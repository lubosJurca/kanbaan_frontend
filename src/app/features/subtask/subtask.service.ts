import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subtask } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private httpClient = inject(HttpClient);
  private url = environment.apiUrl;

  getAllSubtasksByTaskId(taskId: number) {
    return this.httpClient.get<Subtask[]>(`${this.url}/api/kanban-task/${taskId}/subtask`, {
      withCredentials: true,
    });
  }

  createSubtask(taskId: number, description: string, done: boolean = false) {
    return this.httpClient.post<Subtask>(
      `${this.url}/api/kanban-task/${taskId}/subtask`,
      { description, done },
      { withCredentials: true },
    );
  }

  getSingleSubtask(subtaskId: number) {
    return this.httpClient.get<Subtask>(`${this.url}/api/subtask/${subtaskId}`, {
      withCredentials: true,
    });
  }

  updateSubtask(subtask: Subtask) {
    return this.httpClient.put<Subtask>(`${this.url}/api/subtask/${subtask.id}`, subtask, {
      withCredentials: true,
    });
  }

  deleteSubtask(subtaskId: number) {
    return this.httpClient.delete<Subtask>(`${this.url}/api/subtask/${subtaskId}`, {
      withCredentials: true,
    });
  }

  reorderSubtasks(taskId: number, subtaskIdsToReorder: number[]) {
    return this.httpClient.put<Subtask[]>(
      `${this.url}/api/kanban-task/${taskId}/subtask/reorder`,
      { ids: subtaskIdsToReorder },
      { withCredentials: true },
    );
  }
}
