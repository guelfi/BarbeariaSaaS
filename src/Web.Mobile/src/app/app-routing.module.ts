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
    path: 'register',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'development',
    loadChildren: () => import('./features/development/development.module').then(m => m.DevelopmentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'barbearias',
    loadChildren: () => import('./features/barbearias/barbearias.module').then(m => m.BarbeariasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agendamentos',
    loadChildren: () => import('./features/agendamentos/agendamentos.module').then(m => m.AgendamentosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./features/perfil/perfil.module').then(m => m.PerfilModule),
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
    scrollPositionRestoration: 'top',
    // PWA specific configurations
    preloadingStrategy: 'preloadAll' as any,
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }