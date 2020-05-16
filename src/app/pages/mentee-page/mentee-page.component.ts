import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, MenteeService, MatchService } from '../../services';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { COMMA, SPACE, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Mentee, User, Match } from 'src/app/schemas';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mentee-page',
  templateUrl: './mentee-page.component.html',
  styleUrls: ['./mentee-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class MenteePageComponent implements OnInit {
  user$: Observable<User>;
  mentee$: Observable<Mentee>;
  userId: string;
  menteeForm = new FormGroup({
  });
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [COMMA, SPACE, ENTER];
  companies: string[] = [];
  modalRef: BsModalRef;
  matches: Match[];

  constructor(
    private router: Router,
    private userService: UserService,
    private menteeService: MenteeService,
    private modalService: BsModalService,
    private matchService: MatchService
  ) { }

  async ngOnInit() {
    this.user$ = this.userService.getUser$();
    this.userId = this.userService.getUserId();
    if (this.userId === undefined) {
      this.router.navigate(['login'])
    }

    await this.menteeService.signout();
    await this.menteeService.init();
    this.mentee$ = this.menteeService.getMentee$();
    this.mentee$.subscribe(mentee => { if (mentee) { this.companies = mentee.companies } });

    await this.getMatches();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    this.addItem(value);
    if (input) {
      input.value = '';
    }
  }

  addItem(value: string) {
    if ((value || '').trim()) {
      this.companies.push(value.trim());
    }
  }

  remove(company: string): void {
    const index = this.companies.indexOf(company);

    if (index >= 0) {
      this.companies.splice(index, 1);
    }
  }


  async completeProfile() {
    try {
      await this.menteeService.completeMenteeProfile(this.userId, document.getElementById('major')['value'], this.companies)
    } catch (err) {
      alert(err)
    } finally {
      this.mentee$ = this.menteeService.getMentee$();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  async uploadFile(event: any) {
    try {
      await this.menteeService.uploadResume(this.userId, event.target.files[0]);
    } catch (err) {
      alert(err)
    } finally {
      this.modalRef.hide();
    }
  }

  async getMatches() {
    try {
      this.matches = await this.matchService.getMenteeMatches(this.userId);
    }catch {
      alert('failed to refresh matches');
    }
  }
}
