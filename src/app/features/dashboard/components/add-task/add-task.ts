import { Component, inject } from '@angular/core';
import { ColumnStore } from '../../../column/column.store';
import { TaskStore } from '../../../task/task.store';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SubtaskStore } from '../../../subtask/subtask.store';

@Component({
  selector: 'app-add-task',
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  columnStore = inject(ColumnStore);
  taskStore = inject(TaskStore);
  subtaskStore = inject(SubtaskStore);
  private formBuilder = inject(FormBuilder);
  visible: boolean = false;

  createTaskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    description: [''],
    subtasks: this.formBuilder.array([
      this.formBuilder.group({ description: ['Do something good'] }),
      this.formBuilder.group({ description: ['Read before sleep'] }),
    ]),
    columnId: [null as number | null, Validators.required],
  });

  async onSubmit() {
    const { title, description, columnId } = this.createTaskForm.value;
    if (this.createTaskForm.valid && columnId) {
      try {
        const task = await this.taskStore.createTask(columnId, {
          title: title!,
          description: description ?? '',
        });

        if (!task) return;

        (
          await Promise.all(
            this.createTaskForm.value.subtasks!.filter((subtask) => subtask.description?.trim()),
          )
        ).map((subtask) => this.subtaskStore.createSubtask(task.id, subtask.description!));

        this.createTaskForm.get('title')!.reset();
        this.createTaskForm.get('description')!.reset();
        this.subtasks.clear();
        this.subtasks.push(this.formBuilder.group({ description: ['Do something good'] }));
        this.subtasks.push(this.formBuilder.group({ description: ['Read before sleep'] }));
        this.visible = false;
      } catch (error) {
        console.log('Error while creating subtasks: ', error);
      }
    }
  }

  get subtasks() {
    return this.createTaskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.formBuilder.group({ description: [''] }));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  showDialog() {
    this.visible = true;
  }
}
