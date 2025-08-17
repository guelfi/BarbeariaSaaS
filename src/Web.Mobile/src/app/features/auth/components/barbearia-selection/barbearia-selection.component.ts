import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MockAuthDatabase } from '@core/data/mock-users.data';

interface Barbearia {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  distancia?: string;
  avaliacao?: number;
  tempoEstimado?: string;
}

@Component({
  selector: 'app-barbearia-selection',
  templateUrl: './barbearia-selection.component.html',
  styleUrls: ['./barbearia-selection.component.scss']
})
export class BarbeariaSelectionComponent implements OnInit {
  barbearias: Barbearia[] = [];
  selectedBarbearia: Barbearia | null = null;
  isLoading = true;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BarbeariaSelectionComponent>
  ) {}

  ngOnInit(): void {
    this.loadBarbearias();
  }

  private loadBarbearias(): void {
    // Simulate loading delay
    setTimeout(() => {
      this.barbearias = MockAuthDatabase.getBarbearias().map(b => ({
        ...b,
        distancia: this.generateRandomDistance(),
        avaliacao: this.generateRandomRating(),
        tempoEstimado: this.generateRandomTime()
      }));
      this.isLoading = false;
    }, 1000);
  }

  selectBarbearia(barbearia: Barbearia): void {
    this.selectedBarbearia = barbearia;
    
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Close bottom sheet with selected barbearia
    setTimeout(() => {
      this.bottomSheetRef.dismiss(barbearia);
    }, 300);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  private generateRandomDistance(): string {
    const distances = ['0.5 km', '1.2 km', '2.1 km', '3.5 km', '5.0 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  }

  private generateRandomRating(): number {
    return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
  }

  private generateRandomTime(): string {
    const times = ['5 min', '10 min', '15 min', '20 min', '25 min'];
    return times[Math.floor(Math.random() * times.length)];
  }

  getRatingStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const stars: string[] = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star_half');
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push('star_border');
    }
    
    return stars;
  }
}