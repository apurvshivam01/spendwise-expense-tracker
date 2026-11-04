import { Transaction, Budget } from '../models/index.js';

// @desc    Get top-level dashboard metrics (Total balance, income, expenses, savings, budget)
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // 1. Overall Lifetime Aggregates
    const overallAgg = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let lifetimeIncome = 0;
    let lifetimeExpense = 0;
    overallAgg.forEach((item) => {
      if (item._id === 'income') lifetimeIncome = item.total;
      if (item._id === 'expense') lifetimeExpense = item.total;
    });
    const totalBalance = lifetimeIncome - lifetimeExpense;

    // 2. Current Month Aggregates
    const monthAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let monthlyIncome = 0;
    let monthlyExpense = 0;
    monthAgg.forEach((item) => {
      if (item._id === 'income') monthlyIncome = item.total;
      if (item._id === 'expense') monthlyExpense = item.total;
    });

    const monthlySavings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

    // 3. Current Month Budget
    const budgetDoc = await Budget.findOne({ userId, month: currentMonthStr });
    const monthlyBudget = budgetDoc ? budgetDoc.overallBudget : 0;
    const budgetUtilization = monthlyBudget > 0 ? Math.round((monthlyExpense / monthlyBudget) * 100) : 0;

    // 4. Recent Transactions (last 6)
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalBalance,
        totalIncome: lifetimeIncome,
        totalExpenses: lifetimeExpense,
        monthlyIncome,
        monthlyExpense,
        monthlySavings,
        savingsRate,
        monthlyBudget,
        budgetUtilization,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly income vs expenses (last 6 to 12 months)
// @route   GET /api/analytics/monthly-comparison
// @access  Private
export const getMonthlyComparison = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const monthsBack = parseInt(req.query.months) || 6;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (monthsBack - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Build timeline list for all months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeline = [];

    for (let i = 0; i < monthsBack; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const key = `${monthNames[m - 1]} ${y}`;
      timeline.push({
        key,
        year: y,
        month: m,
        name: monthNames[m - 1],
        income: 0,
        expense: 0,
        savings: 0,
      });
    }

    monthlyData.forEach((item) => {
      const slot = timeline.find((t) => t.year === item._id.year && t.month === item._id.month);
      if (slot) {
        if (item._id.type === 'income') slot.income = item.total;
        if (item._id.type === 'expense') slot.expense = item.total;
        slot.savings = slot.income - slot.expense;
      }
    });

    res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense breakdown by category with percentages
// @route   GET /api/analytics/category-breakdown
// @access  Private
export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const matchQuery = {
      userId,
      type: 'expense',
    };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.date.$lte = end;
      }
    } else {
      // Default: current month
      const now = new Date();
      matchQuery.date = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    }

    const breakdown = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalExpense = breakdown.reduce((sum, item) => sum + item.total, 0);

    const formatted = breakdown.map((item) => ({
      name: item._id || 'Other',
      value: item.total,
      count: item.count,
      percentage: totalExpense > 0 ? Math.round((item.total / totalExpense) * 1000) / 10 : 0,
    }));

    res.json({
      success: true,
      totalExpense,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly spending trend (e.g. past 7-14 days or last 4 weeks)
// @route   GET /api/analytics/weekly-spending
// @access  Private
export const getWeeklySpending = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 7;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const dailyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const map = {};
    dailyExpenses.forEach((item) => {
      map[item._id] = item.total;
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      result.push({
        date: dateStr,
        day: dayName,
        label: `${dayName} (${d.getDate()})`,
        amount: map[dateStr] || 0,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
