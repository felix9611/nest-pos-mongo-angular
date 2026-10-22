export interface UserForm {
    _id?: string,
    username: string
    password?: string
    avatarBase64?: string
    deptIds?: string[]
    email: string
    roles?: number[]
    placeIds?: string[]
    superAdmin?: boolean
}