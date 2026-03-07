import { signalStore, withComputed, withState } from '@ngrx/signals';
import { User } from '../models/user.model';
import { computed } from '@angular/core';

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: {
    id: 1,
    username: 'test',
    email: 'test email',
  },
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => user() !== null),
  })),
);
