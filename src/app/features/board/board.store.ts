import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Board } from '../../models/models';
import { computed, inject } from '@angular/core';
import { BoardService } from './board.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

export const BoardStore = signalStore(
  withEntities<Board>(),
  withState({
    isLoading: false,
    error: null as string | null,
    selectedBoardId: null as number | null,
  }),
  withComputed((store) => ({
    boardCount: computed(() => store.entities().length),
    selectedBoard: computed(() =>
      store.selectedBoardId() ? store.entityMap()[store.selectedBoardId()!] : null,
    ),
  })),
  withMethods(
    (store, boardService = inject(BoardService), messageService = inject(MessageService)) => ({
      async loadAllBoards() {
        patchState(store, { isLoading: true });
        try {
          const allBoards = await firstValueFrom(boardService.getAllBoards());
          patchState(store, setAllEntities(allBoards));
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Loading boards failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async createBoard(title: string) {
        patchState(store, { isLoading: true });

        try {
          const board = await firstValueFrom(boardService.createBoard(title));
          patchState(store, addEntity(board));
          messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: `Board with title ${board.title} was created!`,
          });

          return board;
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Creating board failed',
            detail: errorMessage,
          });
          return null;
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async updateBoard(id: number, title: string) {
        patchState(store, { isLoading: true });

        try {
          const board = await firstValueFrom(boardService.updateBoard(id, title));
          patchState(store, updateEntity({ id, changes: board }));
          messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: `Board with title ${board.title} was updated!`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Updating board failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      async deleteBoard(id: number) {
        patchState(store, { isLoading: true });

        try {
          const board = await firstValueFrom(boardService.deleteBoard(id));
          patchState(store, removeEntity(board.id), { selectedBoardId: null });
          messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: `Board with title ${board.title} was deleted!`,
          });
        } catch (error) {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? (error.error?.message ?? 'Something went wrong')
              : 'Something went wrong';

          patchState(store, { error: errorMessage });
          messageService.add({
            severity: 'error',
            summary: 'Deleting board failed',
            detail: errorMessage,
          });
        } finally {
          patchState(store, { isLoading: false });
        }
      },

      selectBoard(id: number) {
        patchState(store, { selectedBoardId: id });
      },
    }),
  ),
);
