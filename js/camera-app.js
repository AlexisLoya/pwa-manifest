import { saveImageFirestore } from "./firestore-functions.js";

// DOM constans
const btnCamera = document.getElementById("btnCamera");
const btnTakePhoto = document.getElementById("btnTakePhoto");
const video = document.getElementById("video");
const photo = document.getElementById("photo");
// camera element
const camera = new Camera(video);

btnCamera.addEventListener("click", function () {
  camera.start();
});
btnTakePhoto.addEventListener("click", function () {
  let picture = camera.takePhoto();
  photo.setAttribute("src", picture);
  camera.stop();
  saveImage(picture);
});

const saveImage = async (image) => {
  localStorage.setItem("image", image);
  location.href = "/";
};
