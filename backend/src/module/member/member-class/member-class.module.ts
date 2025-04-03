import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MemberClass, MemberClassSchema } from './member-class.schame'
import { ActionRecord, ActionRecordSchema } from 'src/module/action-record/actionRecord.schame'
import { MemberClassService } from './member-class.service'
import { ActionRecordService } from 'src/module/action-record/actionRecord.service'
import { MemberClassController } from './member-class.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MemberClass.name, schema: MemberClassSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema }
        ])
    ],
    providers: [MemberClassService, ActionRecordService],
    controllers: [MemberClassController]
})
export class MemberClassMoudule {}