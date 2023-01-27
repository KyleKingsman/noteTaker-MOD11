let titleNote;
let notesText;
let saveNBtn;
let newBtn;
let list;

if (window.location.pathname === '/notes') {
  titleNote = document.querySelector('.note-title');
  notesText = document.querySelector('.note-textarea');
  saveNBtn = document.querySelector('.save-note');
  newBtn = document.querySelector('.new-note');
  list = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNotes = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNBtn);

  if (activeNotes.id) {
    titleNote.setAttribute('readonly', true);
    titleNote.setAttribute('readonly', true);
    titleNote.value = activeNotes.title;
    titleNote.value = activeNotes.text;
  } else {
    titleNote.removeAttribute('readonly');
    titleNote.removeAttribute('readonly');
    titleNote.value = '';
    titleNote.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: titleNote.value,
    text: titleNote.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// delete btn save me pls
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNotes = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNotes = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNotes = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!titleNote.value.trim() || !titleNote.value.trim()) {
    hide(saveNBtn);
  } else {
    show(saveNBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    list.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createList = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createList(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNBtn.addEventListener('click', handleNoteSave);
  newBtn.addEventListener('click', handleNewNoteView);
  titleNote.addEventListener('keyup', handleRenderSaveBtn);
  titleNote.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
