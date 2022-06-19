import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getTransactions } from '../../businessLogic/transactions'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTransactions')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getTransactions event', { event })

  const userId = event.requestContext.authorizer.claims.email
  const response = await getTransactions(userId)

  return response
}
