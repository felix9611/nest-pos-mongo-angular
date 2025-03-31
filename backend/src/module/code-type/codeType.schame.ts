import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

export type CodeTypeDocument = HydratedDocument<CodeType>
@Schema()
export class CodeType extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    valueCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    valueName: string

    @Prop({ type: SchemaTypes.String, required: true  })
    type: string
}

export const CodeTypeSchema = SchemaFactory.createForClass(CodeType)