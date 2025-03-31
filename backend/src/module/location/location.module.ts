import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Location, LocationSchema } from './location.schame'
// import { LocationService } from './location.service'
import { LocationController } from './location.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }]), Location],
    providers: [ ActionRecordService],
    exports: [Location],
    controllers: [LocationController]
})
export class LocationMoudule {}