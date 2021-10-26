import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { File, FileDocument } from './schemas/file.schema'

@Injectable()
export class AppService {

  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>
  ) {

  }

  async postNew(): Promise<File> {
    const newFile = new this.fileModel({
      status: 'upload', progress: ''
    })
    return newFile.save()
  }
}
