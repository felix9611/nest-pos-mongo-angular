import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type InvoiceDocument = HydratedDocument<Invoice>
@Schema({
  timestamps: true,
  strict: 'throw'
})
export class Invoice extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    number!: string

    @Prop({ type: Types.ObjectId, required: true })
    memberId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    locationId!: Types.ObjectId

    @Prop({ type: SchemaTypes.Double, required: true })
    totalAmount!: number

    @Prop({ type: SchemaTypes.Double })
    discount?: number

    @Prop({ type: SchemaTypes.String })
    discountType?: string

    @Prop({ type: SchemaTypes.Double })
    taxTotal?: number

    @Prop({ type: SchemaTypes.String })
    taxRefNo?: string

    @Prop({ type: SchemaTypes.String })
    remark?: string

    @Prop({ type: SchemaTypes.String })
    source!: string
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)