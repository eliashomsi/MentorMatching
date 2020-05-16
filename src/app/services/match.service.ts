import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Match, Mentor, Mentee, User } from '../schemas';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { MailService } from './mail.service';


@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(
    private afs: AngularFirestore,
    private mailService: MailService
  ) { }

  async createMatches() {
    let mentees = await this.fetchCollection<Mentee>('mentees');
    let mentors = await this.fetchCollection<Mentor>('mentors');
    let matches = await this.fetchCollection<Match>('matches');
    let users = await  this.fetchCollection<User>('users');

    mentees = this.filterMentees(mentees, matches);
    mentors = this.filterMentors(mentors, matches);

    console.log(mentees);
    console.log(mentors);
    for (let mentor of mentors) {
      let items: Match[] = [];

      for (let mentee of mentees) {
        if (this.match(mentee, mentor)) {
          mentor.mentees--;
          const currentMatch: Match = {
            mentee: mentee.id,
            mentor: mentor.id
          }
          items.push(currentMatch);
        }
      }

      for (let match of items) {
        mentees = mentees.filter(mentee => {
          return mentee.id == match.mentee;
        });

        await this.createNewMatch(match);
        this.sendEmails(match, users);
      }
    }
  }
  
  private sendEmails(match: Match, users: User[]) {
    const menteeUser = users.filter(user => user.id == match.mentee)[0];
    const mentorUser = users.filter(user => user.id == match.mentor)[0];

    this.mailService.sendMatchEmail(menteeUser.email, mentorUser.name);
    this.mailService.sendMatchEmail(mentorUser.email, menteeUser.name);
  }

  async getMentorMatches(mentorId: string) {
    let matches = await this.fetchCollection<Match>('matches');
    return matches.filter(match => match.mentor == mentorId)
  }

  async getMenteeMatches(menteeId: string) {
    let matches = await this.fetchCollection<Match>('matches');
    return matches.filter(match => match.mentee == menteeId)
  }

  getMatch$(matchId: string) {
    return this.afs.collection('matches').doc<Match>(matchId).snapshotChanges()
      .pipe(
        map(snap => {
          const obj = snap.payload.data();
          obj.id = snap.payload.id;
          return obj as Match;
        })
      );
  }

  private async fetchCollection<T extends { id?: string }>(name: string) {
    let items: T[] = [];

    const snapshot = await this.afs.collection(name).ref.get();
    snapshot.docs.forEach(x => {
      const obj = x.data();
      obj.id = x.id;
      items.push(obj as T);
    })

    return items;
  }

  private match(mentee: Mentee, mentor: Mentor) {
    let intersect = (array1: string[], array2: string[]) => {
      return array1.filter((value: string) => array2.includes(value))
    }

    return (mentor.mentees > 0 && mentor.id != mentee.id && intersect(mentee.companies, mentor.companies).length != 0)
  }

  private filterMentees(mentees: Mentee[], matches: Match[]) {
    const matchedOnes = matches.map(match => match.mentee);
    let items: Mentee[] = [];

    for(let mentee of mentees) {
      if(!matchedOnes.includes(mentee.id)) {
        items.push(mentee);
      }
    }
    return items;
  }

  private filterMentors(mentors: Mentor[], matches: Match[]) {
    const matchedOnes = matches.map(match => match.mentor);
    let items: Mentor[] = [];
    
    for (let mentor of mentors) {
      const available = mentor.mentees - matchedOnes.filter(id => id == mentor.id).length
      if (available > 0) {
        mentor.mentees = available;
        items.push(mentor);
      }
    }

    return items;
  }

  private async createNewMatch(match: Match) {
    await this.afs.collection<Match>('matches').add(match);
  }
}
