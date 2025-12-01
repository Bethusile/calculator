import './index.css'

let currentInput: string = '';
let lastAnswer: number = 0;

const constants: Record<string, number> = {
    'π': Math.PI,
    'e': Math.E
};

const functions: Record<string, (x: number) => number> = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'log': Math.log10,
    'ln': Math.log,
    '√': Math.sqrt,
    'x²': x => x ** 2
};

function parseExpression(input: string): string {
    // Replace constants
    for (const key in constants) {
        const regex = new RegExp(key, 'g');
        input = input.replace(regex, constants[key].toString());
    }

    // Replace functions
    for (const fn in functions) {
        const regex = new RegExp(fn + '\\(([^()]+)\\)', 'g');
        input = input.replace(regex, (_, val) => {
            const num = parseFloat(parseExpression(val));
            return functions[fn](num).toString();
        });
    }

    // Replace power operator
    input = input.replace(/\^/g, '**');

    // Validate input
    if (/[^0-9+\-*/().]/.test(input)) {
        throw new Error('Invalid characters in expression');
    }

    return input;
}

function safeEvaluate(input: string): number {
    const parsed = parseExpression(input);
    return Function('"use strict"; return (' + parsed + ')')() as number;
}

function updateDisplay(value: string): void {
    const output = document.getElementById('output');
    if (output) output.textContent = value;
}

function addRecentCalculation(expression: string, result: number): void {
    const recent = document.querySelector<HTMLParagraphElement>('.recent p');
    if (recent) recent.textContent = `${expression} = ${result}`;
}

function appendInput(value: string): void {
    currentInput += value;
    updateDisplay(currentInput);
}

function clearInput(): void {
    currentInput = '';
    updateDisplay('0');
}

function deleteLast(): void {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

function computeResult(): void {
    try {
        lastAnswer = safeEvaluate(currentInput);
        updateDisplay(lastAnswer.toString());
        addRecentCalculation(currentInput, lastAnswer);
        currentInput = '';
    } catch {
        updateDisplay('Error');
    }
}

function useAnswer(): void {
    currentInput += lastAnswer.toString();
    updateDisplay(currentInput);
}

// Event listeners for buttons
document.querySelectorAll<HTMLButtonElement>('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent || '';
        switch (value) {
            case 'C': clearInput(); break;
            case '⌫': deleteLast(); break;
            case '=': computeResult(); break;
            case 'ANS': useAnswer(); break;
            default: appendInput(value); break;
        }
    });
});
