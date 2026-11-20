export interface UserForm {
    _id?: string,
    username: string
    password?: string
    avatarBase64?: string
    deptIds: string[]
    email: string
    roles: string[]
    placeIds: string[]
    superAdmin: boolean
    manager: boolean
}