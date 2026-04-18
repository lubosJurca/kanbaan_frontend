import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Subtask } from '../../models/models';
import { computed, effect, inject } from '@angular/core';
import { TaskStore } from '../task/task.store';
import { firstValueFrom } from 'rxjs';
import { SubtaskService } from './subtask.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export const SubtaskStore = signalStore(
  withEntities<Subtask>(),
  withState({
    isLoading: false,
    error: null as string | null,
  }),
  withComputed((store, taskStore = inject(TaskStore)) => ({
    currentTaskId: computed(() => taskStore.selectedTaskId()),
  })),
  withMethods(
    (store, subtaskService = inject(SubtaskService), messageService = inject(MessageService)) => ({
      async loadSubtasks(taskId: number) {
        patchState(store, { isLoading: true });
        try {
          const subtasks = await firstValueFrom(subtaskService.getAllSubtasksByTaskId(taskId));
          patchState(store, setAllEntities(subtasks));
          return subtasks;
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Loading subtasks failed',
            detail: errorMessage,
          });
          return null;
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async createSubtask(taskId: number, description: string, done?: boolean) {
        patchState(store, { isLoading: true });
        try {
          const subtask = await firstValueFrom(
            subtaskService.createSubtask(taskId, description, done),
          );
          patchState(store, addEntity(subtask));
          messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: `Subtask with description ${subtask.description} was created!`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Loading subtasks failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async updateSubtask(subtask: Subtask) {
        patchState(store, { isLoading: true });
        try {
          const updatedSubtask = await firstValueFrom(subtaskService.updateSubtask(subtask));
          patchState(store, updateEntity({ id: updatedSubtask.id, changes: updatedSubtask }));
          messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: `Subtask with description ${subtask.description} was created!`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Updating subtasks failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async deleteSubtask(subtaskId: number) {
        patchState(store, { isLoading: true });
        try {
          const deletedSubtask = await firstValueFrom(subtaskService.deleteSubtask(subtaskId));
          patchState(store, removeEntity(subtaskId));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Deleting subtasks failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async reorderSubtasks(taskId: number, ids: number[]) {
        patchState(store, { isLoading: true });
        //Optimistic UI
        ids.forEach((id, index) => {
          patchState(store, updateEntity({ id, changes: { order: index + 1 } }));
        });
        try {
          const reorderedSubtasks = await firstValueFrom(
            subtaskService.reorderSubtasks(taskId, ids),
          );
          for (const subtask of reorderedSubtasks) {
            patchState(store, updateEntity({ id: subtask.id, changes: { order: subtask.order } }));
          }
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Updating subtasks failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    }),
  ),
  withHooks((store) => ({
    onInit() {
      effect(() => {
        const taskId = store.currentTaskId();
        if (taskId) {
          store.loadSubtasks(taskId);
        } else {
          patchState(store, removeAllEntities());
        }
      });
    },
  })),
);
