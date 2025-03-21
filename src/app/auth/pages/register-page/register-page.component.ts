import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, lastName, email } = this.registerForm.value;

    this.authService.register(name, lastName, email).subscribe({
      next: () => {
        this.successMessage = '¡Usuario registrado con éxito!';
        this.errorMessage = null;
        // La redirección está en el AuthService
      },
      error: (err) => {
        this.errorMessage = 'Error al registrar el usuario. Inténtalo de nuevo.';
        this.successMessage = null;
        console.error('Error al registrar:', err);
      }
    });
  }
}