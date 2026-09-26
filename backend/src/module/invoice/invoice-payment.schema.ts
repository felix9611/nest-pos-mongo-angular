import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type InvoicePaymentDocument = HydratedDocument<InvoicePayment>
@Schema()
export class InvoicePayment {
    _id!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    invoiceId!: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    method!: string

    @Prop({ type: SchemaTypes.Double, required: true })
    amount!: number

    @Prop({ type: SchemaTypes.Date, required: true })
    paymentTime!: string
}

export const InvoicePaymentSchema = SchemaFactory.createForClass(InvoicePayment)