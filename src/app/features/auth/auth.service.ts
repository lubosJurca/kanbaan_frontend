import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { User } from '../../models/user.model';

type RegisterUserPayload = {
  username: string;
  email: string;
  password: string;
};

type LoginUserPayload = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private url = environment.apiUrl;

  registerUser(payload: RegisterUserPayload) {
    return this.httpClient.post<User>(this.url + '/api/Auth/register', payload, {
      withCredentials: true,
    });
  }

  loginUser(payload: LoginUserPayload) {
    return this.httpClient.post<User>(this.url + '/api/Auth/login', payload, {
      withCredentials: true,
    });
  }

  logoutUser() {
    return this.httpClient.post<void>(this.url + '/api/Auth/logout', {}, { withCredentials: true });
  }

  getCurrentUser() {
    return this.httpClient.get<User>(this.url + '/api/Auth/me', { withCredentials: true });
  }
}
