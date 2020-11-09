import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transactions = await this.find();

    if (!transactions) {
      return balance;
    }

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance.income += Number(transaction.value);
        balance.total += Number(transaction.value);
      } else {
        balance.outcome += Number(transaction.value);
        balance.total -= Number(transaction.value);
      }
    });

    return balance;
  }
}

export default TransactionsRepository;
