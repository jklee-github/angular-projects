import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  errorMessage: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {}

  onSubmit(): void {
    // console.log('onSubmit', this.form.value)
    this.authService.register(this.form.value).subscribe({
      next: currentUser => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser); // set token to local storage
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser); // set the current user to currentUser$
        this.errorMessage = null; // reset the errorMessage
        this.router.navigateByUrl('/'); // go to the home page
      },
      // we know the err is from http response
      error: (err: HttpErrorResponse) => {
        // in the controller (users.ts), we definded our err
        // const messages = Object.values(err.errors).map(err => err.message);
        // return res.status(422).json(messages);
        console.log('err', err.error);
        this.errorMessage = err.error.join(', ');
      },
    });
  }
}
