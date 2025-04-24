import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
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

    @Prop({ type: Types.ObjectId, required: true })
    returnLocationId: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    returnCaseNumber: Types.ObjectId

    @Prop({ type: SchemaTypes.String })
    returnDatail: string

    @Prop({ type: SchemaTypes.String })
    returnMethod: string

    @Prop({ type: SchemaTypes.String, required: true })
    processMethod: string

    @Prop({ type: SchemaTypes.Boolean })
    refund: boolean

    @Prop({ type: SchemaTypes.Double })
    refundAmount: number

    @Prop({ type: SchemaTypes.String })
    refundMethod: string

    @Prop({ type: SchemaTypes.Boolean })
    returnToVendor: boolean
}

export const ReturnInvoiceSchema = SchemaFactory.createForClass(ReturnInvoice)