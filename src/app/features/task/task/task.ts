import { Component, computed, inject, input } from '@angular/core';
import { TaskStore } from '../task.store';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './task.html',
  host: { class: 'flex flex-col flex-1' },
})
export class Task {
  columnId = input.required<number>();
  taskStore = inject(TaskStore);

  columnTasks = computed(() =>
    this.taskStore
      .entities()
      .filter((t) => t.columnId === this.columnId())
      .sort((a, b) => a.order - b.order),
  );

  drop(event: CdkDragDrop<number>) {
    const sourceColumnId = event.previousContainer.data; //Previous columnId
    const targetColumnId = event.container.data; // new ColumnId

    if (sourceColumnId === targetColumnId) { // moving task inside of column
      if (event.previousIndex === event.currentIndex) return;

      const tasks = [...this.columnTasks()];
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);

      const newOrder = tasks.map((t) => t.id);
      this.taskStore.reorderTasks(this.columnId(), newOrder);
    } else { //moving task between columns
      const movedTaskId = event.previousContainer.data === sourceColumnId
        ? this.taskStore.entities()
            .filter((t) => t.columnId === sourceColumnId)
            .sort((a, b) => a.order - b.order)[event.previousIndex]?.id
        : null;

      if (!movedTaskId) return;

      this.taskStore.moveTask(movedTaskId, targetColumnId, event.currentIndex + 1);
    }
  }
}
