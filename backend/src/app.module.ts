import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecordMoudule} from './module/action-record/actionRecord.module'
import { SysUserMoudule } from './module/sys-user/sysUser.module'
import { AuthModule } from './module/auth/auth.module'
import { SysRoleMoudule } from './module/sys-role/role.module'
import { DepartmentMoudule } from './module/department/department.module'
import { VendorMoudule } from './module/vendor/vendor.module'
import { CodeTypeMoudule } from './module/code-type/codeType.module'
import { TaxInformationMoudule } from './module/tax-information/tax-information.module'
import { AuthGuard } from './module/auth/AuthGuard'
import { APP_GUARD } from '@nestjs/core'
import { SysRoleSchema } from './module/sys-role/role.schame'
import { DepartmentSchema } from './module/department/department.schame'
import { LoggerMiddleware } from './tool/request-logger.middleware'
import { SysMenuMoudule } from './module/sys-menu/sys-menu.module'
import { ExcelFieldMatchModule } from './module/excelFieldMatch/excelFieldMatch.module'
import { SysUserSchema } from './module/sys-user/sysUser.schame'
import { LocationMoudule } from './module/location/location.module'
import { ProductTypeMoudule } from './module/product-type/product-type.module'
import { ProductMoudule } from './module/product/product.module'
import { InvRecordMoudule } from './module/InvRecord/InvRecord.module'
import { MemberClassMoudule } from './module/member/member-class/member-class.module'
import { MemberMoudule } from './module/member/member-list/member-list.module'

@Module({
  imports: [
    ActionRecordMoudule,
    AuthModule, 
    CodeTypeMoudule,
    DepartmentMoudule,
    InvRecordMoudule,
    VendorMoudule,
    TaxInformationMoudule,
    LocationMoudule,
    SysRoleMoudule,
    SysUserMoudule,
    SysMenuMoudule,
    ExcelFieldMatchModule,
    ProductTypeMoudule,
    ProductMoudule,
    MemberMoudule,
    MemberClassMoudule,
    InvRecordMoudule,
    MongooseModule.forRoot('mongodb://localhost/pos'),
    MongooseModule.forFeature([
      { name: 'SysRoles', schema: SysRoleSchema },
      { name: 'Department', schema: DepartmentSchema },
      { name: 'SysUser', schema: SysUserSchema }
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard // This applies the guard globally
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*') // Logs all requests
  }
}
