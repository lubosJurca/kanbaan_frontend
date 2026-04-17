import { Component, inject, OnInit, signal } from '@angular/core';
import { BoardStore } from '../board.store';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnStore } from '../../column/column.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [DialogModule, ReactiveFormsModule, NgClass],
  templateUrl: './board.html',
})
export class BoardComponent implements OnInit {
  public boardStore = inject(BoardStore);
  public columnStore = inject(ColumnStore);
  private formBuilder = inject(FormBuilder);
  visible: boolean = false;
  submitting = signal(false);

  createBoardForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

    columns: this.formBuilder.array([
      this.formBuilder.group({ title: ['Todo'] }),
      this.formBuilder.group({ title: ['Doing'] }),
    ]),
  });

  async onSubmit() {
    if (this.createBoardForm.valid) {
      this.submitting.set(true);
      try {
        const board = await this.boardStore.createBoard(this.createBoardForm.value.title!);
        if (!board) return;

        await Promise.all(
          this.createBoardForm.value
            .columns!.filter((col) => col.title?.trim())
            .map((col) => this.columnStore.createColumn(board.id,col.title!)),
        );

        this.boardStore.selectBoard(board.id)

        this.createBoardForm.get('title')!.reset();
        this.columns.clear();
        this.columns.push(this.formBuilder.group({ title: ['Todo'] }));
        this.columns.push(this.formBuilder.group({ title: ['Doing'] }));
        this.visible = false;
      } catch (error){
        console.log("Error while creating board: ", error)
      } finally {
        this.submitting.set(false);
      }
    }
  }

  get columns() {
    return this.createBoardForm.get('columns') as FormArray;
  }

  addColumn() {
    this.columns.push(this.formBuilder.group({ title: [''] }));
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void {
    this.boardStore.loadAllBoards();
  }
}
