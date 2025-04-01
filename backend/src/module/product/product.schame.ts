import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type ProductTypeDocument = HydratedDocument<Product>
@Schema()
export class Product extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    productCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    productName: string

    @Prop({ type: SchemaTypes.String, required: true })
    itemCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    brandCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    brandName: string

    @Prop({ type: SchemaTypes.String, required: true })
    typeId: string

    @Prop({ type: SchemaTypes.String, required: true })
    deptId: string

    @Prop({ type: SchemaTypes.String, required: true })
    vendorId: string

    @Prop({ type: SchemaTypes.String, required: true })
    unit: string

    @Prop({ type: Types.Double, required: true })
    costPrice: number

    @Prop({ type: Types.Double, required: true })
    retailPrice: number

    @Prop({ type: SchemaTypes.String })
    description: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)