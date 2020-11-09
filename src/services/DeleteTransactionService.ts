import { DeleteResult, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<DeleteResult> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    // verificar se realmente existe uma transação com esse id
    const checkTransactionExists = await transactionsRepository.findOne({
      where: { id },
    });

    if (!checkTransactionExists) {
      throw new AppError('It does not exist a transaction with this id');
    }

    // deletar a transação
    const deleteResult = await transactionsRepository.delete({
      id,
    });

    return deleteResult;
  }
}

export default DeleteTransactionService;
