import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ChatService, UserService, MatchService } from '../../services';
import { Chat, Match, User } from '../../schemas';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  host: {
    class: 'page-with-navbar'
  }
})
export class ChatPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  userId: string;
  user$: Observable<User>;
  matchId: string;
  chats$: Observable<Chat[]>;
  match$: Observable<Match>;
  chatForm = new FormControl('', Validators.required);
  @ViewChild('scrollMe', {static: false}) private chatHistory: ElementRef;
  private sub: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private matchService: MatchService
  ) { }


  ngOnInit() {
    this.user$ = this.userService.getUser$();
    this.userId = this.userService.getUserId();
    if (this.userId === undefined) {
      this.router.navigate(['login'])
    }

    this.sub = this.route.params.subscribe(params => {
      this.matchId = params['id'];
      this.chats$ = this.chatService.getChats$(this.matchId);
      this.match$ = this.matchService.getMatch$(this.matchId);
    });
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch (err) { }
  }

  async sendText() {
    if (this.chatForm.value) {
      let value = this.chatForm.value;
      this.chatForm.reset();
      await this.chatService.sendChat(this.matchId, this.userId, value);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
