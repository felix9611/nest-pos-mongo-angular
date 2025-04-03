import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { MemberClassService } from './member-class.service'
import { AuthGuard } from 'src/module/auth/AuthGuard'
import { CreateMemberClassDto, ListMemberClassRequestDto, UpdateMemberClassDto } from './member-class.dto'


@Controller('member/member-class')
export class MemberClassController {
    constructor(private memberClassService: MemberClassService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateMemberClassDto) {
        return await this.memberClassService.create(createData)
    }
       
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateMemberClassDto) {
        return await this.memberClassService.update(updateDto)
    }
    
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.memberClassService.getOneById(id)
    }
    
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.memberClassService.invalidate(id)
    }
    
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.memberClassService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListMemberClassRequestDto) {
        return this.memberClassService.listPageRole(req)
    }
    
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateMemberClassDto[]) {
        return await this.memberClassService.importData(createDatas)
    }
}