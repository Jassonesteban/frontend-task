import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TaskResponse } from '../interfaces/TaskResponse';
import { Task } from '../interfaces/Task';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskApiURL = environment.apiTaskUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTaskByUsername(username: string): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.taskApiURL}/${username}`);
  }

  creatTask(task: Task, username: string): Observable<Task> {
    return this.http.post<Task>(`${this.taskApiURL}/${username}`, task, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(idTask:number): Observable<void> {
    return this.http.delete<void>(`${this.taskApiURL}/${idTask}`).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(taskId:number, updatedTask:any):Observable<any>{
    return this.http.put<any>(`${this.taskApiURL}/${taskId}`, updatedTask).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error && error.error.error) {
      errorMessage = error.error.error;
    }

    return throwError(() => new Error(errorMessage));
  }
}
