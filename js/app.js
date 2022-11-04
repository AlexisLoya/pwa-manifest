import {getNotesFirestore, saveNoteFirestore} from './firestore-functions.js'


const getAllNotes = async()=>{
    var notes =document.getElementById('notes')
    const querySnapshot = await getNotesFirestore()
     querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data())
        notes.innerHTML += `
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
            `
    });
}

const saveNote = async(note)=>{
    const result = await saveNoteFirestore(note)
    if(result === 'ok'){
       
        alert("Added")
    }else{
        alert("error")
    }
}



const btnSaveNote = document.getElementById('btnSaveNote')
btnSaveNote.addEventListener('click',async()=>{
    const textNote = document.getElementById('textNote')
    const note = {
        text: textNote.value
    }
    await saveNote(note)
    textNote.value = ''
    window.location.reload()
})

getAllNotes()