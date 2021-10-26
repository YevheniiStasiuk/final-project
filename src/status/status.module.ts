import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../schemas/file.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule { }
