import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {
  constructor(
    private afstore: AngularFireStorage
  ) {}

  async transform(userId: string): Promise<string> {
    return this.afstore.ref(`users/${userId}.png`).getDownloadURL().toPromise();
  }
}