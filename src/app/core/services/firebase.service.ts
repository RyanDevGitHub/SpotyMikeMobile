import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  Query,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
interface FirestoreDocumentData {
  [key: string]: unknown; // unknown est plus strict que any
}

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592

@Injectable({
  providedIn: 'root',
})
export class Firebase {
  // Initialize Firebase
  app = initializeApp(environment.firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(this.app);

  constructor() {}

  // Create a new document in collection
  async createDocument(collectionName: string, data: FirestoreDocumentData) {
    await addDoc(collection(this.db, collectionName), data);
    return console.log('Success : Document Create');
  }

  // get a document in collection
  async getDocument(collectionName: string, documentId: string) {
    const docSnap = await getDoc(doc(this.db, collectionName, documentId));
    return docSnap.data();
  }

  // get a document in collection by field
  getDocumentByField(
    collectionName: string,
    fieldName: string,
    value: string,
  ): Observable<DocumentData | null> {
    const querySnapshotPromise = getDocs(
      query(collection(this.db, collectionName), where(fieldName, '==', value)),
    );
    return from(querySnapshotPromise).pipe(
      map((querySnapshot) => {
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data();
        } else {
          console.log(
            `No document found with ${fieldName}=${value} in ${collectionName} collection.`,
          );
          return null;
        }
      }),
    );
  }

  // get many documents in collection
  async getDocuments(query: Query<unknown, DocumentData>) {
    const querySnapshot = await getDocs(query);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // get collection
  async getCollection(collectionName: string) {
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // get sous collection
  async getSousCollection(
    collectionName: string,
    documentId: string,
    sousCollectionName: string,
  ) {
    const querySnapshot = await getDocs(
      collection(this.db, collectionName, documentId, sousCollectionName),
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // Update a document in collection
  async updateDocument(
    collectionName: string,
    documentId: string,
    data: object,
  ) {
    await updateDoc(doc(this.db, collectionName, documentId), data);
    return console.log('Success : Document Update');
  }

  // Delete a document in collection
  async deleteDocument(collectionName: string, documentId: string) {
    await deleteDoc(doc(this.db, collectionName, documentId));
    return console.log('Success : Document Delete');
  }
  // Delete a document in collection By Field
  async deleteDocumentByField(
    collectionName: string,
    fieldName: string,
    value: string,
  ): Promise<void> {
    const querySnapshot = await getDocs(
      query(collection(this.db, collectionName), where(fieldName, '==', value)),
    );

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(
        `Success: Document(s) with ${fieldName}=${value} deleted from ${collectionName} collection.`,
      );
    } else {
      console.log(
        `No document found with ${fieldName}=${value} in ${collectionName} collection.`,
      );
    }
  }
}
