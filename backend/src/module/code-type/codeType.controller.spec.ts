import { Test, TestingModule } from '@nestjs/testing'
import { CodeTypeController } from './codeType.controller'
import { CodeTypeService } from './codeType.service'
import { AuthGuard } from '../auth/AuthGuard'

describe('CodeTypeController', () => {
  let controller: CodeTypeController
  let service: CodeTypeService

  const mockCodeTypeService = {
    create: jest.fn(),
    update: jest.fn(),
    getOneById: jest.fn(),
    invalidateDepartment: jest.fn(),
    findAll: jest.fn(),
    listPageRole: jest.fn(),
    getByType: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTypeController],
      providers: [
        {
          provide: CodeTypeService,
          useValue: mockCodeTypeService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CodeTypeController>(CodeTypeController)
    service = module.get<CodeTypeService>(CodeTypeService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto = { valueCode: '001', valueName: 'Test Code Type', type: 'Tongs' }
      const result = { _id: '1', ...dto }
      mockCodeTypeService.create.mockResolvedValue(result)

      expect(await controller.create(dto)).toEqual(result)
      expect(mockCodeTypeService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto = { _id: '123', valueCode: '001', valueName: 'Test Code Type', type: 'Tongs' }
      const result = { msg: 'Updated successfully' }
      mockCodeTypeService.update.mockResolvedValue(result)

      expect(await controller.update(dto)).toEqual(result)
      expect(mockCodeTypeService.update).toHaveBeenCalledWith(dto)
    })
  })

  describe('getOneById', () => {
    it('should call service.getOneById and return the result', async () => {
      const id = '123'
      const result = { _id: '123', valueCode: '001', valueName: 'Test Code Type', type: 'Tongs' }
      mockCodeTypeService.getOneById.mockResolvedValue(result)

      expect(await controller.getOneById(id)).toEqual(result)
      expect(mockCodeTypeService.getOneById).toHaveBeenCalledWith(id)
    })
  })

  describe('removeById', () => {
    it('should call service.invalidateDepartment and return the result', async () => {
      const id = '123'
      const result = { msg: 'Removed successfully' }
      mockCodeTypeService.invalidateDepartment.mockResolvedValue(result)
      expect(await controller.removeById(id)).toEqual(result)
      expect(mockCodeTypeService.invalidateDepartment).toHaveBeenCalledWith(id)
    })
  })

  describe('getAll', () => {
    it('should call service.findAll and return the result', async () => {
      const result = [{ _id: '123', valueCode: '001', valueName: 'Test Code Type', type: 'Tongs' }]
      mockCodeTypeService.findAll.mockResolvedValue(result)

      expect(await controller.getAll()).toEqual(result)
      expect(mockCodeTypeService.findAll).toHaveBeenCalled()
    })
  })

  describe('listAndPage', () => {
    it('should call service.listPageRole and return the result', async () => {
      const dto = { page: 1, limit: 10 }
      const result = { total: 0, totalPages: 0, list: [], ...dto }
      mockCodeTypeService.listPageRole.mockResolvedValue(result)

      expect(await controller.listAndPage(dto)).toEqual(result)
      expect(mockCodeTypeService.listPageRole).toHaveBeenCalledWith(dto)
    })
  })

  describe('getByType', () => {
    it('should call service.getByType and return the result', async () => {
      const type = 'testType';
      const result = [{ _id: '123', valueCode: '001', valueName: 'Test Code Type', type: 'Tongs' }]
      mockCodeTypeService.getByType.mockResolvedValue(result)

      expect(await controller.getByType(type)).toEqual(result)
      expect(mockCodeTypeService.getByType).toHaveBeenCalledWith(type)
    })
  })
})