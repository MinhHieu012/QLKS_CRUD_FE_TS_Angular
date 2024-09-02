import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomtypeService } from '../../../../service/roomtype.service';
import { MessageService } from 'primeng/api';
import { RoomTypeAddUpdate } from '../../../../interface/roomtype.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-roomtype-update',
  templateUrl: './roomtype-update.component.html',
  styleUrl: './roomtype-update.component.css'
})
export class RoomtypeUpdateComponent {
  constructor(
    private roomTypeService: RoomtypeService,
    private messageService: MessageService,
  ) { }

  @Output() callGetRoomTypeBackAfterAddUpdate = new EventEmitter<String>();

  errorMessage: String = '';
  fieldErrors: any = {};

  @Input() roomTypeDataIdFromParent: String = '';
  @Input() roomTypeDataNameFromParent: String = '';
  @Input() roomTypeDataMaxPeopleFromParent: String = '';
  @Input() roomTypeDataDescFromParent: String = '';
  @Output() callGetRoomTypeBackAfterUpdate = new EventEmitter<String>();

  roomTypeDataSendToUpdate: RoomTypeAddUpdate = {
    id: '',
    name: '',
    maxPeople: '',
    description: ''
  }

  display: boolean = false;
  showDialog() {
    this.roomTypeDataSendToUpdate.id = this.roomTypeDataIdFromParent;
    this.roomTypeDataSendToUpdate.name = this.roomTypeDataNameFromParent;
    this.roomTypeDataSendToUpdate.maxPeople = this.roomTypeDataMaxPeopleFromParent;
    this.roomTypeDataSendToUpdate.description = this.roomTypeDataDescFromParent;
    this.display = true;
  }

  handleUpdateRoomType() {
    this.roomTypeService.updateRoomType(this.roomTypeDataSendToUpdate).subscribe({
      next: () => {
        this.display = false;
        this.callGetRoomTypeBackAfterUpdate.emit();
        this.showUpdateSuccessNotification();
        this.clearModalDataUpdateRoomType();
      },
      error: (error: HttpErrorResponse) => {
        if (error.error) {
          this.showUpdateFailedNotification();
          this.fieldErrors = error.error.result;
        } else {
          this.errorMessage = "Lỗi không xác định!";
        }
      }
    })
  }

  clearModalDataUpdateRoomType() {
    this. roomTypeDataSendToUpdate = {
      id: '',
      name: '',
      maxPeople: '',
      description: ''
    }
    this.fieldErrors = {};
    this.errorMessage = '';
  }

  showUpdateSuccessNotification() {
    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật loại phòng thành công!' });
  }

  showUpdateFailedNotification() {
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật loại phòng thất bại!' });
  }
}
