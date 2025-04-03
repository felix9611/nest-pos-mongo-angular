import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzTableModule } from 'ng-zorro-antd/table'
import { getApiWithAuth, postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { ListProductLocationtRequestDto } from '../interface'

@Component({
    selector: 'product-location',
    standalone: true,
    templateUrl: './product-location.component.html',
    imports: [
        NzSelectModule, 
        CommonModule, 
        NzFormModule, 
        NzButtonModule, 
        FormsModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule
    ]
})
export class ProductLocationListComponent implements OnInit {
    ngOnInit(): void {
        this.loadProductLocationLists()
        this.loadLocationList()
    }

    searchForm: ListProductLocationtRequestDto = {
        page: 1,
        limit: 10
    }

    totals: number = 0

    dataLists: any[] = []


    async loadProductLocationLists() {
        const res = await postApiWithAuth('/product/product-list/location-list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.total
    }

    locationList: any[] = []
    async loadLocationList() {
        const data = await getApiWithAuth('/base/location/getAll')
        this.locationList = data
    }

}