import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateTransaction } from '../../businessLogic/transactions'
import { UpdateTransactionRequest } from '../../requests/UpdateTransactionRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTransaction')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateTransaction event', { event })

  const userId = event.requestContext.authorizer.claims.email
  const transactionId = event.pathParameters.transactionId
  const updatedTransaction: UpdateTransactionRequest = JSON.parse(event.body)

  const response = await updateTransaction(userId, transactionId, updatedTransaction)

  return response
}