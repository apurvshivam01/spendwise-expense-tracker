import { Budget, Transaction } from '../models/index.js';

// @desc    Get budget details & dynamic live utilization for a month
// @route   GET /api/budgets
// @access  Private
export const getBudget = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const month = req.query.month || currentMonthStr;

    // Parse month bounds
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Fetch budget doc
    let budget = await Budget.findOne({ userId: req.user._id, month });

    // Aggregate real expenses for this month
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const spentMap = {};
    let totalSpentMonth = 0;

    expensesByCategory.forEach((item) => {
      spentMap[item._id] = item.totalSpent;
      totalSpentMonth += item.totalSpent;
    });

    const overallBudget = budget ? budget.overallBudget : 0;
    const overallUtilization = overallBudget > 0 ? (totalSpentMonth / overallBudget) * 100 : 0;
    const remainingBudget = Math.max(0, overallBudget - totalSpentMonth);

    // Categories list
    const defaultCategories = [
      'Food',
      'Shopping',
      'Transport',
      'Education',
      'Entertainment',
      'Health',
      'Bills',
      'Travel',
      'Rent',
      'Other',
    ];

    const categoryBudgetsMap = {};
    if (budget && budget.categoryBudgets) {
      budget.categoryBudgets.forEach((cb) => {
        categoryBudgetsMap[cb.category] = cb.amount;
      });
    }

    const categoriesStatus = defaultCategories.map((cat) => {
      const allocated = categoryBudgetsMap[cat] || 0;
      const spent = spentMap[cat] || 0;
      const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
      const remaining = Math.max(0, allocated - spent);
      const isExceeded = allocated > 0 && spent > allocated;
      const isWarning = allocated > 0 && utilization >= 80 && !isExceeded;

      return {
        category: cat,
        allocated,
        spent,
        remaining,
        utilization: Math.round(utilization * 10) / 10,
        isWarning,
        isExceeded,
      };
    });

    res.json({
      success: true,
      data: {
        month,
        hasBudget: !!budget,
        overallBudget,
        totalSpent: totalSpentMonth,
        remainingBudget,
        utilizationPercentage: Math.round(overallUtilization * 10) / 10,
        isWarning: overallUtilization >= 80 && overallUtilization < 100,
        isExceeded: overallUtilization >= 100,
        categoryBudgets: categoriesStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update budget for a month
// @route   POST /api/budgets
// @access  Private
export const setBudget = async (req, res, next) => {
  try {
    const { month, overallBudget, categoryBudgets } = req.body;

    if (!month || overallBudget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month (YYYY-MM) and overall budget amount',
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month },
      {
        userId: req.user._id,
        month,
        overallBudget: Number(overallBudget),
        categoryBudgets: Array.isArray(categoryBudgets) ? categoryBudgets : [],
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Budget saved successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};
