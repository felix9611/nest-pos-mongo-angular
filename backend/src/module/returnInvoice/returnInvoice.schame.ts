import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from '../base/baseSchema'


export type ReturnInvoiceDocument = HydratedDocument<ReturnInvoice>
@Schema()
export class ReturnInvoice extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    invoiceNumber: string

    @Prop({ type: SchemaTypes.Date, required: true })
    returnDate: string

    @Prop({ type: SchemaTypes.String, required: true })
    returnReason: string

    @Prop({ type: SchemaTypes.String, required: true })
    returnDatail: string

    @Prop({ type: SchemaTypes.String, required: true })
    processMethod: string

    @Prop({ type: SchemaTypes.Boolean, required: true })
    refund: boolean

    @Prop({ type: SchemaTypes.Double, required: true })
    refundAmount: number

    @Prop({ type: SchemaTypes.String, required: true })
    refundMethod: string

    @Prop({ type: SchemaTypes.Boolean, required: true })
    returnToVendor: boolean
}

export const ReturnInvoiceSchema = SchemaFactory.createForClass(ReturnInvoice)