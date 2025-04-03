import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { MemberService } from './member-list.service'
import { AuthGuard } from 'src/module/auth/AuthGuard'
import { CreateMemberDto, ListMemberRequestDto, UpdateMemberDto } from './member-list.dto'


@Controller('member/member-list')
export class MemberController {
    constructor(private memberService: MemberService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateMemberDto) {
        return await this.memberService.create(createData)
    }
       
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateMemberDto) {
        return await this.memberService.update(updateDto)
    }
    
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.memberService.getOneById(id)
    }
    
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.memberService.invalidate(id)
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListMemberRequestDto) {
        return this.memberService.listPage(req)
    }
}