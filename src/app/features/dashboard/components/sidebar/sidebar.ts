import { Component, model} from '@angular/core';
import { BoardComponent } from '../../../board/board/board';
import { BoardFooter } from "../board-sidebar-footer/board-sidebar-footer";

@Component({
  selector: 'app-sidebar',
  imports: [BoardComponent, BoardFooter],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isVisible = model<boolean>(true);

}
