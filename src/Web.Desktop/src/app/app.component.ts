import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Barbearia SaaS - Desktop';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize auth state from localStorage
    this.authService.initializeAuthState();
  }
}