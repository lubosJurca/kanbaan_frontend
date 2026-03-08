import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  //Angular očekává, že validátor vrátí null, pokud je vše v pořádku, nebo objekt s chybou, pokud není.
  // V tomto případě vrací null, pokud se hesla shodují, a objekt s chybou, pokud se neshodují.
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private formBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.group(
    {
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    },
    { validators: passwordsMatchValidator },
  );

  onSubmit() {
    console.log(this.registerForm.value);

    //TODO: Odeslat data na backend a zpracovat odpověď
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control?.touched && control?.errors?.[errorType]);
  }
}
