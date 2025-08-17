import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

// Components
import { DevelopmentComponent } from './components/development/development.component';

// Routes
const routes = [
  {
    path: '',
    component: DevelopmentComponent
  }
];

@NgModule({
  declarations: [
    DevelopmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatMenuModule
  ]
})
export class DevelopmentModule { }