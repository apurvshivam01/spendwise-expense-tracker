import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: [true, 'Transaction type is required (expense or income)'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: String,
      required: function () {
        return this.type === 'expense';
      },
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
      default: 'Other',
    },
    source: {
      type: String,
      required: function () {
        return this.type === 'income';
      },
      enum: [
        'Salary',
        'Freelance',
        'Business',
        'Investments',
        'Gift',
        'Other',
      ],
      default: 'Salary',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Other'],
      default: 'UPI',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user transactions sorted by date
transactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);
