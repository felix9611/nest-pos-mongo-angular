import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { TaxInformationService } from './tax-information.service'
import { UpdateDtoTaxInformation, TaxInformationListSearchDto, TaxInformationImportDto, TaxInfoForSalePoint, TaxInformationUpdateBody, TaxInformationBody, TaxInformationCreateBody, TaxInformationListQueryRes, TaxInformationListQuery, TaxInfoForSalePointBody } from './tax-information.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('base/tax-information')
export class TaxInformationController {
  constructor(private readonly taxInformationService: TaxInformationService) {}

  @ApiOperation({ summary: 'Create Tax Information' })
  @ApiBody({ type: TaxInformationUpdateBody })
  @ApiResponse({ description: 'If save successful', status: 201, type: TaxInformationBody })
  @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createData: UpdateDtoTaxInformation) {
    return this.taxInformationService.create(createData)
  }

  @ApiOperation({ summary: 'Update Tax Information' })
  @ApiBody({ type: TaxInformationUpdateBody })
  @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
  @Post('update')
  @UseGuards(AuthGuard)
  async update(@Body() createData: UpdateDtoTaxInformation) {
    return this.taxInformationService.update(createData)
  }

  @ApiOperation({ summary: 'Get by id' })
  @ApiResponse({ description: 'If save successful', status: 201, type: TaxInformationBody })
  @Get('one/:id')
  async getOneById(@Param('id') id: string) {
    return await this.taxInformationService.getOneById(id)
  }

  @ApiOperation({ summary: 'Get all Tax Informatio' })
  @ApiResponse({ description: 'If save successful', status: 201, type: TaxInformationBody, isArray: true })
  @Get('getAll')
  @UseGuards(AuthGuard)
  async getAll() {
    return this.taxInformationService.findAll()
  }

  @ApiOperation({ summary: 'Page and list'})
  @ApiBody({ type: TaxInformationListQuery })
  @ApiResponse({ description: 'If successful', status: 201, type: TaxInformationListQueryRes })
  @Post('list')
  @UseGuards(AuthGuard)
  async listAndPage(@Body() req: TaxInformationListSearchDto) {
    return this.taxInformationService.listAssetTypeBySearch(req)
  }

  @ApiOperation({ summary: 'Void one by ID' })
  @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
  @Get('remove/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.taxInformationService.voidOne(id)
  }

  @ApiOperation({ summary: 'Batch to Create Tax Information' })
  @ApiBody({ type: TaxInformationCreateBody, isArray: true })
  @ApiResponse({ description: 'If save successful', status: 201, type: TaxInformationBody, isArray: true })
  @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
  @Post('batch-create')
  @UseGuards(AuthGuard)
  async importData(@Body() importData: TaxInformationImportDto[]) {
    return await this.taxInformationService.importData(importData)
  }

  @ApiOperation({ summary: 'Page and list'})
  @ApiBody({ type: TaxInfoForSalePointBody })
  @ApiResponse({ description: 'If successful', status: 201, type: TaxInformationBody })
  @Post('sales-point')
  @UseGuards(AuthGuard)
  async findTaxInfoForSalePoint(@Body() req: TaxInfoForSalePoint) {
    return await this.taxInformationService.findTaxInfoForSalePoint(req)
  }
}