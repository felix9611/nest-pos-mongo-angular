import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type StockTakeDocument = HydratedDocument<StockTake>
@Schema()
export class StockTake {
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    actionName: string

    @Prop({ type: Types.ObjectId, required: true, ref: 'Location' })
    actionPlaceId: string 

    @Prop({ type: SchemaTypes.String })
    remark: string

    @Prop({ type: SchemaTypes.Date, required: true })
    createdTime: string

    @Prop({ type: SchemaTypes.Date })
    finishTime: string

    @Prop({ type: SchemaTypes.Number, required: true})
    status: number

    @Prop({ type: SchemaTypes.String })
    createBy: string

    @Prop({ type: SchemaTypes.String })
    finishBy: string
}

export const StockTakeSchema = SchemaFactory.createForClass(StockTake)