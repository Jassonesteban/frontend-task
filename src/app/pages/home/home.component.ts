import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../../service/auth-modal.service';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../service/task.service';
import { TaskResponse } from '../../interfaces/TaskResponse';
import { Task } from '../../interfaces/Task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  isAddingTask = false;
  userName:string = '';
  userData:any = null;
  tasks: TaskResponse[] = [];
  isAuthenticated:boolean = false;
  newTaskTitle = '';
  newDescriptionTask = '';
  isEditing = false;
  newTaskStatus: 'PENDING' | 'COMPLETED' = 'PENDING';
  selectedTask: TaskResponse | null = null;
  errorMessage: string = '';

  constructor(private authModalService: AuthModalService, private authService: AuthService, private taskService: TaskService){}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.authService.getUser().subscribe((user) => {
          this.userData = user;
          this.userName = user ? user.username : 'No logueado';
          this.loadTasks();
        });
      }
    });
  }

  openLogin() {
    this.authModalService.openModal(true);
  }

  openModalTask() {
    this.isAddingTask = true;
    this.isEditing = false;
    this.newTaskTitle = '';
    this.newDescriptionTask = '';
    this.newTaskStatus = 'PENDING';
    this.selectedTask = null;
  }

  closeModalTask() {
    this.isAddingTask = false;
    this.newTaskTitle = '';
    this.newDescriptionTask = '';
    this.selectedTask = null;
    this.errorMessage = '';
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        title: this.newTaskTitle.trim(),
        description: this.newDescriptionTask.trim(),
        status: 'PENDING'
      };

      this.taskService.creatTask(newTask, this.userName).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModalTask();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  editTask(task: TaskResponse) {
    this.selectedTask = task;
    this.newTaskTitle = task.title;
    this.newDescriptionTask = task.description;
    this.newTaskStatus = task.status as 'PENDING' | 'COMPLETED';
    this.isAddingTask = true;
    this.isEditing = true;
  }

  updateTask() {
    if (this.selectedTask && this.selectedTask.id !== undefined) {
      const updatedTask: TaskResponse = {
        ...this.selectedTask,
        title: this.newTaskTitle,
        description: this.newDescriptionTask,
        status: this.newTaskStatus
      };

      this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModalTask();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      console.error('Error: No se puede actualizar la tarea porque el ID es undefined');
    }
  }

  loadTasks() {
    this.taskService.getTaskByUsername(this.userName).subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }
}
