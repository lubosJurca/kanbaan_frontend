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
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Task, TaskPayload, UpdateTaskPayload } from '../../models/models';
import { computed, effect, inject, untracked } from '@angular/core';
import { ColumnStore } from '../column/column.store';
import { TaskService } from './task.service';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const TaskStore = signalStore(
  withEntities<Task>(),
  withState({
    isLoading: false,
    error: null as string | null,
    selectedTaskId: null as number | null,
  }),
  withComputed((store, columnStore = inject(ColumnStore)) => ({
    selectedTask: computed(() =>
      store.selectedTaskId ? store.entityMap()[store.selectedTaskId()!] : null,
    ),
    currentBoardId: computed(() => columnStore.currentBoardId()),
  })),
  withMethods(
    (store, taskService = inject(TaskService), messageService = inject(MessageService)) => ({
      async loadTasks(columnId: number) {
        patchState(store, { isLoading: true });
        try {
          const tasks = await firstValueFrom(taskService.getAllTasksByColumnId(columnId));
          patchState(store, addEntities(tasks));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Loading tasks failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async createTask(columnId: number, payload: TaskPayload) {
        patchState(store, { isLoading: true });
        try {
          const task = await firstValueFrom(taskService.createTask(columnId, payload));
          patchState(store, addEntity(task));

          messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: `Task ${task.title} was created!`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Creating task failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async updateTask(payload: UpdateTaskPayload) {
        const taskId = store.selectedTaskId();
        if (!taskId) return;

        patchState(store, { isLoading: true });

        try {
          const updatedTask = await firstValueFrom(taskService.updateTask(taskId, payload));
          patchState(store, updateEntity({ id: taskId, changes: updatedTask }));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Updating task failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async moveTask(taskId: number, newColumnId: number, newOrder: number) {
        // Optimistický update — okamžite presuň task v UI
        patchState(
          store,
          updateEntity({
            id: taskId,
            changes: { columnId: newColumnId, order: newOrder },
          }),
        );

        try {
          // Pošli update na backend
          const task = store.entityMap()[taskId];
          const updatedTask = await firstValueFrom(
            taskService.updateTask(taskId, {
              title: task.title,
              description: task.description,
              columnId: newColumnId,
            }),
          );
          patchState(store, updateEntity({ id: taskId, changes: updatedTask }));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Moving task failed',
            detail: errorMessage,
          });
          // Pri chybe obnov tasky pre oba stĺpce
          this.loadTasks(newColumnId);
        }
      },

      async deleteTask() {
        const taskId = store.selectedTaskId();
        if (!taskId) return;
        patchState(store, { isLoading: true });

        try {
          const deletedTask = await firstValueFrom(taskService.deleteTask(taskId));
          patchState(store, removeEntity(deletedTask.id));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Deleting task failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async reorderTasks(columnId: number, taskIds: number[]) {
        //Optimistic UI
        taskIds.forEach((id, index) => {
          patchState(store, updateEntity({ id, changes: { order: index + 1 } }));
        });

        try {
          const reorderedTasks = await firstValueFrom(taskService.reorderTasks(columnId, taskIds));
          for (const task of reorderedTasks) {
            patchState(store, updateEntity({ id: task.id, changes: { order: task.order } }));
          }
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Reordering tasks failed',
            detail: errorMessage,
          });
          this.loadTasks(columnId);
        }
      },

      setSelectedTaskId(taskId: number) {
        patchState(store, { selectedTaskId: taskId });
      },

      clearTasks() {
        patchState(store, removeAllEntities());
      },
    }),
  ),
  withHooks((store, columnStore = inject(ColumnStore)) => ({
    onInit() {
      effect(() => {
        const columns = columnStore.entities();

        untracked(() => {
          store.clearTasks();
          for (const column of columns) {
            store.loadTasks(column.id);
          }
        });
      });
    },
  })),
);
