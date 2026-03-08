import { Component, inject } from '@angular/core';
import { AuthStore } from '../../auth/auth.store';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  readonly authStore = inject(AuthStore);
}
