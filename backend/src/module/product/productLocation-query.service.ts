import { InjectModel } from '@nestjs/mongoose'
import { ProductLocation } from './productLocation.schame'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { DashboardReqDto, DashboardReqFilterDto } from './product.dto'

@Injectable()
export class ProductLocationQueryService {
    constructor(
        @InjectModel(ProductLocation.name) private productLocationModel: Model<ProductLocation>,
    ) {}

    getFilter(query: DashboardReqFilterDto) {
        const { typeIds, placeIds, deptIds, productCode, productName } = query
    
        return {
            ...typeIds && typeIds.length > 0 ? { 'product.typeId': { $in: typeIds } } : {},
            ...placeIds && placeIds.length > 0 ? { locationId: { $in: placeIds } } : {},
            ...deptIds && deptIds.length > 0 ? { 'product.deptId': { $in: deptIds } } : {},
            ...productCode ? { 'product.productCode': { $regex: productCode, $options: 'i' } } : {},
            ...productName ? { 'product.productName': { $regex: productName, $options: 'i' } } : {}
        }  
    }

    getDeptSet() {
        return {
            lookup: [
                {
                    $lookup: {
                        from: "departments",
                        let: { deptIdStr: { $toObjectId: '$product.deptId' } }, // Convert deptId to ObjectId
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                        as: "department"
                    }
                },
                { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } }
            ],
            group: {
                _id: "$department.deptName"
            },
            project: {
                deptName: "$_id"
            },
            sort: {
                deptName: 1
            },
        }
    }

    getLocationSet() {
        return {
            lookup: [
                {
                    $lookup: {
                        from: "locations",
                        let: { locationIdStr: { $toObjectId: '$locationId' } }, // Convert deptId to ObjectId
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$locationIdStr'] } } }],
                        as: "location"
                    }
                },
                { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } }
            ],
            group: {
                _id: "$location.placeName"
            },
            project: {
                placeName: "$_id"
            },
            sort: {
                placeName: 1
            },
        }
    }

    getTypeSet() {
        return {
            lookup: [
                {
                    $lookup: {
                        from: "producttypes",
                        let: { typeIdStr: { $toObjectId: '$product.typeId' } }, // Convert deptId to ObjectId
                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                        as: "producttype"
                    }
                },
                { $unwind: { path: "$producttype", preserveNullAndEmptyArrays: true } }
            ],
            group: {
                _id: "$producttype.typeName"
            },
            project: {
                typeName: "$_id"
            },
            sort: {
                typeName: 1
            },
        }
    }

    async getByDataType(query: DashboardReqDto) {
        const { dataTypeValue, filter } = query

        if (!dataTypeValue) return { msg: 'Data Type is required' }

        let dataTypeObj: any = {}

        switch (dataTypeValue) {
            case 'dept':
                dataTypeObj = this.getDeptSet()
            break

            case 'type':
                dataTypeObj = this.getTypeSet()
            break 

            case 'location':
                dataTypeObj = this.getLocationSet()
            break 
        }

        const filters: any = this.getFilter(filter)

        return await this.productLocationModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    let: { productIdStr: { $toObjectId: '$productId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$productIdStr'] } } }],
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            ...dataTypeObj.lookup,
            {
                $match: filters
            },
            {
                $group: {
                    ...dataTypeObj.group,
                    totalQty: { $sum: "$qty" },
                    totalPrice: { $sum: "$totalPrice" },    
                    totalCost: { $sum: "$totalCost" },
                }
            },
            {
                $project: {
                    _id: 0,
                    totalQty: 1,
                    totalPrice: 1,
                    totalCost: 1,
                    ...dataTypeObj.project
                }
            },
            { $sort: dataTypeObj.sort }
        ])
    }

}