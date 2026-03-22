import { Component, inject, input, OnInit } from '@angular/core';
import { ColumnStore } from '../../../column/column.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-column-actions',
  imports: [ButtonModule, DialogModule, InputTextModule, ReactiveFormsModule,ConfirmDialogModule, MenuModule],
  templateUrl: './column-actions.html',
  styleUrl: './column-actions.css',
  providers: [ConfirmationService],
})
export class ColumnActions implements OnInit {
  public columnStore = inject(ColumnStore);
  private formBuilder = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  items: MenuItem[] | undefined;
  visible: boolean = false;
  columnId = input.required<number>(); 

  updateColumnTitleForm = this.formBuilder.group({
     title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
  })

  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label: 'Edit Column',
            command: () => this.onUpdateColumn(),
          },
          {
            label: 'Delete Column',
            command: () => this.onDeleteColumn(),
          },
        ],
      },
    ];
  }

  async onSubmit(){
    if(this.updateColumnTitleForm.valid){
      await this.columnStore.updateColumn(this.columnId(), this.updateColumnTitleForm.value.title!);
      this.visible = false;
    }
  }

  onMenuToggle(event: Event, menu: any) {
    this.columnStore.setSelectedColumnId(this.columnId()!);
    menu.toggle(event);
  }

  onUpdateColumn() {
    if (this.columnId === null) return;

    const column = this.updateColumnTitleForm.patchValue({
      title: this.columnStore.selectedColumn()?.title,
    });
    this.visible = true;
  }

  onDeleteColumn() {
    const columnId = this.columnStore.selectedColumnId();
    if (!columnId) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${this.columnStore.selectedColumn()?.title} column? This action will remove all tasks and subtasks and cannot be reversed.`,
      header: 'Delete this column?',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'confirm-reject-btn',
      accept: () => {
        this.columnStore.deleteColumn(columnId);
      },
    });
  }
}
