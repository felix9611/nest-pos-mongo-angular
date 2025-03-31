import { ApiProperty } from "@nestjs/swagger";

export class ReturnMsg {
    @ApiProperty({ description: 'Message' })
    msg: string
}

export class CommonPageAndList {
    @ApiProperty({ description: 'Page Number' })
    page: number

    @ApiProperty({ description: 'Page limit datas limit' })
    limit: number
}

export class CommonPageAndListResponse {
    @ApiProperty({ description: 'Page Number' })
    page: number

    @ApiProperty({ description: 'Page limit datas limit' })
    limit: number

    @ApiProperty({ description: 'Count of all data' })
    total: number

    @ApiProperty({ description: 'Total pages number' })
    totalPages: number
}

export class CommonId {
    @ApiProperty({ description: 'Data Id' })
    _id: string
    
}

export class CommonBody {
    @ApiProperty({ description: 'Data Id' })
    _id: string

    @ApiProperty({ description: 'Created At' })
    createdAt: string

    @ApiProperty({ description: 'Updated At' })
    updatedAt: string

    @ApiProperty({ description: '1 = Active, 0 = inactive' })  
    status: number
}
