import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // Verificar se o usuário tem saldo pra fazer a transação
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const createCategory = new CreateCategoryService();

    let categoryId;

    const { total: balanceTotal } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balanceTotal) {
      throw new AppError(
        'Your balance is lower then the total amount of this transaction',
        400,
      );
    }

    // Verificar se já existe uma category com esse title
    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const createdCategory = await createCategory.execute({ title: category });
      categoryId = createdCategory.id;
    } else {
      categoryId = checkCategoryExists.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
