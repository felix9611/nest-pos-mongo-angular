import { Body, Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common"
import { JobDashboardService } from "./job-dashboard.server"
import { ApiBody, ApiOperation } from "@nestjs/swagger"
import { AuthGuard } from "../auth/AuthGuard"
import { JobDashboard } from "./job-dashboard.schema"
import { JwtPayload } from "../auth/auth.dto"
import { ListJobDashboardRequestDto, UpdateJobDashboardStatusDto } from './job-dashboard.dto'

@Controller('tasks')
export class JobDashboardController {
    constructor(private jobDashboardService: JobDashboardService) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: JobDashboard, @Req() { user }: { user: JwtPayload }) {
        return await this.jobDashboardService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() createData: JobDashboard, @Req() { user }: { user: JwtPayload }) {
        return await this.jobDashboardService.update(createData)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() req: ListJobDashboardRequestDto, @Req() { user }: { user: JwtPayload }) {
        return await this.jobDashboardService.listJobDashboard(req)
    }

    @Post('change-status')
    @UseGuards(AuthGuard)
    async changeStatus(@Body() req: UpdateJobDashboardStatusDto, @Req() { user }: { user: JwtPayload }) {
        return await this.jobDashboardService.updateTaskStatus(req)
    }

    @Delete('void/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') _id: string, @Req() { user }: { user: JwtPayload }) {
        return await this.jobDashboardService.voidById(_id)
    }
}