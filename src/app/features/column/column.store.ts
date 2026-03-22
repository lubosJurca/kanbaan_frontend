import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Column } from '../../models/models';
import { computed, effect, inject } from '@angular/core';
import { ColumnService } from './column.service';
import { BoardStore } from '../board/board.store';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export const ColumnStore = signalStore(
  withEntities<Column>(),
  withState({
    isLoading: false,
    error: null as string | null,
    selectedColumnId: null as number | null,
  }),
  withComputed((store, boardStore = inject(BoardStore)) => ({
    selectedColumn: computed(() =>
      store.selectedColumnId() ? store.entityMap()[store.selectedColumnId()!] : null,
    ),
    currentBoardId: computed(() => boardStore.selectedBoardId()),
  })),
  withMethods(
    (store, columnService = inject(ColumnService), messageService = inject(MessageService)) => ({
      async loadColumns() {
        const boardId = store.currentBoardId();
        if (!boardId) return;

        patchState(store, { isLoading: true });

        try {
          const columns = await firstValueFrom(columnService.getAllColumns(boardId));
          patchState(store, setAllEntities(columns));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Loading columns failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async createColumn(title: string) {
        const boardId = store.currentBoardId();
        if (!boardId) return;
        patchState(store, { isLoading: true });
        try {
          const createdColumn = await firstValueFrom(columnService.createColumn(boardId, title));
          patchState(store, addEntity(createdColumn));

          return createdColumn
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Creating columns failed',
            detail: errorMessage,
          });

          throw error;
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async updateColumn(columnId: number, title: string) {
        patchState(store, { isLoading: true });
        try {
          const updatedColumn = await firstValueFrom(columnService.updateColumn(columnId, title));
          patchState(store, updateEntity({ id: columnId, changes: updatedColumn }));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Updating column failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async deleteColumn(columnId: number) {
        patchState(store, { isLoading: true });
        try {
          const deletedColumn = await firstValueFrom(columnService.deleteColumn(columnId));
          const wasSelected = store.selectedColumnId() === deletedColumn.id;
          patchState(
            store,
            removeEntity(deletedColumn.id),
            ...(wasSelected ? [{ selectedColumnId: null }] : []),
          );
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Deleting column failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async reorderColumns(ids: number[]) {
        const boardId = store.currentBoardId();
        if (!boardId) return;

        //Optimistic UI update
        patchState(store, { ids: ids });
        try {
          const reorderedColumns = await firstValueFrom(columnService.reorderColumns(boardId, ids));
          patchState(store, setAllEntities(reorderedColumns));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Reordering column failed',
            detail: errorMessage,
          });
          this.loadColumns();
        } 
      },

      setSelectedColumnId(columnId: number){
        patchState(store, {selectedColumnId: columnId});
      }
    }),
  ),
  withHooks((store, boardStore = inject(BoardStore)) => ({
    onInit(){
      effect(() => {
        const boardId = boardStore.selectedBoardId();
        if(boardId){
          store.loadColumns();
        } else {
          patchState(store, removeAllEntities());
        }
      })
    }
  }))
);
