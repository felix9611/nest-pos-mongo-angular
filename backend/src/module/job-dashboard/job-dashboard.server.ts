import { Injectable } from '@nestjs/common'
import { JobDashboard } from './job-dashboard.schema'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Model } from 'mongoose'
import { ListJobDashboardRequestDto, UpdateJobDashboardStatusDto } from './job-dashboard.dto'
import { JwtPayload } from '../auth/auth.dto'

@Injectable()
export class JobDashboardService {
    constructor(
        @InjectModel(JobDashboard.name) private jobDashboardModel: Model<JobDashboard>,
        private actionRecordService: ActionRecordService
    ) {}

    async listJobDashboard(req: ListJobDashboardRequestDto, user: JwtPayload) {

        let userFilter: any = {}

        if (!user.superAdmin || !user.manager) {
            userFilter = {
                ...userFilter,
                $or: [
                    { userIds: { $in: [user.sub] } },
                    { createdBy: user.username }
                ],
                jobValid: true,
            }
        }

        const toDoList = await this.getJobDashboardListQuery(req, 1, userFilter)
        const inProgressList = await this.getJobDashboardListQuery(req, 2, userFilter)
        const pendingReviewList = await this.getJobDashboardListQuery(req, 3, userFilter)
        const inReviewList = await this.getJobDashboardListQuery(req, 4, userFilter)
        const completedList = await this.getJobDashboardListQuery(req, 5, userFilter)

        return {
            toDoList: toDoList || [],
            inProgressList: inProgressList || [],
            pendingReviewList: pendingReviewList || [],
            inReviewList: inReviewList || [],
            completedList: completedList || []
        }
    }

    async getJobDashboardListQuery(req: ListJobDashboardRequestDto, status: number, userFilter: any) {
        const { name, memberId } = req

        const allQuery: any = { 
            ...(name ? { title: { $regex: name, $options: 'i' } } : {}),
            ...userFilter
        }

        return await this.jobDashboardModel.aggregate([
            { 
                $match: { 
                    ...allQuery, 
                    status,
                } 
            },
            {
                $lookup: {
                    from: 'sysusers', // Make sure this matches your DB collection name
                    let: { userIds: { $map: { input: '$userIds', as: 'userIds', in: { $toObjectId: '$$userIds' } } } }, // Convert strings to ObjectIds
                    pipeline: [
                        { $match: { $expr: { $in: ['$_id', '$$userIds'] } } },
                        {
                            $project: {
                                _id: 0,
                                username: 1,
                                avatarBase64: 1
                            }
                        }
                    ],
                    as: 'users'
                }
            },
            { 
                $sort: { 
                    sortOrder: 1,
                } 
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    number: 1,
                    description: 1,
                    category: 1,
                    tags: 1,
                    labels: 1,
                    jobEndDate: 1,
                    comments: 1,
                    createdAt: 1,
                    checkLists: 1,
                    jobValid: 1,
                    status: 1,
                    sortOrder: 1,
                    userIds: 1,
                    users: 1
                }
            },
        ]).exec()
    }

    getOneById(_id: string) {
        return this.jobDashboardModel.findOne({ _id }).exec()
    }

    async voidById(_id: string, user: JwtPayload) {
        const check = await this.jobDashboardModel.findOne({ _id })

        if (!(user.superAdmin === true || user.manager === true) && check && check.status >= 3) {
            return {
                error: 'You do not allow to void this task on this status'
            }
        } else {
            if (check?.status !== 0) {
                const finalData = {
                    status: 0,
                    jobValid: false,
                    updatedAt: new Date()
                }

                const res = await this.jobDashboardModel.updateOne({ _id }, finalData)

                if (res.modifiedCount === 0) {
                    return {
                        error: 'This task has been voided! Please contact admin!'
                    }
                } else {
                    await this.actionRecordService.saveRecord({
                        actionName: 'Void Job Dashboard',
                        actionMethod: 'POST',
                        actionFrom: 'Job Dashboard',
                        actionData: finalData,
                        actionSuccess: 'Sussess',
                        createdAt: new Date()
                    })

                    return {
                        message: 'Task voided successfully!'
                    }
                }
            } else {
                return {
                    error: 'This task has been voided! Please contact admin!'
                }
            }
        }
    }

    async updateTaskStatus(req: UpdateJobDashboardStatusDto) {
        const { _id, status, sortOrder } = req

        const check = await this.jobDashboardModel.findOne({ _id })

        if (check) {
            const finalData = {
                status,
                sortOrder,
                updatedAt: new Date()
            }

            const res = await this.jobDashboardModel.updateOne({ _id }, finalData)

            if (res.modifiedCount > 0) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Task Status',
                    actionMethod: 'POST',
                    actionFrom: 'Job Dashboard',
                    actionData: finalData,
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })
                return {
                    message: 'Task status updated successfully!',
                    move: true
                }
            } else {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Task Status',
                    actionMethod: 'POST',
                    actionFrom: 'Job Dashboard',
                    actionData: finalData,
                    actionSuccess: 'FAILURE',
                    createdAt: new Date()
                })

                return {
                    error: 'Task status updated failed!',
                    move: false
                }
            }
        } else {
            return {
                error: 'Task not found!',
                move: false
            }
        }
    }

    async create(jobDashboard: JobDashboard, createdBy: string) {
        const { _id, number, title, ..._description } = jobDashboard
        
        const check = await this.jobDashboardModel.findOne({ title })

        if (check) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Job Card',
                actionMethod: 'POST',
                actionFrom: 'Job Dashboard',
                actionData: jobDashboard,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                error: 'This title already exist! Please create new one!'
            }
        } else {

            const result = await this.jobDashboardModel
                .findOne({ status: _description.status })
                .sort({ sortOrder: -1 })
                .select('sortOrder')
                .lean()

            const maxSortOrder = result?.sortOrder ?? 0

            const newNumber = await this.createNewNumber()

            const newData: any = {
                ..._description,
                title,
                number: newNumber,
                createdAt: new Date(),
                updatedAt: new Date(),
                jobValid: true,
                sortOrder: maxSortOrder + 10,
                createdBy
            }

            const createdJobDashboard = new this.jobDashboardModel(newData)

            const res = await createdJobDashboard.save()

            if (res) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Job Card',
                    actionMethod: 'POST',
                    actionFrom: 'Job Dashboard',
                    actionData: newData,
                    actionSuccess: 'SUCCESS',
                    createdAt: new Date()
                })
                return {
                    message: 'Job Card created successfully!',
                    data: res
                }
            } else {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Job Card',
                    actionMethod: 'POST',
                    actionFrom: 'Job Dashboard',
                    actionData: newData,
                    actionSuccess: 'FAILURE',
                    createdAt: new Date()
                })
                return {
                    error: 'Failed to create Job Card!'
                }
            }
        }
    } 


    /// get number
    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewNumber() {
        const result = await this.jobDashboardModel.aggregate([
            {
              $addFields: { numberInt: { $toInt: "$number" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$numberInt" } // Find max
              }
            }
        ]).exec()

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 8)
        } else {
            return this.formatNumber(maxNumber, 8)
        }
    }

    async update(jobDashboard: JobDashboard) {
        const { _id, ..._description } = jobDashboard

        const check = await this.jobDashboardModel.findOne({ _id })

        if (check?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Job Card',
                actionMethod: 'PUT',
                actionFrom: 'Job Dashboard',
                actionData: jobDashboard,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                error: 'This Job Card has been voided! Please contact admin!'
            }
        } else {
            const finalData = {
                ...jobDashboard,
                updatedAt: new Date()
            }

            const res = await this.jobDashboardModel.updateOne({ _id }, finalData)

            if (res.modifiedCount > 0) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Job Card',
                    actionMethod: 'PUT',
                    actionFrom: 'Job Dashboard',
                    actionData: finalData,
                    actionSuccess: 'SUCCESS',
                    createdAt: new Date()
                })
                return {
                    message: 'Job Card updated successfully!',
                    data: res
                }
            } else {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Job Card',
                    actionMethod: 'PUT',
                    actionFrom: 'Job Dashboard',
                    actionData: finalData,
                    actionSuccess: 'FAILURE',
                    createdAt: new Date()
                })
                return {
                    error: 'Failed to update Job Card!'
                }
            }
        }
    }

    async asyncTasks(user: JwtPayload) {
        
        const filter = {
            ...(!(user.superAdmin || user.manager) ? 
                { userIds: { $in: [user.sub] }, status: { $lt: 3 } }: { status: { $lt: 5 } }
            ),
            jobValid: true
        }

        return await this.jobDashboardModel.aggregate([
            { 
                $match: filter
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    number: 1,
                    status: 1
                }
            },
            { $sort: { sortOrder: 1 } },
            { $limit: 10}
        ]).exec()

    }
}