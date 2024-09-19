import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  errorMessage: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {}
  getWidth(){}

  

  onSubmit(): void {
    this.authService.login(this.form.value).subscribe({
      next: currentUser => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null; // reset the error message
        this.router.navigateByUrl('/'); // redirect to homepage
      },
      error: (err: HttpErrorResponse) => {
        // error
        // const errors = { emailOrPassword: 'Incorrect email or password' };
        console.log('err', err.error);
        this.errorMessage = err.error.emailOrPassword;
      },
    });
  }
}
