import { Component, inject, OnInit, output } from '@angular/core';
import { TaskStore } from '../../../task/task.store';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ColumnStore } from '../../../column/column.store';
import { SubtaskStore } from '../../../subtask/subtask.store';

@Component({
  selector: 'app-task-actions',
  imports: [InputTextModule, MenuModule, ReactiveFormsModule, ConfirmDialogModule, DialogModule],
  templateUrl: './task-actions.html',
  styleUrl: './task-actions.css',
  providers: [ConfirmationService],
})
export class TaskActions implements OnInit {
  public columnStore = inject(ColumnStore);
  public taskStore = inject(TaskStore);
  public subtaskStore = inject(SubtaskStore);
  private confirmationService = inject(ConfirmationService);
  private formBuilder = inject(FormBuilder);
  hideTaskDialog = output();
  items: MenuItem[] | undefined;
  visible: boolean = false;

  updateTaskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    description: [''],
    subtasks: this.formBuilder.array([]),
    columnId: [null as number | null, Validators.required],
  });

  async onSubmit() {
    if (this.updateTaskForm.valid) {
      const payload = {
        title: this.updateTaskForm.value.title!,
        description: this.updateTaskForm.value?.description ?? undefined,
        columnId: this.updateTaskForm.value?.columnId ?? undefined,
      };

      await this.taskStore.updateTask(payload);

      const originalSubtasks = this.subtaskStore.entities();
      const editedSutasks = this.subtasks.value;

      for (const subtask of editedSutasks) {
        if (!subtask.id) {
          await this.subtaskStore.createSubtask(
            this.taskStore.selectedTaskId()!,
            subtask.description,
          );
        } else {
          const orig = originalSubtasks.find((s) => s.id === subtask.id);
          if (orig && orig.description !== subtask.description)
            await this.subtaskStore.updateSubtask(subtask);
        }
      }

      for (const subtask of originalSubtasks) {
        const stillExist = editedSutasks.find((s: any) => s.id === subtask.id);
        if (!stillExist) {
          await this.subtaskStore.deleteSubtask(subtask.id);
        }
      }

      this.visible = false;
      this.hideTaskDialog.emit();
    }
  }

  onUpdateTask() {
    console.log('Edit task');
    const taskId = this.taskStore.selectedTaskId();
    if (!taskId) return;

    this.updateTaskForm.patchValue({
      title: this.taskStore.selectedTask()?.title,
      description: this.taskStore.selectedTask()?.description,
      columnId: this.taskStore.selectedTask()?.columnId,
    });

    this.subtasks.clear();

    for (const subtask of this.subtaskStore.entities()) {
      this.subtasks.push(this.formBuilder.group(subtask));
    }
    this.visible = true;
  }

  get subtasks() {
    return this.updateTaskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.formBuilder.group({ description: [''] }));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
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
