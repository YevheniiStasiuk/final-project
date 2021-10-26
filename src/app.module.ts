import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusModule } from './status/status.module';
import { File, FileSchema } from './schemas/file.schema'

@Module({
  imports: [
    StatusModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.mongo),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
