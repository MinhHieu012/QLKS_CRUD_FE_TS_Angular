import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  listUser: User[] = [];
  errorMessage: String = '';
  fieldErrors: any = {};

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.listUser = data.result;
    });
  }

  getUserBackAfterAddUpate() {
    this.getAllUsers();
  }

  confirmLockUser(eventLockUser: Event, id: String, username: String) {
    this.confirmationService.confirm({
      target: eventLockUser.target as EventTarget,
      message: 'Bạn chắc chắn muốn khóa người dùng này?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.lockUser(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Khóa', detail: `Đã khóa người dùng có họ tên là ${username}` });
            this.getAllUsers();
          },
          error: (error: HttpErrorResponse) => {
            if (error.error) {
              this.messageService.add({ severity: 'error', summary: 'Khóa', detail: `Người dùng có họ tên là ${username} chưa bị khóa!` });
              this.fieldErrors = error.error.result;
            } else {
              this.errorMessage = "Lỗi không xác định!";
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Khóa', detail: `Người dùng có họ tên là ${username} chưa bị khóa!` });
      }
    });
  }

  confirmUnLockUser(eventLockUser: Event, id: String, username: String) {
    this.confirmationService.confirm({
      target: eventLockUser.target as EventTarget,
      message: 'Bạn chắc chắn muốn mở khóa người dùng này?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.unLockUser(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Mở khóa', detail: 'Đã mở khóa người dùng này!' });
            this.getAllUsers();
          },
          error: (error: HttpErrorResponse) => {
            if (error.error) {
              this.messageService.add({ severity: 'error', summary: 'Mở khóa', detail: `Người dùng có họ tên là ${username} chưa được mở khóa!` });
              this.fieldErrors = error.error.result;
            } else {
              this.errorMessage = "Lỗi không xác định!";
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Mở khóa', detail: 'Người dùng chưa được mở khóa!' });
      }
    });
  }
}
