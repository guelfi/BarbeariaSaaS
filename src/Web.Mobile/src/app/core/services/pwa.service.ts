import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  public updateAvailable$ = this.updateAvailableSubject.asObservable();

  constructor(private swUpdate: SwUpdate) {
    this.initializeNetworkListener();
    this.initializeUpdateListener();
  }

  private initializeNetworkListener(): void {
    window.addEventListener('online', () => {
      this.isOnlineSubject.next(true);
    });

    window.addEventListener('offline', () => {
      this.isOnlineSubject.next(false);
    });
  }

  private initializeUpdateListener(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map(() => true)
        )
        .subscribe(() => {
          this.updateAvailableSubject.next(true);
        });
    }
  }

  public async checkForUpdate(): Promise<boolean> {
    if (this.swUpdate.isEnabled) {
      return await this.swUpdate.checkForUpdate();
    }
    return false;
  }

  public async activateUpdate(): Promise<boolean> {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.activateUpdate();
      document.location.reload();
      return true;
    }
    return false;
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public vibrate(pattern: number | number[] = 200): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  public async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      return await navigator.storage.persist();
    }
    return false;
  }

  public async getStorageEstimate(): Promise<StorageEstimate | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate();
    }
    return null;
  }
}