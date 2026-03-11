import { Component, inject } from '@angular/core';
import { AuthStore } from '../../auth/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  readonly authStore = inject(AuthStore);
  private router = inject(Router);

  async logoutUser() {
    await this.authStore.logoutUser();
    if (!this.authStore.user()) {
      this.router.navigate(['/login']);
    }
  }
}
