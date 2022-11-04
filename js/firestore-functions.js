
import { collection, query, where, getDocs, getFirestore,addDoc } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import { } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'

import { app } from '/js/firestore.js'

const db = getFirestore(app)

const getNotesFirestore = async () => {
    const q = query(collection(db, 'notes'))
    const querySnapshot = await getDocs(q);
   
    return querySnapshot
}

const saveNoteFirestore = async (note) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "notes"), {
        text: note.text,
        created_at: new Date()
    });
    console.log("Document written with ID: ", docRef.id);

    if (docRef.id) {
        return 'ok'
    }
    return 'faild'

}

export {
    getNotesFirestore,
    saveNoteFirestore
}