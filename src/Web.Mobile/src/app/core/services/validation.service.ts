import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // Email validation with custom messages
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values to allow optional controls
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegex.test(control.value);
      
      return valid ? null : { 
        email: { 
          message: 'Email deve ter um formato válido (exemplo@dominio.com)' 
        } 
      };
    };
  }

  // Password strength validation (lighter for mobile)
  static passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const password = control.value;
      const errors: any = {};

      // Check minimum length
      if (password.length < 6) {
        errors.minLength = { message: 'Senha deve ter pelo menos 6 caracteres' };
      }

      // Check for at least one letter and one number (simplified for mobile)
      if (!/[a-zA-Z]/.test(password)) {
        errors.letter = { message: 'Senha deve conter pelo menos uma letra' };
      }

      if (!/\d/.test(password)) {
        errors.number = { message: 'Senha deve conter pelo menos um número' };
      }

      return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
    };
  }

  // Phone validation for Brazilian format
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      const valid = phoneRegex.test(control.value);
      
      return valid ? null : { 
        phone: { 
          message: 'Telefone deve estar no formato (11) 99999-9999' 
        } 
      };
    };
  }

  // Password confirmation validator
  static passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ 
          passwordMismatch: { 
            message: 'Senhas não coincidem' 
          } 
        });
        return { passwordMismatch: true };
      } else {
        // Clear the error if passwords match
        if (confirmPassword.errors?.['passwordMismatch']) {
          delete confirmPassword.errors['passwordMismatch'];
          if (Object.keys(confirmPassword.errors).length === 0) {
            confirmPassword.setErrors(null);
          }
        }
      }

      return null;
    };
  }

  // Get error message from validation errors
  static getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) return '';

    // Handle custom error messages
    for (const key in errors) {
      const error = errors[key];
      if (error && error.message) {
        return error.message;
      }
    }

    // Handle built-in validators
    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';

    return 'Campo inválido';
  }

  // Get all error messages for complex validations
  static getAllErrorMessages(errors: ValidationErrors | null): string[] {
    if (!errors) return [];

    const messages: string[] = [];

    // Handle password strength errors
    if (errors['passwordStrength']) {
      const strengthErrors = errors['passwordStrength'];
      for (const key in strengthErrors) {
        if (strengthErrors[key] && strengthErrors[key].message) {
          messages.push(strengthErrors[key].message);
        }
      }
    }

    // Handle other errors
    for (const key in errors) {
      if (key !== 'passwordStrength') {
        const error = errors[key];
        if (error && error.message) {
          messages.push(error.message);
        } else {
          messages.push(this.getErrorMessage({ [key]: error }));
        }
      }
    }

    return messages;
  }

  // Check if field has specific error
  static hasError(control: AbstractControl | null, errorType: string): boolean {
    return !!(control?.errors && control.errors[errorType]);
  }

  // Check if field is invalid and touched
  static isFieldInvalid(control: AbstractControl | null): boolean {
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  // Format phone number as user types
  static formatPhone(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  // Mobile-specific validation helpers
  static validateOnBlur(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }

  static validateOnSubmit(control: AbstractControl): boolean {
    return control.invalid;
  }
}