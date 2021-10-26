import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { File, FileDocument } from '../schemas/file.schema'

@Injectable()
export class StatusService {

    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>
    ) {

    }

    getStatus(id: string) {
        return this.fileModel.findById(id)
    }
}
