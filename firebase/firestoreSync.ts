import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";

import { firestore } from "./firebaseConfig";

type FirestoreData = Record<string, unknown>;

async function saveRecord(
  collectionName: string,
  localId: number,
  data: FirestoreData,
) {
  await setDoc(doc(firestore, collectionName, `${collectionName}_${localId}`), {
    ...data,
    localId,
    updatedAt: new Date().toISOString(),
  });
}

async function removeRecord(collectionName: string, localId: number) {
  await deleteDoc(
    doc(firestore, collectionName, `${collectionName}_${localId}`),
  );
}

export const saveClassToFirestore = (localId: number, data: FirestoreData) =>
  saveRecord("classes", localId, data);

export const deleteClassFromFirestore = (localId: number) =>
  removeRecord("classes", localId);

export const saveAttendanceToFirestore = (
  localId: number,
  data: FirestoreData,
) => saveRecord("attendance", localId, data);

export const deleteAttendanceFromFirestore = (localId: number) =>
  removeRecord("attendance", localId);

export const saveSaleToFirestore = (localId: number, data: FirestoreData) =>
  saveRecord("sales", localId, data);

export const deleteSaleFromFirestore = (localId: number) =>
  removeRecord("sales", localId);

export async function saveCustomerToFirestore(
  localId: number,
  data: FirestoreData,
  previousPhone?: string | null,
  previousEmail?: string | null,
) {
  const customers = collection(firestore, "customers");
  const stableReference = doc(firestore, "customers", `customers_${localId}`);

  let matchingDocument = null;

  if (previousEmail) {
    const emailSnapshot = await getDocs(
      query(customers, where("email", "==", previousEmail), limit(1)),
    );
    matchingDocument = emailSnapshot.docs[0] ?? null;
  }

  if (!matchingDocument && previousPhone) {
    const phoneSnapshot = await getDocs(
      query(customers, where("phone", "==", previousPhone), limit(1)),
    );
    matchingDocument = phoneSnapshot.docs[0] ?? null;
  }

  const customerData = {
    ...data,
    localId,
    updatedAt: new Date().toISOString(),
  };

  if (matchingDocument) {
    await updateDoc(matchingDocument.ref, customerData);
    return;
  }

  await setDoc(stableReference, customerData);
}
