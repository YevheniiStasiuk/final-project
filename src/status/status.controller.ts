import { Controller, Get, Param } from '@nestjs/common'
import { StatusService } from './status.service'

@Controller('status')
export class StatusController {

    constructor(private readonly statusService: StatusService) {}

    @Get(':id')
    async getStatus(@Param('id') id: string): Promise<string> {
        const test = await this.statusService.getStatus(id)
        return JSON.stringify(test)
    }

}
