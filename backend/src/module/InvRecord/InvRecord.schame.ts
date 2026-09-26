import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type InvRecordDocument = HydratedDocument<InvRecord>
@Schema()
export class InvRecord {
    _id!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
    productId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Location' })
    locFrom!: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Location' })
    locTo!: Types.ObjectId

    @Prop({ type: SchemaTypes.Number })
    qty?: number

    @Prop({ type: SchemaTypes.Double })
    cost?: number

    @Prop({ type: Types.ObjectId })
    staffId?: Types.ObjectId

    @Prop({ type: SchemaTypes.Date, default: Date.now })
    createdAt!: string
}

export const InvRecordSchema = SchemaFactory.createForClass(InvRecord)