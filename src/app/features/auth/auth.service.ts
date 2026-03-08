import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

type RegisterUserPayload = {
  username: string;
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private url = 'http://localhost:3000/api/auth'; //TODO: definovat URL pro backend

  registerUser(payload: RegisterUserPayload) {}
}
