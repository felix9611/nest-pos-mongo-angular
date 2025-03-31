import { ApiProperty } from '@nestjs/swagger'
import { CommonPageAndList, CommonPageAndListResponse } from '../../tool/open-api-body'

export interface CreateDeptDto {
    deptCode: string
    deptName: string,
    remark?: string
}

export interface UpdateDeptDto extends CreateDeptDto {
    _id?: string
}

export interface ListDeptRequestDto {
    page: number
    limit: number
    name?: string
}

export class CreateDeptBody {

    @ApiProperty({ description: 'Department Code' })
    deptCode: string

    @ApiProperty({ description: 'Department Name' })
    deptName: string

    @ApiProperty({ description: 'Remark' })
    remark: string
}

export class UpdateDeptBody extends CreateDeptBody {

    @ApiProperty({ description: 'Data Id' })
    _id: string
}

export class DepartmentBody extends UpdateDeptBody {

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}

export class ListDepartmentQuery extends CommonPageAndList {
    @ApiProperty({ description: 'For search data keywords' })  
    name: string
}

export class ListDepartmentQueryRes extends CommonPageAndListResponse {
    @ApiProperty({ type: [DepartmentBody], description: 'Data List' })
    lists: DepartmentBody[]
}
