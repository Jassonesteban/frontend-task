import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskModalService } from '../../service/task-modal.service';

@Component({
  selector: 'app-create-task',
  imports: [CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {

  isOpen = false;
  isLogin = true;

  constructor(private taskModalService: TaskModalService){}

  ngOnInit(): void {
    this.taskModalService.modalState.subscribe((state) => {
      this.isOpen = state.isOpen;
      this.isLogin = state.isLogin;
    });
  }

  closeModal() {
    this.taskModalService.closeModal();
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;
  }

}
