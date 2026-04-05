import { Component, inject, OnInit, output } from '@angular/core';
import { TaskStore } from '../../../task/task.store';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ColumnStore } from '../../../column/column.store';

@Component({
  selector: 'app-task-actions',
  imports: [InputTextModule, MenuModule, ReactiveFormsModule, ConfirmDialogModule,DialogModule],
  templateUrl: './task-actions.html',
  styleUrl: './task-actions.css',
  providers: [ConfirmationService],
})
export class TaskActions implements OnInit {
  public columnStore = inject(ColumnStore);
  public taskStore = inject(TaskStore);
  private confirmationService = inject(ConfirmationService);
  private formBuilder = inject(FormBuilder);
  hideTaskDialog = output();
  items: MenuItem[] | undefined;
  visible: boolean = false;

  updateTaskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    description: [''],
    columnId: [null as number | null, Validators.required],
  });

    async onSubmit() {
    if (this.updateTaskForm.valid) {
      const payload = {
        title: this.updateTaskForm.value.title!,
        description: this.updateTaskForm.value?.description ?? undefined,
        columnId: this.updateTaskForm.value?.columnId ?? undefined
      }

      await this.taskStore.updateTask(payload);
      this.visible = false;
      this.hideTaskDialog.emit();
    }
  }

  onUpdateTask() {
    console.log('Edit task');
    const taskId = this.taskStore.selectedTaskId();
    if (!taskId) return;

    const task = this.updateTaskForm.patchValue({
      title: this.taskStore.selectedTask()?.title,
      description: this.taskStore.selectedTask()?.description,
      columnId: this.taskStore.selectedTask()?.columnId
    });
    this.visible = true;
  }

  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label: 'Edit Task',
            command: () => this.onUpdateTask(),
          },
          {
            label: 'Delete Task',
            command: () => this.onDeleteTask(),
          },
        ],
      },
    ];
  }

  onDeleteTask() {
    const taskId = this.taskStore.selectedTaskId();
    if (!taskId) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${this.taskStore.selectedTask()?.title} task? This action will remove subtasks and cannot be reversed.`,
      header: 'Delete this task?',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'confirm-reject-btn',
      accept: () => {
        this.taskStore.deleteTask();
        this.hideTaskDialog.emit();
      },
    });
  }
}
