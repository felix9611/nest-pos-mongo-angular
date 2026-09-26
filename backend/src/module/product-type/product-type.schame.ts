import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type ProductTypeDocument = HydratedDocument<ProductType>
@Schema()
export class ProductType extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    typeCode!: string

    @Prop({ type: SchemaTypes.String, required: true })
    typeName!: string

    @Prop({ type: SchemaTypes.String })
    typeOtherName?: string

    @Prop({ type: SchemaTypes.String })
    remark?: string
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType)