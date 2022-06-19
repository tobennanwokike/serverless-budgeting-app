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
  ) {}

  async createTransactionItem(transactionItem: TransactionItem) {
    logger.info(`Putting transaction ${transactionItem.transactionId} into ${this.transactionsTable}`)

    await this.docClient.put({
      TableName: this.transactionsTable,
      Item: transactionItem,
    }).promise()
  }

  

}
