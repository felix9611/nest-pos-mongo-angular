import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type LocationDocument = HydratedDocument<Location>
@Schema()
export class Location extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    placeCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    placeName: string

    @Prop({ type: SchemaTypes.String })
    placeOtherName: string

    @Prop({ type: SchemaTypes.String })
    country: string

    @Prop({ type: SchemaTypes.String })
    address: string

    @Prop({ type: SchemaTypes.String })
    zipCode: string

    @Prop({ type: SchemaTypes.String })
    email: string

    @Prop({ type: SchemaTypes.String })
    phone: string

    @Prop({ type: SchemaTypes.String })
    fax: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const LocationSchema = SchemaFactory.createForClass(Location)