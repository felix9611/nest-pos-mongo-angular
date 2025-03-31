import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type ActionRecordDocument = HydratedDocument<ActionRecord>
@Schema()
export class ActionRecord {
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    actionName: string

    @Prop({ type: SchemaTypes.String, required: true })
    actionMethod: string

    @Prop({ type: SchemaTypes.String, required: true })
    actionFrom: string

    @Prop({ type: SchemaTypes.Mixed, required: true })
    actionData: any

    @Prop({ type: SchemaTypes.String, required: true })
    actionSuccess: string
    
    @Prop({ type: SchemaTypes.Date, default: Date.now})
    createdAt: string
}

export const ActionRecordSchema = SchemaFactory.createForClass(ActionRecord)