import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type VendorDocument = HydratedDocument<Vendor>
@Schema()
export class Vendor extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    vendorCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    vendorName: string

    @Prop({ type: SchemaTypes.String })
    vendorOtherName?: string

    @Prop({ type: SchemaTypes.String, required: true })
    type: string

    @Prop({ type: SchemaTypes.String })
    email?: string

    @Prop({ type: SchemaTypes.String })
    phone?: string

    @Prop({ type: SchemaTypes.String })
    fax?: string

    @Prop({ type: SchemaTypes.String, required: true })
    address: string

    @Prop({ type: SchemaTypes.String, required: true })
    contactPerson: string

    @Prop({ type: SchemaTypes.String })
    remark?: string
}

export const VendorSchema = SchemaFactory.createForClass(Vendor)