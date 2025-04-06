import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzFormModule } from 'ng-zorro-antd/form'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { NzTableModule } from 'ng-zorro-antd/table'
import { CreateInvoiceForm, InvoicePaymentDto, MmeberForm, ProductFormDto } from './interface'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { MatButtonModule } from '@angular/material/button'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { timer } from 'rxjs'
import { Router } from '@angular/router'

@Component({
    templateUrl: './sale-point.component.html',
    imports: [
        NzFormModule,
        FormsModule,
        CommonModule,
        NzSelectModule,
        NzInputModule,
        NzInputNumberModule,
        NzTableModule,
        NzButtonModule,
        MatButtonModule, 
        NzModalModule
    ]
})
export class SalePointComponent implements OnInit {
    constructor(
        private routeTo: Router,
        private message: NzMessageService,
    ) {}

    ngOnInit(): void {
        this.loadLocationList()
    }

    locationList: any[] = []
    async loadLocationList() {
        const data = await getApiWithAuth('/base/location/getAll')
        this.locationList = data
    }

    invoiceForm: CreateInvoiceForm = {
        memberId: '',
        locationId: '',
        locationCode: '',
        totalAmount: 0,
        discount: 0,
        discountType: '',
        taxTotal: 0,
        remark: '',
        invoiceItems: [],
        invoicePayments: []
    }

    enterProductForm: any = {
        productCode: '',
        productId: '',
        productName: '',
        locationId: '',
        qty: 0,
        retailPrice: 0,
        discount: 0,
        discountType: '',
        allTotalPrice: 0
    }

    productForm: ProductFormDto = {
        _id: '',
        productCode: '',
        productName: '',
        itemCode: '',
        brandCode: '',
        brandName: '',
        typeId: '',
        deptId: '',
        vendorId: '',
        unit: '',
        costPrice: 0,
        retailPrice: 0,
        description: '',
        remark: ''
    }

    memberSearch: string = ''

    discountList = [
        { type: '%' },
        { type: '$' },
    ]
    
    payMethodCategory: any = [
        { key: 'Cash' },
        { key: 'IC Card' },
        { key: 'Credit Card' },
        { key: 'E-payment' },
    ]

    inputedProductList: any[] = []
    inputedPaymentList: any[] = []

    async productCodeChanged(event: any) {
        if (event) {
            
            const data = await getApiWithAuth(`/product/product-list/code/${event}`)
            this.enterProductForm.productId = data._id
            this.enterProductForm.retailPrice = data.retailPrice
            this.productForm = data
        }
    }

    qtyChanged(event: any) {
        this.enterProductForm.qty = event
        this.enterProductForm.allTotalPrice = event * this.enterProductForm.retailPrice
    }

    typeChanged(event: any) {
        if (event === '%') {
            this.enterProductForm.allTotalPrice = this.enterProductForm.allTotalPrice * (1 - this.enterProductForm.discount /100)
        } else if (event === '$') {
            this.enterProductForm.allTotalPrice = this.enterProductForm.allTotalPrice - this.enterProductForm.discount
        }
    }

    addToList() {
        const { productId, productCode, qty, allTotalPrice, discount, discountType } = this.enterProductForm
        const addToList = {
            productId,
            productCode,
            qty,
            price: allTotalPrice,
            discount,
            discountType
        }

        this.inputedProductList.push(addToList)
        this.calTotalNumber()

        this.enterProductForm = {
            productCode: '',
            productId: '',
            productName: '',
            locationId: '',
            qty: 0,
            retailPrice: 0,
            disscount: 0,
            disscountType: '',
            allTotalPrice: 0
        }
    }

    orgTotal: number = 0
    calTotalNumber() {
        this.inputedProductList.forEach(a => {
            this.orgTotal += a.price
        })
    }
      

    // RIGHT

    removeItem(index: number) {
        this.inputedProductList.splice(index, 1)
    }

    memberLists: any[] = []
    async findMmebers() {
        this.memberLists = await postApiWithAuth('/member/member-list/list-member', { name: this.memberSearch })
    }

    memberForm: MmeberForm  = {
        _id: '',
        memberCode: '',
        name: '',
        phone: '',
        email: ''
    }


    fillMemberInfo(data: any) {
        this.memberForm = data
        this.invoiceForm.memberId = data._id
    }

    totalTypeChnage(event: any) {
        if (event === '%') {
            this.invoiceForm.totalAmount = this.orgTotal * (1 - this.invoiceForm.discount /100)
        } else if (event === '$') {
            this.invoiceForm.totalAmount = this.orgTotal - this.enterProductForm.disscount
        }
    }


    paymentForm: InvoicePaymentDto = {
        method: '',
        amount: 0,
        balance: 0,
        findRedemption: 0
    }

    addPaymentList() {
        const { method, amount } = this.paymentForm
        const addToList = {
            method,
            amount,
            paymentTime: new Date().toISOString()
        }

        this.inputedPaymentList.push(addToList)
        
        this.paymentForm.findRedemption = amount > this.paymentForm.balance ? amount - this.paymentForm.balance : 0
        this.paymentForm.balance = this.invoiceForm.totalAmount - amount
        

    }

    lastPaymentDialogOpen: boolean = false

    openPaymentDialg() {
        this.invoiceForm.totalAmount = this.invoiceForm.totalAmount ? this.invoiceForm.totalAmount : this.orgTotal
        this.paymentForm.balance = this.invoiceForm.totalAmount ? this.invoiceForm.totalAmount : this.orgTotal
        this.lastPaymentDialogOpen = true
    }

    closePaymentDialg() {
        this.lastPaymentDialogOpen = false
    }

    removePayItem(index: number, amount: any) {
        this.paymentForm.balance = this.paymentForm.balance + amount.amount
        this.paymentForm.findRedemption = this.paymentForm.findRedemption - amount.amount
        this.inputedPaymentList.splice(index, 1)
    }

    async submitPOSale() {

        const finalDataSubmit = {
            ...this.invoiceForm,
            discount: this.invoiceForm.discount ? this.invoiceForm.discount / 100 : 0,
            invoiceItems: this.inputedProductList,
            invoicePayments: this.inputedPaymentList
        }

        const res = await postApiWithAuth('/invoice/create', finalDataSubmit)
        if (res) {
            this.message.success('Invoice created successfully!')
            timer(2500).subscribe(() => {
                this.routeTo.navigate(['/invoice-detail'], { queryParams: { id: res._id}})
            })
        } else {
            this.message.error(res.msg)
        }
    }
    
}
