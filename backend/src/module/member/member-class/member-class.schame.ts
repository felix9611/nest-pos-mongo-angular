import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../../base/baseSchema'

export type MemberClassDocument = HydratedDocument<MemberClass>
@Schema()
export class MemberClass extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    classCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    className: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const MemberClassSchema = SchemaFactory.createForClass(MemberClass)