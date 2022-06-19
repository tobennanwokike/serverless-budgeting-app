import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createTransaction } from '../../businessLogic/transactions'
import { CreateTransactionRequest } from '../../requests/CreateTransactionRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTransaction')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing createTransaction event', { event })

  const userId = event.requestContext.authorizer.claims.email
  const newTransaction: CreateTransactionRequest = JSON.parse(event.body)

  const response = await createTransaction( newTransaction, userId )


  return response
}