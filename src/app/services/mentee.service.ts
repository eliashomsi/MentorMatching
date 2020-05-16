import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Mentee } from '../schemas';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatchService } from './match.service';

@Injectable({
  providedIn: 'root'
})

export class MenteeService implements OnDestroy {
  private mentee$ = new BehaviorSubject<Mentee | null>(null);
  private menteeId: string;
  private menteeSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private afstore: AngularFireStorage,
    private matchService: MatchService
    ) { }

  async init() {
    return new Promise((resolve, _) => {
      const sub = this.afAuth.user.subscribe(async user => {
        if (user) {
          await this.setMentee(user.uid);
        }
        resolve(sub.unsubscribe());
      });
    });
  }

  async signout() {
    this.unsubscribe()
    this.mentee$.next(null);
  }

  async completeMenteeProfile(uid: string, major: string, companies:string[]) {
    //process companies
    companies = companies.map(company => company.toLowerCase());
    
    await this.afs.collection('mentees').doc<Mentee>(uid).set({
      major,
      companies,
      resume: false
    });

    await this.matchService.createMatches();
  }

  async uploadResume(uid: string, file: Blob) {
    let storageRef = this.afstore.storage.ref();
    let userProfileRef = storageRef.child(`resumes/${uid}.pdf`);
    await userProfileRef.put(file);
    // trigger update
    if(this.menteeId){
      await this.setResumeValue(uid, false);
      await this.setResumeValue(uid, true);
    }
  }

  private async setResumeValue(uid: string, resume: boolean) {
    await this.afs.collection('mentees').doc<Mentee>(uid).update({
      resume
    });
  }

  private unsubscribe() {
    if (this.menteeSubscription) {
      this.menteeSubscription.unsubscribe();
    }
  }

  private setMentee(id: string) {
    return new Promise<void>((resolve, _) => {
      this.unsubscribe();

      this.menteeSubscription = this.afs.collection('mentees').doc<Mentee>(id).valueChanges()
        .subscribe(mentee => {
          if(mentee) {
            mentee.id = id;
            this.menteeId = id;
            this.mentee$.next(mentee);
          }
          resolve();
        });
    });
  }

  getMentee$() {
    return this.mentee$.asObservable();
  }

  getMenteeId() {
    return this.menteeId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
