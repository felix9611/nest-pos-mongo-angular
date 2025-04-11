import { InjectModel } from '@nestjs/mongoose'
import { InvRecord } from './InvRecord.schame'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { DashboardReqDto, DashboardReqFilterDto } from './InvRecord.dto'


@Injectable()
export class InvRecordQueryService {
    constructor(
        @InjectModel(InvRecord.name) private invRecordModel: Model<InvRecord>
    ) {}

    getFilter(query: DashboardReqFilterDto) {
            const { dateRange, dataType } = query  
    
        return {
            ...dateRange && dateRange.length > 0 ? { 
                createdAt: { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1]) }
            } : {}
        }
    }

    getYearMonth() {
        return {
            group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: {
                      $dateToString: {
                        format: "%B", // month name like "April"
                        date: "$createdAt"
                      }
                    },
                    monthNum: { $month: "$createdAt" } // sort month number
                }
            },
            project: {
                year: "$_id.year",
                month: "$_id.month",
                monthNum: "$_id.monthNum",
            },
            sort: {
                year: 1,
                monthNum: 1
            },
        }
    }

    async getByDataType(query: DashboardReqDto) {
        const { valueField, dataType, filter } = query

        if (!dataType) {
            throw new Error('dataType is required')
        }

        let dataTypeFilter: any = {}

        switch (dataType) {
            case 'stockIn':
                dataTypeFilter = { locFrom: '' }
            break
            case 'stockOut':
                dataTypeFilter = { locTo: '' }
            break
            case 'stockMove':
                dataTypeFilter = { locFrom: { $ne: ''}, locTo: { $ne: '' } }
            break
        }

        const valueFieldObj = {
            group: { qtys: { $sum: "$qty" }, costs: { $sum: "$cost" } },
            project: { qtys: 1, costs: 1 }
        }

        const getYearMonthObj = this.getYearMonth()


        const filterObj = {
            ...this.getFilter(filter),
            ...dataTypeFilter
        }

        const data = await this.invRecordModel.aggregate([
            { $match: filterObj },
            { $group: { ...valueFieldObj.group, ...getYearMonthObj.group } },
            { $project: { ...valueFieldObj.project, _id: 0, ...getYearMonthObj.project } },
            { $sort: { year: 1, monthNum: 1 } }
        ])

        return data
    }
}