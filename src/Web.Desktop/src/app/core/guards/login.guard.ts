import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // User is already authenticated, redirect to appropriate page
          const returnUrl = route.queryParams['returnUrl'] || '/development';
          this.router.navigate([returnUrl], { replaceUrl: true });
          return false;
        } else {
          // User is not authenticated, allow access to login page
          return true;
        }
      })
    );
  }
}