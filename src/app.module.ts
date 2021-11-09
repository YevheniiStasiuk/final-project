import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { videoQueue } from './queue.processor';
import Path from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MulterModule.register({
      dest: './videos/raw',
      fileFilter: function (req, file, callback) {
        const ext = Path.extname(file.originalname)
        if (ext !== '.avi' && ext !== '.mp4') {
          return callback(new Error('Only videos are allowed'), false)
        }
        callback(null, true)
      },
    }),
    ClientsModule.register([{ name: 'MATH_SERVICE', transport: Transport.REDIS, options: { url: 'redis://localhost:6379', } }]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }, defaultJobOptions: {
        lifo: true
      }
    }),
    BullModule.registerQueue({ name: 'video' })
  ],
  controllers: [AppController],
  providers: [AppService, videoQueue],
})
export class AppModule { }
