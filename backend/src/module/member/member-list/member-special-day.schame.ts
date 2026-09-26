import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../../base/baseSchema'

export type MemberDocument = HydratedDocument<MemberSpecialDay>
@Schema()
export class MemberSpecialDay extends BaseSchema {
    @Prop({ type: Types.ObjectId, required: true })
    memberId!: Types.ObjectId

    @Prop({ type: SchemaTypes.String })
    name!: string

    @Prop({ type: SchemaTypes.Date })
    date!: string

    @Prop({ type: SchemaTypes.String })
    remark?: string
}

export const MemberSpecialDaySchema = SchemaFactory.createForClass(MemberSpecialDay)