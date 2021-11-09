import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueProgress, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import ffmped from '@ffmpeg-installer/ffmpeg'
import ffprobe from '@ffprobe-installer/ffprobe'
import Ffmpeg from 'fluent-ffmpeg'

@Processor('video')
export class videoQueue {
    constructor() {
        Ffmpeg.setFfmpegPath(ffmped.path)
        Ffmpeg.setFfprobePath(ffprobe.path)
    }

    @OnQueueActive()
    async onActive(job: Job) {
        console.log('Processing job', job.id)
        console.log('With name:', job.name)
        console.log('With data', job.data)
    }

    @OnQueueError()
    onError(err: Error): void {
        console.error(err)
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        console.log('Job error:', job.id)
        console.error(err)
    }

    @OnQueueProgress()
    onProgress(job: Job, progress: number) {
        console.log('Job progress:', job.id)
        console.log('progress:', progress)
    }

    @OnQueueCompleted()
    onCompleted(job: Job, res: any) {
        console.log('Job completed:', job.id)
        job.queue.resume(true)
    }

    @Process('video')
    async video(job: Job): Promise<void> {
        const command: Ffmpeg.FfmpegCommand = Ffmpeg(job.data['destination'] + '/' + job.data['filename'])
        await new Promise((resolve, reject) => {
            command.size('640x480')
                .format('avi')
                .videoBitrate('1024k')
                .on('start', async (commandLine) => {
                    console.log('Process has been started')
                })
                .on('progress', (progress) => {
                    job.progress(progress.percent.toFixed(2))
                })
                .on('end', async (stdout, stderr) => {
                    console.log('Transcoding succeeded !')
                    job.queue.resume(true)
                    await job.progress(100)
                    resolve(job)
                })
                .on('error', (err) => {
                    console.log('an error happened: ' + err.message)
                    reject(err)
                })
                .save('./videos/done/' + job.data['filename'] + '.avi')
        })
    }

}