import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Department, DepartmentSchema } from './department.schame'
import { DepartmentService } from './department.service'
import { DepartmentController } from './department.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }]), Department],
    providers: [DepartmentService, ActionRecordService],
    exports: [DepartmentService, Department],
    controllers: [DepartmentController]
})
export class DepartmentMoudule {}