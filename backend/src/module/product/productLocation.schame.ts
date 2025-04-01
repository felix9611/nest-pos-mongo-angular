import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type ProductLocationDocument = HydratedDocument<ProductLocation>
@Schema()
export class ProductLocation {
    _id: Types.ObjectId
    
    @Prop({ type: SchemaTypes.String, required: true })
    productId: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    locationId: Types.ObjectId

    @Prop({ type: SchemaTypes.Int32, required: true })
    qty: number

    @Prop({ type: Types.Double, required: true })
    totalPrice: number

    @Prop({ type: Types.Double, required: true })
    totalCost: number
}

export const ProductLocationSchema = SchemaFactory.createForClass(ProductLocation)