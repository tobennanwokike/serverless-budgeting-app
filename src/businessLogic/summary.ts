import 'source-map-support/register'

import { SummaryAccess } from '../dataLayer/SummaryAccess'
import { createLogger } from '../utils/logger'


const logger = createLogger('summary')

const summaryAccess = new SummaryAccess()


export async function getSummary(userId: string) {
  logger.info(`Retrieving summery for ${userId}`)

  const item = await summaryAccess.getSummaryItem(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        item
    })
  }
}
