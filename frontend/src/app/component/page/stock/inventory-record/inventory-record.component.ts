import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzTableModule } from 'ng-zorro-antd/table'
import { getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { ListInvRecordDto } from '../interface'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import moment from 'moment'

@Component({
    standalone: true,
    templateUrl: './inventory-record.component.html',
    imports: [
        NzSelectModule, 
        CommonModule, 
        NzFormModule, 
        NzButtonModule, 
        FormsModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule,
        NzDatePickerModule
    ]
})
export class InventoryRecordComponent implements OnInit {
    ngOnInit() {
        this.loadInventoryRecordLists()
    }

    searchForm: ListInvRecordDto = {
        page: 1,
        limit: 10
    }

    totals: number = 0

    dataLists: any[] = []

    async loadInventoryRecordLists() {
        const res = await postApiWithAuth('/inventory-record/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.total
    }

    dateFormat(data: string) {
        return data ? moment(new Date(data)).format('DD-MM-YYYY HH:MM') : null
    }
}