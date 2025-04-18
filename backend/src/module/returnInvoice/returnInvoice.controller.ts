import { Body, Controller, Delete, Get, Move, Param, Post, UseGuards } from '@nestjs/common'
import { ReturnInvoiceService } from './returnInvoice.service';

@Controller('return-invoice')
export class ReturnInvoiceController {
    constructor(
        private returnInvoiceService: ReturnInvoiceService,
    ) {}
}