import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../schemas';
import { UserService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class UserPageComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser$();
    const userId = this.userService.getUserId();
    if(!this.user$ || userId === undefined) {
      this.router.navigate(['login'])
    }
  }
}
