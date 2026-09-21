/*
ChatGPT was used as an assistance while developing this lab.
*/

import { USER_MESSAGES } from "../lang/messages/en/user.js";


const STORAGE_KEY = "comp4537_lab2_notes";

const SAVE_INTERVAL = 2000;


/*
    Reusable Button class
*/
class AppButton {

    constructor(text, className, clickHandler) {

        this.element =
            document.createElement("button");

        this.element.type = "button";

        this.element.textContent = text;

        this.element.className = className;

        this.element.addEventListener(
            "click",
            clickHandler
        );
    }


    addTo(parent) {

        parent.appendChild(this.element);
    }
}


/*
    Represents one note on the writer page.
*/
class Note {

    constructor(id, content, removeHandler, changeHandler) {

        this.id = id;

        this.container =
            document.createElement("div");

        this.container.className =
            "note-row";


        this.textArea =
            document.createElement("textarea");

        this.textArea.className =
            "note-textarea";

        this.textArea.value =
            content;


        this.textArea.addEventListener(
            "input",
            changeHandler
        );


        this.removeButton =
            new AppButton(
                USER_MESSAGES.REMOVE_BUTTON,
                "remove-button",
                () => {
                    removeHandler(this.id);
                }
            );


        this.container.appendChild(
            this.textArea
        );

        this.removeButton.addTo(
            this.container
        );
    }


    addTo(parent) {

        parent.appendChild(
            this.container
        );
    }


    remove() {

        this.container.remove();
    }


    /*
        JSON.stringify() automatically uses this
        function when converting the Note to JSON.
    */
    toJSON() {

        return {
            id: this.id,
            content: this.textArea.value
        };
    }
}


/*
    Controls the entire Writer page.
*/
class WriterApp {

    constructor() {

        this.notes = [];

        this.hasChanges = false;

        this.notesContainer =
            document.getElementById(
                "notes-container"
            );

        this.controls =
            document.getElementById(
                "controls"
            );

        this.status =
            document.getElementById(
                "storage-status"
            );


        this.addButton =
            new AppButton(
                USER_MESSAGES.ADD_BUTTON,
                "add-button",
                () => this.addNote()
            );


        this.backButton =
            new AppButton(
                USER_MESSAGES.BACK_BUTTON,
                "back-button",
                () => {
                    window.location.href =
                        "./index.html";
                }
            );
    }


    start() {

        document.title =
            USER_MESSAGES.WRITER_TITLE;

        document.getElementById(
            "page-title"
        ).textContent =
            USER_MESSAGES.WRITER_TITLE;


        this.loadNotes();


        this.addButton.addTo(
            this.controls
        );

        this.backButton.addTo(
            this.controls
        );


        setInterval(
            () => this.saveIfNeeded(),
            SAVE_INTERVAL
        );
    }


    loadNotes() {

        const storedNotes =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (storedNotes === null) {

            return;
        }


        try {

            const noteData =
                JSON.parse(storedNotes);


            noteData.forEach(
                (storedNote) => {

                    this.createNote(
                        storedNote.id,
                        storedNote.content
                    );
                }
            );

        } catch (error) {

            this.status.textContent =
                USER_MESSAGES.STORAGE_ERROR;

            console.error(error);
        }
    }


    createNote(id, content) {

        const note =
            new Note(

                id,

                content,

                (noteId) =>
                    this.removeNote(noteId),

                () =>
                    this.markAsChanged()
            );


        this.notes.push(note);

        note.addTo(
            this.notesContainer
        );
    }


    addNote() {

        const id =
            crypto.randomUUID();


        this.createNote(
            id,
            ""
        );


        this.markAsChanged();
    }


    removeNote(id) {

        const note =
            this.notes.find(
                (currentNote) =>
                    currentNote.id === id
            );


        if (note === undefined) {

            return;
        }


        note.remove();


        this.notes =
            this.notes.filter(
                (currentNote) =>
                    currentNote.id !== id
            );


        /*
            Removal must update localStorage
            immediately.
        */
        this.saveNotes();
    }


    markAsChanged() {

        this.hasChanges = true;
    }


    saveIfNeeded() {

        if (!this.hasChanges) {

            return;
        }


        this.saveNotes();
    }


    saveNotes() {

        const notesAsJSON =
            JSON.stringify(
                this.notes
            );


        localStorage.setItem(
            STORAGE_KEY,
            notesAsJSON
        );


        this.hasChanges = false;


        const currentTime =
            new Date()
                .toLocaleTimeString();


        this.status.textContent =
            `${USER_MESSAGES.STORED_AT} ${currentTime}`;
    }
}


const writerApp =
    new WriterApp();


writerApp.start();