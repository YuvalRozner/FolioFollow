import { db } from '../config/firebase';

export const collections = {
  users: () => db.collection('users'),
  accounts: () => db.collection('accounts'),
  securities: () => db.collection('securities'),
  exchangeRates: () => db.collection('exchangeRates'),
  transactions: () => db.collection('transactions'),
  lots: () => db.collection('lots'),
  lotSales: () => db.collection('lotSales'),
  cashBalances: () => db.collection('cashBalances'),
};
