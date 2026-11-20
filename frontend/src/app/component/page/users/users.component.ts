import { Component, OnChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { UserForm } from './interface'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload'
import { imgToBase64, uploadImgToBase64 } from '../../../../tool/imageUpload'
import { Observable, Observer, Subscription } from 'rxjs'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { findMenuItem } from '../../tool-function'
import { UserStoreService } from '../../../../state/user.service'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { FilterListApiSmall, ListOption } from '../../components/filter-list-small/filter-list.component'

@Component({
    // selector: 'app-footer',
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
        NzUploadModule,
        NzSelectModule,
        NzCheckboxModule,
        FilterListApiSmall
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css',
})
export class UsersComponent {
    private rightSubscription: Subscription
    private userSubscription: Subscription
    constructor(
        private message: NzMessageService,
        private userStoreService: UserStoreService
    ) {

        this.rightSubscription = this.userStoreService.menuRole$.subscribe((data: any) => {
            const answer = findMenuItem(data, 'User', 'users')
            this.userRightInside = {
                read: answer?.read ?? false,
                write: answer.write ?? false,
                update: answer.update ?? false,
                delete: answer.delete ?? false
                 // keep default value
            }
        })

        this.userSubscription = this.userStoreService.user$.subscribe((data: any) => {
            this.superAdmin = data.superAdmin
            this.manager = data.manager
        })
    }

    ngOnDestroy() {
        if (this.userStoreService.menuRole$) {
            this.rightSubscription.unsubscribe()
        }
        if (this.userStoreService.user$) {
            this.userSubscription.unsubscribe()
        }
    }

    superAdmin: boolean = false
    manager: boolean = false

    placeLists: any[] = []
    async loadLocationList() {
        const res = await getApiWithAuth('/base/location/getAll')
        this.placeLists = res
    }

    userRightInside: any = {
        read: false,
        write: false,
        update: false,
        delete: false
    }


    searchForm: any = {
        page: 1,
        limit: 10,
        deptIds: [],
        roleIds: [],
        name: '',
    }

    editForm: UserForm=  {
        _id: '',
        username: '',
        avatarBase64: '',
        deptIds: [],
        email: '',
        roles: [],
        placeIds: [],
        superAdmin: false,
        manager: false
    }

    okText: string = 'Create'

    dataLists: any[] = []
    totals: number = 0
    editFormDialog: boolean = false
    removeDialog: boolean = false
    handleRemoveId: string = ''

    fileList: any[] = []
    deptLists: any[] = []
    roleLists: any[] = []

    department?: any = {}

    updateFile(file: any) {
        let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
        console.log(testmsg)
        const isJpg = testmsg === 'jpg' || testmsg === 'png' || testmsg === 'JPG' || testmsg === 'PNG'
        const isLt2M = file.size / 1024 / 1024 < 3
        if (!isJpg) {
            this.message.error('Only upload jpg or png file!')
        }

        if (!isLt2M) {
            this.message.error('File size cannot over 3MB!')
        }
        if (isJpg && isLt2M){
            this.fileList.push(file)
        }
        this.imgToBase64()
    }

    imgToBase64() {
        this.fileList.map(async (file: any) => {
            const response: any = await uploadImgToBase64(file.raw)
            console.log(response)
        })
    }


    ngOnInit() {
        this.loadUserLists()
    }

    async submitForm() {
        const url = this.editForm._id === '' ? '/sys/user/create-user' : `/sys/user/update-uesr`

        const res = await postApiWithAuth(url, this.editForm._id? {
            avatarBase64: this.avatarUrl ? this.avatarUrl : this.editForm.avatarBase64,
            ...this.editForm
        } : {
            key: '9@0UtWV:;}m@HkjHyVU=',
            userData: {
                avatarBase64: this.avatarUrl,
                ...this.editForm
            }
        })

        if (res.error) {
            this.message.error(res.error)
        } else if (res.matchedCount === 1 || !res.error) {
            this.message.success('Save successful!')
            this.closeDialog()
            this.loadUserLists()

            this.editForm = {
                _id: '',
                username: '',
                avatarBase64: '',
                deptIds: [],
                email: '',
                roles: [],
                placeIds: [],
                superAdmin: false,
                manager: false
            }

            this.okText = 'Create'
        }
    }

    async loadUserLists() {
        const res = await postApiWithAuth('/sys/user/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.total
    }

    showDialog() {
        this.editFormDialog = true
    }

    closeDialog() {
        this.editFormDialog = false
    }

    handleRomeve(id: string) {
        this.handleRemoveId = id
        this.removeDialog = true
    }

    closeRemoveDialog() {
        this.removeDialog = false
    }

    async handleRemove() {
        const url = `/sys/user/invalidate-user/${this.handleRemoveId}`

        const res: any = await getApiWithAuth(url)

        if (res.message) {
            this.message.info(res.message)
            this.loadUserLists()
            this.closeRemoveDialog()
        } else {
            this.message.error(res.error)
        }
    }


    dateFormat(data: string) {
        return data ? moment(data).format('DD-MM-YYYY HH:mm') : null
    }

    async getOneData(id:string) {
        const res = await getApiWithAuth(`/sys/user/one/${id}`)
        if (res.error) {
            this.message.error(res.error)
        } else {
            this.editForm = res
            this.okText = 'Update'
            this.showDialog()
        }
    }

    // upload

    loading = false
    avatarUrl?: string = ''
    previewImage: string = ''
    
    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
        new Observable((observer: Observer<boolean>) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            this.message.error('You can only upload JPG or PNGfile!')
            observer.complete()
            return
        }
        const isLt2M = file.size! / 1024 / 1024 < 3
        if (!isLt2M) {
            this.message.error('Image must smaller than 3MB!')
            observer.complete()
            return
        }
    
        observer.next(isJpgOrPng && isLt2M)
        observer.complete()
    })
        
    
    async handleChange(info: { file: any }) {
        const response: any = await uploadImgToBase64(info.file.originFileObj)
        this.avatarUrl = response.data
    }

// Department data
    deptTotal: number = 0
    depts: any = []
    deptOptions: ListOption[] = [];
    deptSearchForm: any = {
        deptCode: '',
        deptName: '',
        page: 1,
        limit: 10
    }
    loadDeptLists = async (
        url: string,
        body: Record<string, unknown>,
    ): Promise<ListOption[]> => {
        const payload = {
          ...this.deptSearchForm,
          ...body,
        }
    
        try {
            const res = await postApiWithAuth(url, payload)
        
            this.depts = res ?? []
            this.deptTotal = res.length ?? 0
        
            this.deptOptions = this.depts.map((a: any) => ({
                value: a._id,
                label: `${a.deptCode}`,
            }));
        
            return this.deptOptions
        } catch (error) {
            this.message.error('API request failed')
            throw error
        }
    }
    // rOLE data
    roleTotal: number = 0
    roles: any = []
    roleOptions: ListOption[] = [];
    roleSearchForm: any = {
        name: '',
        page: 1,
        limit: 10
    }
    loadRoleLists = async (
        url: string,
        body: Record<string, unknown>,
    ): Promise<ListOption[]> => {
        const payload = {
          ...this.roleSearchForm,
          ...body,
        }
    
        try {
            const res = await postApiWithAuth(url, payload)
        
            this.roles = res.lists ?? []
            this.roleTotal = res.total ?? 0
        
            this.roleOptions = this.roles.map((a: any) => ({
                value: a._id,
                label: `${a.name}`,
            }));
        
            return this.roleOptions
        } catch (error) {
            this.message.error('API request failed')
            throw error
        }
    }
    // Location data
    placeTotal: number = 0
    places: any = []
    placeOptions: ListOption[] = [];
    placeSearchForm: any = {
        placeCode: '',
        placeName: '',
        page: 1,
        limit: 10
    }
    loadPlaceLists = async (
        url: string,
        body: Record<string, unknown>,
    ): Promise<ListOption[]> => {
        const payload = {
          ...this.placeSearchForm,
          ...body,
        }
    
        try {
            const res = await postApiWithAuth(url, payload);
        
            this.places = res ?? [];
            this.placeTotal = res.length ?? 0;
        
            this.placeOptions = this.places.map((a: any) => ({
                value: a._id,
                label: `${a.placeCode}`,
            }))
    
            return this.placeOptions
        } catch (error) {
            this.message.error('API request failed')
            throw error
        }
    }
}