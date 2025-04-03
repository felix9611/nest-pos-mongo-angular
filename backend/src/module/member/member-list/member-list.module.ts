import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from 'src/module/action-record/actionRecord.schame'
import { ActionRecordService } from 'src/module/action-record/actionRecord.service'
import { Member, MemberSchema } from './member-list.schame'
import { MemberSpecialDay, MemberSpecialDaySchema } from './member-special-day.schame'
import { MemberService } from './member-list.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: Member.name, schema: MemberSchema },
            { name: MemberSpecialDay.name, schema: MemberSpecialDaySchema }
        ])
    ],
    providers: [ActionRecordService, MemberService],
    controllers: []
})
export class MemberMoudule {}