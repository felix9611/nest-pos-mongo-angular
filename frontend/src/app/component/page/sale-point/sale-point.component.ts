import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { getApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzFormModule } from 'ng-zorro-antd/form'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { NzTableModule } from 'ng-zorro-antd/table'
import { CreateInvoiceForm, ProductFormDto } from './interface'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { MatButtonModule } from '@angular/material/button'

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
    ]
})
export class SalePointComponent implements OnInit {
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
            this.enterProductForm.allTotalPrice = this.enterProductForm.allTotalPrice * (1 - this.enterProductForm.disscount /100)
        } else if (event === '$') {
            this.enterProductForm.allTotalPrice = this.enterProductForm.allTotalPrice - this.enterProductForm.disscount
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

    // RIGHT

    removeItem(index: number) {
        this.inputedProductList.splice(index, 1)
    }
}
