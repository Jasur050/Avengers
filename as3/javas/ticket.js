"use strict";

// Observer to run multiple functions at the same time //

class Observer {
    constructor() {
        this.storage = [];
    }

    subscribe(fn) {
        this.storage.push(fn);
    }

    unsubscribe(fn) {
        this.storage.filter(item => item !== fn);
    }

    broadcast(...data) {
        this.storage.forEach(item => item(...data));
    }
}

// Hall class is responsible for creating row nodes and handling click event on it //

class Hall {
    constructor(element) {
        this.space = element;
        this.set = []; // Array of rows of all seats
    }

    fill(rowLength, setLength) {
        for (let i = 0; i < setLength; i++) {
            const row = [];

            for (let j = 0; j < rowLength; j++) {
                row[j] = new Seat();
            }

            this.set[i] = row;
        }
    }

    createNodes() {
        this.set.forEach(createRow.bind(this));

        function createRow(row, index) {
            const rowElement = document.createElement('div');
            rowElement.className = 'seats__row';
            rowElement.dataset.index = index;

            row.forEach((seat, index) => {
                seat.createNode(index, Number(rowElement.dataset.index));
                rowElement.appendChild(seat.element);
            });

            this.space.appendChild(rowElement);
        }

        this.space.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick({target, currentTarget}) {
        while (target !== currentTarget) {
            if (target.classList.contains('seats__item')) {
                const rowIndex = target.parentNode.dataset.index;
                const seatIndex = target.dataset.index;
                const currentHash = String(rowIndex + seatIndex);
                const currentSeat = this.set[rowIndex][seatIndex];

                currentSeat.toggleSelection();
                updateObserver.broadcast(currentHash, currentSeat);
            }

            target = target.parentNode;
        }
    }
}

// Seat class creates the seat nodes  //

class Seat {
    constructor() {
        this.element = null;
        this.numberElement = null;
        this.number = null;
        this.row = null;
        this.availible = true;
    }

    createNode(index, row) {
        this.element = document.createElement('div');
        this.numberElement = document.createElement('span');

        this.element.className = 'seats__item';
        this.numberElement.className = 'seats__item-num';

        this.number = index + 1;
        this.row = row + 1;

        this.element.dataset.index = index;
        this.numberElement.textContent = this.number;
        this.element.appendChild(this.numberElement);
    }

    toggleSelection() {
        this.element.classList.toggle('seats__item_selected');
        this.availible = !this.availible;
    }
}

// Counter updates the total price //

class Counter {
    constructor(element) {
        this.element = element;
        this.storage = new Map();
        this.total = 0;
        this.price = 18;
        this.currency = '$';
    }

    add(key, value) {
        this.storage.set(key, value);
        this.total += this.price;
    }

    remove(key) {
        this.storage.delete(key);
        this.total -= this.price;
    }

    has(key) {
        return this.storage.has(key);
    }

    toggleSum(hash, seat) {
        this.has(hash) ? this.remove(hash) : this.add(hash, seat);
    }

    updateSum() {
        const amount = this.storage.size;
        const word = amount > 1 ? 'tickets' : 'ticket';
        const sentence = `${amount} ${word} for ${this.total}${this.currency}`;

        this.element.textContent = amount > 0 ? sentence : '';
    }

    isEmpty() {
        return this.storage.size === 0;
    }
}

class Button {
    constructor(element) {
        this.element = element;
        this.timer = null;
        this.ticketBooked = false;
        this.element.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick() {
        if (!this.element.disabled && !this.ticketBooked) {
            this.element.disabled = true;
            this.ticketBooked = true;
            this.startTimer();
        }
    }

    startTimer() {
        let timeLeft = 15 * 60; // 15 minutes in seconds

        const countdownElement = document.createElement('p');
        countdownElement.className = 'countdown';
        countdownElement.textContent = 'Your ticket was booked for 15 minutes.';
        document.body.appendChild(countdownElement);

        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            countdownElement.textContent = `Your ticket was booked for ${minutes} minutes ${seconds} seconds.`;

            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                countdownElement.textContent = 'Ticket booking time has expired.';
                this.ticketBooked = false;
                this.element.disabled = false;
            }
        }, 1000);
    }
}

const updateObserver = new Observer();
const counter = new Counter(document.querySelector('.info-box__price'));
const cinema = new Hall(document.querySelector('.seats'));
const button = new Button(document.querySelector('.button'));

cinema.fill(14, 9);
cinema.createNodes();

updateObserver.subscribe(counter.toggleSum.bind(counter));
updateObserver.subscribe(counter.updateSum.bind(counter));
updateObserver.subscribe(button.toggle.bind(button));
