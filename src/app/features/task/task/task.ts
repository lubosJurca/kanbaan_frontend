import { Component, computed, inject, input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskStore } from '../task.store';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TaskActions } from '../../dashboard/components/task-actions/task-actions';
import { ColumnStore } from '../../column/column.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubtaskStore } from '../../subtask/subtask.store';
import { Subtask } from '../../../models/models';

@Component({
  selector: 'app-task',
  imports: [CdkDropList, CdkDrag, ButtonModule, DialogModule, TaskActions, ReactiveFormsModule, NgClass],
  templateUrl: './task.html',
  host: { class: 'flex flex-col flex-1' },
})
export class Task {
  columnId = input.required<number>();
  public columnStore = inject(ColumnStore);
  public subtaskStore = inject(SubtaskStore);
  public taskStore = inject(TaskStore);
  private formBuilder = inject(FormBuilder);
  visible: boolean = false;
  localSubtasks: Subtask[] = [];

  taskForm = this.formBuilder.group({
    subtasks: this.formBuilder.array([]),
    columnId: [null as number | null, Validators.required],
  });

  onSubmit() {
    if (this.taskForm.valid) {
      if (this.columnId() !== this.taskForm.value.columnId) {
        const task = this.taskStore.selectedTask();
        this.taskStore.updateTask({
          title: task!.title!,
          description: task?.description,
          columnId: this.taskForm.value.columnId!,
        });
      }

      for (const subtask of this.localSubtasks) {
        const original = this.subtaskStore.entityMap()[subtask.id];

        if (original && original.done != subtask.done) {
          this.subtaskStore.updateSubtask(subtask);
        }
      }
    }
    this.visible = false;
  }

  toggleSubtask(index: number) {
    this.localSubtasks[index] = {
      ...this.localSubtasks[index],
      done: !this.localSubtasks[index].done,
    };
  }

  async showDialog(taskId: number) {
    this.taskStore.setSelectedTaskId(taskId);
    this.visible = true;

    this.taskForm.patchValue({
      columnId: this.taskStore.selectedTask()?.columnId,
    });

    this.localSubtasks = (await this.subtaskStore.loadSubtasks(taskId)) ?? [];
  }

  get doneSubtasksCount() {
    return this.localSubtasks.filter((s) => s.done).length;
  }

  columnTasks = computed(() =>
    this.taskStore
      .entities()
      .filter((t) => t.columnId === this.columnId())
      .sort((a, b) => a.order - b.order),
  );

  drop(event: CdkDragDrop<number>) {
    const sourceColumnId = event.previousContainer.data; //Previous columnId
    const targetColumnId = event.container.data; // new ColumnId

    if (sourceColumnId === targetColumnId) {
      // moving task inside of column
      if (event.previousIndex === event.currentIndex) return;

      const tasks = [...this.columnTasks()];
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);

      const newOrder = tasks.map((t) => t.id);
      this.taskStore.reorderTasks(this.columnId(), newOrder);
    } else {
      //moving task between columns
      const movedTaskId =
        event.previousContainer.data === sourceColumnId
          ? this.taskStore
              .entities()
              .filter((t) => t.columnId === sourceColumnId)
              .sort((a, b) => a.order - b.order)[event.previousIndex]?.id
          : null;

      if (!movedTaskId) return;

      this.taskStore.moveTask(movedTaskId, targetColumnId, event.currentIndex + 1);
    }
  }
}
