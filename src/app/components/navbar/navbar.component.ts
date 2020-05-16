import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { Observable } from 'rxjs';
import { User } from '../../schemas/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User>;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser$();
  }

  async signOut() {
    await this.userService.signout();
    this.router.navigate(['login']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  async uploadFile(event: any) {
    try {
      await this.userService.uploadProfile(event.target.files[0]);
    } catch (err) {
      alert(err)
    } finally {
      this.modalRef.hide();
    }
  }
}
