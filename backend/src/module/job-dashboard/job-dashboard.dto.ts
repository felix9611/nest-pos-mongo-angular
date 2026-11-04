export interface UpdateJobDashboardStatusDto {
    status: number
    _id: string
    sortOrder: number
}

export interface ListJobDashboardRequestDto {
    name?: string
    memberId?: string
}