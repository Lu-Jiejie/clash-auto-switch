import { env } from 'node:process'
import { CronJob } from 'cron'
import dotenv from 'dotenv'
import { autoSwitch } from './switch'

dotenv.config()

const job = CronJob.from({
  cronTime: env.CRON || '0 * * * * *',
  onTick: autoSwitch,
  start: true,
})

job.start()
