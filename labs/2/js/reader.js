/*
ChatGPT was used for guidance and explanation while developing this lab.
I reviewed and understand the submitted code.
*/

import { USER_MESSAGES } from "../lang/messages/en/user.js";


const STORAGE_KEY =
    "comp4537_lab2_notes";

const RETRIEVE_INTERVAL =
    2000;


/*
    Reusable Button class.
*/
class AppButton {

    constructor(text, className, clickHandler) {

        this.element =
            document.createElement("button");

        this.element.type =
            "button";

        this.element.textContent =
            text;

        this.element.className =
            className;

        this.element.addEventListener(
            "click",
            clickHandler
        );
    }


    addTo(parent) {

        parent.appendChild(
            this.element
        );
    }
}


/*
    Represents a note displayed
    on the Reader page.
*/
class ReaderNote {

    constructor(content) {

        this.element =
            document.createElement("div");

        this.element.className =
            "reader-note";

        this.element.textContent =
            content;
    }


    addTo(parent) {

        parent.appendChild(
            this.element
        );
    }
}


class ReaderApp {

    constructor() {

        this.notesContainer =
            document.getElementById(
                "notes-container"
            );

        this.status =
            document.getElementById(
                "retrieve-status"
            );

        this.controls =
            document.getElementById(
                "controls"
            );


        this.previousJSON = null;


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
            USER_MESSAGES.READER_TITLE;

        document.getElementById(
            "page-title"
        ).textContent =
            USER_MESSAGES.READER_TITLE;


        this.backButton.addTo(
            this.controls
        );


        this.retrieveNotes();


        setInterval(
            () => this.retrieveNotes(),
            RETRIEVE_INTERVAL
        );
    }


    retrieveNotes() {

        const storedNotes =
            localStorage.getItem(
                STORAGE_KEY
            );


        /*
            Only redraw the notes if
            their contents have changed.
        */
        if (storedNotes !== this.previousJSON) {

            this.displayNotes(
                storedNotes
            );

            this.previousJSON =
                storedNotes;
        }


        const currentTime =
            new Date()
                .toLocaleTimeString();


        this.status.textContent =
            `${USER_MESSAGES.RETRIEVED_AT} ${currentTime}`;
    }


    displayNotes(storedNotes) {

        this.notesContainer.innerHTML =
            "";


        if (storedNotes === null) {

            this.showNoNotesMessage();

            return;
        }


        try {

            const noteData =
                JSON.parse(storedNotes);


            if (noteData.length === 0) {

                this.showNoNotesMessage();

                return;
            }


            noteData.forEach(
                (note) => {

                    const readerNote =
                        new ReaderNote(
                            note.content
                        );

                    readerNote.addTo(
                        this.notesContainer
                    );
                }
            );

        } catch (error) {

            this.notesContainer.textContent =
                USER_MESSAGES.STORAGE_ERROR;

            console.error(error);
        }
    }


    showNoNotesMessage() {

        const message =
            document.createElement("p");

        message.textContent =
            USER_MESSAGES.NO_NOTES;

        this.notesContainer.appendChild(
            message
        );
    }
}


const readerApp =
    new ReaderApp();


readerApp.start();