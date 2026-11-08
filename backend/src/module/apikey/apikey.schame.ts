import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type ApiKeyDocument = HydratedDocument<ApiKey>
@Schema()
export class ApiKey {
    _id!: Types.ObjectId

    @Prop({ type: SchemaTypes.String, default: Date.now })
    source!: string

    @Prop({ type: SchemaTypes.String, required: true })
    key!: string

    @Prop({ type: SchemaTypes.Number, default: 1})
    status!: number
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey)