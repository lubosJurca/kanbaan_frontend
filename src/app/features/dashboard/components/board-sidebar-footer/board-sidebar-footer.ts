import { Component, effect, inject, model, signal } from '@angular/core';
import { AuthStore } from '../../../auth/auth.store';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { BoardStore } from '../../../board/board.store';

@Component({
  selector: 'app-board-footer',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './board-sidebar-footer.html',
  styleUrl: './board-sidebar-footer.css',
})
export class BoardFooter {
  public authStore = inject(AuthStore);
  public boardStore = inject(BoardStore);
  private router = inject(Router);
  isVisible = model<boolean>();
  checked = signal<boolean>(localStorage.getItem('darkMode') === 'true');

  private darkLightModeEffect = effect(() => {
    const isDark = this.checked();

    document.documentElement.classList.toggle('dark', this.checked());

    localStorage.setItem('darkMode', String(isDark))
  });

  async logoutUser() {
    await this.authStore.logoutUser();
    if (!this.authStore.user()) {
      this.router.navigate(['/login']);
    }
  }
}
