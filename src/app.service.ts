import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bull'
import AWS from 'aws-sdk'
import fs from 'fs'

@Injectable()
export class AppService {

  private readonly S3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })

  constructor(
    @InjectQueue('video') private videoQueue: Queue
  ) {

  }

  async postNew(file: Express.Multer.File): Promise<Job> {
    const job: Job = await this.videoQueue.add('video', {
      ...file
    })
    /*const fileContent = fs.readFileSync(job.data['destination'] + '/' + job.data['filename'])
    const bucketParam = {
      Bucket: process.env.bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: process.env.location
      },
      Key: job.id.toString(),
      Body: fileContent
    }
    this.S3.upload(bucketParam, (err, data) => {
      err ? console.log("Error", err) : console.log("Upload Success!", data.Location);
    })*/
    return job
  }

  async getStatusById(id: number): Promise<object> {
    const job = await this.videoQueue.getJob(id).catch((err) => {
      console.error(err)
    })
    if (job)
      return { status: await this.getStatus(job), progress: job.progress() }
    else
      return null
  }

  async getStatus(job: Job) {
    if (await job.isActive())
      return 'active'
    else if (await job.isCompleted())
      return 'completed'
    else if (await job.isDelayed())
      return 'delayed'
    else if (await job.isFailed())
      return 'failed'
    else if (await job.isPaused())
      return 'paused'
    else if (await job.isStuck())
      return 'stuck'
    else if (await job.isWaiting())
      return 'waiting'
  }
}