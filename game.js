// PPL Simulator - Game Engine
// A quirky text-based Private Pilot License training simulator

// Game State
let gameState = {
    week: 1,
    phase: 'Ground School',
    stats: {
        morale: 75,
        knowledge: 30,
        safety: 80,
        money: 15000,
        flightHours: 0.0,
        progress: 0
    },
    milestones: {
        groundSchool: false,
        firstSolo: false,
        writtenTest: false,
        checkride: false
    },
    logbook: [
        { week: 1, activity: 'Ground School', hours: 0.0, cost: 0 }
    ],
    totalSpent: 0,
    gameEnded: false,
    endingType: null
};

// Aviation Events - Quirky and relatable scenarios
const aviationEvents = [
    {
        text: "Your CFI shows up in flip-flops and a Hawaiian shirt. 'Weather's perfect for flying!' he says, ignoring the 25-knot crosswind.",
        morale: -5,
        safety: -3,
        knowledge: 2
    },
    {
        text: "The tower controller sounds suspiciously like they're eating lunch while giving pattern instructions. You hear what sounds like a sandwich being unwrapped.",
        morale: 3,
        knowledge: 1,
        safety: 0
    },
    {
        text: "You discover your training aircraft was previously owned by a crop duster. The cockpit still smells faintly of pesticide and adventure.",
        morale: 5,
        safety: -2,
        knowledge: 1
    },
    {
        text: "Weather briefer says 'It'll probably be fine' when asked about the scattered thunderstorms. Probably.",
        morale: -8,
        safety: -5,
        knowledge: 3
    },
    {
        text: "Another student pilot in the pattern keeps calling 'any traffic please advise' on unicom. Your CFI mutters something unprintable.",
        morale: -3,
        knowledge: 4,
        safety: 0
    },
    {
        text: "Perfect flying weather! CAVU conditions, light winds, and your favorite aircraft is available. This is why you started flying.",
        morale: 15,
        safety: 5,
        knowledge: 2
    },
    {
        text: "Your headset dies mid-flight. You discover aviation sign language is surprisingly limited.",
        morale: -5,
        safety: -8,
        knowledge: 5
    },
    {
        text: "Ground school instructor goes on a 20-minute tangent about 'back in my day' aviation stories. Half the class falls asleep.",
        morale: -2,
        knowledge: -1,
        safety: 0
    },
    {
        text: "You nail your first crosswind landing! Your CFI actually looks impressed instead of terrified.",
        morale: 20,
        safety: 8,
        knowledge: 3
    },
    {
        text: "The aircraft you're supposed to fly is 'down for maintenance.' The mechanic is standing next to it looking very confused.",
        morale: -10,
        money: 0,
        knowledge: 1
    },
    {
        text: "Your CFI cancels last minute because their previous student 'got a little creative with the traffic pattern.' You don't ask for details.",
        morale: -7,
        money: 0,
        knowledge: 0
    },
    {
        text: "You successfully complete your first solo cross-country flight! The sense of freedom is incredible, even if you did get slightly lost.",
        morale: 25,
        safety: 5,
        knowledge: 8
    },
    {
        text: "Checkride examiner is running 2 hours late. You've memorized every procedure twice and are starting to question your life choices.",
        morale: -15,
        knowledge: 3,
        safety: 0
    },
    {
        text: "You pass your written exam with flying colors! The test prep actually paid off.",
        morale: 18,
        knowledge: 10,
        safety: 2
    },
    {
        text: "Ramp check! The friendly FAA inspector wants to see... everything. Your logbook suddenly feels very heavy.",
        morale: -20,
        safety: 5,
        knowledge: 8
    }
];

// Game phases and their requirements
const phases = {
    'Ground School': { minWeeks: 4, requirements: { knowledge: 60 } },
    'Pre-Solo': { minWeeks: 8, requirements: { knowledge: 65, flightHours: 10, safety: 70 } },
    'Solo Training': { minWeeks: 15, requirements: { flightHours: 25, safety: 75 } },
    'Cross-Country': { minWeeks: 25, requirements: { flightHours: 35, knowledge: 80 } },
    'Checkride Prep': { minWeeks: 35, requirements: { flightHours: 40, knowledge: 85, safety: 80 } }
};

// Initialize the game
function initGame() {
    updateDisplay();
    updateLogbook();
    showCurrentEvent();
}

// Take an action (Study/Fly/Rest)
function takeAction(action) {
    if (gameState.gameEnded) return;

    let eventText = '';
    let impact = { morale: 0, knowledge: 0, safety: 0, money: 0, hours: 0 };

    // Base action effects
    switch(action) {
        case 'study':
            impact.knowledge += Math.floor(Math.random() * 8) + 7;
            impact.morale += Math.floor(Math.random() * 6) - 3;
            eventText = "You hit the books hard this week. The regulations are starting to make sense... mostly.";
            break;
            
        case 'fly':
            if (gameState.stats.money >= 250) {
                impact.money = -250;
                impact.hours = Math.random() * 2 + 0.5;
                impact.knowledge += Math.floor(Math.random() * 5) + 3;
                impact.safety += Math.floor(Math.random() * 5) + 2;
                impact.morale += Math.floor(Math.random() * 10) + 5;
                eventText = `Great lesson! You logged ${impact.hours.toFixed(1)} hours and made solid progress.`;
            } else {
                eventText = "You can't afford a lesson this week. Time to hit the books or pick up extra shifts.";
                impact.morale = -8;
            }
            break;
            
        case 'rest':
            impact.morale += Math.floor(Math.random() * 12) + 8;
            impact.knowledge -= Math.floor(Math.random() * 3);
            eventText = "You take a break from aviation this week. Sometimes you need to recharge the batteries.";
            break;
    }

    // Apply random events 40% of the time
    if (Math.random() < 0.4) {
        const randomEvent = aviationEvents[Math.floor(Math.random() * aviationEvents.length)];
        eventText += "\n\n" + randomEvent.text;
        
        if (randomEvent.morale) impact.morale += randomEvent.morale;
        if (randomEvent.knowledge) impact.knowledge += randomEvent.knowledge;
        if (randomEvent.safety) impact.safety += randomEvent.safety;
        if (randomEvent.money) impact.money += randomEvent.money;
    }

    // Apply impacts
    applyImpacts(impact);
    
    // Add to logbook
    addLogbookEntry(action, impact.hours || 0, Math.abs(impact.money) || 0);
    
    // Advance week
    gameState.week++;
    
    // Update phase if conditions met
    updatePhase();
    
    // Check win/lose conditions
    checkEndConditions();
    
    // Update display
    updateDisplay();
    showWeeklyEvent(eventText, impact);
    updateLogbook();
}

// Apply stat impacts with bounds checking
function applyImpacts(impact) {
    gameState.stats.morale = Math.max(0, Math.min(100, gameState.stats.morale + impact.morale));
    gameState.stats.knowledge = Math.max(0, Math.min(100, gameState.stats.knowledge + impact.knowledge));
    gameState.stats.safety = Math.max(0, Math.min(100, gameState.stats.safety + impact.safety));
    gameState.stats.money = Math.max(0, gameState.stats.money + impact.money);
    gameState.stats.flightHours = Math.max(0, gameState.stats.flightHours + (impact.hours || 0));
    
    if (impact.money < 0) {
        gameState.totalSpent += Math.abs(impact.money);
    }
    
    // Calculate overall progress (weighted average of key stats)
    gameState.stats.progress = Math.floor(
        (gameState.stats.knowledge * 0.3 + 
         gameState.stats.flightHours * 2.5 + 
         gameState.stats.safety * 0.2) / 1.0
    );
    gameState.stats.progress = Math.min(100, gameState.stats.progress);
}

// Update current training phase based on progress
function updatePhase() {
    const stats = gameState.stats;
    const week = gameState.week;
    
    if (week >= 35 && stats.flightHours >= 40 && stats.knowledge >= 85 && stats.safety >= 80) {
        gameState.phase = 'Checkride Prep';
    } else if (week >= 25 && stats.flightHours >= 35 && stats.knowledge >= 80) {
        gameState.phase = 'Cross-Country';
    } else if (week >= 15 && stats.flightHours >= 25 && stats.safety >= 75) {
        gameState.phase = 'Solo Training';
    } else if (week >= 8 && stats.knowledge >= 65 && stats.flightHours >= 10 && stats.safety >= 70) {
        gameState.phase = 'Pre-Solo';
    } else if (week >= 4 && stats.knowledge >= 60) {
        gameState.phase = 'Pre-Solo';
    }
    
    // Update milestone achievements
    if (gameState.phase === 'Pre-Solo' && !gameState.milestones.groundSchool) {
        gameState.milestones.groundSchool = true;
        showAchievement('Ground School Complete! ✈️');
    }
    
    if (gameState.phase === 'Solo Training' && !gameState.milestones.firstSolo) {
        gameState.milestones.firstSolo = true;
        showAchievement('First Solo Flight! 🎉');
    }
}

// Check for game ending conditions
function checkEndConditions() {
    const stats = gameState.stats;
    
    // Win condition - PPL obtained
    if (stats.flightHours >= 40 && stats.knowledge >= 85 && stats.safety >= 80 && stats.progress >= 95) {
        endGame('success', `Congratulations! You've earned your Private Pilot License! 
                            Total time: ${gameState.week} weeks
                            Flight hours: ${stats.flightHours.toFixed(1)}
                            Total cost: $${gameState.totalSpent.toLocaleString()}`);
        return;
    }
    
    // Lose conditions
    if (stats.money <= 500 && stats.progress < 90) {
        endGame('broke', 'You ran out of money before completing your training. Maybe try a different approach to managing your budget.');
        return;
    }
    
    if (stats.morale <= 0) {
        endGame('burnout', 'Your motivation hit rock bottom. Flying is supposed to be fun! Take a break and come back when you\'re ready.');
        return;
    }
    
    if (stats.safety <= 30 && stats.flightHours > 15) {
        endGame('safety', 'Your CFI has grounded you due to safety concerns. Time to go back to the basics.');
        return;
    }
    
    if (gameState.week > 100) {
        endGame('timeout', 'Your training has taken too long and you\'ve lost momentum. Maybe aviation isn\'t for everyone.');
        return;
    }
}

// End the game with a specific ending
function endGame(endingType, message) {
    gameState.gameEnded = true;
    gameState.endingType = endingType;
    
    const eventCard = document.getElementById('event-card');
    eventCard.innerHTML = `
        <div class="event-header">
            <span class="event-week">GAME OVER</span>
            <span class="event-type">${getEndingIcon(endingType)} ${getEndingTitle(endingType)}</span>
        </div>
        <div class="event-content">${message}</div>
        <div class="event-stats">
            Final Stats - Weeks: ${gameState.week} | Hours: ${gameState.stats.flightHours.toFixed(1)} | 
            Spent: $${gameState.totalSpent.toLocaleString()} | Progress: ${gameState.stats.progress}%
        </div>
    `;
    
    // Disable action buttons
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
}

function getEndingIcon(type) {
    const icons = {
        success: '🎉',
        broke: '💸',
        burnout: '😵',
        safety: '⚠️',
        timeout: '⏰'
    };
    return icons[type] || '🛩️';
}

function getEndingTitle(type) {
    const titles = {
        success: 'PPL EARNED!',
        broke: 'FINANCIALLY GROUNDED',
        burnout: 'BURNED OUT',
        safety: 'SAFETY VIOLATION',
        timeout: 'TRAINING EXPIRED'
    };
    return titles[type] || 'FLIGHT TERMINATED';
}

// Show achievement popup
function showAchievement(text) {
    // Simple achievement notification - could be enhanced with animations
    const achievement = document.createElement('div');
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-green);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    achievement.textContent = text;
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.remove();
    }, 3000);
}

// Update all display elements
function updateDisplay() {
    const stats = gameState.stats;
    
    // Update header
    document.getElementById('week-counter').textContent = `Week ${gameState.week}`;
    document.getElementById('phase-indicator').textContent = gameState.phase;
    
    // Update gauge values and progress bars
    updateGauge('morale', stats.morale);
    updateGauge('knowledge', stats.knowledge);
    updateGauge('safety', stats.safety);
    updateGauge('money', stats.money, '$', true);
    updateGauge('hours', stats.flightHours, '', false, 1);
    updateGauge('progress', stats.progress);
    
    // Update action button states
    const flyBtn = document.getElementById('fly-btn');
    if (stats.money < 250) {
        flyBtn.classList.add('disabled');
        flyBtn.querySelector('.btn-description').textContent = 'Need $250';
    } else {
        flyBtn.classList.remove('disabled');
        flyBtn.querySelector('.btn-description').textContent = 'Book lesson ($250)';
    }
}

// Update individual gauge display
function updateGauge(statName, value, prefix = '', isCurrency = false, decimals = 0) {
    const valueEl = document.getElementById(`${statName}-value`);
    const barEl = document.getElementById(`${statName}-bar`);
    const gaugeEl = valueEl.closest('.gauge');
    
    // Format display value
    let displayValue;
    if (isCurrency) {
        displayValue = `$${value.toLocaleString()}`;
        const percentage = Math.min(100, (value / 15000) * 100); // Scale to starting amount
        barEl.style.width = percentage + '%';
    } else if (statName === 'hours') {
        displayValue = value.toFixed(decimals);
        const percentage = Math.min(100, (value / 40) * 100); // Scale to PPL requirement
        barEl.style.width = percentage + '%';
    } else {
        displayValue = `${value}%`;
        barEl.style.width = value + '%';
    }
    
    valueEl.textContent = displayValue;
    
    // Add status classes
    gaugeEl.classList.remove('critical', 'warning', 'good');
    if (value <= 25) gaugeEl.classList.add('critical');
    else if (value <= 50) gaugeEl.classList.add('warning');
    else gaugeEl.classList.add('good');
    
    // Animation
    gaugeEl.classList.add('stat-updated');
    setTimeout(() => gaugeEl.classList.remove('stat-updated'), 300);
}

// Show current event
function showCurrentEvent() {
    const eventText = "Welcome to flight training! You've just signed up for ground school at your local flight training center. Your instructor mentions that weather has been unpredictable lately, but you're excited to start your journey toward becoming a private pilot.";
    showWeeklyEvent(eventText, {});
}

// Display weekly event with impacts
function showWeeklyEvent(text, impact) {
    const eventCard = document.getElementById('event-card');
    const impactText = formatImpacts(impact);
    
    eventCard.innerHTML = `
        <div class="event-header">
            <span class="event-week">Week ${gameState.week}</span>
            <span class="event-type">${getPhaseIcon(gameState.phase)} ${gameState.phase}</span>
        </div>
        <div class="event-content">${text}</div>
        <div class="event-stats">${impactText}</div>
    `;
}

function getPhaseIcon(phase) {
    const icons = {
        'Ground School': '📚',
        'Pre-Solo': '🎯',
        'Solo Training': '✈️',
        'Cross-Country': '🗺️',
        'Checkride Prep': '📋'
    };
    return icons[phase] || '🛩️';
}

function formatImpacts(impact) {
    const impacts = [];
    if (impact.morale) impacts.push(`Morale ${impact.morale > 0 ? '+' : ''}${impact.morale}`);
    if (impact.knowledge) impacts.push(`Knowledge ${impact.knowledge > 0 ? '+' : ''}${impact.knowledge}`);
    if (impact.safety) impacts.push(`Safety ${impact.safety > 0 ? '+' : ''}${impact.safety}`);
    if (impact.money) impacts.push(`${impact.money > 0 ? '+' : ''}$${Math.abs(impact.money)}`);
    if (impact.hours) impacts.push(`+${impact.hours.toFixed(1)} flight hours`);
    
    return impacts.length > 0 ? `Impact: ${impacts.join(' | ')}` : '';
}

// Logbook management
function addLogbookEntry(activity, hours, cost) {
    const entry = {
        week: gameState.week,
        activity: formatActivity(activity),
        hours: hours,
        cost: cost
    };
    gameState.logbook.push(entry);
}

function formatActivity(action) {
    const activities = {
        study: 'Ground Study',
        fly: 'Flight Training',
        rest: 'Rest Day'
    };
    return activities[action] || action;
}

function updateLogbook() {
    const entriesContainer = document.getElementById('logbook-entries');
    const totalHours = document.getElementById('total-hours');
    const totalSpent = document.getElementById('total-spent');
    
    // Show last 5 entries
    const recentEntries = gameState.logbook.slice(-5);
    entriesContainer.innerHTML = recentEntries.map(entry => `
        <div class="logbook-entry">
            <span>Week ${entry.week}</span>
            <span>${entry.activity}</span>
            <span>${entry.hours.toFixed(1)}</span>
            <span>$${entry.cost}</span>
        </div>
    `).join('');
    
    totalHours.textContent = `${gameState.stats.flightHours.toFixed(1)} hrs`;
    totalSpent.textContent = `$${gameState.totalSpent.toLocaleString()}`;
}

// Save/Load functionality
function saveGame() {
    localStorage.setItem('ppl-simulator-save', JSON.stringify(gameState));
    alert('Game saved successfully!');
}

function loadGame() {
    const saved = localStorage.getItem('ppl-simulator-save');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
        updateLogbook();
        
        if (gameState.gameEnded) {
            endGame(gameState.endingType, 'Loaded saved game.');
        } else {
            showCurrentEvent();
        }
        alert('Game loaded successfully!');
    } else {
        alert('No saved game found!');
    }
}

function resetGame() {
    if (confirm('Are you sure you want to start a new game? This will delete your current progress.')) {
        gameState = {
            week: 1,
            phase: 'Ground School',
            stats: {
                morale: 75,
                knowledge: 30,
                safety: 80,
                money: 15000,
                flightHours: 0.0,
                progress: 0
            },
            milestones: {
                groundSchool: false,
                firstSolo: false,
                writtenTest: false,
                checkride: false
            },
            logbook: [
                { week: 1, activity: 'Ground School', hours: 0.0, cost: 0 }
            ],
            totalSpent: 0,
            gameEnded: false,
            endingType: null
        };
        
        // Re-enable buttons
        document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = false);
        
        initGame();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);