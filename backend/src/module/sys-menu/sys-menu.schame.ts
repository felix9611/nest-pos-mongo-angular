import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type SysMenuDocument = HydratedDocument<SysMenu>
@Schema()
export class SysMenu extends BaseSchema {
    @Prop({ type: SchemaTypes.String })
    mainId: string

    @Prop({ type: SchemaTypes.String, required: true })
    name: string

    @Prop({ type: SchemaTypes.String })
    icon: string

    @Prop({ type: SchemaTypes.String })
    path?: string

    @Prop({ type: SchemaTypes.Number, required: true })
    sort: number

    @Prop({ type: SchemaTypes.String })
    type: string

    @Prop({ type: SchemaTypes.String })
    excelFunctionCode: string

    @Prop({ type: SchemaTypes.String })
    excelFunctionName: string
}

export const SysMenuSchema = SchemaFactory.createForClass(SysMenu)