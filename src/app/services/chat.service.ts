import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Chat } from '../schemas';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore
  ) { }

  async sendChat(matchId: string, userId: string, content: string) {
    await this.afs.collection('matches').doc(matchId).collection<Chat>('chats').add({
      user: userId,
      content,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  getChats$(matchId: string) {
    return this.afs
      .collection('matches')
      .doc(matchId)
      .collection<Chat>('chats')
      .valueChanges()
      .pipe(
        map(chats => {
          return chats.sort((a, b) => {
            const aTime = (a.time as firebase.firestore.Timestamp) || { seconds: Date.now() };
            const bTime = (b.time as firebase.firestore.Timestamp) || { seconds: Date.now() };
            return aTime.seconds - bTime.seconds;
          });
        })
      );
  }
}
