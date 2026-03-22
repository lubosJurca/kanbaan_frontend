import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TaskPayload, Task, UpdateTaskPayload } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient = inject(HttpClient);
  private url = environment.apiUrl;

  getAllTasksByColumnId(columnId: number) {
    return this.httpClient.get<Task[]>(`${this.url}/api/column/${columnId}/kanban-task`, {
      withCredentials: true,
    });
  }

  createTask(columnId: number, payload: TaskPayload) {
    return this.httpClient.post<Task>(`${this.url}/api/column/${columnId}/kanban-task`, payload, {
      withCredentials: true,
    });
  }

  getSingleTask(taskId: number) {
    return this.httpClient.get<Task>(`${this.url}/api/kanban-task/${taskId}`, {
      withCredentials: true,
    });
  }

  updateTask(taskId: number, payload: UpdateTaskPayload) {
    return this.httpClient.put<Task>(`${this.url}/api/kanban-task/${taskId}`, payload, {
      withCredentials: true,
    });
  }

  deleteTask(taskId: number) {
    return this.httpClient.delete<Task>(`${this.url}/api/kanban-task/${taskId}`, {
      withCredentials: true,
    });
  }

  reorderTasks(columnId: number, taskIds: number[]) {
    return this.httpClient.put<Task[]>(
      `${this.url}/api/column/${columnId}/kanban-task/reorder`,
      { ids: taskIds },
      { withCredentials: true },
    );
  }
}
