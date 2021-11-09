import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueProgress, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import ffmped from '@ffmpeg-installer/ffmpeg'
import Ffmpeg from 'fluent-ffmpeg'
import { AppService } from './app.service'

@Processor('video')
export class videoQueue {
    constructor(private readonly appService: AppService) {
        Ffmpeg.setFfmpegPath(ffmped.path)
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
        //console.log('result:', res)
    }

    @Process('video')
    async video(job: Job): Promise<void> {
        const command: Ffmpeg.FfmpegCommand = Ffmpeg(job.data['destination'] + '/' + job.data['filename'])
        command.size('640x480')
            .format('avi')
            .videoBitrate('1024k')
            .on('start', async (commandLine) => {
                console.log('Process has been started')
            })
            .on('progress', (progress) => {
                console.log(progress)
                /*console.log('Processing: ' + progress.percent + '% done')
                job.progress(progress.percent)*/
            })
            .on('end', async (stdout, stderr) => {
                console.log('Transcoding succeeded !')
                console.log('resume:', await this.appService.setResume(true))
                console.log('completed:', await job.moveToCompleted())
                job.progress(100)
            })
            .on('error', (err) => {
                console.log('an error happened: ' + err.message);
            })
            .save('./videos/done/' + job.data['filename'] + '.avi')
        await this.appService.setPause(true, false)
    }

}