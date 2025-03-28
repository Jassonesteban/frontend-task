import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { AuthModalService } from '../../service/auth-modal.service';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  userInfo: Object = {};
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authModalService: AuthModalService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      }
    );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const formattedData: User = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
    };

    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.registerUser(formattedData).subscribe({
        next: () => {
          this.authModalService.closeModal();
          this.authService.loginUser(
            formattedData.username,
            formattedData.password
          );
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Hubo un error al registrarse';
        },
      });
      this.authModalService.closeModal();
    } else {
      Object.keys(this.registerForm.controls).forEach((field) => {
        const control = this.registerForm.get(field);
        if (control?.invalid) {
          this.isLoading = false;
          this.errorMessage = 'Error al registrarse';
        }
      });
    }
  }

}
