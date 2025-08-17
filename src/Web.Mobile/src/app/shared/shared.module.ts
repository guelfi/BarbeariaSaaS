import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PwaStatusComponent } from './components/pwa-status/pwa-status.component';

@NgModule({
  declarations: [
    PwaStatusComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  exports: [
    PwaStatusComponent
  ]
})
export class SharedModule { }