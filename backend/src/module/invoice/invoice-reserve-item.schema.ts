import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type InvoiceReserveItemDocument = HydratedDocument<InvoiceReserveItem>
@Schema()
export class InvoiceReserveItem {
    _id!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    invoiceId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    productId!: Types.ObjectId

    @Prop({ type: SchemaTypes.Boolean, required: true })
    outOfStock?: boolean

    @Prop({ type: SchemaTypes.Boolean, required: true })
    inAddition?: boolean

    @Prop({ type: SchemaTypes.Number, required: true })
    qty!: number

    @Prop({ type: SchemaTypes.Double, required: true })
    price!: number

    @Prop({ type: SchemaTypes.Double })
    discount?: number

    @Prop({ type: SchemaTypes.String })
    discountType?: string

    @Prop({ type: SchemaTypes.String })
    taxType?: string

    @Prop({ type: SchemaTypes.String })
    taxCode?: string

    @Prop({ type: SchemaTypes.Double })
    taxRate?: number

    @Prop({ type: SchemaTypes.Double })
    taxAmount?: number 
}

export const InvoiceReserveItemSchema = SchemaFactory.createForClass(InvoiceReserveItem)