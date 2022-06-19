import 'source-map-support/register'

import { UserAccess } from '../dataLayer/UserAccess'
import { SummaryAccess } from '../dataLayer/SummaryAccess'
import { SummaryItem } from '../models/SummaryItem'
import { CreateUserRequest } from '../requests/CreateUserRequest'
import { createLogger } from '../utils/logger'


const logger = createLogger('user')

const userAccess = new UserAccess()
const summaryAccess = new SummaryAccess()

export async function createUser(createUserRequest: CreateUserRequest) {

  logger.info(`Creating new user ${createUserRequest.email}`)

  await userAccess.createUserItem(createUserRequest)
  
  //create a new summary object
  const newSummaryItem: SummaryItem = {
    createdAt: new Date().toISOString(),
    userId: createUserRequest.email,
    totalCredit: 0,
    totalDebit: 0
  }

  await summaryAccess.createSummaryItem(newSummaryItem)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `User ${createUserRequest.email} was successfully registered`
    })
  }
}

