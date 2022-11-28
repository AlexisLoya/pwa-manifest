import {
  collection,
  query,
  getDocs,
  getFirestore,
  addDoc,
  orderBy,
  limit,
  doc,
  updateDoc,
  startAfter,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

import { app } from "/js/firestore.js";

const db = getFirestore(app);

const getNotesFirestore = async (latestDoc) => {
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
  const imageUrl = await saveImageFirestore(note.image);
  const docRef = await addDoc(collection(db, "notes"), {
    text: note.text,
    created_at: new Date(),
    image: imageUrl,
  });

  if (docRef.id) {
    return "ok";
  }
  return "faild";
};

const updateNoteFirestore = async (note) => {
  // update a document with a generated id.
  const noteRef = doc(db, "notes", note.id);

  if (noteRef) {
    await updateDoc(noteRef, {
      text: note.text,
    });
    return "ok";
  }
  return "faild";
};

const saveImageFirestore = async (image) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, "images/" + image.name);
  const snapshot = await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(snapshot.ref);
  return imageUrl;
};
const deleteNoteFirestore = async (id) => {
  const noteRef = doc(db, "notes", id);
  if (noteRef) {
    await deleteDoc(noteRef);
    return "ok";
  }
  return "faild";
};

export {
  getNotesFirestore,
  saveNoteFirestore,
  updateNoteFirestore,
  saveImageFirestore,
  deleteNoteFirestore,
};
