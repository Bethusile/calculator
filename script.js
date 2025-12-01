let currentInput = '';
let lastAnswer = 0;

const constants = {
    'π': Math.PI,
    'e': Math.E
};

const functions = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'log': Math.log10,
    'ln': Math.log,
    '√': Math.sqrt,
    'x²': x => x ** 2
};

function parseExpression(input) {
    for (const key in constants) {
        const regex = new RegExp(key, 'g');
        input = input.replace(regex, constants[key].toString());
    }
    for (const fn in functions) {
        const regex = new RegExp(fn + '\\(([^()]+)\\)', 'g');
        input = input.replace(regex, (_, val) => {
            const num = parseFloat(parseExpression(val));
            return functions[fn](num).toString();
        });
    }
    input = input.replace(/\^/g, '**');
    if (/[^0-9+\-*/().]/.test(input)) {
        throw new Error('Invalid characters in expression');
    }
    return input;
}

function safeEvaluate(input) {
    const parsed = parseExpression(input);
    return Function('"use strict"; return (' + parsed + ')')();
}

function updateDisplay(value) {
    document.getElementById('output').textContent = value;
}

function addRecentCalculation(expression, result) {
    document.querySelector('.recent p').textContent = expression + ' = ' + result;
}

function appendInput(value) {
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

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;
        switch (value) {
            case 'C': clearInput(); break;
            case '⌫': deleteLast(); break;
            case '=': computeResult(); break;
            case 'ANS': useAnswer(); break;
            default: appendInput(value); break;
        }
    });
});
