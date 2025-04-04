import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type InvoiceDocument = HydratedDocument<Invoice>
@Schema()
export class Invoice extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    number: string

    @Prop({ type: Types.ObjectId, required: true })
    memberId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    locationId: Types.ObjectId

    @Prop({ type: SchemaTypes.Double, required: true })
    totalAmount: number

    @Prop({ type: SchemaTypes.Double, required: true })
    discount: number

    @Prop({ type: SchemaTypes.String, required: true })
    discountType: string

    @Prop({ type: SchemaTypes.Double, required: true })
    taxTotal: number

    @Prop({ type: SchemaTypes.String, required: true })
    taxRefNo: string

    @Prop({ type: SchemaTypes.String, required: true })
    remark: string
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)