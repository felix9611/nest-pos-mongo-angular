import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { TaxInformation } from './tax-information.schame'
import { UpdateDtoTaxInformation, TaxInformationListSearchDto, TaxInformationImportDto } from './tax-information.dto'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Injectable()
export class TaxInformationService {
    constructor(
        @InjectModel(TaxInformation.name) private taxInformationModel: Model<TaxInformation>,
        private actionRecordService: ActionRecordService
        ) {}
    
    async create(createDto: UpdateDtoTaxInformation) {

        const { _id, ..._createData } = createDto

        const checkData = await this.findCheckData(
            _createData.taxCode,
            _createData.taxName,
            _createData.nationCode,
            _createData.nationName,
            _createData.countryCode,
            _createData.countryName
        )
        
        if (checkData) {
            await this.taxInformationModel.updateOne({ _id: checkData._id}, {
                ..._createData,
                updatedAt: new Date()
            }).exec()

            await this.actionRecordService.saveRecord({
                actionName: 'Create Tax information for update',
                actionMethod: 'POST',
                actionFrom: 'Tax information',
                actionData: { 
                    _id: checkData._id,
                    ..._createData,
                    updatedAt: new Date()
                },
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return {
                msg: 'This tax information is updated old data!'
            }
        } else {
            const finalData = {
                ..._createData,
                createdAt: new Date(),
                status: 1
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Tax information',
                actionMethod: 'POST',
                actionFrom: 'Tax information',
                actionData: createDto,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })


            const created = new this.taxInformationModel(finalData)
            return await created.save()
        }
    }

    async update(updateDto: UpdateDtoTaxInformation) {
        const { _id, ..._updateDto } = updateDto

        const checkData = await this.taxInformationModel.findOne({ _id, status: 1 })

        if (checkData) {
            const finalData = {
                ..._updateDto,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Tax information',
                actionMethod: 'POST',
                actionFrom: 'Tax information',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.taxInformationModel.updateOne(
                { _id }, 
                finalData
            ).exec()
        } else {


            await this.actionRecordService.saveRecord({
                actionName: 'Update Tax information',
                actionMethod: 'POST',
                actionFrom: 'Tax information',
                actionData: updateDto,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This tax information not exist!'
            }
            
        }
    }

    async getOneById(_id: string) {
        const data = await this.taxInformationModel.findOne({ _id, status: 1 }).exec()

        if (data) {
            return data
        } else {
            return {
                msg: 'This tax information has been invalidated! Please contact admin!'
            }
        }
    }

    async voidOne(_id: string) {
        const checkData = await this.taxInformationModel.findOne({ _id }).exec()

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void tax information',
                actionMethod: 'GET',
                actionFrom: 'Tax information',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })


            return {
                msg: 'This tax information has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.taxInformationModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
        
            if (res.acknowledged === true) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void tax information',
                    actionMethod: 'GET',
                    actionFrom: 'Tax information',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })


                return {
                  msg: 'Invalidate successfully!'
                }
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
        }
    }


    async findCheckData(
        taxCode: string, 
        taxName: string, 
        nationCode: string, 
        nationName: string,
        countryCode: string,
        countryName: string
    ) {
        return await this.taxInformationModel.findOne({
            taxCode,
            taxName,
            nationCode,
            nationName,
            countryCode,
            countryName,
            status: 1
        }).exec()
    }

    async findAll(): Promise<TaxInformation[]> {
        return this.taxInformationModel.find({
            status: 1
        }).exec()
    }

    async listAssetTypeBySearch(req: TaxInformationListSearchDto) {
        const { nameCode, tax, page, limit } = req
        const skip = (page - 1) * limit

        const filters = {
            ...nameCode? {
                $or: [
                    {
                        nationCode: { $regex: name, $options: 'i' }
                    },
                    {
                        nationName: { $regex: name, $options: 'i' }
                    },
                    {
                        countryCode: { $regex: name, $options: 'i' }
                    },
                    {
                        countryName: { $regex: name, $options: 'i' }
                    }
                ]
            } : {},
            ...tax ? {
                $or: [
                    {
                        taxCode: { $regex: name, $options: 'i' }
                    },
                    {
                        taxName: { $regex: name, $options: 'i' }
                    }
                ]
            } : {},
            status: 1
        }

        const lists: TaxInformation[] = await this.taxInformationModel
            .find(filters)
            .skip(skip)
            .limit(limit)
            .exec()
        const total = await this.taxInformationModel.find(filters).countDocuments().exec()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists
        }

    }

    async importData(importData: TaxInformationImportDto[]) {
        let arrayTest: any = []
        for (const data of importData) {
            let { taxType, taxCode, taxName, nationCode, nationName, countryCode, countryName, remark, taxRate, importRate } = data

            if (typeof taxRate === 'string') {
                if (taxRate.includes('%')) {
                    taxRate = Number(taxRate.replace('%', '')) / 100
                } else {
                    taxRate = Number(taxRate) / 100
                }
            } else {
                taxRate = Number(taxRate)
            }

            if (typeof importRate === 'string') {
                if (importRate.includes('%')) {
                    importRate = Number(importRate.replace('%', '')) / 100
                } else {
                    importRate = Number(taxRate) / 100
                }
            } else {
                importRate = Number(taxRate)
            }

            const checkData = await this.findCheckData(taxCode, taxName, nationCode, nationName, countryCode, countryName)


            if (checkData) {
                arrayTest.push({
                    _id: checkData._id.toString(),
                    taxType,
                    taxCode, 
                    taxName,
                    nationCode,
                    nationName,
                    countryCode,
                    countryName,
                    taxRate,
                    importRate, 
                    remark
                })
                await this.update({
                    _id: checkData._id.toString(),
                    taxType,
                    taxCode, 
                    taxName,
                    nationCode,
                    nationName,
                    countryCode,
                    countryName,
                    taxRate,
                    importRate, 
                    remark
                })
            } else {
                arrayTest.push({
                    taxType,
                    taxCode, 
                    taxName,
                    nationCode,
                    nationName,
                    countryCode,
                    countryName,
                    taxRate,
                    importRate, 
                    remark
                })
                await this.create({
                    taxType,
                    taxCode, 
                    taxName,
                    nationCode,
                    nationName,
                    countryCode,
                    countryName,
                    taxRate,
                    importRate, 
                    remark
                })
            }
        }

        return arrayTest
    }
}