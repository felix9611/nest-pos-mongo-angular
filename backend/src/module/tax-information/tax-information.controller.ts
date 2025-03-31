import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { TaxInformationService } from './tax-information.service'
import { UpdateDtoTaxInformation, TaxInformationListSearchDto, TaxInformationImportDto } from './tax-information.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('base/tax-information')
export class TaxInformationController {
  constructor(private readonly taxInformationService: TaxInformationService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createData: UpdateDtoTaxInformation) {
    return this.taxInformationService.create(createData)
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(@Body() createData: UpdateDtoTaxInformation) {
    return this.taxInformationService.update(createData)
  }

  @Get('one/:id')
  async getOneById(@Param('id') id: string) {
    return await this.taxInformationService.getOneById(id)
  }

  @Get('getAll')
  @UseGuards(AuthGuard)
  async getAll() {
    return this.taxInformationService.findAll()
  }

  @Post('list')
  @UseGuards(AuthGuard)
  async listAndPage(@Body() req: TaxInformationListSearchDto) {
    return this.taxInformationService.listAssetTypeBySearch(req)
  }

  @Get('remove/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.taxInformationService.voidOne(id)
  }

  @Post('batch-create')
  @UseGuards(AuthGuard)
  async importData(@Body() importData: TaxInformationImportDto[]) {
    return await this.taxInformationService.importData(importData)
  }
}