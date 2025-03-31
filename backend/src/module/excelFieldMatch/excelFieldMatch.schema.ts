import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'
import { BaseSchema } from '../base/baseSchema'

interface ExcelFieldList {
    dbFieldName: string
    excelFieldName: string
    sort: number
}

export type ExcelFieldMatchDocument = HydratedDocument<ExcelFieldMatch>
@Schema()
export class ExcelFieldMatch extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    functionCode: string

    @Prop({ type: SchemaTypes.String, required: true })
    functionName: string

    @Prop({ type: SchemaTypes.String, required: true })
    functionType: string

    @Prop({ type: SchemaTypes.Array, schema: { type: ExcelFieldMatch } })
    fieldLists: any[]
}

export const ExcelFieldMatchSchema = SchemaFactory.createForClass(ExcelFieldMatch)