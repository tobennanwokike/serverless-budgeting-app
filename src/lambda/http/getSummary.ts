import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getSummary } from '../../businessLogic/summary'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getSummary')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getSUmmary event', { event })

  const userId = event.requestContext.authorizer.claims.email
  const response = await getSummary(userId)


  return response
}