import { Component, EventEmitter, Output } from '@angular/core';
import { UserAdd } from '../../../../interface/user.interface';
import { UserService } from '../../../../service/user.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../../service/local-storage-service.service';
import { CommonComponent } from '../../../../utils/common.component';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private commmonFunc: CommonComponent
  ) {
    this.userAddForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/(03|04|05|07|08|09)[0-9]{8,9}$/)
      ]],
      identificationNumber: ['', [
        Validators.required,
        Validators.pattern(/^(0)[0-9]*$/)
      ]],
      dateOfBirth: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userAddForm.statusChanges.subscribe(status => {
      this.isSubmitDisabled = status !== 'VALID';
    });
  }

  @Output() callGetUserBackAfterAdd = new EventEmitter<String>();

  userAddForm: FormGroup;
  isSubmitDisabled: boolean = true;

  errorMessage: String = '';
  fieldErrors: any = {};

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.clearModalDataAddUser();
  }

  dataAddUser: UserAdd = {
    username: '',
    email: '',
    password: '',
    phone: '',
    identificationNumber: '',
    dateOfBirth: new Date()
  }

  handleAddUser() {
    const isExistTokenOrLoggedIn = this.commmonFunc.checkUserRoleOrLoggedIn();
    if (!isExistTokenOrLoggedIn) {
      this.display = true;
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
    } else {
      this.userService.addUser(this.userAddForm.value).subscribe({
        next: () => {
          this.display = false;
          this.callGetUserBackAfterAdd.emit();
          this.showAddSuccessNotification();
          this.clearModalDataAddUser();
        },
        error: (error: HttpErrorResponse) => {
          this.display = true;
          if (error.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Bạn không có quyền thao tác!" });
          }
          if (error.error) {
            this.showAddFailedNotification();
            this.fieldErrors = error.error.result;
            const fieldErrors = error.error.result;
            if (fieldErrors.username) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.username}` });
            }
            if (fieldErrors.phone) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.phone}` });
            }
            if (fieldErrors.email) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.email}` });
            }
            if (fieldErrors.identificationNumber) {
              this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: `${fieldErrors.identificationNumber}` });
            }
          } else {
            this.errorMessage = "Lỗi không xác định!";
          }
        }
      });
    }
  }

  clearModalDataAddUser() {
    this.dataAddUser = {
      username: '',
      email: '',
      password: '',
      phone: '',
      identificationNumber: '',
      dateOfBirth: new Date()
    }
    this.fieldErrors = {};
    this.errorMessage = '';
    this.isSubmitDisabled = true;
    this.userAddForm.reset();
  }

  showAddSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm người dùng thành công!' });
  }

  showAddFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Thêm người dùng thất bại!' });
  }
}