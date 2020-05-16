import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Pipe({
  name: 'resume'
})
export class ResumePipe implements PipeTransform {
  constructor(
    private afstore: AngularFireStorage
  ) {}

  async transform(userId: string): Promise<string> {
    return this.afstore.ref(`resumes/${userId}.pdf`).getDownloadURL().toPromise();
  }
}