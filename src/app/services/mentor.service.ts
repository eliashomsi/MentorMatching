import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Mentor } from '../schemas/mentor';
import { MatchService } from './match.service';

@Injectable({
  providedIn: 'root'
})

export class MentorService implements OnDestroy {
  private mentor$ = new BehaviorSubject<Mentor | null>(null);
  private mentorId: string;
  private mentorSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private matchService: MatchService
  ) { }

  async init() {
    return new Promise((resolve, _) => {
      const sub = this.afAuth.user.subscribe(async user => {
        if (user) {
          await this.setMentor(user.uid);
        }
        resolve(sub.unsubscribe());
      });
    });
  }

  async completeMentorProfile(uid: string, mentees: number, companies:string[], title: string) {
    //process companies
    companies = companies.map(company => company.toLowerCase());

    await this.afs.collection('mentors').doc<Mentor>(uid).set({
      mentees,
      companies,
      title
    });

    await this.matchService.createMatches();
  }

  async signout() {
    this.unsubscribe()
    this.mentor$.next(null);
  }

  private unsubscribe() {
    if (this.mentorSubscription) {
      this.mentorSubscription.unsubscribe();
    }
  }

  private setMentor(id: string) {
    return new Promise<void>((resolve, _) => {
      this.unsubscribe();

      this.mentorSubscription = this.afs.collection('mentors').doc<Mentor>(id).valueChanges()
        .subscribe(mentor => {
          if(mentor) {
            mentor.id = id;
            this.mentorId = id;
            this.mentor$.next(mentor);
          }
          resolve();
        });
    });
  }

  getMentor$() {
    return this.mentor$.asObservable();
  }

  getMentorId() {
    return this.mentorId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
