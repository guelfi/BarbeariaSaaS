import { Component, OnInit } from '@angular/core';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Barbearia SaaS - Mobile';

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    this.initializePwa();
  }

  private async initializePwa(): Promise<void> {
    // Request persistent storage for better offline experience
    await this.pwaService.requestPersistentStorage();
    
    // Check for app updates
    await this.pwaService.checkForUpdate();
    
    // Log storage usage for debugging
    const storageEstimate = await this.pwaService.getStorageEstimate();
    if (storageEstimate) {
      console.log('Storage usage:', {
        used: Math.round((storageEstimate.usage || 0) / 1024 / 1024 * 100) / 100 + ' MB',
        quota: Math.round((storageEstimate.quota || 0) / 1024 / 1024 / 1024 * 100) / 100 + ' GB'
      });
    }
  }
}