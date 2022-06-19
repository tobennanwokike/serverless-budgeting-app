import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getTransaction } from '../../businessLogic/transactions'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTransaction')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getTransaction event', { event })

  const transactionId = event.pathParameters.transactionId
  const response = await getTransaction(transactionId)

  return response
}
