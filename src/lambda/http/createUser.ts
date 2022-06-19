import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createUser } from '../../businessLogic/user'
import { CreateUserRequest } from '../../requests/CreateUserRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createUser')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing createUser event', { event })

  const newUser: CreateUserRequest = JSON.parse(event.body)

  const response = await createUser( newUser )

  return response
}