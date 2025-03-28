import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../../interfaces/Login';
import { AuthModalService } from '../../service/auth-modal.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  credentials: Login = { username: '', password: '' };
  isLoading = false;
  errorMessage: string | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private authModalService:AuthModalService, private authService: AuthService){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    const {username, password} = this.loginForm.value;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authModalService.closeModal();
      this.authService.loginUser(username ?? "", password??"").add( () => {
        this.isLoading = false;
        window.location.reload();
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        console.log(control);
        if (control?.invalid) {
          this.errorMessage = "Credenciales incorrectas";
        }
      });
    }
  }

}
