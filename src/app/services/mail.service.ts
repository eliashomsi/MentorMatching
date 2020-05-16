import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private url = "https://us-central1-mentorme-68536.cloudfunctions.net";
  private sendWelcomeEmailText = 'sendWelcomeEmail';
  private sendMatchEmailText = 'sendMatchEmail';

  constructor(
    private http: HttpClient
  ) { }

  async sendWelcomeEmail(dest: string) {
    try {
      await this.http.get(`${this.url}/${this.sendWelcomeEmailText}?dest=${dest}`).toPromise()
    }catch {

    }
  }

  async sendMatchEmail(dest: string, who: string) {
    try {
      await this.http.get(`${this.url}/${this.sendMatchEmailText}?dest=${dest}&who=${who}`).toPromise()
    }catch {

    }
  }

}
