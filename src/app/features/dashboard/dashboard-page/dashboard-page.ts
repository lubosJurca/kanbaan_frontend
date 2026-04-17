import { Component, signal } from '@angular/core';

import { Sidebar } from '../components/sidebar/sidebar';
import { BoardHeader } from '../components/board-header/board-header';
import { BoardStore } from '../../board/board.store';
import { ColumnStore } from '../../column/column.store';
import { ColumnComponent } from "../../column/column/column";
import { TaskStore } from '../../task/task.store';
import { SubtaskStore } from '../../subtask/subtask.store';

@Component({
  selector: 'app-dashboard-page',
  imports: [Sidebar, BoardHeader, ColumnComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  providers: [BoardStore, ColumnStore,TaskStore,SubtaskStore],
})
export class DashboardPage {
  showSidebar = signal<boolean>(true);
}
