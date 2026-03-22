import { Component, OnInit, inject } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BoardStore } from '../../../board/board.store';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AddTask } from "../add-task/add-task";

@Component({
  selector: 'app-board-header',
  imports: [
    MenuModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    AddTask
],
  templateUrl: './board-header.html',
  styleUrl: './board-header.css',
  providers: [ConfirmationService],
})
export class BoardHeader implements OnInit {
  public boardStore = inject(BoardStore);
  private confirmationService = inject(ConfirmationService);
  private formBuilder = inject(FormBuilder);
  items: MenuItem[] | undefined;
  visible: boolean = false;

  updateBoardForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
  });

  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label: 'Edit Board',
            command: () => this.onUpdateBoard(),
          },
          {
            label: 'Delete Board',
            command: () => this.onDeleteBoard(),
          },
        ],
      },
    ];
  }

  async onSubmit() {
    if (this.updateBoardForm.valid) {
      await this.boardStore.updateBoard(
        this.boardStore.selectedBoardId()!,
        this.updateBoardForm.value.title!,
      );
      this.visible = false;
    }
  }

  onUpdateBoard() {
    this.updateBoardForm.patchValue({
      title: this.boardStore.selectedBoard()?.title
    });
    this.visible = true;
  }



  onDeleteBoard() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${this.boardStore.selectedBoard()?.title} board? This action will remove all columns and tasks and cannot be reversed.`,
      header: 'Delete this board?',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'confirm-reject-btn',
      accept: () => {
        this.boardStore.deleteBoard(this.boardStore.selectedBoardId()!);
      },
    });
  }
}
