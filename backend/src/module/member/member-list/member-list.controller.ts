import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { MemberService } from './member-list.service'
import { AuthGuard } from 'src/module/auth/AuthGuard'
import { AllMemberListQuery, CreateMemberDto, ListMemberDto, ListMemberRequestDto, MemberBody, MemberListQuery, MemberListResponseBody, UpdateMemberBody, UpdateMemberDto } from './member-list.dto'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'


@Controller('member/member-list')
export class MemberController {
    constructor(private memberService: MemberService){}

    @ApiOperation({ summary: 'Create Member' })
    @ApiBody({ description: 'Create Member', type: UpdateMemberBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: MemberBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateMemberDto) {
        return await this.memberService.create(createData)
    }
       
     @ApiOperation({ summary: 'Update Member' })
        @ApiBody({ type: UpdateMemberBody })
        @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateMemberDto) {
        return await this.memberService.update(updateDto)
    }
    
    @ApiOperation({ summary: 'Get one data by id'})
    @ApiResponse({ description: 'If successful', status: 201, type: MemberBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.memberService.getOneById(id)
    }
    
    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.memberService.invalidate(id)
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: MemberListQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: MemberListResponseBody })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListMemberRequestDto) {
        return this.memberService.listPage(req)
    }

    @ApiOperation({ summary: 'List Member by global search' })
    @ApiBody({ type: AllMemberListQuery })
    @ApiResponse({ description: 'If save successful', status: 201, type: MemberBody  })
    @Post('list-member')
    @UseGuards(AuthGuard)
    async listMember(@Body() req: ListMemberDto) {
        return this.memberService.listMember(req)
    }

    @ApiOperation({ summary: 'Void special day data by Id' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('special-day/remove/:id')
    @UseGuards(AuthGuard)
    async specialDayRemoveById(@Param('id') id: string) {
        return await this.memberService.removeSpecialDay(id)
    }
}