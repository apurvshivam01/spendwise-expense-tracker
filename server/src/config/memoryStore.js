import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'spendwise_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state
let state = {
  users: [],
  transactions: [],
  budgets: [],
  notifications: [],
};

// Load initial state if file exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    state = JSON.parse(raw);
    console.log(`[MemoryStore] Loaded persistent database from ${DATA_FILE}`);
  } catch (err) {
    console.warn('[MemoryStore] Could not parse existing data file, initializing fresh store:', err.message);
  }
}

// Save state to disk
const persist = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[MemoryStore] Failed to persist data:', err.message);
  }
};

// Unique ID generator
const generateId = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 9)
  );
};

// --- USER MODEL IMPLEMENTATION ---
export class UserModel {
  constructor(data) {
    Object.assign(this, data);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const idx = state.users.findIndex((u) => u._id === this._id);
    if (idx !== -1) {
      state.users[idx] = { ...this };
    } else {
      state.users.push({ ...this });
    }
    persist();
    return this;
  }

  static findOne(query) {
    let user = null;
    if (query.email) {
      user = state.users.find(
        (u) => u.email.toLowerCase() === query.email.toLowerCase()
      );
    } else if (query._id) {
      user = state.users.find((u) => u._id.toString() === query._id.toString());
    }

    const queryObj = {
      select() {
        return this;
      },
      then(resolve, reject) {
        if (!user) return resolve(null);
        const instance = new UserModel({ ...user });
        resolve(instance);
      },
    };
    return queryObj;
  }

  static findById(id) {
    const user = state.users.find((u) => u._id.toString() === id.toString());
    const queryObj = {
      select() {
        return this;
      },
      then(resolve, reject) {
        if (!user) return resolve(null);
        const instance = new UserModel({ ...user });
        resolve(instance);
      },
    };
    return queryObj;
  }

  static async create(data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = {
      _id: generateId(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      currency: data.currency || 'INR',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.users.push(newUser);
    persist();

    return new UserModel(newUser);
  }
}

// --- TRANSACTION MODEL IMPLEMENTATION ---
export class TransactionModel {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const idx = state.transactions.findIndex((t) => t._id === this._id);
    if (idx !== -1) {
      state.transactions[idx] = { ...this };
    } else {
      state.transactions.push({ ...this });
    }
    persist();
    return this;
  }

  static async create(data) {
    const newTrans = {
      _id: generateId(),
      userId: data.userId.toString(),
      type: data.type,
      amount: Number(data.amount),
      category: data.category || 'Other',
      source: data.source || 'Salary',
      date: new Date(data.date || Date.now()).toISOString(),
      description: data.description,
      paymentMethod: data.paymentMethod || 'UPI',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.transactions.push(newTrans);
    persist();
    return new TransactionModel(newTrans);
  }

  static async insertMany(list) {
    const created = list.map((item) => ({
      _id: generateId(),
      userId: item.userId.toString(),
      type: item.type,
      amount: Number(item.amount),
      category: item.category || 'Other',
      source: item.source || 'Salary',
      date: new Date(item.date || Date.now()).toISOString(),
      description: item.description,
      paymentMethod: item.paymentMethod || 'UPI',
      notes: item.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    state.transactions.push(...created);
    persist();
    return created.map((c) => new TransactionModel(c));
  }

  static _filterQuery(query) {
    return state.transactions.filter((t) => {
      if (query.userId && t.userId.toString() !== query.userId.toString()) {
        return false;
      }
      if (query.type && t.type !== query.type) {
        return false;
      }
      if (query.category && t.category !== query.category) {
        return false;
      }
      if (query.source && t.source !== query.source) {
        return false;
      }
      if (query.paymentMethod && t.paymentMethod !== query.paymentMethod) {
        return false;
      }
      if (query.date) {
        const tDate = new Date(t.date).getTime();
        if (query.date.$gte && tDate < new Date(query.date.$gte).getTime()) {
          return false;
        }
        if (query.date.$lte && tDate > new Date(query.date.$lte).getTime()) {
          return false;
        }
      }
      if (query.$or && Array.isArray(query.$or)) {
        const matchesAny = query.$or.some((condition) => {
          for (const key of Object.keys(condition)) {
            const regex = new RegExp(condition[key].$regex, condition[key].$options);
            if (t[key] && regex.test(t[key])) return true;
          }
          return false;
        });
        if (!matchesAny) return false;
      }
      return true;
    });
  }

  static find(query = {}) {
    let results = this._filterQuery(query);

    const queryObj = {
      _results: results,
      sort(sortOptions) {
        const key = Object.keys(sortOptions)[0] || 'date';
        const order = sortOptions[key] === 1 ? 1 : -1;

        this._results.sort((a, b) => {
          let valA = a[key];
          let valB = b[key];
          if (key === 'date') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
          }
          if (valA < valB) return -1 * order;
          if (valA > valB) return 1 * order;
          return 0;
        });
        return this;
      },
      skip(count) {
        this._results = this._results.slice(count);
        return this;
      },
      limit(count) {
        this._results = this._results.slice(0, count);
        return this;
      },
      then(resolve) {
        return Promise.resolve(this._results.map((r) => new TransactionModel(r))).then(resolve);
      },
    };

    return queryObj;
  }

  static async findOne(query) {
    const list = this._filterQuery(query);
    if (query._id) {
      const match = list.find((t) => t._id.toString() === query._id.toString());
      return match ? new TransactionModel(match) : null;
    }
    return list.length > 0 ? new TransactionModel(list[0]) : null;
  }

  static async findOneAndDelete(query) {
    const idx = state.transactions.findIndex(
      (t) =>
        t._id.toString() === query._id.toString() &&
        t.userId.toString() === query.userId.toString()
    );
    if (idx === -1) return null;
    const deleted = state.transactions.splice(idx, 1)[0];
    persist();
    return new TransactionModel(deleted);
  }

  static async countDocuments(query = {}) {
    return this._filterQuery(query).length;
  }

  static async aggregate(pipeline = []) {
    let data = [...state.transactions];

    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter((t) => {
          const m = stage.$match;
          if (m.userId && t.userId.toString() !== m.userId.toString()) return false;
          if (m.type && t.type !== m.type) return false;
          if (m.date) {
            const time = new Date(t.date).getTime();
            if (m.date.$gte && time < new Date(m.date.$gte).getTime()) return false;
            if (m.date.$lte && time > new Date(m.date.$lte).getTime()) return false;
          }
          return true;
        });
      }

      if (stage.$group) {
        const groupSpec = stage.$group;
        const groups = {};

        data.forEach((item) => {
          let key;
          const idSpec = groupSpec._id;

          if (idSpec === null) {
            key = 'null';
          } else if (typeof idSpec === 'string' && idSpec.startsWith('$')) {
            const prop = idSpec.substring(1);
            key = item[prop];
          } else if (typeof idSpec === 'object') {
            const d = new Date(item.date);
            if (idSpec.$dateToString) {
              key = d.toISOString().split('T')[0];
            } else {
              const y = d.getFullYear();
              const m = d.getMonth() + 1;
              const t = item.type;
              key = `${y}_${m}_${t}`;
            }
          }

          if (!groups[key]) {
            groups[key] = {
              _id:
                typeof groupSpec._id === 'object' && !groupSpec._id.$dateToString
                  ? {
                      year: new Date(item.date).getFullYear(),
                      month: new Date(item.date).getMonth() + 1,
                      type: item.type,
                    }
                  : key === 'null'
                  ? null
                  : key,
              total: 0,
              totalSpent: 0,
              count: 0,
            };
          }

          groups[key].total += item.amount || 0;
          groups[key].totalSpent += item.amount || 0;
          groups[key].count += 1;
        });

        data = Object.values(groups);
      }

      if (stage.$sort) {
        const sortKey = Object.keys(stage.$sort)[0];
        const dir = stage.$sort[sortKey];
        data.sort((a, b) => {
          const valA = a[sortKey] || 0;
          const valB = b[sortKey] || 0;
          return (valA - valB) * dir;
        });
      }
    }

    return data;
  }
}

// --- BUDGET MODEL IMPLEMENTATION ---
export class BudgetModel {
  constructor(data) {
    Object.assign(this, data);
  }

  static async findOne(query) {
    const budget = state.budgets.find(
      (b) =>
        b.userId.toString() === query.userId.toString() &&
        b.month === query.month
    );
    return budget ? new BudgetModel(budget) : null;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    let budget = state.budgets.find(
      (b) =>
        b.userId.toString() === query.userId.toString() &&
        b.month === query.month
    );

    if (budget) {
      if (update.overallBudget !== undefined) budget.overallBudget = Number(update.overallBudget);
      if (update.categoryBudgets !== undefined) budget.categoryBudgets = update.categoryBudgets;
      budget.updatedAt = new Date().toISOString();
    } else if (options.upsert) {
      budget = {
        _id: generateId(),
        userId: query.userId.toString(),
        month: query.month,
        overallBudget: Number(update.overallBudget || 0),
        categoryBudgets: update.categoryBudgets || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.budgets.push(budget);
    }

    persist();
    return new BudgetModel(budget);
  }
}

// --- NOTIFICATION MODEL IMPLEMENTATION ---
export class NotificationModel {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(data) {
    const notif = {
      _id: generateId(),
      userId: data.userId.toString(),
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.notifications.push(notif);
    persist();
    return new NotificationModel(notif);
  }

  static find(query) {
    const notifs = state.notifications
      .filter((n) => n.userId.toString() === query.userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      sort() {
        return this;
      },
      limit(count) {
        return Promise.resolve(notifs.slice(0, count).map((n) => new NotificationModel(n)));
      },
      then(resolve) {
        return Promise.resolve(notifs.map((n) => new NotificationModel(n))).then(resolve);
      },
    };
  }

  static async countDocuments(query) {
    return state.notifications.filter(
      (n) =>
        n.userId.toString() === query.userId.toString() &&
        (query.read !== undefined ? n.read === query.read : true)
    ).length;
  }

  static async findOneAndUpdate(query, update) {
    const notif = state.notifications.find(
      (n) =>
        n._id.toString() === query._id.toString() &&
        n.userId.toString() === query.userId.toString()
    );
    if (!notif) return null;
    if (update.read !== undefined) notif.read = update.read;
    persist();
    return new NotificationModel(notif);
  }

  static async updateMany(query, update) {
    state.notifications.forEach((n) => {
      if (
        n.userId.toString() === query.userId.toString() &&
        (query.read !== undefined ? n.read === query.read : true)
      ) {
        if (update.read !== undefined) n.read = update.read;
      }
    });
    persist();
    return { modifiedCount: 1 };
  }

  static async deleteMany(query) {
    state.notifications = state.notifications.filter(
      (n) => n.userId.toString() !== query.userId.toString()
    );
    persist();
    return { deletedCount: 1 };
  }
}
