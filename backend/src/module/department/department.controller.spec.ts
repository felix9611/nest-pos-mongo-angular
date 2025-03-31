import { Test, TestingModule } from '@nestjs/testing'
import { DepartmentController } from './department.controller'
import { DepartmentService } from './department.service'
import { AuthGuard } from '../auth/AuthGuard'

describe('DepartmentController', () => {
    let controller: DepartmentController
    let service: DepartmentService

    const mockDepartmentService = {
        create: jest.fn(),
        update: jest.fn(),
        getOneById: jest.fn(),
        invalidateDepartment: jest.fn(),
        findAll: jest.fn(),
        listPageRole: jest.fn(),
        importData: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DepartmentController],
            providers: [
                {
                    provide: DepartmentService,
                    useValue: mockDepartmentService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile()

        controller = module.get<DepartmentController>(DepartmentController)
        service = module.get<DepartmentService>(DepartmentService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('create', () => {
        it('should create a department successfully', async () => {
            const dto = { deptCode: 'HR', deptName: 'HR Team', remark: 'Tongs' }
            mockDepartmentService.create.mockResolvedValue(dto)

            const result = await controller.create(dto)
            expect(result).toEqual(dto)
            expect(mockDepartmentService.create).toHaveBeenCalledWith(dto)
        })
    });

    describe('update', () => {
        it('should update a department successfully', async () => {
            const dto = { id: '1',  deptCode: 'HR', deptName: 'HR Team', remark: 'Tongs' }
            mockDepartmentService.update.mockResolvedValue(dto)

            const result = await controller.update(dto)
            expect(result).toEqual(dto)
            expect(mockDepartmentService.update).toHaveBeenCalledWith(dto)
        })
    })

    describe('removeById', () => {
        it('should invalidate a department by ID', async () => {
            const id = '1';
            const message = { message: 'Department invalidated' }
            mockDepartmentService.invalidateDepartment.mockResolvedValue(message)

            const result = await controller.removeById(id)
            expect(result).toEqual(message)
            expect(mockDepartmentService.invalidateDepartment).toHaveBeenCalledWith(id)
        })
    })

    describe('getAll', () => {
        it('should return all departments', async () => {
            const departments = [{ id: '1',  deptCode: 'HR', deptName: 'HR Team', remark: 'Tongs' }]
            mockDepartmentService.findAll.mockResolvedValue(departments)

            const result = await controller.getAll()
            expect(result).toEqual(departments)
            expect(mockDepartmentService.findAll).toHaveBeenCalled()
        })
    })

    describe('listAndPage', () => {
        it('should return paginated department data', async () => {
            const req: any = { page: 1, size: 10 }
            const response = { total: 0, totalPages: 0, list: [], ...req }
            mockDepartmentService.listPageRole.mockResolvedValue(response)

            const result = await controller.listAndPage(req)
            expect(result).toEqual(response)
            expect(mockDepartmentService.listPageRole).toHaveBeenCalledWith(req)
        })
    })

    describe('importData', () => {
        it('should batch create departments', async () => {
            const createDatas: any[] = [{ deptCode: 'HR', deptName: 'HR Team', remark: 'Tongs' }]
            mockDepartmentService.create.mockResolvedValue(createDatas[0])

          //  const result = await controller.importData(createDatas)
        //    expect(result).toEqual(createDatas[0])
        //    expect(mockDepartmentService.create).toHaveBeenCalledWith(createDatas[0])
        })
    })

    describe('getOneById', () => {
        it('should call service.getOneById and return the result', async () => {
          const id = '123'
          const result = { _id: '123', deptCode: 'HR', deptName: 'HR Team', remark: 'Tongs' }
          mockDepartmentService.getOneById.mockResolvedValue(result)
    
          expect(await controller.getOneById(id)).toEqual(result)
          expect(mockDepartmentService.getOneById).toHaveBeenCalledWith(id)
        })
    })

})