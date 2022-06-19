import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TransactionItem } from '../models/TransactionItem'
import { createLogger } from '../utils/logger'

const logger = createLogger('transactionsAccess')

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

export class TransactionsAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly transactionsTable = process.env.TRANSACTIONS_TABLE,
    private readonly transactionsByUserIndex = process.env.TRANSACTIONS_BY_USER_INDEX
  ) {}

  async createTransactionItem(transactionItem: TransactionItem) {
    logger.info(`Putting transaction ${transactionItem.transactionId} into ${this.transactionsTable}`)

    await this.docClient.put({
      TableName: this.transactionsTable,
      Item: transactionItem,
    }).promise()
  }

  async getTransactionItems(userId: string): Promise<TransactionItem[]> {
    logger.info(`Getting all transactions for user ${userId} from ${this.transactionsTable}`)

    const result = await this.docClient.query({
      TableName: this.transactionsTable,
      IndexName: this.transactionsByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} transactions for user ${userId} in ${this.transactionsTable}`)

    return items as TransactionItem[]
  }

  async getTransactionItem(transactionId: string): Promise<TransactionItem> {
    logger.info(`Getting transaction ${transactionId} from ${this.transactionsTable}`)

    const result = await this.docClient.get({
      TableName: this.transactionsTable,
      Key: {
        transactionId
      }
    }).promise()

    const item = result.Item

    return item as TransactionItem
  }

  

}
