import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type ReturnItemDocument = HydratedDocument<ReturnItem>
@Schema()
export class ReturnItem {
    _id!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    returnDataId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    returnInvoiceId!: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    productId!: Types.ObjectId

    @Prop({ type: SchemaTypes.Number, required: true })
    qty!: number

    @Prop({ type: SchemaTypes.Double, required: true })
    price!: number

    @Prop({ type: SchemaTypes.String })
    taxType?: string

    @Prop({ type: SchemaTypes.String })
    taxCode?: string

    @Prop({ type: SchemaTypes.Double })
    taxRate?: number

    @Prop({ type: SchemaTypes.Double })
    taxAmount?: number 
}

export const ReturnItemSchema = SchemaFactory.createForClass(ReturnItem)