import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  host: {
    class: 'page'
  }
})
export class LoginPageComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  loginLoading = false;
  faGoogle = faGoogle;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  async login() {
    this.loginLoading = true;

    try {
      const { email, password } = this.loginForm.value;
      await this.userService.login(email, password);
      this.router.navigate(['user']);
    } catch (err) {
      console.error(err);
      alert(err);
    }

    this.loginLoading = false;
  }

  register() {
    this.router.navigate(['register']);
  }

  signout() {
    this.userService.signout();
  }

  resetPassword() {
    let email = window.prompt('Enter email to reset password'); 
    if(email) {
      this.userService.resetPassword(email)
      .then(_ => window.alert("If the email is found in our records, an password reset email will be sent"))
      .catch(_ => window.alert("If the email is found in our records, an password reset email will be sent"))
    }
  }

  async tryGoogleLogin(){
    try {
      await this.userService.doGoogleLogin()
      this.router.navigate(['user']);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }
}
