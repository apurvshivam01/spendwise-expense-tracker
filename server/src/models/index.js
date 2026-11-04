import { isMongooseConnected } from '../config/db.js';

import MongooseUser from './User.js';
import MongooseTransaction from './Transaction.js';
import MongooseBudget from './Budget.js';
import MongooseNotification from './Notification.js';

import {
  UserModel,
  TransactionModel,
  BudgetModel,
  NotificationModel,
} from '../config/memoryStore.js';

// Dynamic proxy objects that delegate to Mongoose when connected or MemoryStore otherwise
export const User = new Proxy(
  {},
  {
    get(target, prop) {
      const active = isMongooseConnected ? MongooseUser : UserModel;
      const val = active[prop];
      return typeof val === 'function' ? val.bind(active) : val;
    },
  }
);

export const Transaction = new Proxy(
  {},
  {
    get(target, prop) {
      const active = isMongooseConnected ? MongooseTransaction : TransactionModel;
      const val = active[prop];
      return typeof val === 'function' ? val.bind(active) : val;
    },
  }
);

export const Budget = new Proxy(
  {},
  {
    get(target, prop) {
      const active = isMongooseConnected ? MongooseBudget : BudgetModel;
      const val = active[prop];
      return typeof val === 'function' ? val.bind(active) : val;
    },
  }
);

export const Notification = new Proxy(
  {},
  {
    get(target, prop) {
      const active = isMongooseConnected ? MongooseNotification : NotificationModel;
      const val = active[prop];
      return typeof val === 'function' ? val.bind(active) : val;
    },
  }
);
