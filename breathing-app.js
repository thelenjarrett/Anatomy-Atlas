// Global variables
let circle, text, timer, startBtn, stopBtn;
let inhaleInput, hold1Input, hold2Input, exhaleInput;
let intervalId;
let currentState = 'ready';
let timeLeft = 0;
let breathingHistory = [];

// TODO
// write the body of this function
function createProgressIndicator() {
    /* 1. Remove any existing progress indicator by:
          - using document.querySelector to find element with class 'progress-indicator'
          - if it exists, call remove() method on it
       2. Create a new progress container div element using document.createElement
       3. Set the className of the container to 'progress-indicator'
       4. Set the cssText style with position absolute, top 10px, right 10px, background rgba(255,255,255,0.1), padding 10px, border-radius 8px, and min-width 150px
       5. Create a progress title h4 element and set its textContent to 'Session Progress'
       6. Set the title's cssText style with margin 0 0 8px 0, color white, and font-size 14px
       7. Create a cycle counter div element with className 'cycle-counter'
       8. Set its textContent to show current cycles count using template literal `Cycles: ${breathingHistory.length}`
       9. Set the cycle counter's cssText style with color white, font-size 12px, and margin-bottom 5px
       10. Create a current phase div element with className 'current-phase'
       11. Set its textContent to show current phase using template literal `Phase: ${currentState.toUpperCase()}`
       12. Set the current phase's cssText style with color white and font-size 12px
       13. Append the title, cycle counter, and current phase to the progress container using appendChild
       14. Append the progress container to document.body using appendChild
    */
    const existingIndicator = document.querySelector('.progress-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-indicator';
    progressContainer.style.cssText = `
    position: absolute;
    top: 10p;
    right: 10px;
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    min-width: 150px;
    `;
    const progressTitle = document.createElement('h4');
    progressTitle.textContent = 'Session Progress';
    progressTitle.style.cssText = `
    margin: 0 0 8px 0;
    color: white;
    font-size: 14px;
    `;
    const cycleCounter = document.createElement('div');
    cycleCounter.className = 'cylce-counter';
    cycleCounter.textContent = `Cycles: ${breathingHistory.length}`;
    cycleCounter.style.cssText = `
    color: white;
    font-size: 12px;
    margin-bottom: 5px;
    `;
    const currentPhase = document.createElement('div');
    currentPhase.className = 'current-phase';
    currentPhase.textContent = `Phase: ${currentState.toUpperCase()}`;
    currentPhase.style.cssText = `
    color: white;
    font-size: 12px;
    `;
    progressContainer.appendChild(progressTitle);
    progressContainer.appendChild(cycleCounter);
    progressContainer.appendChild(currentPhase);
    document.body.appendChild(progressContainer);
}

// TODO
// write the body of this function
function updateProgressIndicator() {
    /* 1. Get the cycle counter element using document.querySelector with class 'cycle-counter'
       2. Get the current phase element using document.querySelector with class 'current-phase'
       3. If cycle counter exists, update its textContent to show current cycles count using template literal `Cycles: ${breathingHistory.length}`
       4. If current phase exists, update its textContent to show current phase using template literal `Phase: ${currentState.toUpperCase()}`
    */
    const cycleCounter = document.querySelector('.cycle-counter');
    const currentPhase = document.querySelector('.current-phase');
    if (cycleCounter) {
        cycleCounter.textContent = `Cycles: ${breathingHistory.length}`
    }
    if (currentPhase) {
        currentPhase.textContent = `Phase: ${currentState.toUpperCase()}`
    }
}

// TODO
// write the body of this function
function updateDisplay() {
    /* 1. Remove previous animations by calling classList.remove on circle with 'breathe-in' and 'breathe-out' classes
       2. Use an if-else if chain to handle different states:
          - If currentState is 'inhale': set text.textContent to 'INHALE' and add 'breathe-in' class to circle
          - Else if currentState is 'hold1': set text.textContent to 'HOLD'
          - Else if currentState is 'exhale': set text.textContent to 'EXHALE' and add 'breathe-out' class to circle
          - Else if currentState is 'hold2': set text.textContent to 'HOLD'
       3. Update the timer display by setting timer.textContent to the timeLeft value
       4. Call updateProgressIndicator() to refresh the progress display
    */
    circle.classList.remove('breathe-in', 'breathe-out');
    if (currentState === 'inhale') {
        text.textContent = "INHALE";
        circle.classList.add('breathe-in');
    } else if (currentState === 'hold1') {
        text.textContent = "HOLD";
    }else if (currentState === 'exhale') {
        text.textContent = "EXHALE";
        circle.classList.add('breathe-out');
    } else if (currentState === 'hold2') {
        text.textContent = "HOLD";
    }
    timer.textContent = timeLeft;
    updateProgressIndicator();
}

function startBreathing() {
    if (intervalId) clearInterval(intervalId);
    
    // Get times from inputs
    const inhaleTime = parseInt(inhaleInput.value, 10);
    const hold1Time = parseInt(hold1Input.value, 10);
    const exhaleTime = parseInt(exhaleInput.value, 10);
    const hold2Time = parseInt(hold2Input.value, 10);
    
    // Validate inputs
    if (inhaleTime < 1 || hold1Time < 0 || exhaleTime < 1 || hold2Time < 0) {
        alert('Please enter valid times (inhale & exhale > 0, holds >= 0)');
        return;
    }
    
    // Create progress indicator
    createProgressIndicator();
    
    currentState = 'inhale';
    timeLeft = inhaleTime;
    updateDisplay();
    
    intervalId = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            if (currentState === 'inhale') {
                currentState = 'hold1';
                timeLeft = hold1Time;
                if (timeLeft <= 0) {
                    currentState = 'exhale';
                    timeLeft = exhaleTime;
                }
            } else if (currentState === 'hold1') {
                currentState = 'exhale';
                timeLeft = exhaleTime;
            } else if (currentState === 'exhale') {
                currentState = 'hold2';
                timeLeft = hold2Time;
                if (timeLeft <= 0) {
                    currentState = 'inhale';
                    timeLeft = inhaleTime;
                    // Track completed breathing cycle
                    breathingHistory.push(new Date().toLocaleTimeString());
                }
            } else if (currentState === 'hold2') {
                currentState = 'inhale';
                timeLeft = inhaleTime;
                // Track completed breathing cycle
                breathingHistory.push(new Date().toLocaleTimeString());
            }
        }
        
        updateDisplay();
    }, 1000);
}

// TODO
// write the body of this function
function stopBreathing() {
   /* 1. Clear the interval by calling clearInterval with intervalId as parameter
      2. Set intervalId to null to reset it
      3. Set currentState to 'ready' to reset the breathing state
      4. Remove both 'breathe-in' and 'breathe-out' classes from circle using classList.remove
      5. Set text.textContent to 'READY' to show ready state
      6. Set timer.textContent to empty string to clear the timer display
      7. Remove the progress indicator by:
         - using document.querySelector to find element with class 'progress-indicator'
         - if it exists, call remove() method on it
      8. Reset the breathing history by setting breathingHistory to an empty array []
   */
   clearInterval(intervalId);
   intervalId = null;
   currentState = 'ready';
   circle.classList.remove('breathe-in');
   circle.classList.remove('breathe-out');
   text.textContent = 'READY';
   timer.textContent = '';
   const progressIndicator = document.querySelector('.progress-indicator')
   if (progressIndicator) {
    progressIndicator.remove();
   }
   breathingHistory = []
}

function initializeApp() {
    // Get DOM elements
    circle = document.querySelector('.circle');
    text = document.querySelector('.text');
    timer = document.querySelector('.timer');
    startBtn = document.getElementById('start-btn');
    stopBtn = document.getElementById('stop-btn');
    inhaleInput = document.getElementById('inhale-time');
    hold1Input = document.getElementById('hold1-time');
    hold2Input = document.getElementById('hold2-time');
    exhaleInput = document.getElementById('exhale-time');
    
    // Add event listeners
    startBtn.addEventListener('click', startBreathing);
    stopBtn.addEventListener('click', stopBreathing);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);