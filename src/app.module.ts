import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Queue } from './queue.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MulterModule.register({
      dest: './videos/raw',
      /*fileFilter(
        file: {
          mimetype: 'video'
        }
      )*/
    }),
    ClientsModule.register([{ name: 'MATH_SERVICE', transport: Transport.REDIS, options: { url: 'redis://localhost:6379', } }]),
    BullModule.forRoot({ redis: { 
      host: 'localhost',
      port: 6379
    }, defaultJobOptions: {
      lifo: true
    } }),
    BullModule.registerQueue({ name: 'video' })
  ],
  controllers: [AppController],
  providers: [AppService, Queue],
})
export class AppModule { }
