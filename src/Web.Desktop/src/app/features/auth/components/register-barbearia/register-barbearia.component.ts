import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { AuthService } from '@core/services/auth.service';
import { RegisterBarbeariaRequest } from '@core/models/auth.models';

@Component({
  selector: 'app-register-barbearia',
  templateUrl: './register-barbearia.component.html',
  styleUrls: ['./register-barbearia.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class RegisterBarbeariaComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  currentStep = 1;
  totalSteps = 3;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if already authenticated
    this.authService.isAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate(['/development']);
        }
      });

    // Setup real-time validation
    this.setupRealTimeValidation();
  }

  private setupRealTimeValidation(): void {
    // Email validation
    this.registerForm.get('emailResponsavel')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(email => {
        if (email && this.isValidEmail(email)) {
          this.checkEmailAvailability(email);
        }
      });

    // Password strength validation
    this.registerForm.get('senha')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(password => {
        if (password) {
          this.validatePasswordStrength(password);
        }
      });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private checkEmailAvailability(email: string): void {
    // Simulate email availability check
    const unavailableEmails = ['admin@test.com', 'teste@barbearia.com'];
    
    if (unavailableEmails.includes(email.toLowerCase())) {
      this.registerForm.get('emailResponsavel')?.setErrors({ 
        ...this.registerForm.get('emailResponsavel')?.errors,
        emailTaken: true 
      });
    }
  }

  private validatePasswordStrength(password: string): void {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (password.length >= 8 && strength < 3) {
      this.registerForm.get('senha')?.setErrors({ 
        ...this.registerForm.get('senha')?.errors,
        weakPassword: true 
      });
    }
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get('senha')?.value || '';
    if (password.length === 0) return '';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (password.length < 8) return 'weak';
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Step 1 - Dados da Barbearia
      nomeBarbearia: ['', [Validators.required, Validators.minLength(2)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      
      // Step 2 - Endereço
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      rua: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      
      // Step 3 - Dados do Responsável
      emailResponsavel: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', [Validators.required]],
      aceitarTermos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha');
    const confirmarSenha = form.get('confirmarSenha');
    
    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    } else {
      this.markStepFieldsTouched(this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private isStepValid(step: number): boolean {
    const stepFields = this.getStepFields(step);
    return stepFields.every(fieldName => {
      const field = this.registerForm.get(fieldName);
      return field?.valid;
    });
  }

  private getStepFields(step: number): string[] {
    switch (step) {
      case 1:
        return ['nomeBarbearia', 'telefone'];
      case 2:
        return ['cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];
      case 3:
        return ['emailResponsavel', 'senha', 'confirmarSenha', 'aceitarTermos'];
      default:
        return [];
    }
  }

  private markStepFieldsTouched(step: number): void {
    const stepFields = this.getStepFields(step);
    stepFields.forEach(fieldName => {
      const field = this.registerForm.get(fieldName);
      field?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const registerRequest: RegisterBarbeariaRequest = {
      nomeBarbearia: formValue.nomeBarbearia,
      emailResponsavel: formValue.emailResponsavel,
      senha: formValue.senha,
      telefone: formValue.telefone,
      endereco: {
        rua: formValue.rua,
        numero: formValue.numero,
        bairro: formValue.bairro,
        cidade: formValue.cidade,
        estado: formValue.estado,
        cep: formValue.cep
      }
    };

    this.authService.registerBarbearia(registerRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.snackBar.open(
              result.message || 'Barbearia cadastrada com sucesso!', 
              'Fechar', 
              { duration: 5000, panelClass: ['success-snackbar'] }
            );
            
            // Redirect to login with success message
            setTimeout(() => {
              this.router.navigate(['/login'], {
                queryParams: { registered: 'true' }
              });
            }, 2000);
          } else {
            this.errorMessage = result.message || 'Erro durante o cadastro';
          }
        },
        error: (error) => {
          console.error('Register error:', error);
          this.errorMessage = 'Erro interno do servidor. Tente novamente.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      
      this.registerForm.patchValue({ telefone: value });
    }
  }

  formatCep(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      this.registerForm.patchValue({ cep: value });
      
      // Auto-fill address when CEP is complete
      if (value.length === 9) {
        this.searchCep(value);
      }
    }
  }

  private searchCep(cep: string): void {
    // Simulate CEP search API call
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      // Mock address data based on CEP
      const mockAddresses: { [key: string]: any } = {
        '01310100': {
          rua: 'Avenida Paulista',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        '04038001': {
          rua: 'Rua Vergueiro',
          bairro: 'Vila Mariana',
          cidade: 'São Paulo',
          estado: 'SP'
        }
      };

      const address = mockAddresses[cleanCep];
      if (address) {
        this.registerForm.patchValue({
          rua: address.rua,
          bairro: address.bairro,
          cidade: address.cidade,
          estado: address.estado
        });
        
        this.snackBar.open('Endereço preenchido automaticamente!', 'OK', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      }
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for template
  get nomeBarbearia() { return this.registerForm.get('nomeBarbearia'); }
  get telefone() { return this.registerForm.get('telefone'); }
  get cep() { return this.registerForm.get('cep'); }
  get rua() { return this.registerForm.get('rua'); }
  get numero() { return this.registerForm.get('numero'); }
  get bairro() { return this.registerForm.get('bairro'); }
  get cidade() { return this.registerForm.get('cidade'); }
  get estado() { return this.registerForm.get('estado'); }
  get emailResponsavel() { return this.registerForm.get('emailResponsavel'); }
  get senha() { return this.registerForm.get('senha'); }
  get confirmarSenha() { return this.registerForm.get('confirmarSenha'); }
  get aceitarTermos() { return this.registerForm.get('aceitarTermos'); }
}