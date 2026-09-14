/*
 * ChatGPT was used as an assistant while developing this lab.
 */

import { USER_MESSAGES } from "../lang/messages/en/user.js";

class GameButton {

    constructor(order, clickHandler) {
        this.order = order;

        this.element = document.createElement("button");

        this.element.type = "button";
        this.element.className = "memory-button";
        this.element.textContent = String(this.order);

        this.element.style.backgroundColor = this.createRandomColor();

        this.element.disabled = true;

        this.element.addEventListener("click", () => {
            clickHandler(this);
        });
    }


    createRandomColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        return `rgb(${red}, ${green}, ${blue})`;
    }


    addTo(parentElement) {
        parentElement.appendChild(this.element);
    }


    hideNumber() {
        this.element.textContent = "";
    }


    revealNumber() {
        this.element.textContent = String(this.order);
    }


    setClickable(isClickable) {
        this.element.disabled = !isClickable;
    }


    moveTo(x, y) {
        this.element.style.position = "fixed";
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }


    getWidth() {
        return this.element.offsetWidth;
    }


    getHeight() {
        return this.element.offsetHeight;
    }
}



class GameUI {

    constructor() {
        this.root = document.getElementById("app");

        this.input = null;
        this.goButton = null;
        this.message = null;
        this.gameArea = null;

        this.buildInterface();
    }


    buildInterface() {
        document.title = USER_MESSAGES.PAGE_TITLE;

        const controls = document.createElement("div");
        controls.className = "controls";

        const label = document.createElement("label");
        label.htmlFor = "button-count";
        label.textContent = USER_MESSAGES.QUESTION;

        this.input = document.createElement("input");

        this.input.id = "button-count";
        this.input.type = "number";
        this.input.min = "3";
        this.input.max = "7";
        this.input.step = "1";

        this.goButton = document.createElement("button");

        this.goButton.type = "button";
        this.goButton.textContent = USER_MESSAGES.GO_BUTTON;

        this.message = document.createElement("p");
        this.message.className = "message";

        this.gameArea = document.createElement("div");
        this.gameArea.className = "game-area";

        controls.appendChild(label);
        controls.appendChild(this.input);
        controls.appendChild(this.goButton);

        this.root.appendChild(controls);
        this.root.appendChild(this.message);
        this.root.appendChild(this.gameArea);
    }


    getButtonCount() {
        return Number(this.input.value);
    }


    setGoHandler(handler) {
        this.goButton.addEventListener("click", handler);
    }


    showMessage(message) {
        this.message.textContent = message;
    }


    clearMessage() {
        this.message.textContent = "";
    }


    clearButtons() {
        this.gameArea.replaceChildren();
    }
}



class MemoryGame {

    constructor() {
        this.ui = new GameUI();

        this.buttons = [];

        this.expectedOrder = 1;

        this.minimumButtons = 3;
        this.maximumButtons = 7;

        this.scrambleInterval = 2000;

        this.gameId = 0;
    }


    start() {
        this.ui.setGoHandler(() => {
            this.startNewGame();
        });
    }


    async startNewGame() {

        this.gameId++;

        const currentGameId = this.gameId;

        this.resetGame();

        const numberOfButtons = this.ui.getButtonCount();

        if (!this.isValidInput(numberOfButtons)) {
            this.ui.showMessage(USER_MESSAGES.INVALID_NUMBER);
            return;
        }

        this.createButtons(numberOfButtons);

        await this.sleep(numberOfButtons * 1000);

        if (!this.isCurrentGame(currentGameId)) {
            return;
        }

        for (let scrambleNumber = 0;
             scrambleNumber < numberOfButtons;
             scrambleNumber++) {

            this.scrambleButtons();

            if (scrambleNumber < numberOfButtons - 1) {
                await this.sleep(this.scrambleInterval);

                if (!this.isCurrentGame(currentGameId)) {
                    return;
                }
            }
        }

        this.prepareForGuessing();
    }


    resetGame() {
        this.buttons = [];

        this.expectedOrder = 1;

        this.ui.clearMessage();
        this.ui.clearButtons();
    }


    isValidInput(numberOfButtons) {
        return Number.isInteger(numberOfButtons)
            && numberOfButtons >= this.minimumButtons
            && numberOfButtons <= this.maximumButtons;
    }


    createButtons(numberOfButtons) {

        for (let order = 1; order <= numberOfButtons; order++) {

            const gameButton = new GameButton(
                order,
                (clickedButton) => {
                    this.handleButtonClick(clickedButton);
                }
            );

            gameButton.addTo(this.ui.gameArea);

            this.buttons.push(gameButton);
        }
    }


    scrambleButtons() {

        const browserWidth = window.innerWidth;
        const browserHeight = window.innerHeight;

        this.buttons.forEach((gameButton) => {

            const maximumX =
                Math.max(0, browserWidth - gameButton.getWidth());

            const maximumY =
                Math.max(0, browserHeight - gameButton.getHeight());

            const randomX =
                Math.floor(Math.random() * (maximumX + 1));

            const randomY =
                Math.floor(Math.random() * (maximumY + 1));

            gameButton.moveTo(randomX, randomY);
        });
    }


    prepareForGuessing() {

        this.buttons.forEach((gameButton) => {
            gameButton.hideNumber();
            gameButton.setClickable(true);
        });
    }


    handleButtonClick(clickedButton) {

        if (clickedButton.order === this.expectedOrder) {

            clickedButton.revealNumber();
            clickedButton.setClickable(false);

            this.expectedOrder++;

            if (this.expectedOrder > this.buttons.length) {
                this.ui.showMessage(
                    USER_MESSAGES.EXCELLENT_MEMORY
                );

                this.disableAllButtons();
            }

            return;
        }

        this.ui.showMessage(USER_MESSAGES.WRONG_ORDER);

        this.revealAllButtons();

        this.disableAllButtons();
    }


    revealAllButtons() {

        this.buttons.forEach((gameButton) => {
            gameButton.revealNumber();
        });
    }


    disableAllButtons() {

        this.buttons.forEach((gameButton) => {
            gameButton.setClickable(false);
        });
    }


    sleep(milliseconds) {

        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }


    isCurrentGame(gameId) {
        return gameId === this.gameId;
    }
}



new MemoryGame().start();