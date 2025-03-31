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