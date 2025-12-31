// Select elements that use data-* attributes (added to `in.html`)
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const allClearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const previousOperandTextElement = document.querySelector('.previous-operand');
const currentOperandTextElement = document.querySelector('.current-operand');

class Calculator {
    constructor(previousTextEl, currentTextEl) {
        this.previousTextEl = previousTextEl;
        this.currentTextEl = currentTextEl;
        this.clear();
    }

    clear() {
        this.current = '0';
        this.previous = '';
        this.operation = undefined; // JS operator like + - * /
        this.operationDisplay = undefined; // human-friendly symbol like × ÷
    }

    deleteLast() {
        if (this.current === '0' || this.current === '') return;
        // remove last character
        this.current = this.current.slice(0, -1);
        // safeguard: if nothing left or only a minus sign left, reset to '0'
        if (this.current === '' || this.current === '-') this.current = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.current.includes('.')) return;
        if (this.current === '0' && number !== '.') {
            this.current = number;
        } else {
            this.current = this.current + number;
        }
    }

    toggleSign() {
        if (!this.current) return;
        if (this.current.startsWith('-')) this.current = this.current.slice(1);
        else this.current = '-' + this.current;
    }

    percent() {
        const val = parseFloat(this.current);
        if (isNaN(val)) return;
        this.current = String(val / 100);
    }

    chooseOperation(opDisplay) {
        // handle operator display -> JS operator mapping
        if (this.current === '') return;
        if (this.previous !== '') {
            this.compute();
        }
        let op;
        if (opDisplay === '×') op = '*';
        else if (opDisplay === '÷') op = '/';
        else op = opDisplay; // + or -

        this.operation = op;
        this.operationDisplay = opDisplay;
        this.previous = this.current;
        this.current = '';
    }

    compute() {
        const prev = parseFloat(this.previous);
        const curr = parseFloat(this.current);
        if (isNaN(prev) || isNaN(curr)) return;
        let computation;
        switch (this.operation) {
            case '+':
                computation = prev + curr;
                break;
            case '-':
                computation = prev - curr;
                break;
            case '*':
                computation = prev * curr;
                break;
            case '/':
                computation = curr === 0 ? 'Error' : prev / curr;
                break;
            default:
                return;
        }
        this.current = String(computation);
        this.operation = undefined;
        this.operationDisplay = undefined;
        this.previous = '';
    }

    updateDisplay() {
        this.currentTextEl.innerText = this.current;
        if (this.operationDisplay && this.previous !== '') {
            this.previousTextEl.innerText = `${this.previous} ${this.operationDisplay}`;
        } else {
            this.previousTextEl.innerText = '';
        }
    }
}

// Instantiate and wire up
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.dataset.operation;
        if (!op) return;
        if (op === '+/-') {
            calculator.toggleSign();
        } else if (op === '%') {
            calculator.percent();
        } else {
            calculator.chooseOperation(op);
        }
        calculator.updateDisplay();
    });
});

if (equalsButton) {
    equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });
}

if (allClearButton) {
    allClearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });
}

if (deleteButton) {
    deleteButton.addEventListener('click', () => {
        calculator.deleteLast();
        calculator.updateDisplay();
    });
}

// Initial render
calculator.updateDisplay();