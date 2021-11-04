import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueProgress, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import ffmped from '@ffmpeg-installer/ffmpeg'
import Ffmpeg from 'fluent-ffmpeg'

@Processor('video')
export class Queue {

    constructor() {
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
    video(job: Job) {
        const command: Ffmpeg.FfmpegCommand = Ffmpeg(job.data['destination'] + '/' + job.data['filename'])
            .size('640x480')
            .format('avi')
            .save('./videos' + '/done/' + job.data['filename'] + '.avi')
        /*command.on('progress', (something) => {
            console.log(something)
        })*/
        return command
    }

}