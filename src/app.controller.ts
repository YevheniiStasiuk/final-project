import { Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import { Express } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('send')
  @Render('send')
  getSend(): void {

  }

  @Post('send')
  @UseInterceptors(FileInterceptor('file'))
  postFile(@UploadedFile() file: Express.Multer.File): any {
    console.log(file)
  }
}
