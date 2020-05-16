import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  host: {
    class: 'page'
  }
})
export class RegisterPageComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
    name: new FormControl('', Validators.required),
  });
  registerLoading = false;
  faGoogle = faGoogle;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  async register() {
    this.registerLoading = true;
    try {
      const {name, email, password} = this.registerForm.value;
      await this.userService.register(email, password, name);
      this.router.navigate(['login']);
    } catch (err) {
      console.error(err);
      alert(err);
    }
    this.registerLoading = false;
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
