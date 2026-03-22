import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthState, LoginUserPayload, RegisterUserPayload, User } from '../../models/models';
import { computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => user() !== null),
  })),
  withMethods(
    (store, authService = inject(AuthService), messageService = inject(MessageService)) => ({
      async registerUser(payload: RegisterUserPayload) {
        patchState(store, { isLoading: true });
        try {
          const user = await firstValueFrom(authService.registerUser(payload));
          patchState(store, { user });
          messageService.add({
            severity: 'success',
            summary: 'Registration successful!',
            detail: `Welcome, ${user.username}`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });

          messageService.add({
            severity: 'error',
            summary: 'Registration failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async loginUser(payload: LoginUserPayload) {
        patchState(store, { isLoading: true });

        try {
          const user = await firstValueFrom(authService.loginUser(payload));
          patchState(store, { user });
          messageService.add({
            severity: 'success',
            summary: 'Login successful!',
            detail: `Welcome, ${user.username}`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });

          messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async loadCurrentUser() {
        patchState(store, { isLoading: true });

        try {
          const user = await firstValueFrom(authService.getCurrentUser());
          patchState(store, { user });
        } catch (error) {
          console.log(error);
          patchState(store, { error: 'Registration failed' });
        } finally {
          patchState(store, { isLoading: false, isInitialized: true });
        }
      },

      async logoutUser() {
        patchState(store, { isLoading: true });

        try {
          await firstValueFrom(authService.logoutUser());
          patchState(store, { user: null });
        } catch (error) {
          console.log(error);
          patchState(store, { error: 'Logout failed' });
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    }),
  ),
);
