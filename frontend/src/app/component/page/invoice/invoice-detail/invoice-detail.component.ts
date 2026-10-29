import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { getApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { NzTableModule } from 'ng-zorro-antd/table'
import { MatIconModule } from '@angular/material/icon'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import moment from 'moment'
import { NzMessageService } from 'ng-zorro-antd/message'
import { Subscription } from 'rxjs'
import { UserStoreService } from '../../../../../state/user.service'


@Component({
    imports: [
        CommonModule,
        FormsModule,
        NzFormModule,
        NzSelectModule,
        NzInputModule,
        NzInputNumberModule,
        NzTableModule,
        MatIconModule,
        NzDatePickerModule
    ],
    templateUrl: './invoice-detail.component.html'
})
export class InvoiceDetailComponent implements OnInit {
    private userRightSubscription: Subscription
    constructor(
        private route: ActivatedRoute,
        private routeTo: Router,
        private message: NzMessageService,
        private userStoreService: UserStoreService,
    ) {
        this.userRightSubscription = this.userStoreService.user$.subscribe((data: any) => {
            this.superAdmin = data.superAdmin
            if (data.superAdmin !== true) {
                this.locationList = data.locations
            }
        })
    }

    ngOnDestroy(): void {
        if (this.userStoreService.user$) {
            this.userRightSubscription.unsubscribe()
        }
    }

    ngOnInit(): void {
        this.loadLocationList()
        this.route.queryParams.subscribe((x: any) => {
            if (x.id) {
                this.getDetail(x.id)
            }
        })
    }

    superAdmin: boolean = false

    async getDetail(id: string) {
        const data = await getApiWithAuth(`/invoice/one/${id}`)
        if (data.error) {
            this.message.error(data.error)
        } else if (!data.error) {
            this.invoiceDetail = data
            this.invoiceDetail.discount = this.invoiceDetail.discountType === '%' ? this.invoiceDetail.discount * 100 : this.invoiceDetail.discount
        }
    }

    locationList: any[] = []
    async loadLocationList() {
        const data = await getApiWithAuth('/base/location/getAll')
        this.locationList = data
    }

    invoiceDetail: any = {}
    
    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }

    goBackList() {
        this.routeTo.navigate(['invoice-list'])
    }
}