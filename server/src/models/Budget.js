import mongoose from 'mongoose';

const categoryBudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Budget amount cannot be negative'],
    },
  },
  { _id: false }
);

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String, // Format: YYYY-MM
      required: true,
    },
    overallBudget: {
      type: Number,
      required: [true, 'Overall budget amount is required'],
      min: [0, 'Budget cannot be negative'],
    },
    categoryBudgets: [categoryBudgetSchema],
  },
  {
    timestamps: true,
  }
);

// One budget document per user per month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
