export interface CreateSysRoleDto {
    name: string
    code: string
    remark?: string
    meunIds?: number[]
    read: boolean
    write: boolean
    delete: boolean
    update: boolean
    upload: boolean
}

export interface UpdateSysRoleDto extends CreateSysRoleDto{
    _id: string
}

export interface ListRoleRequestDto {
    page: number,
    limit: number,
    name?: string
}