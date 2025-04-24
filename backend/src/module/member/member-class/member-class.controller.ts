import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { MemberClassService } from './member-class.service'
import { AuthGuard } from 'src/module/auth/AuthGuard'
import { CreateMemberClassBody, CreateMemberClassDto, ListMemberClassQuery, ListMemberClassQueryRes, ListMemberClassRequestDto, MemberClassBody, UpdateMemberClassBody, UpdateMemberClassDto } from './member-class.dto'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger'


@Controller('member/member-class')
export class MemberClassController {
    constructor(private memberClassService: MemberClassService){}

    @ApiOperation({ summary: 'Create Member Class' })
    @ApiBody({ type: CreateMemberClassBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: MemberClassBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateMemberClassDto) {
        return await this.memberClassService.create(createData)
    }
       
    @ApiOperation({ summary: 'Update Member Class' })
    @ApiBody({ type: UpdateMemberClassBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateMemberClassDto) {
        return await this.memberClassService.update(updateDto)
    }
    
    @ApiOperation({ summary: 'Get one by ID' })
        @ApiResponse({ description: 'If successful', status: 201, type: MemberClassBody })
        @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.memberClassService.getOneById(id)
    }
    
    @ApiOperation({ summary: 'Void one by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.memberClassService.invalidate(id)
    }
    
    @ApiOperation({ summary: 'Get all Data' })
    @ApiResponse({ description: 'If successful', status: 201, type: [MemberClassBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.memberClassService.findAll()
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListMemberClassQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListMemberClassQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListMemberClassRequestDto) {
        return this.memberClassService.listPage(req)
    }
    
     @ApiOperation({ summary: 'Batch Create' })
        @ApiBody({ type: CreateMemberClassBody, isArray: true })
        @ApiResponse({ description: 'If save successful', status: 201, type: MemberClassBody, isArray: true })
        @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateMemberClassDto[]) {
        return await this.memberClassService.importData(createDatas)
    }
}

