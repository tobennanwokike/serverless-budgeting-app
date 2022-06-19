import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteTransaction } from '../../businessLogic/transactions'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTransaction')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing deleteTransaction event', { event })

  const transactionId = event.pathParameters.transactionId
  const userId = event.requestContext.authorizer.claims.email
  const response = await deleteTransaction(userId, transactionId)

  return response
}