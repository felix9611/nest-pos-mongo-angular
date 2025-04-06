export interface CreateMemberClassDto {
    classCode: string
    className: string
    remark: string
}

export interface UpdateMemberClassDto extends CreateMemberClassDto {
    _id?: string
}

export interface ListMemberClassRequestDto {
    page: number
    limit: number
    name?: string
}
