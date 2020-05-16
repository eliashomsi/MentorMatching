import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../schemas';
import * as firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { MailService } from './mail.service';

@Injectable({
  providedIn: 'root'
})

export class UserService implements OnDestroy {
  private user$ = new BehaviorSubject<User | null>(null);
  private userId: string;
  private userSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private afstore: AngularFireStorage,
    private mailService: MailService
  ) { }

  async init() {
    return new Promise((resolve, _) => {
      const sub = this.afAuth.user.subscribe(async user => {
        if (user) {
          await this.setUser(user.uid);
        }
        resolve(sub.unsubscribe());
      });
    });
  }

  async login(email: string, password: string) {
    const authUser = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    await this.setUser(authUser.user.uid);
  }

  async register(email: string, password: string, name: string) {
    const authUser = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    await this.createNewUser(authUser.user.uid, email, name)
    this.mailService.sendWelcomeEmail(email);
  }

  async signout() {
    await this.afAuth.auth.signOut();
    this.unsubscribe()
    this.user$.next(null);
  }

  async resetPassword(email: string) {
    await this.afAuth.auth.sendPasswordResetEmail(email)
  }

  async doGoogleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const authUser = await this.afAuth.auth.signInWithPopup(provider)

    if (!(await this.checkIfUserExsits(authUser.user.uid))) {
      await this.uploadProfilePictureFromUrl(authUser.user.uid, authUser.user.photoURL)
      await this.createNewUser(authUser.user.uid, authUser.user.email, authUser.user.displayName, true);
      this.mailService.sendWelcomeEmail(authUser.user.email);
    }
    await this.setUser(authUser.user.uid);
  }

  async uploadProfile(file: Blob) {
    let uid = this.getUserId();
    let storageRef = this.afstore.storage.ref();
    let userProfileRef = storageRef.child(`users/${uid}.png`);
    await userProfileRef.put(file);
    // trigger update
    await this.setAvatarValue(uid, false);
    await this.setAvatarValue(uid, true);
  }

  private async createNewUser(uid: string, email: string, name: string, avatar: boolean = false) {
    await this.afs.collection('users').doc<User>(uid).set({
      email,
      name,
      avatar
    });
  }

  private async setAvatarValue(uid: string, avatar: boolean) {
    await this.afs.collection('users').doc<User>(uid).update({
      avatar
    });
  }

  private unsubscribe() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private setUser(id: string) {
    return new Promise<void>((resolve, _) => {
      this.unsubscribe();

      this.userSubscription = this.afs.collection('users').doc<User>(id).valueChanges()
        .subscribe(user => {
          if (user) {
            user.id = id;
            this.userId = id;
            this.user$.next(user);
          }
          resolve();
        });
    });
  }

  private async uploadProfilePictureFromUrl(uid: string, url: string) {
    let storageRef = this.afstore.storage.ref();
    let userProfileRef = storageRef.child(`users/${uid}.png`);
    this.imageToDataUrl(url, async (base64: string) => {
      await userProfileRef.putString(base64, 'data_url')
    });
  }

  private imageToDataUrl(url: string, callback: Function) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  getUser$() {
    return this.user$.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  ngOnDestroy() {
    this.unsubscribe();
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

  private async checkIfUserExsits(id: string) {
    const users = await this.fetchCollection<User>('users');
    const listId = users.map(user => user.id);
    return listId.includes(id);
  }
}
