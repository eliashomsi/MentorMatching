import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Pipe({
  name: 'firedoc'
})
export class FiredocPipe implements PipeTransform {

  constructor(
    private afs: AngularFirestore
  ) { }

  getDoc$<T extends { id?: string }>(collection: string, docId: string) {
    return this.afs.collection(collection).doc<T>(docId).snapshotChanges()
      .pipe(
        map(snap => {
          const obj = snap.payload.data();
          obj.id = snap.payload.id;
          return obj;
        })
      );
  }

  transform(docId: string, collection: string): Observable<any> {
    return this.getDoc$(collection, docId);
  }
}