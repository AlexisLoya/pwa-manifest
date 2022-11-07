import {
  collection,
  query,
  getDocs,
  getFirestore,
  addDoc,
  orderBy,
  limit,
  startAfter,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

import { app } from "/js/firestore.js";

const db = getFirestore(app);

const getNotesFirestore = async (latestDoc) => {
  console.log(latestDoc);
  let queryResult = null;
  if (latestDoc) {
    queryResult = query(
      collection(db, "notes"),
      orderBy("created_at", "desc"),
      startAfter(latestDoc),
      limit(4)
    );
  } else {
    queryResult = query(
      collection(db, "notes"),
      orderBy("created_at", "desc"),
      limit(4)
    );
  }
  const querySnapshot = await getDocs(queryResult);
  return querySnapshot;
};

const saveNoteFirestore = async (note) => {
  // Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "notes"), {
    text: note.text,
    created_at: new Date(),
  });
  console.log("Document written with ID: ", docRef.id);

  if (docRef.id) {
    return "ok";
  }
  return "faild";
};

export { getNotesFirestore, saveNoteFirestore };
