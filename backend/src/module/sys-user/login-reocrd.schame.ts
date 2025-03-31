
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type SysUserDocument = HydratedDocument<LoginRecord>
@Schema()
export class LoginRecord {
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.String, required: true })
    username: string

    @Prop({ type: SchemaTypes.Date, required: true })
    loginTime: string

    @Prop({ type: SchemaTypes.String, required: true })
    loginStatus: string

    @Prop({ type: SchemaTypes.String })
    ipAddress: string
}

export const LoginRecordSchema = SchemaFactory.createForClass(LoginRecord)