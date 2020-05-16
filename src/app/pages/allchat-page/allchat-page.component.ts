import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ChatService, UserService, MatchService } from '../../services';
import { Chat, Match, User } from '../../schemas';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-allchat-page',
  templateUrl: './allchat-page.component.html',
  styleUrls: ['./allchat-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class AllChatPageComponent implements OnInit {
  userId: string;
  user$: Observable<User>;
  mentorChats: Match[] = [];
  menteeChats: Match[] = [];

  constructor(
    private router: Router,
    private matchService: MatchService,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.user$ = this.userService.getUser$();
    this.userId = this.userService.getUserId();
    if (this.userId === undefined) {
      this.router.navigate(['login'])
    }

    await this.getMenteeChats();
    await this.getMentorChats();
  }

  async getMentorChats() {
    this.mentorChats = await this.matchService.getMentorMatches(this.userId)
  }
  
  async getMenteeChats() {
    this.menteeChats  = await this.matchService.getMenteeMatches(this.userId)
  }
}
