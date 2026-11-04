import { HydratedDocument, SchemaTypes, Types } from "mongoose"
import { BaseSchema } from "../base/baseSchema"
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"

export type JobDashboardDocument = HydratedDocument<JobDashboard>

@Schema()
export class JobDashboard extends BaseSchema {
    @Prop({ type: SchemaTypes.String, required: true })
    number!: string

    @Prop({ type: SchemaTypes.String, required: true })
    category!: string

    @Prop({ type: SchemaTypes.String, required: true })
    title!: string

    @Prop({ type: SchemaTypes.String, required: true })
    description!: string

    @Prop({ type: SchemaTypes.Date, required: false })
    jobStartDate!: Date

    @Prop({ type: SchemaTypes.Date, required: false })
    jobEndDate!: Date

    @Prop({ type: SchemaTypes.String, required: false })
    jobTimeRemain?: string

    @Prop({ type: SchemaTypes.Array, required: false, default: [] })
    locationIds?: string[]

    @Prop({ type: SchemaTypes.Array, required: false, default: [] })
    tags?: string[]

    @Prop({ type: SchemaTypes.Array, required: false, default: [] })
    labels?: string[]

    @Prop({ type: SchemaTypes.Array, required: false, default: [] })
    attachments?: AttachmentLists[]

    @Prop({ type: SchemaTypes.Array, required: false, default: [] })
    comments?: CommentList[]

    @Prop({ type: SchemaTypes.Array, required: false, default: [] })
    checkLists?: CheckList[]

    @Prop({ type: Types.ObjectId, required: false, default: [] })
    userIds?: Types.ObjectId[]

    @Prop({ type: SchemaTypes.Mixed, required: false, default: {} })
    jobRelationData?: JobRelationData

    @Prop({ type: SchemaTypes.Boolean, required: false, default: false })
    jobValid!: boolean

    @Prop({ type: SchemaTypes.Number, required: false, default: 1 })
    sortOrder!: number
}

export const JobDashboardSchema = SchemaFactory.createForClass(JobDashboard)


export interface CheckList {
    name: string
    checked: boolean
    status: number
}

export interface CommentList {
    userId: string
    username: string
    avatar: string
    comment: string
    status: number
}

export interface AttachmentLists {
    fileName?: string
    fileType?: string
    base64?: string
    updatedAt?: Date
    status?: number
}

export interface JobRelationData {
    productCode?: string
    typeCode?: string
    deptCode?: string
    placeCode?: string
    vendorCode?: string
    stockTakeName?: string
    invoiceNumber?: string
    returnInvoiceCaseNumber?: string
}