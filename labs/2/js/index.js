/*
ChatGPT was used as an assistance while developing this lab.
*/

import { USER_MESSAGES } from "../lang/messages/en/user.js";


document.title = USER_MESSAGES.INDEX_TITLE;

document.getElementById("page-title").textContent =
    USER_MESSAGES.INDEX_TITLE;

document.getElementById("student-name").textContent =
    USER_MESSAGES.STUDENT_NAME;

document.getElementById("writer-link").textContent =
    USER_MESSAGES.WRITER_LINK;

document.getElementById("reader-link").textContent =
    USER_MESSAGES.READER_LINK;