import 'source-map-support/register'

import * as uuid from 'uuid'
import { SummaryAccess } from '../dataLayer/SummaryAccess'
import { TransactionsAccess } from '../dataLayer/TransactionsAccess'
import { SummaryUpdate } from '../models/SummaryUpdate'
import { TransactionItem } from '../models/TransactionItem'
import { CreateTransactionRequest } from '../requests/CreateTransactionRequest'
import { createLogger } from '../utils/logger'


const logger = createLogger('transactions')

const transactionsAccess = new TransactionsAccess()
const summaryAccess = new SummaryAccess()

export async function getTransactions(userId: string) {
  logger.info(`Retrieving all transactions for user ${userId}`, { userId })

  const items =  await transactionsAccess.getTransactionItems(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}

export async function getTransaction(transactionId: string) {
  logger.info(`Retrieving transaction with id ${transactionId}`)

  const item = await transactionsAccess.getTransactionItem(transactionId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}

export async function createTransaction(createTransactionRequest: CreateTransactionRequest, userId: string) {
  const transactionId = uuid.v4()

  const newItem: TransactionItem = {
    transactionId,
    createdAt: new Date().toISOString(),
    userId: userId,
    ...createTransactionRequest
  }

  logger.info(`Creating budget transaction ${transactionId}`, { transactionId, transactionItem: newItem })

  await transactionsAccess.createTransactionItem(newItem)

  //update summary to reflect new transaction
  const userSummary = await summaryAccess.getSummaryItem(userId)

  if(createTransactionRequest.category == "credit"){
    userSummary.totalCredit += createTransactionRequest.amount
  }
  else{
    userSummary.totalDebit += createTransactionRequest.amount
  }

  const updateSummary: SummaryUpdate = {
    totalCredit: userSummary.totalCredit,
    totalDebit: userSummary.totalDebit
  }

  await summaryAccess.updateSummaryItem(userId, updateSummary)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }

}