import { Component, inject } from '@angular/core';
import { ColumnStore } from '../column.store';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnActions } from '../../dashboard/components/column-actions/column-actions';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, CdkDragHandle, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Task } from "../../task/task/task";

@Component({
  selector: 'app-column-component',
  imports: [DialogModule, ReactiveFormsModule, ColumnActions, CdkDropList, CdkDrag, CdkDragHandle, Task, CdkDropListGroup],
  templateUrl: './column.html',
})
export class ColumnComponent {
  public columnStore = inject(ColumnStore);
  private formBuilder = inject(FormBuilder);
  visible: boolean = false;

  readonly columnColors = ['#49C4E5', '#8471F2', '#67E2AE', '#E78A4A', '#6B95EB', '#E56B8C'];

  createColumnForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
  });

  async onSubmit() {
    if (this.createColumnForm.valid && this.columnStore.currentBoardId()) {
      await this.columnStore.createColumn(this.createColumnForm.value.title!);
      this.visible = false;
      this.createColumnForm.get('title')!.reset();
    }
  }

  showDialog() {
    this.visible = true;
  }

  drop(event: CdkDragDrop<string[]>) {
    //Nothing moved
    if (event.previousIndex === event.currentIndex) return;

    // Take a mutable copy of the current entities
    const columns = [...this.columnStore.entities()];

    moveItemInArray(columns, event.previousIndex, event.currentIndex);

    // Extract the new ID ordering and send it to the store
    const newOrder = columns.map((c) => c.id);
    this.columnStore.reorderColumns(newOrder);
  }
}
