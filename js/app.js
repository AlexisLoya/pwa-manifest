import { getNotesFirestore, saveNoteFirestore } from "./firestore-functions.js";

// store last visible document
let lastVisible = null;

// DOM
const container = document.querySelector(".notes");
const loading = document.querySelector(".loading");

const getAllNotes = async (latestDoc) => {
  // Get data from firestore
  const data = await getNotesFirestore(latestDoc);

  let notes = "";
  data.forEach((doc) => {
    notes += `
        <div class="card m-1" >
                <div class="card-body">
                    <div class="row">
                        <div class="col-2">
                            <img src="/images/imgjpg.jpg" class="img-fluid rounded" alt="Only caché.">
                        </div>
                        <div class="col text-truncate">${doc.data().text}</div>
                    </div>
                </div>
            </div>
            `;
  });
  container.innerHTML += notes;

  // update latest doc
  lastVisible = data.docs[data.docs.length - 1];

  // unattach event listeners if no more docs
  if (data.empty) {
    window.removeEventListener("scroll", handleScroll);
    loading.innerHTML = "No more notes";
  }
};
const showToast = (message, type) => {
  var notification = document.getElementById("notification");
  notification.innerHTML = `
  <div class="toast show" style="position:absolute; z-index:3; right:10px; top:4em;">
    <div class="toast-header border-0 ${type}">
      <strong class="me-auto text-white">${message}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>
  </div>
  `;
};
const saveNote = async (note) => {
  const result = await saveNoteFirestore(note);
  if (result === "ok") {
    showToast("The Note was saved", "bg-success");
  } else {
    showToast("Error", "bg-danger");
  }
};
const cleanNotes = () => {
  container.innerHTML = "";
};

document.getElementById("btnSaveNote").addEventListener("click", async () => {
  const textNote = document.getElementById("textNote");
  const note = {
    text: textNote.value,
  };
  await saveNote(note);
  textNote.value = "";
  cleanNotes();
  getAllNotes();
});

// load data on DOM loaded
window.addEventListener("DOMContentLoaded", () => getAllNotes());

// load more books (scroll)
const handleScroll = () => {
  if (window.scrollY >= document.body.offsetHeight - window.innerHeight) {
    getAllNotes(lastVisible);
  }
};
const loadMore = document.querySelector(".load-more button");

window.addEventListener("scroll", handleScroll);
