import {
  getNotesFirestore,
  saveNoteFirestore,
  updateNoteFirestore,
  deleteNoteFirestore,
} from "./firestore-functions.js";
import { base64ToFile, convertTimestamp } from "./ultils.js";

// store last visible document
let lastVisible = null;

// DOM
const container = document.querySelector(".notes");
const loading = document.querySelector(".loading");
var myModal = new bootstrap.Modal(document.getElementById("editNote"), {
  keyboard: true,
});
const getAllNotes = async (latestDoc) => {
  // Get data from firestore
  const data = await getNotesFirestore(latestDoc);

  data.forEach((doc) => {
    // Create a new note
    const note = document.createElement("div");
    // Add class
    let image = "/images/imgjpg.jpg";
    if (doc.data().image) {
      image = doc.data().image;
    }
    note.setAttribute("data-image", image);
    note.setAttribute("data-id", doc.id);
    note.setAttribute("data-title", "Note");
    note.setAttribute("data-content", doc.data().text);
    note.setAttribute("data-content", doc.data().text);
    note.setAttribute("data-bs-toggle", "modal");
    note.setAttribute("data-bs-target", "#editNote");
    // add style
    note.innerHTML = `
        <div class="card m-1">
                <div class="card-body">
                    <div class="row">
                        <div class="col-2">
                            <img 
                            src="${image}" 
                            class="img-fluid rounded" alt="Only caché.">
                        </div>
                        <div class="col-6 text-truncate">${
                          doc.data().text
                        }</div>
                        <div class="col-4">
                          ${convertTimestamp(doc.data().created_at)}
                        </div>
                    </div>
                </div>
            </div>
            `;
    // add event listener
    note.addEventListener("click", (e) => {
      const noteToEdit = {};
      noteToEdit.id = note.getAttribute("data-id");
      noteToEdit.title = note.getAttribute("data-title");
      noteToEdit.content = note.getAttribute("data-content");
      noteToEdit.image = note.getAttribute("data-image");
      setNoteModalValues(noteToEdit);
    });
    container.appendChild(note);
  });
  // update latest doc
  lastVisible = data.docs[data.docs.length - 1];

  // unattach event listeners if no more docs
  if (data.empty) {
    window.removeEventListener("scroll", handleScroll);
    loading.innerHTML = "No more notes";
  }
};
const setNoteModalValues = (note) => {
  document.getElementById("input-edit-note").value = note.content;
  document.getElementById("editNoteLabel").value = note.title;
  document.getElementById("idNote").value = note.id;
  document.getElementById("image-preview-modal").src = note.image;
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
  if (textNote.value === "") {
    showToast("The note is empty", "bg-danger");
    return;
  }
  const result = await saveNoteFirestore(note);
  if (result === "ok") {
    showToast("The Note was saved", "bg-success");
  } else {
    showToast("Error", "bg-danger");
  }
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = "";
  localStorage.removeItem("image");
};

const updateNote = async (note) => {
  const result = await updateNoteFirestore(note);
  if (result === "ok") {
    showToast("The Note was updated", "bg-success");
    myModal.hide();
  } else {
    showToast("Error", "bg-danger");
  }
};

const deleteNote = async (id) => {
  const result = await deleteNoteFirestore(id);
  if (result === "ok") {
    showToast("The Note was deleted", "bg-success");
  } else {
    showToast("Error", "bg-danger");
  }
};
const cleanNotes = () => {
  container.innerHTML = "";
};
// Event listeners dom

document.getElementById("BtnDeleteNote").addEventListener("click", async () => {
  const id = document.getElementById("idNote").value;
  await deleteNote(id);
  cleanNotes();
  getAllNotes();
  myModal.hide();
});
document.getElementById("take-photo-button").addEventListener("click", () => {
  const textNote = document.getElementById("textNote");
  localStorage.setItem("textNote", textNote.value);
  location.href = "/pages/camera.html";
});

// note details
document.getElementById("updateNote").addEventListener("click", async () => {
  const note = {
    id: document.getElementById("idNote").value,
    text: document.getElementById("input-edit-note").value,
  };
  console.log("app:note", note);
  await updateNote(note);
  cleanNotes();
  getAllNotes();
  myModal.hide();
});

// save note
document.getElementById("btnSaveNote").addEventListener("click", async () => {
  const textNote = document.getElementById("textNote");
  const note = {
    text: textNote.value,
  };
  const base64 = localStorage.getItem("image");
  if (base64) {
    note.image = base64ToFile(base64, new Date().getTime() + ".jpg");
  }
  await saveNote(note);
  textNote.value = "";
  cleanNotes();
  await getAllNotes();
});

// load data on DOM loaded
window.addEventListener("DOMContentLoaded", () => getAllNotes());

// load more books (scroll)
const handleScroll = () => {
  if (window.scrollY >= document.body.offsetHeight - window.innerHeight) {
    getAllNotes(lastVisible);
  }
};

window.addEventListener("scroll", handleScroll);

function setPreviewImage(base64) {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = base64;
}

function checkFileNote() {
  const base64 = localStorage.getItem("image");
  if (!base64) return;
  setPreviewImage(base64);
}

function checkTextNote() {
  const text = localStorage.getItem("textNote");
  if (!text) return;
  const textNote = document.getElementById("textNote");
  textNote.value = text;
}

checkFileNote();
checkTextNote();
