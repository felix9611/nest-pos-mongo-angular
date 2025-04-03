import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../../base/baseSchema'

export type MemberDocument = HydratedDocument<Member>
@Schema()
export class Member extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    name: string

    @Prop({ type: SchemaTypes.String, required: true })
    address: string

    @Prop({ type: SchemaTypes.String, required: true })
    phone: string

    @Prop({ type: SchemaTypes.String, required: true })
    email: string

    @Prop({ type: SchemaTypes.String, required: true })
    fax: string

    @Prop({ type: Types.ObjectId, required: true })
    classId: Types.ObjectId

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const MemberSchema = SchemaFactory.createForClass(Member)