import { Controller, Get, HttpCode, Param, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import { Express } from 'express'

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get('send')
  @HttpCode(200)
  @Render('send')
  getSend(): void {

  }

  @Post('send')
  @HttpCode(202)
  @UseInterceptors(FileInterceptor('file'))
  async postFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this.appService.postNew(file)
  }

  @Get('status::id')
  @HttpCode(200)
  async getStatusById(@Param('id') id: number): Promise<string> {
    const res: string = await this.appService.getStatusById(id)
    if (res)
      return res
    else
      return `not found`
  }
}
