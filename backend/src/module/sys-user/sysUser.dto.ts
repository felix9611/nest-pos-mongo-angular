export interface CreateUserDto {
    username: string
    password?: string
    avatarBase64?: string
    deptId?: number
    email: string
    roles?: number[]
}

export interface CreateUserRequestDto {
    key: string
    userData: CreateUserDto
}

export interface UpdateUserDto extends CreateUserDto{
    _id: string
}

export interface ListUserRequestDto {
    page: number,
    limit: number,
    deptIds?: number[],
    roleIds?: number[],
    username?: string
}