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
    console.log("no more docs");
    loadMore.removeEventListener("click", handleClick);
    window.removeEventListener("scroll", handleScroll);
  } else {
    console.log("more docs");
  }
};
const showToast = (message, type) => {
  var notification = document.getElementById("notification");
  notification.innerHTML = `
    <div class="alert ${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>
  `;
};
const saveNote = async (note) => {
  const result = await saveNoteFirestore(note);
  if (result === "ok") {
    showToast("Note saved", "alert-success");
  } else {
    showToast("Error", "alert-danger");
  }
};
const cleanNotes = () => {
  container.innerHTML = "";
};

const btnSaveNote = document.getElementById("btnSaveNote");
btnSaveNote.addEventListener("click", async () => {
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
  console.log(
    "window.scrollY:",
    window.scrollY,
    "window.innerHeight:",
    window.innerHeight,
    "document.body.offsetHeight:",
    document.body.offsetHeight
  );
  if (window.scrollY >= document.body.offsetHeight - window.innerHeight) {
    getAllNotes(lastVisible);
  }
};
const loadMore = document.querySelector(".load-more button");

const handleClick = () => {
  getAllNotes(lastVisible);
};

loadMore.addEventListener("click", handleClick);

window.addEventListener("scroll", handleScroll);
