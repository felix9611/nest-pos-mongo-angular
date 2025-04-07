import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { DashboardReqDto, DashboardReqFilterDto } from './interface'
import { CanvasChartComponent } from '../../components/chart/chart.component'
import { transformData, transformDataNoDate, transformDataPointsOnly } from './function' 
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { UserStoreService } from '../../../../state/user.service'
import { findMenuItem } from '../../tool-function'
import { Subscription } from 'rxjs'

@Component({
    standalone: true,
    imports: [
        CommonModule, 
        NzFormModule, 
        NzButtonModule, 
        FormsModule, 
        NzModalModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule, 
        CanvasChartComponent,
        NzSelectModule,
        NzDatePickerModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
    private rightSubscription: Subscription
    constructor(
        private message: NzMessageService,
        private userStoreService: UserStoreService
    ) {
            this.rightSubscription = this.userStoreService.menuRole$.subscribe((data: any) => {
                const answer = findMenuItem(data, 'Dashboard', 'dashboard')
                this.userRightInside = {
                    read: answer?.read ?? false
                     // keep default value
                }
            })
                    
    }

    ngOnDestroy() {
        if (this.userStoreService.menuRole$) {
            this.rightSubscription.unsubscribe()
        }
    }


    userRightInside = {
        read: false
    }

    ngOnInit(): void {
        this.runSearch()
   //     this.getByTotalCost()
  //      this.getByTotalCount()
        this.loadTypeList()
        this.loadDeptList()
        this.loadLocationList()
        
    }

    typeLists: any[] = []
    async loadTypeList() {
        this.typeLists = await getApiWithAuth('/product/product-type/getAll')
    }

    deptLists: any[] = []
    async loadDeptList() {
        this.deptLists = await getApiWithAuth('/sys/department/getAll')
    }

    placeLists: any[] = []
    async loadLocationList() {
        this.placeLists = await getApiWithAuth('/base/location/getAll')
    }

    async runSearch() {
        await this.getByDeptAndQtys()
        await this.getByDeptAndPrice()
        await this.getByTypeAndPrice()
        await this.getByTypeAndQtys()
    }

    globalFilter: DashboardReqFilterDto = {}

    byTypeAndQtysLoading: boolean = false
    byTypeAndQtys: any = {}
    async getByTypeAndQtys() {
        this.byTypeAndQtysLoading = false
        const dataQuery: DashboardReqDto = {
            dataTypeValue: 'type',
            valueField: 'qtys'
        }

        const res = await this.runQueryData(dataQuery)
        this.byTypeAndQtys = {
            data: transformDataNoDate(res, 'stackedColumn', false, 'typeName', 'qtys'),
            animationEnabled: true,
            axisY: {
                title: 'Qtys'
            },
            axisX: {
                title: 'Product Types',
             /*   valueFormatString: "YYYY - MMM",
                xValueType: "dateTime" */
            },
            toolTip: {
                shared: true
            }
        }
        this.byTypeAndQtysLoading = true
    }

    byTypeAndPriceLoading: boolean = false
    byTypeAndPrice: any = {}
    async getByTypeAndPrice() {
        this.byTypeAndPriceLoading = false
        const dataQuery: DashboardReqDto = {
            dataTypeValue: 'type',
            valueField: 'price'
        }

        const res = await this.runQueryData(dataQuery)
        this.byTypeAndPrice = {
            data: transformDataNoDate(res, 'stackedColumn', false, 'typeName', 'price'),
            animationEnabled: true,
            axisY: {
                title: 'Price'
            },
            axisX: {
                title: 'Product Types',
             /*   valueFormatString: "YYYY - MMM",
                xValueType: "dateTime" */
            },
            toolTip: {
                shared: true
            }
        }
        this.byTypeAndPriceLoading = true
    }

    byDeptAndQtysLoading: boolean = false
    byDeptAndQtys: any = {}
    async getByDeptAndQtys() {
        this.byDeptAndQtysLoading = false
        const dataQuery: DashboardReqDto = {
            dateTypeValue: 'YearMonth',
            dataTypeValue: 'dept',
            valueField: 'qtys'
        }

        const res = await this.runQueryData(dataQuery)
        this.byDeptAndQtys = {
            data: transformDataNoDate(res, 'stackedColumn', false, 'deptName', 'qtys'),
            animationEnabled: true,
            axisY: {
                title: 'Qtys'
            },
            axisX: {
                title: 'Departments',
             /*   valueFormatString: "YYYY - MMM",
                xValueType: "dateTime" */
            },
            toolTip: {
                shared: true
            }
        }
        this.byDeptAndQtysLoading = true
    }

    byDeptAndPriceLoading: boolean = false
    byDeptAndPrice: any = {}
    async getByDeptAndPrice() {
        this.byDeptAndPriceLoading = false
        const dataQuery: DashboardReqDto = {
            dataTypeValue: 'dept',
            valueField: 'price'
        }

        const res = await this.runQueryData(dataQuery)
        this.byDeptAndPrice = {
            data: transformDataNoDate(res, 'stackedColumn', false, 'deptName', 'price'),
            animationEnabled: true,
            axisY: {
                title: 'Price'
            },
            axisX: {
                title: 'Departments',
             /*   valueFormatString: "YYYY - MMM",
                xValueType: "dateTime" */
            },
            toolTip: {
                shared: true
            }
        }
        this.byDeptAndPriceLoading = true
    }

    async runQueryData(dataQuery: DashboardReqDto) {
        const finalQuery = {
            ...dataQuery,
            filter: this.globalFilter
        }

        return await postApiWithAuth('/invoice/query/data-group-by', finalQuery)
    }

}