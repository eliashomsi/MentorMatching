import * as firebase from 'firebase/app';

export interface Chat {
    user: string;
    content: string;
    time: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}
