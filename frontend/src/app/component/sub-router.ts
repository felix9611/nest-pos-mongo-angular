import { Routes } from '@angular/router'
import { AssetTypeComponent } from './page/asset/asset-type/asset-type.component'
import { AuthGuard } from '../../state/AuthGuard'
import { UserInfoComponent } from './page/userInfo/user-info.component'
import { DepartmentComponent } from './page/department/department.component'
import { RoleComponent } from './page/role/role.component'
import { UsersComponent } from './page/users/users.component'
import { CodeTypeComponent } from './page/code-type/code-type.component'
import { VendorComponent } from './page/vendor/vendor.component'
import { LocationComponent } from './page/location/location.component'
import { ActionRecordComponent } from './page/action-record/action-record.component'
import { BudgetComponent } from './page/budget/budget.component'
import { TaxInformationComponent } from './page/tax-information/tax-information.component'
import { AssetFormComponent } from './page/asset/asset-form/asset-form.component'
import { AssetListComponent } from './page/asset/asset-list/asset-list.component'
import { WriteOffFormComponent } from './page/asset/write-off-form/write-off-form.component'
import { WriteOffListComponent } from './page/asset/write-off-list/write-off-list.component'
import { InventoryRecordListComponent } from './page/asset/inventory-record/inventory-record.component'
import { AssetListAllComponent } from './page/asset/asset-list-all/asset-list-all.component'
import { RepairRecordListComponent } from './page/asset/repair-record-list/repair-record-list.component'
import { StockTakeListComponent } from './page/stock-take/stock-take-list/stock-take-list.component'
import { StockTakeFormComponent } from './page/stock-take/stock-take-form/stock-take-form.component'
import { DashboardComponent } from './page/dashboard/dashboard.component'
import { MenuListComponent } from './page/menu/menu.component'
import { ExcelFieldMatchComponent } from './page/excel-field-match/excel-field-match.component'
import { AccessGuard } from '../../state/AccessGuard'
import { ProductTypeComponent } from './page/product-type/product-type.component'
import { ProductListComponent } from './page/product/product-list/product-list.component'
import { ProductFormComponent } from './page/product/product-form/product-form.component'
import { StockInComponent } from './page/stock/stock-in/stock-in.component'
import { ProductLocationListComponent } from './page/stock/product-location/product-location.component'
import { StockOutComponent } from './page/stock/stock-out/stock-out.component'

export const pagesRoutes: Routes = [
    {
        path: 'action-record',
        component: ActionRecordComponent,
        canActivate: [AuthGuard]
    },
    
   
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'excel-field-matchs',
        component: ExcelFieldMatchComponent,
        canActivate: [AuthGuard]
    },
   
    {
        path: 'code-type',
        component: CodeTypeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'departments',
        component: DepartmentComponent,
        canActivate: [AuthGuard]
    },
   
    {
        path: 'location',
        component: LocationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'tax-information',
        component: TaxInformationComponent,
        canActivate: [AuthGuard]
    },
   
    {
        path: 'role',
        component: RoleComponent,
        canActivate: [AuthGuard]
    },
   
    {
        path: 'menu',
        component: MenuListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'user-info',
        component: UserInfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vendor',
        component: VendorComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'product-type',
        component: ProductTypeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'product-list',
        component: ProductListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'product-create',
        component: ProductFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'product-detail',
        component: ProductFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'product-location-lists',
        component: ProductLocationListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'stock-in',
        component: StockInComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'stock-out',
        component: StockOutComponent,
        canActivate: [AuthGuard]
    }
]