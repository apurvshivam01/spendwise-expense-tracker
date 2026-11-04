import { Transaction, Budget, Notification } from '../models/index.js';

export const seedSampleDataForUser = async (userId, currency = 'INR') => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const monthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  // Currency multiplier if non-INR
  const mult = currency === 'INR' ? 1 : currency === 'USD' ? 0.012 : currency === 'EUR' ? 0.011 : 0.012;

  // 1. Create a monthly budget
  await Budget.findOneAndUpdate(
    { userId, month: monthString },
    {
      userId,
      month: monthString,
      overallBudget: Math.round(65000 * mult),
      categoryBudgets: [
        { category: 'Food', amount: Math.round(15000 * mult) },
        { category: 'Shopping', amount: Math.round(8000 * mult) },
        { category: 'Transport', amount: Math.round(6000 * mult) },
        { category: 'Education', amount: Math.round(4000 * mult) },
        { category: 'Entertainment', amount: Math.round(5000 * mult) },
        { category: 'Health', amount: Math.round(4000 * mult) },
        { category: 'Bills', amount: Math.round(7000 * mult) },
        { category: 'Travel', amount: Math.round(5000 * mult) },
        { category: 'Rent', amount: Math.round(18000 * mult) },
        { category: 'Other', amount: Math.round(3000 * mult) },
      ],
    },
    { upsert: true, new: true }
  );

  // 2. Create realistic transactions for the current month and last month
  const sampleTransactions = [
    // Current Month Income
    {
      userId,
      type: 'income',
      amount: Math.round(85000 * mult),
      source: 'Salary',
      date: new Date(currentYear, currentMonth, 1),
      description: 'Monthly Senior Tech Lead Salary',
      paymentMethod: 'Net Banking',
    },
    {
      userId,
      type: 'income',
      amount: Math.round(18000 * mult),
      source: 'Freelance',
      date: new Date(currentYear, currentMonth, 4),
      description: 'Frontend UI/UX Consulting Retainer',
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'income',
      amount: Math.round(7500 * mult),
      source: 'Investments',
      date: new Date(currentYear, currentMonth, 12),
      description: 'Quarterly Mutual Fund Dividend',
      paymentMethod: 'Net Banking',
    },

    // Current Month Expenses
    {
      userId,
      type: 'expense',
      amount: Math.round(18000 * mult),
      category: 'Rent',
      date: new Date(currentYear, currentMonth, 2),
      description: 'Apartment Monthly Rent & Maintenance',
      paymentMethod: 'Net Banking',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(4200 * mult),
      category: 'Bills',
      date: new Date(currentYear, currentMonth, 3),
      description: 'High-speed Fiber & Electricity Bill',
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(3450 * mult),
      category: 'Food',
      date: new Date(currentYear, currentMonth, 5),
      description: 'Weekly Organic Groceries & Gourmet Items',
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(1200 * mult),
      category: 'Transport',
      date: new Date(currentYear, currentMonth, 6),
      description: 'Cab Rides & City Metro Pass',
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(4999 * mult),
      category: 'Shopping',
      date: new Date(currentYear, currentMonth, 8),
      description: 'Ergonomic Desk Accessories & Headphones',
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(2100 * mult),
      category: 'Entertainment',
      date: new Date(currentYear, currentMonth, 10),
      description: 'Weekend Cinema IMAX & Streaming Subscriptions',
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(2800 * mult),
      category: 'Food',
      date: new Date(currentYear, currentMonth, 14),
      description: 'Dinner with colleagues at Trattoria',
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(1850 * mult),
      category: 'Health',
      date: new Date(currentYear, currentMonth, 17),
      description: 'Pharmacy & Monthly Gym Membership',
      paymentMethod: 'Debit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(3500 * mult),
      category: 'Education',
      date: new Date(currentYear, currentMonth, 20),
      description: 'Full-Stack Architecture Certification course',
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(4100 * mult),
      category: 'Food',
      date: new Date(currentYear, currentMonth, 22),
      description: 'Family Weekend Dining & Cafés',
      paymentMethod: 'Credit Card',
    },

    // Previous Month Transactions for historical trend comparison
    {
      userId,
      type: 'income',
      amount: Math.round(85000 * mult),
      source: 'Salary',
      date: new Date(currentYear, currentMonth - 1, 1),
      description: 'Monthly Senior Tech Lead Salary (Previous Month)',
      paymentMethod: 'Net Banking',
    },
    {
      userId,
      type: 'income',
      amount: Math.round(12000 * mult),
      source: 'Freelance',
      date: new Date(currentYear, currentMonth - 1, 15),
      description: 'Mobile App Wireframing Sprint',
      paymentMethod: 'UPI',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(18000 * mult),
      category: 'Rent',
      date: new Date(currentYear, currentMonth - 1, 2),
      description: 'Previous Month Rent',
      paymentMethod: 'Net Banking',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(12500 * mult),
      category: 'Food',
      date: new Date(currentYear, currentMonth - 1, 10),
      description: 'Monthly Groceries & Dining',
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(8900 * mult),
      category: 'Shopping',
      date: new Date(currentYear, currentMonth - 1, 18),
      description: 'Wardrobe Refresh & Tech Gear',
      paymentMethod: 'Credit Card',
    },
    {
      userId,
      type: 'expense',
      amount: Math.round(4500 * mult),
      category: 'Bills',
      date: new Date(currentYear, currentMonth - 1, 5),
      description: 'Utilities & Subscriptions',
      paymentMethod: 'UPI',
    },
  ];

  await Transaction.insertMany(sampleTransactions);

  // 3. Welcome Notification
  await Notification.create({
    userId,
    title: 'Welcome to SpendWise!',
    message: 'Your smart financial workspace is ready. Sample data has been generated to explore your dashboard and analytics.',
    type: 'success',
  });
};
