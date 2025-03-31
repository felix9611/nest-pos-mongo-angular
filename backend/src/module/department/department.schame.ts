import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type SysRoleDocument = HydratedDocument<Department>
@Schema()
export class Department extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    deptCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    deptName: string

    @Prop({ type: SchemaTypes.String })
    remark: string
}

export const DepartmentSchema = SchemaFactory.createForClass(Department)