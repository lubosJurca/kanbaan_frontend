import { Component, inject } from '@angular/core';
import { ColumnStore } from '../../../column/column.store';
import { TaskStore } from '../../../task/task.store';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-add-task',
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  columnStore = inject(ColumnStore);
  taskStore = inject(TaskStore);
  private formBuilder = inject(FormBuilder);
  visible: boolean = false;

  createTaskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    description: [''],
    columnId: [null as number | null, Validators.required],
  });

  async onSubmit() {
    const { title, description, columnId } = this.createTaskForm.value;
    if (this.createTaskForm.valid && columnId) {
      await this.taskStore.createTask(columnId, { title: title!, description: description ?? '' });
      this.visible = false;
      this.createTaskForm.reset();
    }
  }

  showDialog() {
    this.visible = true;
  }
}
