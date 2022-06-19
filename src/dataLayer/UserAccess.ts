import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { UserItem } from '../models/UserItem'
import { createLogger } from '../utils/logger'


const logger = createLogger('UserAccess')

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

export class UserAccess {

  constructor(
    private readonly cognito = new XAWS.CognitoIdentityServiceProvider(),
    private readonly userPoolId = process.env.USER_POOL_ID,
    private readonly clientId = process.env.CLIENT_ID,
  ) {}

  async createUserItem(userItem: UserItem) {
    logger.info(`Creating User ${userItem.email}`)

    const { email, password } = userItem

    const params = {
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }],
        MessageAction: 'SUPPRESS'
    }
    const response = await this.cognito.adminCreateUser(params).promise()
    if (response.User) {
        const paramsForSetPass = {
            Password: password,
            UserPoolId: this.userPoolId,
            Username: email,
            Permanent: true
        };
        await this.cognito.adminSetUserPassword(paramsForSetPass).promise()
    }

  }

  async loginUserItem(userItem: UserItem) {
    logger.info(`Logging in user ${userItem.email}`)

    const { email, password } = userItem

    const params = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    }
    const response = await this.cognito.adminInitiateAuth(params).promise()

    return response

  }

  

}
