import { Controller, Get, Param, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common'
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
  async postFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this.appService.postNew(file)
  }

  @Get('status::id')
  async getStatusById(@Param('id') id: number): Promise<string> {
    const res: string = await this.appService.getStatusById(id)
    if (res)
      return res
    else
      return `not found`
  }
}
