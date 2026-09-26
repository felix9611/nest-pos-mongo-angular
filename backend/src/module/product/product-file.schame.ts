import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type ProductFileDocument = HydratedDocument<ProductFile>
@Schema()
export class ProductFile extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true, ref: 'ProductList' })
    productId!: Types.ObjectId

    @Prop({ type: SchemaTypes.String })
    fileName!: string

    @Prop({ type: SchemaTypes.String })
    fileType!: string

    @Prop({ type: SchemaTypes.String })
    base64!: string

}

export const ProductFileSchema = SchemaFactory.createForClass(ProductFile)