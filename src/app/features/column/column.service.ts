import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Column } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private httpClient = inject(HttpClient);
  private url = environment.apiUrl;

  getAllColumns(boardId: number) {
    return this.httpClient.get<Column[]>(`${this.url}/api/board/${boardId}/column`, {
      withCredentials: true,
    });
  }

  createColumn(boardId: number, title: string) {
    return this.httpClient.post<Column>(
      `${this.url}/api/board/${boardId}/column`,
      { title },
      {
        withCredentials: true,
      },
    );
  }

  updateColumn(columnId: number, title: string) {
    return this.httpClient.put<Column>(
      `${this.url}/api/column/${columnId}`,
      { title },
      {
        withCredentials: true,
      },
    );
  }

  deleteColumn(columnId: number) {
    return this.httpClient.delete<Column>(`${this.url}/api/column/${columnId}`, {
      withCredentials: true,
    });
  }

  reorderColumns(boardId: number, columnIds: number[]) {
    return this.httpClient.put<Column[]>(
      `${this.url}/api/board/${boardId}/column/reorder`,
      { ids: columnIds },
      {
        withCredentials: true,
      },
    );
  }
}
