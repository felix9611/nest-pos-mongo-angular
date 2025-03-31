import { Test, TestingModule } from '@nestjs/testing'
import { ActionRecordController } from './actionRecord.controller'
import { ActionRecordService } from './actionRecord.service'
import { AuthGuard } from '../auth/AuthGuard'
import { ActionRecord, ActionRecordSchema } from './actionRecord.schame'
import { Model } from 'mongoose'
import { getModelToken } from '@nestjs/mongoose'

describe('ActionRecordController', () => {
    let controller: ActionRecordController
    let service: ActionRecordService

    const mockActionRecordService = {
        listAndPage: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActionRecordController],
            providers: [
                {
                  provide: ActionRecordService,
                  useValue: mockActionRecordService,
                },
            ],
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .compile();
        
        controller = module.get<ActionRecordController>(ActionRecordController)
        service = module.get<ActionRecordService>(ActionRecordService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('list', () => {
        it('should call service.listAndPage and return the result', async () => {
            const dto = { page: 1, limit: 10 }
            const result = { total: 0, totalPages: 0, list: [], ...dto }

            mockActionRecordService.listAndPage.mockResolvedValue(result)

            expect(await controller.list(dto)).toEqual(result)
            expect(mockActionRecordService.listAndPage).toHaveBeenCalledWith(dto)
        })
        it('should handle errors gracefully', async () => {
            mockActionRecordService.listAndPage.mockRejectedValue(new Error('DB Error'))
            
            await expect(controller.list({ page: -1, limit: 10 })).rejects.toThrow('DB Error')
        })
        
    })
})

describe('ActionRecordService', () => {
    let service: ActionRecordService
    let model: Model<ActionRecord>

    const mockActionRecordModel = {
        countDocuments: jest.fn().mockResolvedValue(0),
        find: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActionRecordService,
                {
                    provide: getModelToken('ActionRecord'),
                    useValue: mockActionRecordModel
                }
            ],
        }).compile()

        service = module.get<ActionRecordService>(ActionRecordService)
        model = module.get<Model<ActionRecord>>(getModelToken('ActionRecord'))
    })


    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('listAndPage', () => {
        it('should return paginated results', async () => {
            const mockData = [{ _id: '1', actionName: 'Test', actionMethod: 'POST', actionFrom: 'Test', actionData: {}, actionSuccess: 'Test', createdAt: '2025-03-27T00:00:00:00Z' }]
            mockActionRecordModel.countDocuments.mockReturnValue(Promise.resolve(10))
            mockActionRecordModel.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData)
            })
        })

        it('should return empty list if no records', async () => {
            mockActionRecordModel.countDocuments.mockReturnValue(Promise.resolve(0))
            mockActionRecordModel.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([])
            })

        })
    })
})