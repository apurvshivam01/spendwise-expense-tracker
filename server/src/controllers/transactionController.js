import { Transaction, Budget, Notification } from '../models/index.js';

// @desc    Get all transactions with filtering, searching, sorting and pagination
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      source,
      paymentMethod,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = { userId: req.user._id };

    if (type && ['expense', 'income'].includes(type)) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (source) {
      query.source = source;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: transactions.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction (expense or income)
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const {
      type,
      amount,
      category,
      source,
      date,
      description,
      paymentMethod,
      notes,
    } = req.body;

    if (!type || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, amount, and description',
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: Number(amount),
      category: type === 'expense' ? category || 'Other' : undefined,
      source: type === 'income' ? source || 'Other' : undefined,
      date: date ? new Date(date) : new Date(),
      description,
      paymentMethod: paymentMethod || 'UPI',
      notes,
    });

    // Check budget alert if this is an expense
    if (type === 'expense') {
      try {
        const transDate = transaction.date;
        const monthStr = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
        const budget = await Budget.findOne({ userId: req.user._id, month: monthStr });

        if (budget && budget.overallBudget > 0) {
          // Calculate total expenses for this month
          const startOfMonth = new Date(transDate.getFullYear(), transDate.getMonth(), 1);
          const endOfMonth = new Date(transDate.getFullYear(), transDate.getMonth() + 1, 0, 23, 59, 59, 999);

          const expenses = await Transaction.aggregate([
            {
              $match: {
                userId: req.user._id,
                type: 'expense',
                date: { $gte: startOfMonth, $lte: endOfMonth },
              },
            },
            {
              $group: { _id: null, total: { $sum: '$amount' } },
            },
          ]);

          const totalExp = expenses[0]?.total || 0;
          const ratio = (totalExp / budget.overallBudget) * 100;

          if (ratio >= 100) {
            await Notification.create({
              userId: req.user._id,
              title: 'Budget Exceeded Alert!',
              message: `Your spending for ${monthStr} (${totalExp.toFixed(2)}) has exceeded your overall monthly budget limit of ${budget.overallBudget.toFixed(2)}.`,
              type: 'danger',
            });
          } else if (ratio >= 80) {
            await Notification.create({
              userId: req.user._id,
              title: 'Budget Warning (80% Reached)',
              message: `You have utilized ${ratio.toFixed(1)}% of your monthly budget for ${monthStr}. Remaining: ${(budget.overallBudget - totalExp).toFixed(2)}.`,
              type: 'warning',
            });
          }
        }
      } catch (alertErr) {
        console.warn('Budget check warning:', alertErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: `${type === 'expense' ? 'Expense' : 'Income'} recorded successfully`,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const {
      type,
      amount,
      category,
      source,
      date,
      description,
      paymentMethod,
      notes,
    } = req.body;

    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (type === 'expense' || transaction.type === 'expense') {
      if (category) transaction.category = category;
    }
    if (type === 'income' || transaction.type === 'income') {
      if (source) transaction.source = source;
    }
    if (date) transaction.date = new Date(date);
    if (description) transaction.description = description;
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to CSV
// @route   GET /api/transactions/export/csv
// @access  Private
export const exportTransactionsCSV = async (req, res, next) => {
  try {
    const { startDate, endDate, type, category } = req.query;
    const query = { userId: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Build CSV content
    const headers = ['Date', 'Type', 'Category / Source', 'Description', 'Payment Method', 'Amount', 'Notes'];
    const rows = transactions.map((t) => {
      const dateFormatted = new Date(t.date).toISOString().split('T')[0];
      const catOrSource = t.type === 'expense' ? t.category : t.source;
      const cleanDesc = `"${(t.description || '').replace(/"/g, '""')}"`;
      const cleanNotes = `"${(t.notes || '').replace(/"/g, '""')}"`;
      return [
        dateFormatted,
        t.type.toUpperCase(),
        catOrSource || '',
        cleanDesc,
        t.paymentMethod || '',
        t.amount,
        cleanNotes,
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=SpendWise_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};
