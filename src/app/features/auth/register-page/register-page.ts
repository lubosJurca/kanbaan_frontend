import { Component, effect, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthStore } from '../auth.store';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  //Angular očekává, že validátor vrátí null, pokud je vše v pořádku, nebo objekt s chybou, pokud není.
  // V tomto případě vrací null, pokud se hesla shodují, a objekt s chybou, pokud se neshodují.
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private formBuilder = inject(FormBuilder);
  public authStore = inject(AuthStore);

  registerForm = this.formBuilder.group(
    {
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    },
    { validators: passwordsMatchValidator },
  );

  async onSubmit() {
    if (this.registerForm.valid) {
        const payload = {
          username: this.registerForm.value.username!,
          email: this.registerForm.value.email!,
          password: this.registerForm.value.password!,
        };
        await this.authStore.registerUser(payload);
      
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control?.touched && control?.errors?.[errorType]);
  }

  inputClass(field: string): string {
    const control = this.registerForm.get(field);
    const hasErr = !!(control?.touched && control?.errors);
    return hasErr
      ? 'border-destructive'
      : 'border-light-line dark:border-dark-line focus:border-primary';
  }

  confirmPasswordClass(): string {
    const control = this.registerForm.get('confirmPassword');
    const mismatch = !!(control?.touched && this.registerForm.errors?.['passwordsMismatch']);
    return mismatch
      ? 'border-destructive'
      : 'border-light-line dark:border-dark-line focus:border-primary';
  }
}
