export interface MemberSpecialDayDto {
    _id?: string
    memberId?: string
    name: string
    date: string
    remark: string
}

export interface CreateMemberDto {
    name: string
    address: string
    phone: string
    email: string
    fax: string
    classId: string
    remark: string
    memberSpecialDays: MemberSpecialDayDto[]
}

export interface UpdateMemberDto extends CreateMemberDto {
    _id?: string
    memberCode?: string
}

export interface ListMemberRequestDto {
    page: number
    limit: number
    name?: string
    contact?: string
    classIds?: string[]
}
