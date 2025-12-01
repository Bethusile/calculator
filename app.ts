// app.ts

let currentInput = '';
let lastAnswer = 0;

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
    'x²': (x: number) => x ** 2
};

// Replace constants and functions with safe evaluation
function parseExpression(input: string): string {
    // Replace constants
    for (const key in constants) {
        const regex = new RegExp(key, 'g');
        input = input.replace(regex, constants[key].toString());
    }

    // Replace functions: e.g., sin(30) → Math.sin(30)
    for (const fn in functions) {
        const regex = new RegExp(`${fn}\\(([^()]+)\\)`, 'g');
        input = input.replace(regex, (_, val) => {
            const num = parseFloat(parseExpression(val));
            return functions[fn](num).toString();
        });
    }

    // Replace exponentiation x^y → **y
    input = input.replace(/\^/g, '**');

    // Only allow numbers, operators, parentheses, decimal points
    if (/[^0-9+\-*/().]/.test(input)) {
        throw new Error('Invalid characters in expression');
    }

    return input;
}

// Safely evaluate math expressions
function safeEvaluate(input: string): number {
    const parsed = parseExpression(input);
    return Function(`"use strict"; return (${parsed})`)();
}

// DOM helpers
function updateDisplay(value: string) {
    const output = document.getElementById('output')!;
    output.textContent = value;
}

function addRecentCalculation(expression: string, result: number) {
    const recentSection = document.querySelector('.recent p')!;
    recentSection.textContent = `${expression} = ${result}`;
}

// Calculator operations
function appendInput(value: string) {
    currentInput += value;
    updateDisplay(currentInput);
}

function clearInput() {
    currentInput = '';
    updateDisplay('0');
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

function computeResult() {
    try {
        lastAnswer = safeEvaluate(currentInput);
        updateDisplay(lastAnswer.toString());
        addRecentCalculation(currentInput, lastAnswer);
        currentInput = '';
    } catch {
        updateDisplay('Error');
    }
}

function useAnswer() {
    currentInput += lastAnswer.toString();
    updateDisplay(currentInput);
}

// Event listeners
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = (btn as HTMLButtonElement).textContent!;
        switch (value) {
            case 'C': clearInput(); break;
            case '⌫': deleteLast(); break;
            case '=': computeResult(); break;
            case 'ANS': useAnswer(); break;
            default: appendInput(value); break;
        }
    });
});
