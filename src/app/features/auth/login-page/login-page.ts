import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../auth.store';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  public authStore = inject(AuthStore);
  private router = inject(Router);

 loginForm = this.formBuilder.group(
  {
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]]
  }
 )

 private redirectEffect = effect(() => {
  if(this.authStore.user()){
    this.router.navigate(['/dashboard']);
  }
 })

 async onSubmit(){
   if(this.loginForm.valid){
    const payload = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }

    await this.authStore.loginUser(payload);
   }
 }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.touched && control?.errors?.[errorType]);
  }

  inputClass(field: string): string {
    const control = this.loginForm.get(field);
    const hasErr = !!(control?.touched && control?.errors);
    return hasErr
      ? 'border-destructive'
      : 'border-light-line dark:border-dark-line focus:border-primary';
  }

}
