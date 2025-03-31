import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type SysRoleDocument = HydratedDocument<SysRole>
@Schema()
export class SysRole extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    name: string

    @Prop({ type: SchemaTypes.String, required: true })
    code: string

    @Prop({ type: SchemaTypes.String})
    remark?: string

    @Prop({ type: SchemaTypes.Mixed })
    menuIds: any

    @Prop({ type: SchemaTypes.Boolean })
    read: boolean

    @Prop({ type: SchemaTypes.Boolean })
    write: boolean

    @Prop({ type: SchemaTypes.Boolean })
    delete: boolean

    @Prop({ type: SchemaTypes.Boolean })
    upload: boolean

    @Prop({ type: SchemaTypes.Boolean })
    update: boolean
}

export const SysRoleSchema = SchemaFactory.createForClass(SysRole)