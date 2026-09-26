import { ApiProperty } from "@nestjs/swagger"

export interface SysMenuDto {
    mainId: string
    name: string
    icon: string
    path: string
    sort: number
    type: string
    excelFunctionCode: string
    excelFunctionName: string
}

export interface UpdateSysMenuDto extends SysMenuDto {
    _id: string
}

export interface SysMenuList {
    name: string
}


export interface SysMenuTree extends SysMenuDto {
    childrens: SysMenuTree[]
}


export interface SysMenuTree extends SysMenuDto {
    childrens: SysMenuTree[]
}

export class CreateSysMenuBody {
    @ApiProperty({ description: 'Main Id , blank will be main' })
    mainId?: string

    @ApiProperty({ description: 'Name' })
    name!: string

    @ApiProperty({ description: 'Icon String' })
    icon?: string

    @ApiProperty({ description: 'path' })
    path!: string

    @ApiProperty({ description: 'Sorting Order Number' })
    sort!: number

    @ApiProperty({ description: 'Menu Type' })
    type?: string

    @ApiProperty({ description: 'Excel Function Code' })
    excelFunctionCode?: string

    @ApiProperty({ description: 'Excel Function Name' })
    excelFunctionName?: string
}

export class UpdateSysMenuBody extends CreateSysMenuBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
}
export class SysMenuBody extends UpdateSysMenuBody {
    @ApiProperty({ description: 'Created At' }) 
    createdAt!: string    
    @ApiProperty({ description: 'Updated At' })            
    updatedAt?: string
    @ApiProperty({ description: '1 = Active, 0 = inactive' })    
    status!: number
}

export class ListTreeMenuBody {
    @ApiProperty({ description: 'Menu ID Lists' })
    ids?: string[]
}

export class TreeMenuBody extends SysMenuBody {
    @ApiProperty({ description: 'Children Menu', type: SysMenuBody, isArray: true }) 
    childrens?: SysMenuBody[] 
}

export class MainMenuBody {
    @ApiProperty({ description: 'Data Id' })
    _id!: string
    @ApiProperty({ description: 'Main Id , blank will be main' })
    mainId?: string
    @ApiProperty({ description: 'Name' })
    name?: string
}

export class MenuQueryBody {
    @ApiProperty({ description: 'Name for search' })
    name?: string
}