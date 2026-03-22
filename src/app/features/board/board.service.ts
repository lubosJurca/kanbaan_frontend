import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Board } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private httpClient = inject(HttpClient);
  private url = environment.apiUrl;

  getAllBoards() {
    return this.httpClient.get<Board[]>(`${this.url}/api/Board`, { withCredentials: true });
  }

  getSingleBoard(id: number) {
    return this.httpClient.get<Board>(`${this.url}/api/Board/${id}`, { withCredentials: true });
  }

  createBoard(title: string) {
    return this.httpClient.post<Board>(
      `${this.url}/api/Board`,
      { title },
      { withCredentials: true },
    );
  }

  updateBoard(id: number, title: string) {
    return this.httpClient.put<Board>(
      `${this.url}/api/Board/${id}`,
      { title },
      { withCredentials: true },
    );
  }

  deleteBoard(id: number) {
    return this.httpClient.delete<Board>(`${this.url}/api/Board/${id}`, { withCredentials: true });
  }
}
