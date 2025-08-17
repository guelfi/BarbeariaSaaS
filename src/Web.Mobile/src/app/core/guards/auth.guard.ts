import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { PwaService } from '../services/pwa.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private pwaService: PwaService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          // Trigger haptic feedback for unauthorized access
          this.pwaService.vibrate([100, 100, 100]);
          
          // Store the attempted URL for redirecting after login
          const returnUrl = state.url;
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl },
            replaceUrl: true 
          });
          return false;
        }
      })
    );
  }
}