import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterClienteComponent } from './components/register-cliente/register-cliente.component';
import { BarbeariaSelectionComponent } from './components/barbearia-selection/barbearia-selection.component';

// Guards
import { LoginGuard } from '../../core/guards/login.guard';

// Routes
const routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterClienteComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'select-barbearia',
    component: BarbeariaSelectionComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterClienteComponent,
    BarbeariaSelectionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatListModule,
    MatSelectModule
  ]
})
export class AuthModule { }