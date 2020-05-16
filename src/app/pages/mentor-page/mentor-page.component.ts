import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, MentorService, MatchService } from '../../services';
import { Router } from '@angular/router';
import { FormGroup} from '@angular/forms';
import { COMMA, SPACE, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Mentor, User, Match } from 'src/app/schemas';

@Component({
  selector: 'app-mentor-page',
  templateUrl: './mentor-page.component.html',
  styleUrls: ['./mentor-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class MentorPageComponent implements OnInit {
  user$: Observable<User>;
  mentor$: Observable<Mentor>;
  userId: string;
  mentorForm = new FormGroup({
  });
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  companies: string[] = [];
  matches: Match[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private mentorService: MentorService,
    private matchService: MatchService
  ) { }

  async ngOnInit() {
    this.user$ = this.userService.getUser$();
    this.userId = this.userService.getUserId();
    if (this.userId === undefined) {
      this.router.navigate(['login'])
    }
    
    await this.mentorService.signout();
    await this.mentorService.init();
    this.mentor$ = this.mentorService.getMentor$();
    this.mentor$.subscribe(mentor => {if(mentor) this.companies = mentor.companies});

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

  addItem(value:string) {
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
      await this.mentorService.completeMentorProfile(this.userId, document.getElementById('mentees')['value'], this.companies, document.getElementById('title')['value'])
    }catch(err) {
      alert(err)
    }finally {
      this.mentor$ = this.mentorService.getMentor$();
    }
  }

  async getMatches() {
    try {
      this.matches = await this.matchService.getMentorMatches(this.userId);
    }catch {
      alert('failed to refresh matches');
    }
  }
}
