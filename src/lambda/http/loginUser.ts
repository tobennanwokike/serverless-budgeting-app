import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { loginUser } from '../../businessLogic/user'
import { LoginUserRequest } from '../../requests/LoginUserRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('loginUser')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing loginUser event', { event })

  const user: LoginUserRequest = JSON.parse(event.body)

  const response =  await loginUser( user )

  return response
  
}