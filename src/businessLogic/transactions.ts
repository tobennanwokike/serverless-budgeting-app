import 'source-map-support/register'

import * as uuid from 'uuid'
import { SummaryAccess } from '../dataLayer/SummaryAccess'
import { TransactionsAccess } from '../dataLayer/TransactionsAccess'
import { SummaryUpdate } from '../models/SummaryUpdate'
import { TransactionItem } from '../models/TransactionItem'
import { TransactionUpdate } from '../models/TransactionUpdate'
import { CreateTransactionRequest } from '../requests/CreateTransactionRequest'
import { UpdateTransactionRequest } from '../requests/UpdateTransactionRequest'
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

export async function updateTransaction(userId: string, transactionId: string, updateTransactionRequest: UpdateTransactionRequest) {
  logger.info(`Updating transaction ${transactionId} for user ${userId}`, { userId, transactionId, transactionUpdate: updateTransactionRequest })

  const item = await transactionsAccess.getTransactionItem(transactionId)

  if (!item)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: `Transaction not found`
      })
    }

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update transaction ${transactionId}`)
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: `You are not authorized to access this resource`
      })
    }
  }

  //check if the amount is being updated
  if (item.amount != updateTransactionRequest.amount){
    //update summary table
    const userSummary = await summaryAccess.getSummaryItem(userId)

    if(item.category == "credit"){
      if(updateTransactionRequest.amount > item.amount){
        userSummary.totalCredit += (updateTransactionRequest.amount - item.amount)
      }
      else{
        userSummary.totalCredit -= (item.amount - updateTransactionRequest.amount)
      }
    }
    else{
      if(updateTransactionRequest.amount > item.amount){
        userSummary.totalDebit += (updateTransactionRequest.amount - item.amount)
      }
      else{
        userSummary.totalDebit -= (item.amount - updateTransactionRequest.amount)
      }
    }

    const updateSummary: SummaryUpdate = {
      totalCredit: userSummary.totalCredit,
      totalDebit: userSummary.totalDebit
    }

    await summaryAccess.updateSummaryItem(userId, updateSummary)
  }


  await transactionsAccess.updateTransactionItem(transactionId, updateTransactionRequest as TransactionUpdate)

  const updatedItem = await transactionsAccess.getTransactionItem(transactionId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        updatedItem
    })
  }
}
