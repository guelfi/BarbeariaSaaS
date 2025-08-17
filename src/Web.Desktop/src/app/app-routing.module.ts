import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PoliticaPrivacidadeComponent } from './pages/politica-privacidade/politica-privacidade.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'development',
    loadChildren: () => import('./features/development/development.module').then(m => m.DevelopmentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'politica-privacidade',
    component: PoliticaPrivacidadeComponent
  },
  {
    path: 'termos-uso',
    component: PoliticaPrivacidadeComponent // Reutilizando o mesmo componente por simplicidade
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }