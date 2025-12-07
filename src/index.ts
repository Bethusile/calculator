// index.ts
export {};

// --- INJECT HTML & CSS LINK ---
function injectCalculatorHTML(): void {
  
  // Set up the main body structure with your specified HTML
  document.body.innerHTML = `
  <div class="calculator-container wrapper" id="calculator" style="position:relative;">
    <div id="calculatorheader" style="cursor:grab;"></div>

    <div class="calculator-content">

      <div class="calculator-header">
          <button class="menu-btn">☰</button>
          <div class="title">Scientific</div>
          <div class="mode-toggles">
              <span id="rad-deg-indicator">DEG</span>
              <span id="f-e-indicator">F-E</span>
              <button class="history-btn">⟲</button>
          </div>
      </div>

      <div class="display-container">
          <div class="computation-display"></div> 
          <div class="result-display">0</div> 
      </div>

      <div class="memory-keys">
          <button class="mem-btn memory-btn" value="mc">MC</button>
          <button class="mem-btn memory-btn" value="mr">MR</button>
          <button class="mem-btn memory-btn" value="m+">M+</button>
          <button class="mem-btn memory-btn" value="m-">M-</button>
          <button class="mem-btn memory-btn" value="ms">MS</button>
          <button class="mem-btn memory-btn" value="m_r">M↓</button>
      </div>

      <div class="function-selectors button-label-bar">
          <div class="dropdown-wrapper">
              <button class="dropdown-btn trig-dropdown-btn" value="trig-toggle">
                  <span class="icon">△</span>
                  Trigonometry <span class="arrow">⌄</span>
              </button>
              <div class="dropdown-menu trig-menu hidden">
                  <button class="trig-key" value="sin(">sin</button>
                  <button class="trig-key" value="cos(">cos</button>
                  <button class="trig-key" value="tan(">tan</button>
                  <button class="trig-key" value="asin(">sin⁻¹</button>
                  <button class="trig-key" value="acos(">cos⁻¹</button>
                  <button class="trig-key" value="atan(">tan⁻¹</button>
                  <button class="trig-key" value="sec(">sec</button>
                  <button class="trig-key" value="csc(">csc</button>
                  <button class="trig-key" value="cot(">cot</button>
              </div>
          </div>

          <div class="dropdown-wrapper">
              <button class="dropdown-btn func-dropdown-btn">
                  <span class="icon">ƒ</span>
                  Function <span class="arrow">⌄</span>
              </button>
          </div>
      </div>

      <div class="keypad-grid buttons-container">
          <button class="key func-key" value="2nd">2<sup>nd</sup></button>
          <button class="key func-key" value="pi">π</button>
          <button class="key func-key" value="e">e</button>
          <button class="key func-key utility-key" value="AC">C</button>
          <button class="key utility-key" value="bksp">&#9003;</button>
          
          <button class="key func-key" value="x2">x²</button>
          <button class="key func-key" value="1/x">1/x</button>
          <button class="key func-key" value="abs">|x|</button>
          <button class="key func-key" value="exp">exp</button>
          <button class="key func-key" value="mod">%</button>
          
          <button class="key func-key" value="2sqrt"><sup>2</sup>√x</button>
          <button class="key parens-key" value="(">(</button>
          <button class="key parens-key" value=")">)</button>
          <button class="key func-key" value="n!">n!</button>
          <button class="key operator-key" value="divide">÷</button>
          
          <button class="key func-key" value="xy">x<sup>y</sup></button>
          <button class="key num-key" value="7">7</button>
          <button class="key num-key" value="8">8</button>
          <button class="key num-key" value="9">9</button>
          <button class="key operator-key" value="multiply">×</button>
          
          <button class="key func-key" value="10x">10<sup>x</sup></button>
          <button class="key num-key" value="4">4</button>
          <button class="key num-key" value="5">5</button>
          <button class="key num-key" value="6">6</button>
          <button class="key operator-key" value="minus">-</button>
          
          <button class="key func-key" value="log">log</button>
          <button class="key num-key" value="1">1</button>
          <button class="key num-key" value="2">2</button>
          <button class="key num-key" value="3">3</button>
          <button class="key operator-key" value="plus">+</button>
          
          <button class="key func-key" value="ln">ln</button>
          <button class="key func-key" value="+/-">+/-</button>
          <button class="key num-key" value="0">0</button>
          <button class="key num-key period" value=".">,</button>
          <button class="key equals-key" value="equals">=</button>
      </div>
    </div>
  </div>
  `;
}

injectCalculatorHTML();

// --- STATE MANAGEMENT ---
interface CalculatorState {
    currentDisplay: string;
    computationString: string;
    lastNumber: string | null;
    lastResult: number | null;
    shouldStartFresh: boolean;
    isSecondFunctionActive: boolean;
    isRadianMode: boolean;
    memory: number; // ADDED: Stores the memory value
}

const state: CalculatorState = {
    currentDisplay: '',
    computationString: '',
    lastNumber: null,
    lastResult: null,
    shouldStartFresh: true,
    isSecondFunctionActive: false,
    isRadianMode: false, 
    memory: 0, // INITIALIZED
};

// --- UI ELEMENTS ---
const UI = {
    result: document.querySelector('.result-display') as HTMLElement, 
    operations: document.querySelector('.computation-display') as HTMLElement, 
    buttonContainer: document.querySelector('.keypad-grid') as HTMLElement, 
    radDegIndicator: document.querySelector('#rad-deg-indicator') as HTMLElement, 
    memoryButtons: document.querySelectorAll('.memory-keys .mem-btn'),
    trigButton: document.querySelector('.trig-dropdown-btn') as HTMLElement,
    trigMenu: document.querySelector('.trig-menu') as HTMLElement,
};


// --- MATH UTILITY FUNCTIONS ---
const MathUtils = {
    degToRad: (degrees: number): number => degrees * (Math.PI / 180),
    radToDeg: (radians: number): number => (radians * (180 / Math.PI)),
    factorial: (n: number): number => {
        const num = Number(n);
        if (num < 0 || !Number.isInteger(num) || isNaN(num)) return NaN;
        if (num === 0) return 1;
        let result = 1;
        for (let i = num; i >= 1; i--) {
            result *= i;
        }
        return result;
    },
    phi: (): number => (1 + Math.sqrt(5))/2, 
    negate: (n: number): number => -1 * n,
    formatNumber: (num: number): string => {
        if (!Number.isFinite(num)) return 'Error';
        return Number.isInteger(num) ? num.toString() : Number(num.toPrecision(10)).toString();
    },
};

// --- CORE CALCULATOR FUNCTIONS ---
export class Calculator {
    static clearAll(): void {
        state.currentDisplay = '';
        state.computationString = '';
        state.lastResult = null;
        state.lastNumber = null;
        state.shouldStartFresh = true;
        updateDisplay();
    }
    
    static handleNegation(): void {
        const value = state.currentDisplay || (state.lastResult !== null ? state.lastResult.toString() : '0');
        let displayVal: string;
        let computationVal: string;

        if (value.startsWith('±') || (value.startsWith('(') && value.endsWith(')') && value.includes('±'))) {
            displayVal = value.replace('±', '').replace(/\(|\)/g, '');
        } else {
            displayVal = `±(${value})`;
        }

        if (state.computationString.startsWith('negate(') && state.computationString.endsWith(')')) {
            computationVal = state.computationString.substring(7, state.computationString.length - 1);
        } else {
            computationVal = `negate(${state.computationString || value})`;
        }

        state.currentDisplay = displayVal;
        state.computationString = computationVal;
        state.lastNumber = null;
        state.shouldStartFresh = false;
        updateDisplay();
    }
    
    static handleAbs(): void {
        const value = state.currentDisplay || (state.lastResult !== null ? state.lastResult.toString() : '0');
        state.currentDisplay = `|${value}|`;
        state.computationString = `Math.abs(${state.computationString || value})`;
        state.lastNumber = null;
        state.shouldStartFresh = false;
        updateDisplay();
    }

    static handleBackspace(): void {
        if (state.currentDisplay === 'Error') {
            Calculator.clearAll();
            return;
        }
        state.computationString = state.computationString.slice(0, -1);
        state.currentDisplay = state.currentDisplay.slice(0, -1);
        
        if (state.currentDisplay.length === 0) {
            state.shouldStartFresh = true;
        }
        updateDisplay();
    }

    static handleEquals(): void {
        try {
            if (!state.computationString && !state.currentDisplay) return;

            const missingParens = (state.computationString.match(/\(/g) || []).length - (state.computationString.match(/\)/g) || []).length;
            if (missingParens > 0) {
                state.computationString += ')'.repeat(missingParens);
                state.currentDisplay += ')'.repeat(missingParens);
            }

            const result = evaluateExpression(state.computationString);

            if (Number.isFinite(result)) {
                state.lastResult = result;
                state.currentDisplay = MathUtils.formatNumber(result);
                state.computationString = result.toString();
                state.lastNumber = result.toString();
            } else {
                handleError();
            }

            state.shouldStartFresh = true;
        } catch (error) {
            handleError();
        }
        updateDisplay();
    }

    // --- MEMORY FUNCTIONS IMPLEMENTATION ---
    
    // Clear Memory: MC
    static handleMemoryClear(): void { 
        state.memory = 0;
        console.log("Memory Cleared (M=0)");
    }

    // Recall Memory: MR
    static handleMemoryRecall(): void { 
        const memValue = MathUtils.formatNumber(state.memory);
        state.currentDisplay = memValue;
        state.computationString = memValue;
        state.shouldStartFresh = true;
        updateDisplay();
        console.log(`Memory Recalled: ${state.memory}`);
    }

    // Memory Add: M+
    static handleMemoryAdd(): void { 
        const currentValue = parseFloat(state.currentDisplay || state.lastResult?.toString() || '0');
        if (Number.isFinite(currentValue)) {
            state.memory += currentValue;
            state.shouldStartFresh = true;
            updateDisplay();
            console.log(`M+ added ${currentValue}. New Memory: ${state.memory}`);
        } else {
            console.error("Cannot add non-finite number to memory.");
        }
    }

    // Memory Subtract: M-
    static handleMemorySubtract(): void { 
        const currentValue = parseFloat(state.currentDisplay || state.lastResult?.toString() || '0');
        if (Number.isFinite(currentValue)) {
            state.memory -= currentValue;
            state.shouldStartFresh = true;
            updateDisplay();
            console.log(`M- subtracted ${currentValue}. New Memory: ${state.memory}`);
        } else {
            console.error("Cannot subtract non-finite number from memory.");
        }
    }

    // Memory Store: MS
    static handleMemoryStore(): void { 
        const currentValue = parseFloat(state.currentDisplay || state.lastResult?.toString() || '0');
        if (Number.isFinite(currentValue)) {
            state.memory = currentValue;
            state.shouldStartFresh = true;
            updateDisplay();
            console.log(`Memory Stored: ${state.memory}`);
        } else {
            console.error("Cannot store non-finite number in memory.");
        }
    }

    // Memory Clear All (Placeholder for M˽, usually MR/MC list view)
    static handleMemoryClearAll(): void { 
        // Typically used to show/manage memory list, but we'll use it as a console log placeholder for now
        console.log(`Memory list feature placeholder. Current Memory: ${state.memory}`);
    }
}


// --- DISPLAY & ERROR HANDLING ---
function updateDisplay(): void {
    if (UI.operations) {
        UI.operations.textContent = state.computationString || ''; 
    }
    if (UI.result) {
        if (state.lastResult !== null && state.shouldStartFresh) {
            UI.result.textContent = MathUtils.formatNumber(state.lastResult);
        } else {
            UI.result.textContent = state.currentDisplay || '0';
        }
    }
    
    if (UI.radDegIndicator) {
        UI.radDegIndicator.textContent = state.isRadianMode ? 'RAD' : 'DEG'; 
    }
}

function handleError(): void {
    state.currentDisplay = 'Error';
    state.computationString = '';
    state.lastResult = null;
    state.lastNumber = null;
    updateDisplay();
}

// --- EXPRESSION EVALUATION (Secure RPN Logic) ---
type Tok = { type: 'num'; v: number } | { type: 'id'; v: string } | { type: 'op'; v: string } | { type: 'paren'; v: '(' | ')' };

const precedence: Record<string, number> = {
    'u-': 4, 
    '**': 3, 
    '*': 2, '/': 2, '%': 2,
    '+': 1, '-': 1,
};
const rightAssoc = (op: string) => op === '**';
const output: (Tok | { type: 'func'; v: string })[] = [];
const stack: (Tok | { type: 'func'; v: string })[] = [];


function evaluateExpression(expr: string): number {
    const constants: Record<string, number> = { E: Math.E, PI: Math.PI };

    const fns: Record<string, (x: number) => number> = {
        sqrt: Math.sqrt, cbrt: Math.cbrt, exp: Math.exp, log: Math.log, log10: Math.log10, log2: Math.log2, abs: Math.abs, 
        
        // --- TRIG FUNCTIONS ---
        sin: (x: number) => state.isRadianMode ? Math.sin(x) : Math.sin(MathUtils.degToRad(x)),
        cos: (x: number) => state.isRadianMode ? Math.cos(x) : Math.cos(MathUtils.degToRad(x)),
        tan: (x: number) => state.isRadianMode ? Math.tan(x) : Math.tan(MathUtils.degToRad(x)),
        asin: (x: number) => state.isRadianMode ? Math.asin(x) : MathUtils.radToDeg(Math.asin(x)),
        acos: (x: number) => state.isRadianMode ? Math.acos(x) : MathUtils.radToDeg(Math.acos(x)),
        atan: (x: number) => state.isRadianMode ? Math.atan(x) : MathUtils.radToDeg(Math.atan(x)),
        sec: (x: number) => 1 / fns.cos(x),
        csc: (x: number) => 1 / fns.sin(x),
        cot: (x: number) => 1 / fns.tan(x),

        factorial: MathUtils.factorial, negate: MathUtils.negate, phi: MathUtils.phi,
    };

    try {
        output.length = 0;
        stack.length = 0;
        
        // Normalize safe function calls and constants
        const src = expr
            .replace(/Math\.(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|cbrt|log|log10|log2|exp|abs)\(/g, '$1(')
            .replace(/Math\.PI/g, 'PI')
            .replace(/Math\.E/g, 'E')
            .trim();

        // --- Tokenizer ---
        const toks: Tok[] = [];
        const isDigit = (c: string) => /[0-9]/.test(c);
        const isAlpha = (c: string) => /[A-Za-z_]/.test(c);
        let i = 0;
        while (i < src.length) {
            const c = src[i];
            if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }

            if (isDigit(c) || (c === '.' && isDigit(src[i+1] || ''))) {
                let j = i + 1;
                while (j < src.length && (isDigit(src[j]) || src[j] === '.')) j++;
                const num = Number(src.slice(i, j));
                if (!Number.isFinite(num)) return NaN;
                toks.push({ type: 'num', v: num });
                i = j; continue;
            }

            if (isAlpha(c)) {
                let j = i + 1;
                while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
                const id = src.slice(i, j);
                if (!fns.hasOwnProperty(id) && !constants.hasOwnProperty(id) && id !== 'Rand' && id !== 'Ans' && id !== 'M') return NaN; // Added 'M' exclusion
                toks.push({ type: 'id', v: id });
                i = j; continue;
            }

            if (c === '(' || c === ')') { toks.push({ type: 'paren', v: c }); i++; continue; }

            if (c === '*' && src[i+1] === '*') { toks.push({ type: 'op', v: '**' }); i += 2; continue; }

            if ('+-*/%'.includes(c)) {
                const prev = toks[toks.length - 1];
                const isUnaryMinus = (c === '-') && (
                    !prev || (prev.type === 'op') || (prev.type === 'paren' && prev.v === '(')
                );
                if (isUnaryMinus) {
                    toks.push({ type: 'op', v: 'u-' });
                } else {
                    toks.push({ type: 'op', v: c });
                }
                i++; continue;
            }
            return NaN; 
        }
        
        // --- Shunting-Yard ---
        for (let k = 0; k < toks.length; k++) {
            const t = toks[k];
            if (t.type === 'num') { output.push(t); continue; }
            if (t.type === 'id') {
                const next = toks[k+1];
                if (next && next.type === 'paren' && next.v === '(') {
                    stack.push({ type: 'func', v: t.v });
                } else {
                    // Handle 'M' recall here
                    if (t.v === 'M') {
                        output.push({ type: 'num', v: state.memory });
                    } else {
                        output.push(t);
                    }
                }
                continue;
            }
            if (t.type === 'op') {
                while (stack.length) {
                    const top = stack[stack.length - 1];
                    if ('type' in top && (top as any).type === 'func') {
                        output.push(stack.pop() as any);
                        continue;
                    }
                    const topTok = top as Tok;
                    if (topTok.type === 'op') {
                        const o1 = t.v, o2 = topTok.v;
                        if ((rightAssoc(o1) && precedence[o1] < precedence[o2]) || (!rightAssoc(o1) && precedence[o1] <= precedence[o2])) {
                            output.push(stack.pop() as Tok);
                            continue;
                        }
                    }
                    break;
                }
                stack.push(t);
                continue;
            }
            if (t.type === 'paren' && t.v === '(') { stack.push(t); continue; }
            if (t.type === 'paren' && t.v === ')') {
                let foundLeft = false;
                while (stack.length) {
                    const s = stack.pop() as any;
                    if (s.type === 'paren' && s.v === '(') { foundLeft = true; break; }
                    output.push(s);
                }
                if (!foundLeft) return NaN;
                if (stack.length && (stack[stack.length - 1] as any).type === 'func') {
                    output.push(stack.pop() as any);
                }
                continue;
            }
        }
        while (stack.length) {
            const s = stack.pop() as any;
            if (s.type === 'paren') return NaN;
            output.push(s);
        }

        // --- Evaluate RPN ---
        const st: number[] = [];
        for (const t of output) {
            if ((t as any).type === 'func') {
                const fn = (t as any).v as string;
                if (!(fn in fns)) return NaN;
                const a = st.pop();
                if (a === undefined) return NaN;
                const res = fns[fn](a);
                if (!Number.isFinite(res)) return NaN;
                st.push(res);
                continue;
            }
            if (t.type === 'num') { st.push(t.v); continue; }
            if (t.type === 'id') {
                if (t.v in constants) { st.push(constants[t.v]); continue; }
                if (t.v === 'Rand') { st.push(Math.random()); continue; } 
                if (t.v === 'Ans' && state.lastResult !== null) { st.push(state.lastResult); continue; }
                return NaN;
            }
            if (t.type === 'op') {
                if (t.v === 'u-') {
                    const x = st.pop();
                    if (x === undefined) return NaN;
                    const res = -x;
                    if (!Number.isFinite(res)) return NaN;
                    st.push(res);
                    continue;
                }
                const b = st.pop();
                const a = st.pop();
                if (a === undefined || b === undefined) return NaN;
                let res: number;
                switch (t.v) {
                    case '+': res = a + b; break;
                    case '-': res = a - b; break;
                    case '*': res = a * b; break;
                    case '/': res = b === 0 ? NaN : a / b; break;
                    case '%': res = a % b; break;
                    case '**': res = a ** b; break;
                    default: return NaN;
                }
                if (!Number.isFinite(res)) return NaN;
                st.push(res);
                continue;
            }
            return NaN;
        }
        return st.length === 1 ? st[0] : NaN;
    } catch (error) {
        return NaN;
    }
}

// --- DROPDOWN LOGIC ---


// --- BUTTON CREATION AND EVENT HANDLING ---

function toggleSecondFunction(): void {
  state.isSecondFunctionActive = !state.isSecondFunctionActive;
  const secondFnButton = document.querySelector('.key.func-key[value="2nd"]');
  secondFnButton?.classList.toggle('active', state.isSecondFunctionActive);
}

function enableDragAndDrop(element: HTMLElement): void {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById(element.id + 'header') || element;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    (header as HTMLElement).onmousedown = startDragging;

    function startDragging(e: MouseEvent): void {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = drag;
        if ((header as HTMLElement).style.cursor === 'grab') (header as HTMLElement).style.cursor = 'grabbing';
    }

    function drag(e: MouseEvent): void {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + 'px';
        element.style.left = (element.offsetLeft - pos1) + 'px';
    }

    function stopDragging(): void {
        document.onmouseup = null;
        document.onmousemove = null;
        if ((header as HTMLElement).style.cursor === 'grabbing') (header as HTMLElement).style.cursor = 'grab';
    }
}

export default function initializeCalculator(): void {
    if (!UI.buttonContainer) {
        console.error("Button container not found. Calculator cannot initialize.");
        return;
    }

    // --- Main button grid listener ---
    UI.buttonContainer.addEventListener('click', (event: Event) => {
        const target = (event.target as HTMLElement).closest('button');
        if (!target) return;
        handleButtonEvent(target);
    });

    // --- Memory buttons listener ---
    UI.memoryButtons.forEach(button => {
        button.addEventListener('click', (event: Event) => {
            const btn = (event.target as HTMLElement).closest('button');
            if (!btn) return;
            handleButtonEvent(btn);
        });
    });

    // --- Trig dropdown button (toggle menu) ---
    if (UI.trigButton) {
        UI.trigButton.addEventListener('click', (event: Event) => {
            event.stopPropagation();
            UI.trigMenu?.classList.toggle('hidden');
        });
    }

    // --- Trig menu keys ---
if (UI.trigMenu) {
    UI.trigMenu.addEventListener('click', (event: Event) => {
        const button = (event.target as HTMLElement).closest('.trig-key');
        if (button instanceof HTMLElement) {  // ✅ type guard
            handleButtonEvent(button);
            UI.trigMenu.classList.add('hidden'); // close menu after selection
        }
    });
}


    // --- RAD/DEG toggle ---
    if (UI.radDegIndicator) {
        UI.radDegIndicator.addEventListener('click', () => {
            state.isRadianMode = !state.isRadianMode;
            updateDisplay();
        });
    }

    // --- Global click to close dropdowns ---
    document.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (UI.trigMenu && !UI.trigMenu.contains(target) && target !== UI.trigButton) {
            UI.trigMenu.classList.add('hidden');
        }
    });

    // --- Drag and drop ---
    const wrapper = document.querySelector('#calculator') as HTMLElement;
    if (wrapper) enableDragAndDrop(wrapper);

    // --- Initial display update ---
    updateDisplay();
}



// Helper function to extract button details from the static HTML
function getButtonDetails(button: HTMLElement): { value: string, press: string, display: string, type: string } {
    const buttonValue = button.getAttribute('value') || button.textContent;
    const buttonType = button.classList.contains('num-key') ? 'number' :
                       button.classList.contains('operator-key') ? 'operator' :
                       button.classList.contains('func-key') ? 'function' :
                       button.classList.contains('parens-key') ? 'paren' :
                       button.classList.contains('mem-btn') ? 'memory' : // Added memory type
                       'unknown';

    let pressValue = buttonValue || '';
    let displayValue = button.textContent;

    // Map the button value/text to the computation value
    switch (buttonValue) {
        case '2nd': 
        case '+/-': pressValue = 'negate('; break; 
        case 'pi': pressValue = 'PI'; displayValue = 'π'; break; // Use PI ID
        case 'e': pressValue = 'E'; displayValue = 'e'; break; // Use E ID
        case 'x2': pressValue = '**2'; break;
        case '1/x': pressValue = '**(-1)'; break;
        case 'abs': pressValue = 'Math.abs('; break;
        case 'exp': pressValue = 'exp('; break;
        case 'mod': pressValue = '%'; break;
        case '2sqrt': pressValue = 'sqrt('; break;
        case 'n!': pressValue = 'factorial('; break;
        case 'divide': pressValue = '/'; break;
        case 'xy': pressValue = '**'; break;
        case 'multiply': pressValue = '*'; break;
        case '10x': pressValue = '10**'; break;
        case 'minus': pressValue = '-'; break;
        case 'log': pressValue = 'log10('; break; 
        case 'plus': pressValue = '+'; break;
        case 'ln': pressValue = 'log('; break; 
        case ',': 
        case '.': pressValue = '.'; break;
        case 'equals': pressValue = '='; break;
        case 'AC': pressValue = 'clear'; break;
        case 'bksp': pressValue = 'backspace'; break;
        case 'mr': pressValue = 'M'; displayValue = 'M'; break; // Recall M
    }

    return { 
        value: buttonValue!, 
        press: pressValue!, 
        display: displayValue!, 
        type: buttonType 
    };
}


function handleButtonEvent(target: HTMLElement): void {
    // --- Check if the clicked button is one of the new trig keys ---
    if (target.matches('.trig-key')) {
        const buttonDetail = {
            value: target.textContent!,
            press: target.getAttribute('value')!, // e.g., 'sin('
            display: target.textContent!,
            type: 'function'
        };
        handleButtonClick(buttonDetail, target);
        // Close menu after selection
        if (UI.trigMenu) UI.trigMenu.classList.add('hidden'); 
        return; 
    }
    
    // Get details from the static calculator key (main grid or memory bar)
    const buttonDetail = getButtonDetails(target);
    if (!buttonDetail) return;

    handleButtonClick(buttonDetail, target);
}

function handleButtonClick(buttonDetail: { value: string, press: string, display: string, type: string }, button: HTMLElement): void {
  
    // --- SPECIAL FUNCTION HANDLING ---
    if (buttonDetail.value === '2nd') { toggleSecondFunction(); return; }
    if (buttonDetail.value === 'AC') { Calculator.clearAll(); return; }
    if (buttonDetail.value === 'bksp') { Calculator.handleBackspace(); return; }
    if (buttonDetail.value === 'equals' || buttonDetail.value === '=') { Calculator.handleEquals(); return; }
    if (buttonDetail.value === '+/-') { Calculator.handleNegation(); return; }
    if (buttonDetail.value === 'abs') { Calculator.handleAbs(); return; }
    
    // --- MEMORY HANDLERS ---
    if (buttonDetail.type === 'memory') {
        if (buttonDetail.value === 'mc') Calculator.handleMemoryClear();
        else if (buttonDetail.value === 'mr') Calculator.handleMemoryRecall();
        else if (buttonDetail.value === 'm+') Calculator.handleMemoryAdd();
        else if (buttonDetail.value === 'm-') Calculator.handleMemorySubtract();
        else if (buttonDetail.value === 'ms') Calculator.handleMemoryStore();
        else if (buttonDetail.value === 'm_r') Calculator.handleMemoryClearAll();
        return; 
    }

    // --- REGULAR INPUT HANDLING ---
    const isNewInput = buttonDetail.type === 'number' || buttonDetail.value === '.' || buttonDetail.type === 'paren' || buttonDetail.value === 'pi' || buttonDetail.value === 'e';

    if (state.shouldStartFresh && state.lastResult !== null) {
        if (isNewInput) {
            state.currentDisplay = '';
            state.computationString = '';
        } else if (buttonDetail.type === 'operator' || buttonDetail.type === 'function') {
            state.currentDisplay = MathUtils.formatNumber(state.lastResult);
            state.computationString = state.lastResult.toString();
        }
        state.shouldStartFresh = false;
    } else if (isNewInput) {
        state.shouldStartFresh = false;
    }

    handleRegularButton(buttonDetail);
}

function handleRegularButton(buttonDetail: { value: string, press: string, display: string, type: string }): void {
    const pressValue = buttonDetail.press;
    const displayValue = buttonDetail.display;

    if (!pressValue) return;

    // --- Logic for implicit multiplication ---
    const isFunctionOrParen = (buttonDetail.type === 'function' && pressValue.endsWith('(')) ||
        (buttonDetail.type === 'paren' && buttonDetail.value === '(');
    
    const prevChar = state.computationString.slice(-1);
    
    // If the input is a function/open paren and preceded by a number or close paren, assume multiplication
    if (isFunctionOrParen) {
        if (prevChar && /[0-9)]/.test(prevChar)) {
            state.computationString += '*';
            state.currentDisplay += '*'; // Also display multiplication symbol
        }
    } 
    // If the input is a number, PI, or E and preceded by a close paren or a constant/variable (like M)
    else if (buttonDetail.type === 'number' || buttonDetail.value === 'pi' || buttonDetail.value === 'e' || buttonDetail.value === 'mr') {
        if (prevChar && /[)]/.test(prevChar)) {
            state.computationString += '*';
            state.currentDisplay += '*'; // Also display multiplication symbol
        }
    }

    // --- Update state and display ---
    const calculationPressValue = (buttonDetail.value === ',') ? '.' : pressValue;
    
    state.currentDisplay += displayValue;
    state.computationString += calculationPressValue;
    updateDisplay();
}

initializeCalculator();