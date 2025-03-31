import { Module } from '@nestjs/common'
import { ActionRecord, ActionRecordSchema } from './actionRecord.schame';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionRecordService } from './actionRecord.service';
import { ActionRecordController } from './actionRecord.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ActionRecord.name, schema: ActionRecordSchema }
    ]), ActionRecord],
    controllers: [ActionRecordController],
    providers: [ActionRecordService],
    exports: [ActionRecord, ActionRecordService],
})
export class ActionRecordMoudule {}