import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types, Document } from 'mongoose'

@Schema({ timestamps: true })
export class BaseSchema {
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.Date, default: Date.now})
    createdAt: Date

    @Prop({ type: SchemaTypes.Date, default: Date.now})
    updatedAt?: Date

    @Prop({ type: SchemaTypes.Number, default: 1})
    status: number
}