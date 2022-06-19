import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { SummaryItem } from '../models/SummaryItem'
import { createLogger } from '../utils/logger'

const logger = createLogger('summaryAccess')

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

export class SummaryAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly summaryTable = process.env.SUMMARY_TABLE,
  ) {}

  async createSummaryItem(summaryItem: SummaryItem) {
    logger.info(`Putting summary item for user ${summaryItem.userId} into ${this.summaryTable}`)

    await this.docClient.put({
      TableName: this.summaryTable,
      Item: summaryItem,
    }).promise()
  }

  async getSummaryItem(userId: string): Promise<SummaryItem> {
    logger.info(`Getting summary for ${userId} from ${this.summaryTable}`)

    const result = await this.docClient.get({
      TableName: this.summaryTable,
      Key: {
        userId
      }
    }).promise()

    let item = result.Item

    item.profit = item.totalCredit - item.totalDebit



    return item as SummaryItem
  }

  

}
