// PPL Simulator - Compact Game Engine with Dynamic Events

// Debug mode - set to true to force events every action
let DEBUG_EVENTS = false; // Toggle this for testing

// Event chains - reuse from events.js if it exists
if (typeof eventChains === 'undefined') {
    var eventChains = {};
}

// Game State
let gameState = {
    day: 1,
    phase: 'Ground School',
    
    // Core stats
    stats: {
        morale: 70 + Math.floor(Math.random() * 11), // 70-80 uniform random
        knowledge: 0,  // Complete beginner
        safety: 0,  // No safety knowledge yet
        money: 17000 + Math.floor(Math.random() * 3001), // 17000-20000 uniform random
        flightHours: 0.0,
        xcHours: 0.0,  // Cross-country hours (need 5+ for PPL)
        nightHours: 0.0,  // Night hours (need 3 for PPL)
        fatigue: 5 + Math.floor(Math.random() * 11) // 5-15 uniform random
    },
    
    // Milestones
    milestones: {
        // Knowledge track
        groundSchool: false,
        writtenPrep: false,
        writtenEndorsement: false,
        writtenPassed: false,
        writtenExpiryDay: null,  // Day when written expires (day + 730)
        
        // Flight track
        preSoloWrittenPassed: false,
        soloEndorsement: false,
        firstSolo: false,
        crossCountry: false,
        checkrideEndorsement: false,
        checkridePassed: false
    },
    
    // Event tracking
    currentEvent: null,
    eventHistory: [],
    eventOccurrences: {},  // Track how many times each event has occurred
    decisionHistory: {},   // Store persistent effects from event choices
    lastEventDay: 0,
    lastAction: null,  // Track the last action performed
    
    // Reputation system
    reputation: {
        cfi: 0,
        atc: 0,
        fbo: 0,
        peers: 0,
        safety: 0
    },
    
    // Daily drain tracking
    lastDrainDay: 0,
    
    // Game state
    gameEnded: false,
    endingType: null
};

// Weather system
const weatherPatterns = ['clear', 'clear', 'marginal', 'clear', 'ifr', 'clear', 'storms'];

function getCurrentWeather() {
    const weatherIndex = (gameState.day - 1) % weatherPatterns.length;
    const weatherType = weatherPatterns[weatherIndex];
    return weatherTypes[weatherType];
}

// Handle high fatigue dual flight event (CFI intervenes)
function handleHighFatigueDualEvent() {
    const eventText = document.getElementById('event-text');
    const actionButtons = document.getElementById('action-buttons');
    
    const events = [
        {
            text: "Your CFI takes one look at you: 'When's the last time you slept? We're not flying. Let's review IMSAFE instead.'",
            options: [
                { text: "Review IMSAFE", impact: { knowledge: 5, safety: 10 }, outcome: "You review: Illness, Medication, Stress, Alcohol, Fatigue, Emotion. The 'F' feels particularly relevant." },
                { text: "Insist you're fine", impact: { morale: -15, safety: -10 }, outcome: "Your CFI is firm: 'I'm the PIC and I say no. Find another instructor if you can't respect safety.'" },
                { text: "Go rest instead", action: 'rest' }
            ]
        },
        {
            text: "During preflight, you miss the pitot cover. Your CFI stops you: 'You're exhausted. This isn't safe.'",
            options: [
                { text: "Admit exhaustion", impact: { safety: 15, morale: 5 }, outcome: "Your CFI appreciates your honesty. 'Good ADM. Let's do ground school instead.'" },
                { text: "Try to continue", impact: { safety: -15, morale: -10 }, outcome: "Your CFI grounds you. 'This is exactly how accidents happen. We're done for today.'" }
            ]
        },
        {
            text: "You forget to check mags during run-up. Your CFI shuts down: 'STOP. Classic fatigue symptoms. You're not flying.'",
            options: [
                { text: "Accept decision", impact: { safety: 12, knowledge: 8 }, outcome: "You review emergency procedures instead. Valuable but humbling." },
                { text: "Argue it's minor", impact: { morale: -20, safety: -8 }, outcome: "'If you think mag checks are minor, we have bigger problems.'" }
            ]
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    eventText.textContent = event.text;
    
    actionButtons.innerHTML = '';
    event.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = option.text.includes('Insist') || option.text.includes('Argue') ? 'action-btn-compact danger' : 'action-btn-compact';
        btn.innerHTML = `<span class="btn-text">${option.text}</span>`;
        btn.onclick = () => {
            if (option.action === 'rest') {
                performAction('rest');
            } else {
                for (const [stat, value] of Object.entries(option.impact)) {
                    gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + value));
                }
                updateDisplay();
                document.getElementById('event-text').textContent = option.outcome;
                showContinueButton();
            }
        };
        actionButtons.appendChild(btn);
    });
}

// Handle high fatigue solo flight event (close calls)
function handleHighFatigueSoloEvent() {
    const eventText = document.getElementById('event-text');
    const actionButtons = document.getElementById('action-buttons');
    
    const events = [
        {
            text: "Tower: 'Confirm you're number two following the Cherokee?' You don't remember any Cherokee...",
            options: [
                { text: "Request clarification", impact: { safety: -5, knowledge: 5 }, outcome: "You finally spot traffic you completely missed. Wake-up call." },
                { text: "Extend downwind", impact: { safety: 10, fatigue: 2 }, outcome: "Smart move to buy time when confused." },
                { text: "Continue approach", impact: { safety: -20, morale: -15 }, outcome: "Near miss! Cherokee pilot reports you. Possible deviation." }
            ]
        },
        {
            text: "Too high on final! Exhaustion has destroyed your sight picture. The runway looks tiny.",
            options: [
                { text: "Go around", impact: { safety: 15, money: -30, fatigue: 3 }, outcome: "Good decision. Second approach better." },
                { text: "Slip aggressively", impact: { safety: -10, knowledge: 3 }, outcome: "You bounce twice. Almost a prop strike!" },
                { text: "Dive for runway", impact: { safety: -25, morale: -20 }, outcome: "Terrifying porpoise! Nearly lost control." }
            ]
        },
        {
            text: "Your radio calls are slurred: 'Uhh... tower... Cessna... um...' Can't form thoughts.",
            options: [
                { text: "Land immediately", impact: { safety: 20, morale: -5 }, outcome: "You get priority. Not proud but safe." },
                { text: "Leave pattern", impact: { safety: 15, money: -40 }, outcome: "Exit to practice area, collect yourself. Good ADM." },
                { text: "Try to continue", impact: { safety: -30, morale: -25 }, outcome: "Tower declares emergency FOR you! Certificate at risk." }
            ]
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    eventText.textContent = event.text;
    
    actionButtons.innerHTML = '';
    event.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = option.text.includes('Continue') || option.text.includes('Dive') ? 'action-btn-compact danger' : 'action-btn-compact';
        btn.innerHTML = `<span class="btn-text">${option.text}</span>`;
        btn.onclick = () => {
            for (const [stat, value] of Object.entries(option.impact)) {
                if (stat === 'money') {
                    gameState.stats[stat] = Math.max(0, gameState.stats[stat] + value);
                } else {
                    gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + value));
                }
            }
            updateDisplay();
            document.getElementById('event-text').textContent = option.outcome;
            showContinueButton();
        };
        actionButtons.appendChild(btn);
    });
}

// Unified event selection that combines all event sources
function selectRandomEventUnified(gameState) {
    // Combine all event sources
    let allEvents = [];
    let eventSources = {};
    
    // From original events.js
    if (typeof dynamicEvents !== 'undefined') {
        const originalEvents = [
            ...(dynamicEvents.financial || []),
            ...(dynamicEvents.social || []),
            ...(dynamicEvents.world || []),
            ...(dynamicEvents.training || []),
            ...(dynamicEvents.safety || []),
            ...(dynamicEvents.life || [])
        ];
        allEvents = allEvents.concat(originalEvents);
        eventSources['original events.js'] = originalEvents.length;
    }
    
    // From events_expanded.js
    if (typeof dynamicEvents !== 'undefined' && dynamicEvents.ultraRare) {
        const expandedEvents = [
            ...(dynamicEvents.ultraRare || []),
            ...(dynamicEvents.legendary || []),
            ...(dynamicEvents.absurd || []),
            ...(dynamicEvents.equipment || []),
            ...(dynamicEvents.weather || []),
            ...(dynamicEvents.financialExpanded || []),
            ...(dynamicEvents.socialExpanded || []),
            ...(dynamicEvents.trainingExpanded || []),
            ...(dynamicEvents.lifeExpanded || []),
            ...(dynamicEvents.safetyExpanded || []),
            ...(dynamicEvents.chainConsequences || [])
        ];
        allEvents = allEvents.concat(expandedEvents);
        eventSources['events_expanded.js'] = expandedEvents.length;
    }
    
    // From events_training_expanded.js
    if (typeof expandedTrainingEvents !== 'undefined') {
        const trainingEvents = [
            ...(expandedTrainingEvents.earlyTraining || []),
            ...(expandedTrainingEvents.preSolo || []),
            ...(expandedTrainingEvents.soloPeriod || []),
            ...(expandedTrainingEvents.crossCountry || []),
            ...(expandedTrainingEvents.checkridePr || []),
            ...(expandedTrainingEvents.instructorEvents || []),
            ...(expandedTrainingEvents.equipmentEvents || []),
            ...(expandedTrainingEvents.breakthroughEvents || []),
            ...(expandedTrainingEvents.emergencyTraining || []),
            ...(expandedTrainingEvents.socialEvents || []),
            ...(expandedTrainingEvents.weatherScheduling || [])
        ];
        allEvents = allEvents.concat(trainingEvents);
        eventSources['events_training_expanded.js'] = trainingEvents.length;
    }
    
    // From events_enhanced_chains.js
    if (typeof enhancedChainEvents !== 'undefined') {
        const chainEvents = [
            ...(enhancedChainEvents.weatherChains || []),
            ...(enhancedChainEvents.cfiEvents || []),
            ...(enhancedChainEvents.neighboringChaos || []),
            ...(enhancedChainEvents.radioMishaps || []),
            ...(enhancedChainEvents.soloCrossCountry || []),
            ...(enhancedChainEvents.airportLife || []),
            ...(enhancedChainEvents.chainConsequences || []),
            ...(enhancedChainEvents.communityEvents || []),
            ...(enhancedChainEvents.natureEncounters || [])
        ];
        allEvents = allEvents.concat(chainEvents);
        eventSources['events_enhanced_chains.js'] = chainEvents.length;
    }
    
    // From events_morale_challenges.js
    if (typeof moraleChallengeEvents !== 'undefined') {
        const moraleEvents = [
            ...(moraleChallengeEvents.trainingStruggles || []),
            ...(moraleChallengeEvents.weatherFrustrations || []),
            ...(moraleChallengeEvents.socialPressures || []),
            ...(moraleChallengeEvents.medicalConcerns || []),
            ...(moraleChallengeEvents.trainingEnvironment || [])
        ];
        allEvents = allEvents.concat(moraleEvents);
        eventSources['events_morale_challenges.js'] = moraleEvents.length;
    }
    
    // Filter valid events
    const validEvents = allEvents.filter(event => {
        // Check condition
        if (event.condition && !event.condition(gameState)) {
            return false;
        }
        
        // Check frequency
        if (event.frequency === 'once') {
            const occurrences = gameState.eventOccurrences || {};
            if (occurrences[event.id] > 0) {
                return false;
            }
        }
        
        // Check recent history (no repeat within 5 days)
        if (gameState.eventHistory && gameState.eventHistory.some(h => 
            h.eventId === event.id && gameState.day - h.day < 5)) {
            return false;
        }
        
        return true;
    });
    
    if (DEBUG_EVENTS) {
        console.log('=== Event Loading Debug ===');
        console.log('Event sources:', eventSources);
        console.log(`Total events loaded: ${allEvents.length}`);
        console.log(`Valid events for current state: ${validEvents.length}`);
        if (allEvents.length === 0) {
            console.error('NO EVENTS LOADED! Check that event files are included before game_compact.js');
        }
        if (validEvents.length < 20) {
            console.log('Valid event IDs:', validEvents.map(e => e.id || e.text.substring(0, 30)));
        }
        console.log('=========================');
    }
    
    if (validEvents.length === 0) return null;
    
    // Weight-based selection
    const totalWeight = validEvents.reduce((sum, event) => sum + (event.probability || 0.1), 0);
    let random = Math.random() * totalWeight;
    
    for (const event of validEvents) {
        random -= (event.probability || 0.1);
        if (random <= 0) {
            return event;
        }
    }
    
    return validEvents[0];
}

// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    // Check if there's an ended game to show stats from
    const endedGame = localStorage.getItem('ppl_simulator_compact_ended');
    if (endedGame) {
        // Show option to view previous game stats, but don't resume it
        console.log('Previous game ended - starting fresh');
    }
    
    // Always start fresh to prevent refresh exploits
    // No loading of in-progress games
    
    // Game state is already initialized at the top of the file
    // Just ensure lastDrainDay is set
    gameState.lastDrainDay = gameState.day - 1;
    
    updateDisplay();
    checkForEvents();
}

// Save game state (only when game ends)
function saveGame() {
    // Only save if game has ended
    if (gameState.gameEnded) {
        const saveData = {
            ...gameState,
            eventChains: eventChains
        };
        localStorage.setItem('ppl_simulator_compact_ended', JSON.stringify(saveData));
    }
    // Clear any in-progress game to prevent refresh exploits
    localStorage.removeItem('ppl_simulator_compact');
}

// Update dual-path progress display
function updateProgressPaths() {
    // Knowledge path updates
    const groundStep = document.getElementById('ks-ground');
    const prepStep = document.getElementById('ks-written-prep');
    const endorseStep = document.getElementById('ks-endorsement');
    const writtenStep = document.getElementById('ks-written');
    
    if (groundStep) {
        if (gameState.milestones.groundSchool) {
            groundStep.className = 'progress-step completed';
            groundStep.querySelector('.step-icon').textContent = '✓';
        } else if (gameState.stats.knowledge >= 40) {
            groundStep.className = 'progress-step active';
            groundStep.querySelector('.step-icon').textContent = '📚';
        }
    }
    
    if (prepStep && gameState.milestones.groundSchool) {
        if (gameState.stats.knowledge >= 80) {
            prepStep.className = 'progress-step completed';
            prepStep.querySelector('.step-icon').textContent = '✓';
        } else if (gameState.stats.knowledge >= 60) {
            prepStep.className = 'progress-step active';
            prepStep.querySelector('.step-icon').textContent = '📝';
        }
    }
    
    // Flight path updates
    const preSoloStep = document.getElementById('fs-presolo');
    const soloStep = document.getElementById('fs-solo');
    const xcStep = document.getElementById('fs-xc');
    const checkrideStep = document.getElementById('fs-checkride');
    
    if (preSoloStep) {
        const hoursPercent = Math.min(100, (gameState.stats.flightHours / 18) * 100);
        const safetyPercent = Math.min(100, (gameState.stats.safety / 85) * 100);
        
        if (gameState.milestones.firstSolo) {
            preSoloStep.className = 'progress-step completed';
            preSoloStep.querySelector('.step-icon').textContent = '✓';
        } else {
            preSoloStep.className = 'progress-step active';
            const reqText = preSoloStep.querySelector('.step-req');
            if (reqText) {
                // Display current values vs requirements
                const safetyValue = Math.min(100, Math.round(gameState.stats.safety));
                reqText.textContent = `${gameState.stats.flightHours.toFixed(1)}/18h ${safetyValue}%/85%`;
                if (gameState.stats.flightHours >= 18 && gameState.stats.safety >= 85) {
                    reqText.style.color = '#00cc66';
                } else if (gameState.stats.flightHours >= 15 || gameState.stats.safety >= 75) {
                    reqText.style.color = '#FFA500';
                } else {
                    reqText.style.color = 'rgba(255, 255, 255, 0.5)';
                }
            }
        }
    }
    
    if (soloStep && gameState.milestones.firstSolo) {
        soloStep.className = 'progress-step completed';
        soloStep.querySelector('.step-icon').textContent = '✓';
    }
    
    if (xcStep && gameState.phase === 'Cross-Country') {
        xcStep.className = gameState.milestones.crossCountry ? 'progress-step completed' : 'progress-step active';
        xcStep.querySelector('.step-icon').textContent = gameState.milestones.crossCountry ? '✓' : '🗺️';
    }
    
    // Update PPL badge
    const pplBadge = document.getElementById('ppl-achievement');
    if (pplBadge && gameState.milestones.writtenPassed && gameState.milestones.checkridePassed) {
        pplBadge.className = 'ppl-badge';
    }
}

// Update all UI elements
function updateDisplay() {
    updateProgressPaths();  // Update dual-path progress
    // Update weather header
    const weather = getCurrentWeather();
    const weatherHeader = document.getElementById('weather-header');
    const weatherStatus = document.getElementById('weather-status');
    const dayCounter = document.getElementById('day-counter');
    
    weatherHeader.className = 'weather-header weather-' + (weatherPatterns[(gameState.day - 1) % weatherPatterns.length]);
    // Set appropriate weather message based on conditions
    let weatherMessage = weather.name;
    if (weather.name === 'Clear skies') {
        weatherMessage += ' - Perfect for flying!';
    } else if (weather.name === 'Marginal VFR') {
        weatherMessage += ' - Too risky for students';
    } else if (weather.name === 'IFR conditions') {
        weatherMessage += ' - No VFR flying';
    } else if (weather.name === 'Thunderstorms') {
        weatherMessage += ' - Dangerous conditions';
    }
    weatherStatus.textContent = weatherMessage;
    dayCounter.textContent = `Day ${gameState.day}`;
    
    // Update mini gauges
    updateMiniGauge('morale', gameState.stats.morale);
    updateMiniGauge('knowledge', gameState.stats.knowledge);
    updateMiniGauge('safety', gameState.stats.safety);
    updateMiniGauge('hours', gameState.stats.flightHours, 50); // Max 50 hours
    updateMiniGauge('money', gameState.stats.money, 20000); // Max $20k
    updateMiniGauge('fatigue', gameState.stats.fatigue);
    
    // Calculate and update progress
    const progress = calculateProgress();
    updateMiniGauge('progress', progress);
    
    // Milestones now updated via updateProgressPaths()
    
    // Daily stat drain is now handled in advanceDay() only
    
    // Auto-save removed to prevent refresh exploits
}

// Get gauge status based on stat type and value
function getGaugeStatus(stat, value, max = 100) {
    // Calculate percentage for non-standard max values
    const percentage = (value / max) * 100;
    
    // Special handling for different stat types
    switch(stat) {
        case 'fatigue':
            // Fatigue is inverted - lower is better
            if (value <= 30) return 'good';
            else if (value <= 60) return 'warning';
            else return 'critical';
            
        case 'money':
            // Money thresholds based on actual values
            if (value >= 5000) return 'good';
            else if (value >= 1000) return 'warning';
            else return 'critical';
            
        case 'hours':
            // Flight hours based on PPL requirements
            if (percentage >= 70) return 'good';  // 35+ hours out of 50
            else if (percentage >= 40) return 'warning';  // 20+ hours
            else return 'critical';
            
        case 'morale':
        case 'knowledge':
        case 'safety':
        default:
            // Standard stats use 70/40 thresholds
            if (percentage >= 70) return 'good';
            else if (percentage >= 40) return 'warning';
            else return 'critical';
    }
}

function updateMiniGauge(stat, value, max = 100) {
    const needle = document.getElementById(`${stat}-mini-needle`);
    const fill = document.getElementById(`${stat}-fill`);
    const valueEl = document.getElementById(`${stat}-value`);
    const gauge = document.getElementById(`${stat}-gauge`);
    
    if (!needle || !valueEl) return;
    
    // Calculate percentage
    const percentage = Math.min(100, (value / max) * 100);
    
    // Get status for color coding
    const status = getGaugeStatus(stat, value, max);
    
    // Update needle rotation (-90 to 270 degrees for full circle)
    // -90 degrees = 0%, 270 degrees = 100%
    const rotation = -90 + (percentage / 100) * 360;
    needle.setAttribute('transform', `rotate(${rotation} 20 20)`);
    
    // Update fill circle with status color (match 240° sweep of needle)
    if (fill) {
        const circumference = 113; // 2 * PI * 18
        // Only fill 240° worth (2/3 of circle) to match needle sweep
        const fillAmount = (percentage / 100) * (circumference * 240/360);
        const offset = circumference - fillAmount;
        fill.setAttribute('stroke-dashoffset', offset);
        
        // Apply color based on status
        if (status === 'good') {
            fill.setAttribute('stroke', '#00cc66');
            needle.setAttribute('stroke', '#00cc66');
        } else if (status === 'warning') {
            fill.setAttribute('stroke', '#ff6600');
            needle.setAttribute('stroke', '#ff6600');
        } else {
            fill.setAttribute('stroke', '#ff4444');
            needle.setAttribute('stroke', '#ff4444');
        }
    }
    
    // Update value display
    if (stat === 'money') {
        valueEl.textContent = value >= 1000 ? `${Math.floor(value/1000)}K` : `$${value}`;
    } else if (stat === 'hours') {
        valueEl.textContent = value.toFixed(1);
    } else {
        valueEl.textContent = Math.round(value);
    }
    
    // Update value text color based on status
    if (status === 'good') {
        valueEl.style.color = '#00cc66';
    } else if (status === 'warning') {
        valueEl.style.color = '#ff6600';
    } else {
        valueEl.style.color = '#ff4444';
    }
    
    // Add status classes for additional styling
    gauge.classList.remove('critical', 'warning', 'good');
    gauge.classList.add(status);
    
    // Legacy class handling for backward compatibility
    if (stat === 'morale' || stat === 'knowledge' || stat === 'safety') {
        // Already handled by status classes
    } else if (stat === 'money') {
        if (value < 1000) gauge.classList.add('critical');
        else if (value < 5000) gauge.classList.add('warning');
        else gauge.classList.add('good');
    } else if (stat === 'fatigue') {
        if (value > 70) gauge.classList.add('critical');
        else if (value > 40) gauge.classList.add('warning');
        else gauge.classList.add('good');
    }
}

function updateMilestones() {
    const milestones = {
        'ms-ground': gameState.stats.knowledge >= 60,
        'ms-presolo': gameState.stats.flightHours >= 15 && gameState.stats.safety >= 70,
        'ms-solo': gameState.milestones.firstSolo,
        'ms-xc': gameState.stats.flightHours >= 35,
        'ms-check': gameState.milestones.checkride
    };
    
    // Update gameState milestones based on current progress
    if (milestones['ms-ground'] && !gameState.milestones.groundSchool) {
        gameState.milestones.groundSchool = true;
    }
    
    for (const [id, completed] of Object.entries(milestones)) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('active', 'completed');
            if (completed) {
                element.classList.add('completed');
            } else if (id === getCurrentMilestone()) {
                element.classList.add('active');
            }
        }
    }
}

function getCurrentMilestone() {
    if (!gameState.milestones.groundSchool && gameState.stats.knowledge < 60) return 'ms-ground';
    if (!gameState.milestones.firstSolo && gameState.stats.flightHours < 15) return 'ms-presolo';
    if (!gameState.milestones.firstSolo) return 'ms-solo';
    if (gameState.stats.flightHours < 35) return 'ms-xc';
    return 'ms-check';
}

// Calculate overall training progress
function calculateProgress() {
    const weights = {
        knowledge: 0.25,
        safety: 0.25,
        flightHours: 0.35, // Most important for PPL
        milestones: 0.15
    };
    
    // Normalize flight hours (40 hours = 100%)
    const hoursProgress = Math.min(100, (gameState.stats.flightHours / 40) * 100);
    
    // Count completed milestones
    const milestoneCount = Object.values(gameState.milestones).filter(Boolean).length;
    const milestonesProgress = (milestoneCount / 5) * 100;
    
    const totalProgress = 
        (gameState.stats.knowledge * weights.knowledge) +
        (gameState.stats.safety * weights.safety) +
        (hoursProgress * weights.flightHours) +
        (milestonesProgress * weights.milestones);
    
    return Math.round(totalProgress);
}

// Apply daily stat degradation (only once per day)
function applyDailyDrain() {
    // Only apply if we haven't already applied it today
    if (gameState.day > gameState.lastDrainDay && gameState.day > 1) {
        gameState.stats.knowledge = Math.max(0, gameState.stats.knowledge - 0.3);
        gameState.stats.morale = Math.max(0, gameState.stats.morale - 0.5);
        gameState.stats.safety = Math.max(0, gameState.stats.safety - 0.2);
        gameState.stats.fatigue = Math.min(100, gameState.stats.fatigue + 1.5);
        gameState.lastDrainDay = gameState.day;
    }
}

// Check for random events
function checkForEvents() {
    // Don't trigger events on day 1 or if one just happened
    if (gameState.day === 1 || gameState.lastEventDay === gameState.day) {
        showDefaultActions();
        return;
    }
    
    // Check for chain events first
    for (const chainId in eventChains) {
        const chainEvent = checkChainEvents(gameState, chainId);
        if (chainEvent) {
            displayEvent(chainEvent, chainId);
            return;
        }
    }
    
    // Event trigger rate - 60% normally, 100% in debug mode
    // With 200+ events, we need higher trigger rate for variety
    const eventChance = DEBUG_EVENTS ? 1.0 : 0.60;
    if (Math.random() < eventChance) {
        const event = selectRandomEventUnified(gameState);
        if (event) {
            displayEvent(event);
            return;
        }
    }
    
    // No event, show default actions
    showDefaultActions();
}

// Display an event
function displayEvent(event, chainId = null) {
    gameState.currentEvent = { event, chainId };
    gameState.lastEventDay = gameState.day;
    
    const eventText = document.getElementById('event-text');
    const actionButtons = document.getElementById('action-buttons');
    
    eventText.textContent = event.text;
    
    // Generate event buttons
    actionButtons.innerHTML = '';
    
    // If event has no buttons (informational only), add continue button
    if (!event.buttons || event.buttons.length === 0) {
        const btnEl = document.createElement('button');
        btnEl.className = 'action-btn-compact';
        btnEl.innerHTML = `<span class="btn-text">Continue</span>`;
        btnEl.onclick = () => continueGame();
        actionButtons.appendChild(btnEl);
    } else {
        // Add choice buttons
        event.buttons.forEach((button, index) => {
            const btnEl = document.createElement('button');
            btnEl.className = 'action-btn-compact event-choice';
            
            // Handle cost display for function-based impacts
            let costDisplay = '';
            if (button.impact) {
                if (typeof button.impact === 'function') {
                    // For function-based impacts, show a range or estimate
                    if (button.text.includes('expensive')) {
                        costDisplay = '<span class="btn-cost">$350-450</span>';
                    }
                } else if (button.impact.money) {
                    costDisplay = `<span class="btn-cost">$${Math.abs(button.impact.money)}</span>`;
                }
            }
            
            btnEl.innerHTML = `
                <span class="btn-text">${button.text}</span>
                ${costDisplay}
            `;
            btnEl.onclick = () => handleEventChoice(index);
            actionButtons.appendChild(btnEl);
        });
    }
}

// Handle event choice
function handleEventChoice(choiceIndex) {
    try {
        const { event, chainId } = gameState.currentEvent;
        const choice = event.buttons[choiceIndex];
        
        if (!choice) {
            console.error('Invalid choice index:', choiceIndex);
            closeModal();
            return;
        }
        
        // Apply stat impacts
        if (choice.impact) {
            // Handle function-based impacts
            let impacts = choice.impact;
            if (typeof choice.impact === 'function') {
                try {
                    impacts = choice.impact.call(choice, gameState);
                } catch (e) {
                    console.error('Error executing impact function:', e);
                    impacts = {};
                }
            }
            
            // Apply the impacts
            for (const [stat, value] of Object.entries(impacts)) {
                if (stat in gameState.stats) {
                    // Properly clamp all stats between 0 and 100 (except money and flight hours)
                    if (stat === 'money' || stat === 'flightHours') {
                        gameState.stats[stat] = Math.max(0, gameState.stats[stat] + value);
                    } else {
                        gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + value));
                    }
                    
                    // Show floating indicator
                    showStatChange(stat, value);
                }
            }
        }
    
    // Handle chain events
    if (choice.chainStart) {
        startEventChain(choice.chainStart, choice.chainData);
    }
    if (choice.nextPhase && chainId) {
        advanceEventChain(chainId, choice.nextPhase);
    }
    if (choice.endChain && chainId) {
        delete eventChains[chainId];
    }
    
    // Handle game ending
    if (choice.triggerEnding) {
        endGame(choice.triggerEnding);
        return;
    }
    
    // Show outcome
    const eventText = document.getElementById('event-text');
    // Handle function-based outcomes
    let outcomeText = choice.outcome;
    if (typeof choice.outcome === 'function') {
        outcomeText = choice.outcome.call(choice, gameState);
    }
    eventText.textContent = outcomeText;
    
    // Record in history
    gameState.eventHistory.push({
        day: gameState.day,
        eventId: event.id,
        choice: choiceIndex
    });
    
    // Track event occurrence for frequency limiting
    if (!gameState.eventOccurrences) {
        gameState.eventOccurrences = {};
    }
    gameState.eventOccurrences[event.id] = (gameState.eventOccurrences[event.id] || 0) + 1;
    
    // Store chainData in decisionHistory for persistent effects
    if (choice.chainData) {
        if (!gameState.decisionHistory) {
            gameState.decisionHistory = {};
        }
        Object.assign(gameState.decisionHistory, choice.chainData);
    }
    
    // Apply reputation changes
    if (choice.reputation) {
        if (!gameState.reputation) {
            gameState.reputation = { cfi: 0, atc: 0, fbo: 0, peers: 0, safety: 0 };
        }
        for (const [rep, value] of Object.entries(choice.reputation)) {
            if (rep in gameState.reputation) {
                gameState.reputation[rep] += value;
            }
        }
    }
    
    // Show continue button to advance day
    showContinueButton();
    } catch (error) {
        console.error('Error handling event choice:', error);
        console.error('Event:', gameState.currentEvent);
        console.error('Choice index:', choiceIndex);
        // Still try to close modal and continue
        closeModal();
        updateDisplay();
    }
}

// Start an event chain
function startEventChain(chainId, data = {}) {
    eventChains[chainId] = {
        startDay: gameState.day,
        phase: 'initial',
        ...data
    };
}

// Advance event chain to next phase
function advanceEventChain(chainId, nextPhase) {
    if (eventChains[chainId]) {
        eventChains[chainId].phase = nextPhase;
    }
}

// Check for active chain events
function checkChainEvents(state, chainId) {
    const chain = eventChains[chainId];
    if (!chain) return null;
    
    // For now, return null - chain events need specific implementation
    // This prevents errors when chain events are referenced
    return null;
}

// Show default actions based on context
function showDefaultActions() {
    const weather = getCurrentWeather();
    const actionButtons = document.getElementById('action-buttons');
    const eventText = document.getElementById('event-text');
    
    // Update event text based on phase
    const phaseMessages = {
        'Ground School': 'Time to build your aviation knowledge foundation.',
        'Pre-Solo': 'Building confidence and skills for your first solo flight.',
        'Solo Training': 'Perfecting your skills as pilot-in-command.',
        'Cross-Country': 'Learning navigation and expanding your horizons.',
        'Checkride Prep': 'Final preparation for your pilot certificate!'
    };
    
    eventText.textContent = phaseMessages[gameState.phase] || "What's your plan for today?";
    
    // Clear and rebuild buttons
    actionButtons.innerHTML = '';
    
    // Study option (costs money for materials/online courses)
    const studyCost = 30; // Daily access to study materials
    const studyBtn = createActionButton('Study', 'study', studyCost, 'Online ground school materials');
    if (gameState.stats.money < studyCost) {
        studyBtn.disabled = true;
        studyBtn.title = 'Not enough money for study materials';
    }
    actionButtons.appendChild(studyBtn);
    
    // Flying option (weather dependent)
    if (weather.flyable) {
        // After first solo, show both dual and solo options
        if (gameState.milestones.firstSolo) {
            // Dual instruction with CFI
            const dualCost = calculateFlightCost(gameState.phase);
            const lessonType = gameState.phase === 'Cross-Country' ? '3hr' : '2hr';
            const dualBtn = createActionButton('Fly with CFI', 'fly_dual', dualCost.total, 
                `${lessonType} dual instruction`);
            dualBtn.dataset.flightCost = JSON.stringify(dualCost);
            
            if (gameState.stats.money < dualCost.total) {
                dualBtn.disabled = true;
                dualBtn.title = 'Not enough money for dual instruction';
            } else if (gameState.stats.fatigue > 80) {
                dualBtn.disabled = true;
                dualBtn.title = 'Too fatigued - CFI won\'t let you fly';
            }
            actionButtons.appendChild(dualBtn);
            
            // Solo flight (no CFI fee, just aircraft rental)
            const soloCost = calculateSoloFlightCost();
            const soloBtn = createActionButton('Fly Solo', 'fly_solo', soloCost.total, 'Solo practice flight');
            soloBtn.dataset.flightCost = JSON.stringify(soloCost);
            
            // Add warning color if conditions are risky for solo
            if (gameState.stats.fatigue >= 70 || gameState.stats.safety < 70) {
                soloBtn.className = 'action-btn-compact warning';
                soloBtn.title = 'Warning: High risk conditions for solo flight';
            }
            
            if (gameState.stats.money < soloCost.total) {
                soloBtn.disabled = true;
                soloBtn.title = 'Not enough money for solo flight';
            } else if (gameState.stats.fatigue > 90) {
                soloBtn.disabled = true;
                soloBtn.title = 'Too fatigued for solo flight - extremely dangerous!';
            }
            actionButtons.appendChild(soloBtn);
            
            // Cross-country dual (preparation for solo XC)
            if (gameState.stats.flightHours >= 15) {
                const xcCost = calculateXCFlightCost();
                const xcBtn = createActionButton('XC with CFI', 'fly_xc_dual', xcCost.total, '3hr cross-country dual');
                xcBtn.dataset.flightCost = JSON.stringify(xcCost);
                
                if (gameState.stats.money < xcCost.total) {
                    xcBtn.disabled = true;
                    xcBtn.title = 'Not enough money for cross-country flight';
                } else if (gameState.stats.fatigue > 70) {
                    xcBtn.disabled = true;
                    xcBtn.title = 'Too fatigued for long cross-country flight';
                }
                actionButtons.appendChild(xcBtn);
            }
            
            // Night dual (required for PPL)
            if (gameState.stats.flightHours >= 20) {
                const nightCost = calculateNightFlightCost();
                const nightBtn = createActionButton('Night with CFI', 'fly_night_dual', nightCost.total, '2hr night dual');
                nightBtn.dataset.flightCost = JSON.stringify(nightCost);
                
                if (gameState.stats.money < nightCost.total) {
                    nightBtn.disabled = true;
                    nightBtn.title = 'Not enough money for night flight';
                } else if (gameState.stats.fatigue > 75) {
                    nightBtn.disabled = true;
                    nightBtn.title = 'Too fatigued for night flying';
                }
                actionButtons.appendChild(nightBtn);
            }
        } else {
            // Pre-solo: only dual instruction available
            const flightCost = calculateFlightCost(gameState.phase);
            const lessonType = gameState.phase === 'Cross-Country' ? '3hr lesson' : '2hr lesson';
            const flyBtn = createActionButton('Fly', 'fly', flightCost.total, 
                `${lessonType} with your CFI`);
            
            // Store the cost details for use in performAction
            flyBtn.dataset.flightCost = JSON.stringify(flightCost);
            
            // Disable flying if too fatigued (>80) or not enough money
            if (gameState.stats.money < flightCost.total) {
                flyBtn.disabled = true;
                flyBtn.title = 'Not enough money for flight lesson';
            } else if (gameState.stats.fatigue > 80) {
                flyBtn.disabled = true;
                flyBtn.title = 'Too fatigued to fly safely - get some rest first';
            }
            actionButtons.appendChild(flyBtn);
        }
    } else {
        const simBtn = createActionButton('Simulator', 'simulator', 75, 'Practice in the simulator');
        if (gameState.stats.money < 75) {
            simBtn.disabled = true;
            simBtn.title = 'Not enough money for simulator time';
        } else if (gameState.stats.fatigue > 90) {
            simBtn.disabled = true;
            simBtn.title = 'Too tired even for simulator - rest needed';
        }
        actionButtons.appendChild(simBtn);
    }
    
    // Rest option
    const restBtn = createActionButton('Rest', 'rest', 0, 'Recover and reduce fatigue');
    actionButtons.appendChild(restBtn);
}

function createActionButton(text, action, cost, tooltip) {
    const btn = document.createElement('button');
    btn.className = 'action-btn-compact';
    let costDisplay = '';
    if (action === 'fly') {
        costDisplay = ''; // Don't show cost for flying - you find out after!
    } else if (cost > 0) {
        costDisplay = `$${cost}`;
    } else {
        costDisplay = 'Free';
    }
    btn.innerHTML = `
        <span class="btn-text">${text}</span>
        ${costDisplay ? `<span class="btn-cost">${costDisplay}</span>` : ''}
    `;
    btn.title = tooltip;
    btn.onclick = () => performAction(action);
    return btn;
}

// Perform standard actions
function performAction(action) {
    let impacts = {};
    let message = '';
    
    // Track the last action
    gameState.lastAction = action;
    
    switch(action) {
        case 'study':
            const studyCost = 30;
            
            // Check if we have money for study materials
            if (gameState.stats.money < studyCost) {
                message = 'Not enough money for study materials. Consider taking a rest instead.';
                impacts = {};
                break;
            }
            
            // Study increases knowledge by 5±1 (normal distribution)
            const z = Math.random() * 2 - 1; // Simple approximation of normal
            const knowledgeGain = Math.round(5 + z);
            const actualGain = Math.max(3, Math.min(7, knowledgeGain)); // Clamp between 3-7
            
            impacts = { 
                knowledge: actualGain,
                money: -studyCost,
                morale: -2,
                fatigue: 4  // Studying is mentally tiring
            };
            
            // Small chance to earn money tutoring if knowledge is high
            if (gameState.stats.knowledge > 75 && Math.random() < 0.10) {
                impacts.money = 50 - studyCost; // Net gain of $20
                impacts.morale = 3; // Override the -2 with +3
                message = `You studied hard (+${actualGain} knowledge) and earned $50 tutoring another student!`;
            } else {
                const topics = ['regulations', 'weather', 'navigation', 'aerodynamics', 'weight & balance'];
                const topic = topics[Math.floor(Math.random() * topics.length)];
                message = `You studied ${topic} using online materials. Knowledge +${actualGain}.`;
            }
            break;
            
        case 'fly':
        case 'fly_dual':
        case 'fly_solo':
        case 'fly_xc_dual':
        case 'fly_night_dual':
            // Get the pre-calculated flight cost from the button
            let flightCost;
            const buttonText = action === 'fly_dual' ? 'Fly with CFI' : 
                              action === 'fly_solo' ? 'Fly Solo' :
                              action === 'fly_xc_dual' ? 'XC with CFI' :
                              action === 'fly_night_dual' ? 'Night with CFI' : 'Fly';
            const flyButton = Array.from(document.querySelectorAll('.action-btn-compact')).find(btn => 
                btn.querySelector('.btn-text')?.textContent === buttonText
            );
            
            if (flyButton && flyButton.dataset.flightCost) {
                // Use the stored cost from the button
                flightCost = JSON.parse(flyButton.dataset.flightCost);
            } else {
                // Fallback: calculate new cost if button data not found
                flightCost = calculateFlightCost(gameState.phase);
            }
            
            // Check if we have enough money before flying
            if (gameState.stats.money < flightCost.total) {
                message = 'Not enough money for a flight lesson. Consider studying or taking a break.';
                impacts = {};
                break;
            }
            
            // Check fatigue levels - safety first!
            const isSolo = action === 'fly_solo' || (flightCost && flightCost.isSolo);
            
            if (isSolo) {
                // Solo flight: Higher risk thresholds
                if (gameState.stats.fatigue >= 95) {
                    // Critical fatigue during solo = incident
                    endGame('exhausted');
                    return;
                } else if (gameState.stats.fatigue >= 80) {
                    // High fatigue solo: chance of close call
                    handleHighFatigueSoloEvent();
                    return;
                }
            } else {
                // Dual flight: CFI provides safety net
                if (gameState.stats.fatigue >= 80) {
                    // CFI intervenes when student is too tired
                    handleHighFatigueDualEvent();
                    return;
                }
            }
            
            // Apply fatigue-based safety penalties
            let safetyImpact = 8; // Base safety gain
            let safetyPenaltyMessage = '';
            
            if (gameState.stats.fatigue >= 60 && gameState.stats.fatigue < 80) {
                // Moderate fatigue - reduced safety gain and possible penalty
                safetyImpact = 3; // Reduced from 8
                const safetyRisk = Math.random();
                if (safetyRisk < 0.3) { // 30% chance of safety incident
                    safetyImpact = -5;
                    safetyPenaltyMessage = ' You made some sloppy mistakes due to fatigue.';
                }
            }
            
            // Use actual Hobbs time for flight hours
            const flightHours = parseFloat(flightCost.hobbs || flightCost.hours);
            
            // Track special flight types
            let xcHours = 0;
            let nightHours = 0;
            if (action === 'fly_xc_dual') {
                xcHours = flightHours;
            } else if (action === 'fly_night_dual') {
                nightHours = flightHours;
            }
            
            // Check for fuel price increase from previous event
            let adjustedCost = flightCost.total;
            if (gameState.decisionHistory && gameState.decisionHistory.fuelPriceIncreased) {
                adjustedCost = Math.round(flightCost.total * 1.15); // 15% increase on all flights
            }
            
            // Check for extra driving fatigue from cheaper airport
            let extraFatigue = 15; // Base flying fatigue
            if (gameState.decisionHistory && gameState.decisionHistory.extraDriving) {
                extraFatigue = 23; // +8 fatigue for 45min drive each way
            }
            
            impacts = {
                flightHours: flightHours,
                xcHours: xcHours,
                nightHours: nightHours,
                knowledge: Math.floor(Math.random() * 3) + 1,  // 1-3 uniform distribution
                safety: safetyImpact,
                morale: gameState.stats.fatigue >= 60 ? 8 : 15, // Less enjoyable when tired
                money: -adjustedCost,
                fatigue: extraFatigue
            };
            
            // Create detailed message with cost breakdown
            let costNote = '';
            if (gameState.decisionHistory && gameState.decisionHistory.fuelPriceIncreased) {
                costNote = ' (includes fuel surcharge)';
            }
            if (gameState.decisionHistory && gameState.decisionHistory.extraDriving) {
                costNote += '\n🚗 Extra fatigue from 90min round-trip drive.';
            }
            
            if (isSolo) {
                message = `Great solo flight! You logged ${flightHours} PIC hours.${safetyPenaltyMessage}\n\n💵 Aircraft rental: $${adjustedCost}${costNote}\n✈️ Building confidence as pilot-in-command!`;
                // Solo flights provide different benefits
                impacts.knowledge = Math.floor(Math.random() * 2) + 1;  // 1-2 knowledge (less than dual)
                impacts.safety = Math.max(3, safetyImpact - 2);  // Slightly less safety gain without CFI
                impacts.morale = gameState.stats.fatigue >= 60 ? 10 : 20;  // More pride in solo flight
            } else {
                message = `Great ${flightCost.lessonHours}-hour lesson! You logged ${flightHours} flight hours.${safetyPenaltyMessage}\n\n💵 Total: $${flightCost.total}\n✈️ Aircraft: $${flightCost.aircraft}\n👨‍✈️ Instructor: $${flightCost.cfi}`;
            }
            break;
            
        case 'simulator':
            // Check if we have enough money for simulator
            if (gameState.stats.money < 75) {
                message = 'Not enough money for simulator time. Consider studying instead.';
                impacts = {};
                break;
            }
            impacts = {
                knowledge: 10,
                safety: 5,
                money: -75,
                fatigue: 8
            };
            message = 'Good simulator session. Procedures are becoming second nature.';
            break;
            
        case 'rest':
            // Random recovery with normal distribution (mean=18, std=4)
            // Increased from mean=10 to make rest more effective
            // Using Box-Muller transform for normal distribution
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const recovery = Math.round(18 + z0 * 4);  // mean=18, std=4
            
            // Clamp recovery between 10 and 26 (roughly 2 standard deviations)
            const actualRecovery = Math.max(10, Math.min(26, recovery));
            
            impacts = {
                morale: 5 + Math.floor(Math.random() * 8),  // 5-12 morale (increased upper range)
                fatigue: -actualRecovery,  // Variable recovery 10-26 points
                safety: 3  // Slightly increased from 2
            };
            
            // Account for daily fatigue increase (+1.5) in the displayed value
            const dailyFatigueIncrease = 1.5;
            const netFatigueChange = -actualRecovery + dailyFatigueIncrease;
            
            // 10% chance of earning money through part-time work while resting
            if (Math.random() < 0.10) {
                impacts.money = 120;
                impacts.fatigue = Math.floor(-actualRecovery * 0.7); // Less rest due to work (70% of normal)
                const netWorkFatigue = Math.floor(-actualRecovery * 0.7) + dailyFatigueIncrease;
                message = `You pick up a part-time shift at the FBO. Made money but less rest. (Net fatigue ${netWorkFatigue > 0 ? '+' : ''}${Math.round(netWorkFatigue)})`;
            } else {
                // Different messages based on recovery quality, showing NET change
                const displayNet = Math.round(netFatigueChange);
                if (actualRecovery >= 14) {
                    message = `Excellent rest! You feel completely refreshed. (Net fatigue ${displayNet > 0 ? '+' : ''}${displayNet})`;
                } else if (actualRecovery >= 10) {
                    message = `Good rest. You feel better. (Net fatigue ${displayNet > 0 ? '+' : ''}${displayNet})`;
                } else if (actualRecovery >= 7) {
                    message = `Decent rest, though still a bit tired. (Net fatigue ${displayNet > 0 ? '+' : ''}${displayNet})`;
                } else {
                    message = `Poor sleep quality. You're still tired. (Net fatigue ${displayNet > 0 ? '+' : ''}${displayNet})`;
                }
            }
            break;
    }
    
    // Apply impacts with proper money validation
    for (const [stat, value] of Object.entries(impacts)) {
        if (stat === 'flightHours') {
            gameState.stats.flightHours += value;
        } else if (stat === 'xcHours') {
            gameState.stats.xcHours = (gameState.stats.xcHours || 0) + value;
        } else if (stat === 'nightHours') {
            gameState.stats.nightHours = (gameState.stats.nightHours || 0) + value;
        } else if (stat === 'money') {
            // Prevent money from going negative
            const newMoney = gameState.stats.money + value;
            gameState.stats.money = Math.max(0, newMoney);
        } else if (stat in gameState.stats) {
            gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + value));
        }
        
        if (Math.abs(value) > 0) {
            showStatChange(stat, value);
        }
    }
    
    // Update display message (use innerHTML to support line breaks)
    document.getElementById('event-text').innerHTML = message.replace(/\n/g, '<br>');
    
    // Check for milestone completion  
    const milestoneShown = checkMilestones();
    
    // Only show continue button if no milestone was shown
    if (!milestoneShown) {
        showContinueButton();
    }
}

// Calculate realistic flight lesson cost based on 2025 rates
function calculateFlightCost(phase = 'normal') {
    // Aircraft rental rates (2025 prices per Hobbs hour)
    // Cessna 152/Piper Tomahawk: $120-150/hr
    // Cessna 172/Piper Cherokee: $140-180/hr
    // Average around $150-175/hr with std dev ~$15
    
    // Use normal distribution for random variables
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    const z2 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    
    // Aircraft rental: mean $165/hr, std $15 (charged by Hobbs time)
    const aircraftRate = Math.round(165 + z0 * 15);
    const actualAircraftRate = Math.max(120, Math.min(200, aircraftRate));
    
    // CFI rate: mean $85/hr, std $12 (charged for full lesson time)
    const cfiRate = Math.round(85 + z1 * 12);
    const actualCFIRate = Math.max(60, Math.min(110, cfiRate));
    
    // Flight time (Hobbs): 0.7-1.8 hours for a 2-hour lesson block
    // Using normal distribution centered at 1.2 hours
    let flightTime = 1.2 + z2 * 0.3;
    flightTime = Math.max(0.7, Math.min(1.8, flightTime));
    
    // Cross-country flights have longer flight time (1.5-2.5 hours for 3-hour block)
    if (phase === 'Cross-Country') {
        flightTime = 2.0 + z2 * 0.3;
        flightTime = Math.max(1.5, Math.min(2.5, flightTime));
    }
    
    // Lesson duration (CFI time)
    const lessonHours = phase === 'Cross-Country' ? 3.0 : 2.0;
    
    // Calculate costs
    const aircraftCost = Math.round(actualAircraftRate * flightTime);
    const cfiCost = Math.round(actualCFIRate * lessonHours);
    const totalCost = aircraftCost + cfiCost;
    
    return {
        total: totalCost,
        aircraft: aircraftCost,
        cfi: cfiCost,
        hobbs: flightTime.toFixed(1),
        lessonHours: lessonHours,
        aircraftRate: actualAircraftRate,
        cfiRate: actualCFIRate
    };
}

// Create typewriter effect text
function createTypewriterText(text, duration = 3) {
    const words = text.split(' ');
    let result = '';
    let currentLength = 0;
    
    // Build the text word by word
    words.forEach((word, index) => {
        if (index > 0) result += ' ';
        result += `<span style="animation-delay: ${(currentLength / text.length) * duration}s">${word}</span>`;
        currentLength += word.length + 1;
    });
    
    return `<div class="dramatic-text">${result}</div>`;
}

// Show floating stat change indicator
function showStatChange(stat, value) {
    if (Math.abs(value) < 0.1) return;
    
    const gaugeEl = document.getElementById(`${stat}-gauge`);
    if (!gaugeEl) return;
    
    const indicator = document.createElement('div');
    indicator.className = `stat-change ${value > 0 ? 'positive' : 'negative'}`;
    indicator.textContent = value > 0 ? `+${Math.round(value)}` : Math.round(value);
    
    gaugeEl.style.position = 'relative';
    gaugeEl.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 1500);
}

// Check for milestone completion
function checkMilestones() {
    let milestoneShown = false;
    
    // Ground school completion
    if (!gameState.milestones.groundSchool && gameState.stats.knowledge >= 60) {
        gameState.milestones.groundSchool = true;
        gameState.phase = 'Pre-Solo';
        showMilestoneComplete('Ground School Complete!', 'Ready for flight training!');
        milestoneShown = true;
    }
    
    // Pre-solo written test eligibility (at 15 hours)
    else if (!gameState.milestones.preSoloWrittenPassed && 
        gameState.stats.flightHours >= 15 && 
        gameState.stats.knowledge >= 50) {
        gameState.milestones.preSoloWrittenPassed = true;
        showMilestoneComplete('Pre-Solo Written Passed!', 'One step closer to solo flight!');
        milestoneShown = true;
    }
    
    // Solo endorsement check (18+ hours, 85+ safety, passed pre-solo written)
    else if (!gameState.milestones.soloEndorsement && 
        gameState.milestones.preSoloWrittenPassed &&
        gameState.stats.flightHours >= 18 && 
        gameState.stats.safety >= 85) {
        gameState.milestones.soloEndorsement = true;
        gameState.milestones.firstSolo = true;  // Also mark first solo
        gameState.phase = 'Solo Training';
        
        // Show special solo flight message
        const eventText = document.getElementById('event-text');
        const actionButtons = document.getElementById('action-buttons');
        
        eventText.innerHTML = `<strong>✈️ FIRST SOLO FLIGHT!</strong><br><br>
            Your CFI steps out of the plane: "Three times around the pattern. You've got this!"<br><br>
            <em style="color: #87CEEB;">The plane feels lighter, quieter, and suddenly very much yours. 
            Three perfect landings. You'll never forget this day.</em>`;
        
        actionButtons.innerHTML = `
            <button class="action-btn-compact" onclick="continueGame()">
                <span class="btn-text">Continue</span>
            </button>
        `;
        
        // Bonus for solo
        gameState.stats.morale = Math.min(100, gameState.stats.morale + 30);
        gameState.stats.flightHours += 0.5;
        updateDisplay();
        
        milestoneShown = true;
    }
    
    // Cross country phase
    if (gameState.stats.flightHours >= 25 && gameState.phase === 'Solo Training') {
        gameState.phase = 'Cross-Country';
    }
    
    // Checkride ready
    if (gameState.stats.flightHours >= 40 && gameState.phase === 'Cross-Country') {
        gameState.phase = 'Checkride Prep';
        // Auto-start checkride preparation chain if not already active
        if (!eventChains['checkride_prep']) {
            startEventChain('checkride_prep');
        }
    }
    
    return milestoneShown;
}

// Show milestone completion
function showMilestoneComplete(title, message) {
    const eventText = document.getElementById('event-text');
    const actionButtons = document.getElementById('action-buttons');
    
    eventText.innerHTML = `<strong>🎉 ${title}</strong><br>${message}`;
    
    // Replace action buttons with continue button
    actionButtons.innerHTML = `
        <button class="action-btn-compact" onclick="continueGame()">
            <span class="btn-text">Continue</span>
        </button>
    `;
    
    // Flash the milestone bar
    const milestoneBar = document.querySelector('.milestone-bar');
    if (milestoneBar) {
        milestoneBar.style.animation = 'pulse 1s ease 3';
    }
}

// Advance to next day
function advanceDay() {
    gameState.day++;
    
    // Apply daily stat drain first
    applyDailyDrain();
    
    // Check for game over conditions
    if (gameState.stats.money <= 500) {
        endGame('bankrupt');
        return;
    }
    if (gameState.stats.morale <= 0) {
        endGame('burnout');
        return;
    }
    // Fatigue ending is now handled in performAction when flying
    
    // Update display and check for events
    updateDisplay();
    checkForEvents();
}

// End game
function endGame(reason) {
    gameState.gameEnded = true;
    gameState.endingType = reason;
    
    // Handle randomized fatigue scenarios
    if (reason === 'exhausted') {
        const fatigueScenarios = [
            {
                text: 'The NTSB report would later cite "pilot fatigue" as a contributing factor. Fighting to stay alert during the base-to-final turn, your heavy eyelids betrayed you for just a moment. The stall horn\'s desperate cry snapped you back, but physics had already taken command. The aircraft met the runway threshold with its left wingtip first, cartwheeling across the grass in a symphony of tearing metal and shattering dreams. You walked away physically unharmed, but the FAA medical examiner\'s suspension letter arrived within days. Three years before you can reapply—if the nightmares ever stop.',
                advice: 'The twisted propeller blade sits on your mantle, a $45,000 reminder that in aviation, fatigue isn\'t just tiredness—it\'s a killer waiting for its moment.'
            },
            {
                text: 'Microsleep. That\'s what the investigators called it. Two seconds of unconsciousness on short final—enough time for the crosswind to push you off centerline, enough time for the wing to drop, enough time for everything to go wrong. The Cessna\'s landing gear collapsed as it struck the runway edge sideways. The prop struck asphalt with a shriek that still echoes in your dreams. Insurance covered the $38,000 in damages, but not the revocation of your student certificate. "Reckless operation," they said. The words burn deeper than the seatbelt bruises ever did.',
                advice: 'Your unused headset hangs in the closet, forever tuned to 121.5—the emergency frequency you never thought you\'d need.'
            },
            {
                text: 'You don\'t remember lining up with the taxiway instead of the runway. Fatigue fog had wrapped around your brain like cotton. Tower\'s frantic calls barely registered as you advanced the throttle. The realization hit simultaneously with the runway light you clipped on rotation. The bent prop and damaged light cost $12,000, but the real price was higher—mandatory psychiatric evaluation, remedial training, and a permanent mark on your record. Every future employer will see it: "Attempted takeoff from taxiway due to fatigue impairment."',
                advice: 'The taxi diagram from that day stays folded in your wallet—a map to nowhere you\'ll ever fly again.'
            },
            {
                text: 'The fuel selector valve was on "BOTH"—you\'re certain of it. But exhaustion plays tricks with memory. After the engine quit at 3,000 feet, you had time to think during the glide. Time to realize you\'d been flying on the left tank only, now empty. The forced landing in a cornfield was textbook, until the nose gear dug in. The plane flipped. Hanging inverted in the harness, fuel dripping on your face, you had clarity for the first time in weeks. The FAA agreed: "Fuel exhaustion due to pilot fatigue and improper fuel management." Certificate suspended indefinitely.',
                advice: 'A photo of the inverted Cessna serves as your computer wallpaper—a daily reminder that in aviation, exhaustion exhausts more than just the pilot.'
            },
            {
                text: 'Radio calls became word salad. "Cessna five... no, four... requesting the... thing." Tower asked you to repeat. You couldn\'t. Fatigue had stolen your words at 3,500 feet in Class C airspace. They declared an emergency for you, vectored you down like a child being led by hand. The landing was rough but safe. The drug and alcohol test was clean, but the cognitive assessment was not. "Acute fatigue syndrome affecting judgment and communication." Six months mandatory rest before reapplication. Six months to wonder if you\'ll ever trust your own mind again.',
                advice: 'Your last radio transcript sits in a drawer—incomprehensible proof that exhaustion speaks its own dark language.'
            },
            {
                text: 'You lined up perfectly on final approach—to the wrong airport. Fatigue narrowed your vision, erased your situational awareness. Tower watched in horror as you descended toward the private strip 2 miles south, its shorter runway and power lines waiting. Their urgent calls finally broke through the fog at 200 feet. The go-around was ugly, uncoordinated, barely controlled. You landed at the correct airport shaking, crying, defeated. The NASA ASRS report you filed couldn\'t undo what everyone saw—a student pilot too exhausted to know where they were.',
                advice: 'Two sectional charts hang framed on your wall, circles drawn around both airports—the one you meant to find, and the one that found you.'
            },
            {
                text: 'The magneto check revealed nothing wrong, because exhausted pilots miss things. Like the fact you never did a magneto check. The engine ran rough on takeoff, but tired minds rationalize. At 400 feet, it quit entirely. The impossible turn—attempting to return to the runway—is what exhausted pilots try. The stall-spin was inevitable. The crash, survivable but devastating. Left leg, three fractures. Aircraft, total loss. Career, over before it began. The NTSB report sits on your shelf, its conclusion a single, damning line: "Pilot\'s fatigue-impaired judgment chain began with inadequate preflight inspection."',
                advice: 'Your cane taps out a rhythm when you walk—left-right-tap, left-right-tap—the cadence of dreams that will never leave the ground.'
            },
            {
                text: 'Density altitude at 8,500 feet on a hot day requires a sharp mind. Yours was dulled by exhaustion. The takeoff roll stretched forever. Rotation speed came and went. The trees at runway\'s end grew larger. You pulled back anyway—the desperate act of a tired pilot out of options. The Cessna mushed into the air, shuddered, and settled back onto the overrun. Through the fence, across the road, into the ditch. The insurance company\'s investigator was blunt: "Fatigue impairment led to failure to abort takeoff." They paid for the plane but not for your future.',
                advice: 'A piece of the perimeter fence wire sits coiled on your desk—the boundary you crossed when exhaustion crossed into catastrophe.'
            },
            {
                text: 'Night landing, fatigue multiplied by darkness. The VASI lights blurred into stars, stars into runway lights, everything into nothing. You flew a stable approach to a point 50 feet above the runway, then forgot to flare. The landing was more controlled crash than arrival. Nose gear collapsed, prop strike, firewall buckled. As you sat in the tilted cockpit, emergency vehicles approaching, you finally understood: exhaustion had been flying the plane for the last ten minutes. You were just a passenger in your own disaster. The repair estimate exceeded the plane\'s value. So did the damage to your reputation.',
                advice: 'You keep a VASI light bulb on your nightstand—red over white through sleepless nights, reminding you of the approach you\'ll never fly again.'
            }
        ];
        
        // Select random scenario and store it
        gameState.selectedFatigueScenario = fatigueScenarios[Math.floor(Math.random() * fatigueScenarios.length)];
    }
    
    const endings = {
        'bankrupt': {
            title: 'Financial Ruin',
            subtitle: 'Empty Pockets, Fuller Dreams',
            dramatic: 'The aviation weather briefings you once checked religiously fade from your browser history, replaced by job listings and budget spreadsheets. Walking past the flight school, you hear the familiar drone of pattern work overhead—each touch-and-go a reminder of lessons you can no longer afford. The sectional charts on your wall, once marked with planned cross-countries, now serve as expensive wallpaper for dreams deferred. In the empty hangar of your ambitions, only echoes remain.',
            advice: 'Aviation magazines pile up unread, too painful to open, too precious to throw away. Someday, when the accounts balance again, those pages will turn.'
        },
        'burnout': {
            title: 'Complete Exhaustion',
            subtitle: 'Dreams Too Heavy to Carry', 
            dramatic: 'The sky that once called to you now feels impossibly distant. Your student pilot certificate becomes a bookmark in a story left unfinished. The preflight checklist that once thrilled you now feels like meaningless ritual. Your logbook sits closed on the nightstand—no longer a record of progress, but a souvenir from a journey that grew too heavy for weary shoulders. In the airport cafe, pilots share tales of crosswinds and cloud bases while you stir cold coffee, no longer part of their world.',
            advice: 'You frame your logbook, not as a trophy, but as a reminder that some dreams are worth returning to when the time is right. The runway awaits your return when your spirit finds its lift again.'
        },
        'exhausted': {
            title: 'Fatigue-Related Incident',
            subtitle: 'When Exhaustion Takes Control',
            dramatic: gameState.selectedFatigueScenario ? gameState.selectedFatigueScenario.text : 'Fatigue claimed another victim. The details blur together—a moment of inattention, a critical mistake, an incident that ended everything. You survived, but your aviation dreams did not.',
            advice: gameState.selectedFatigueScenario ? gameState.selectedFatigueScenario.advice : 'In aviation, fatigue is the enemy that never sleeps—and neither should you have been flying.'
        },
        'success': {
            title: '✈️ Private Pilot Certificate',
            subtitle: 'Dreams Take Flight',
            dramatic: 'The examiner\'s signature transforms paper into wings. Years of dreaming crystallize into a plastic card that carries the weight of freedom itself. The sky is no longer above you—it surrounds you, welcomes you, claims you as its own.',
            advice: 'You are now pilot-in-command of your destiny. The sky was never the limit—it was just the beginning.'
        }
    };
    
    const ending = endings[reason] || {
        title: 'Journey\'s End',
        subtitle: 'Chapter Closed',
        dramatic: 'Every flight must eventually land...',
        advice: 'The runway awaits your return.'
    };
    
    // Calculate journey statistics
    const moneySpent = 15000 - gameState.stats.money;
    const progressPercent = Math.round(
        (gameState.stats.flightHours / 40) * 100
    );
    
    const eventText = document.getElementById('event-text');
    const eventContent = document.getElementById('event-content');
    const actionButtons = document.getElementById('action-buttons');
    const miniInstruments = document.querySelector('.mini-instruments');
    
    // Hide regular gauges
    if (miniInstruments) {
        miniInstruments.style.display = 'none';
    }
    
    // Remove height restriction for ending screen
    if (eventContent) {
        eventContent.style.maxHeight = 'none';
        eventContent.style.overflow = 'visible';
    }
    
    // Create dramatic ending display with journey stats
    eventText.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <h2 style="font-size: 1.4rem; color: ${reason === 'success' ? '#00cc66' : '#ff6600'}; margin: 0;">
                ${ending.title}
            </h2>
            <div style="color: #98D8E8; font-size: 0.9rem; margin-top: 5px; opacity: 0.8;">
                ${ending.subtitle}
            </div>
        </div>
        
        <div class="dramatic-text" style="margin: 20px 0; font-style: italic; color: #e8f5e9; line-height: 1.6; font-size: 0.95rem; text-align: center;">
            ${ending.dramatic}
        </div>
        
        <div style="background: rgba(135, 206, 235, 0.1); border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #FFD700; text-align: center; margin: 0 0 15px 0; font-size: 1.1rem;">Your Aviation Journey</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                <div>
                    <div style="font-size: 1.2rem;">📅</div>
                    <div style="color: #FFD700; font-size: 1.2rem; font-weight: bold;">${gameState.day}</div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">Days</div>
                </div>
                <div>
                    <div style="font-size: 1.2rem;">✈️</div>
                    <div style="color: #87CEEB; font-size: 1.2rem; font-weight: bold;">${gameState.stats.flightHours.toFixed(1)}</div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">Hours</div>
                </div>
                <div>
                    <div style="font-size: 1.2rem;">💰</div>
                    <div style="color: #4CAF50; font-size: 1.2rem; font-weight: bold;">$${moneySpent.toLocaleString()}</div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">Invested</div>
                </div>
                <div>
                    <div style="font-size: 1.2rem;">🎯</div>
                    <div style="color: ${progressPercent >= 100 ? '#00cc66' : '#ff6600'}; font-size: 1.2rem; font-weight: bold;">${progressPercent}%</div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">Progress</div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; font-style: italic; color: #98D8E8; font-size: 0.9rem; margin-top: 15px;">
            ${ending.advice}
        </div>
    `;
    
    // Update action buttons with better styling
    actionButtons.innerHTML = `
        <button class="action-btn-compact" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);" onclick="resetGame()">
            <span class="btn-text">✈️ Begin New Journey</span>
        </button>
        ${localStorage.getItem('ppl_simulator_compact_ended') ? 
            `<button class="action-btn-compact" style="background: linear-gradient(135deg, #555 0%, #444 100%);" onclick="viewPreviousStats()">
                <span class="btn-text">📊 View Previous Stats</span>
            </button>` : ''}
    `;
    
    // Update weather header to match ending theme
    const weatherHeader = document.getElementById('weather-header');
    if (weatherHeader) {
        weatherHeader.style.background = reason === 'success' ? 
            'linear-gradient(90deg, #00cc66, #00aa55)' : 
            'linear-gradient(90deg, #6F42C1, #8A5DD8)';
        document.getElementById('weather-status').textContent = 
            reason === 'success' ? '✈️ Certificate Earned!' : '🛬 Journey Paused';
    }
    
    saveGame();
}

// Reset game
function resetGame() {
    if (confirm('Start a new game? This will start fresh.')) {
        // Clear any ended game stats
        localStorage.removeItem('ppl_simulator_compact_ended');
        localStorage.removeItem('ppl_simulator_compact');
        location.reload();
    }
}

// View previous game stats (optional feature)
function viewPreviousStats() {
    const endedGame = localStorage.getItem('ppl_simulator_compact_ended');
    if (endedGame) {
        const stats = JSON.parse(endedGame);
        alert(`Previous Game Stats:\n
Days: ${stats.day}
Flight Hours: ${stats.stats.flightHours.toFixed(1)}
Money Spent: $${(15000 - stats.stats.money).toLocaleString()}
Ending: ${stats.endingType || 'In Progress'}`);
    }
}

// Event selection is now handled in events.js - removed duplicate function

// Event chain management functions are now in events.js

// Show continue button after actions/events
function showContinueButton() {
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = `
        <button class="action-btn-compact" onclick="continueGame()">
            <span class="btn-text">Continue</span>
        </button>
    `;
}

// Continue game after user clicks
function continueGame() {
    // Clear any milestone animations
    const milestoneBar = document.querySelector('.milestone-bar');
    if (milestoneBar) {
        milestoneBar.style.animation = '';
    }
    
    // Advance day and check for new events
    advanceDay();
}

// Calculate solo flight cost (no CFI fee)
function calculateXCFlightCost() {
    // Cross-country flights are typically 3+ hours
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    const z2 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    
    // Aircraft rental
    const aircraftRate = Math.round(165 + z0 * 15);
    const actualAircraftRate = Math.max(120, Math.min(200, aircraftRate));
    
    // XC flights are 3-4 hours typically
    let flightTime = 3.5 + z1 * 0.5;
    flightTime = Math.max(3.0, Math.min(4.0, flightTime));
    
    // CFI rate
    const cfiRate = Math.round(55 + z2 * 10);
    const actualCfiRate = Math.max(40, Math.min(75, cfiRate));
    
    const aircraftCost = Math.round(actualAircraftRate * flightTime);
    const cfiCost = Math.round(actualCfiRate * flightTime);
    const fuelSurcharge = Math.round(15 + Math.random() * 10); // Higher for XC
    
    return {
        aircraft: aircraftCost,
        cfi: cfiCost,
        fuel: fuelSurcharge,
        total: aircraftCost + cfiCost + fuelSurcharge,
        hours: flightTime,
        breakdown: `Aircraft: $${aircraftCost}, CFI: $${cfiCost}, Fuel: $${fuelSurcharge}`
    };
}

function calculateNightFlightCost() {
    // Night flights with required landings
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    const z2 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    
    // Aircraft rental (sometimes slightly higher for night)
    const aircraftRate = Math.round(170 + z0 * 15);
    const actualAircraftRate = Math.max(125, Math.min(205, aircraftRate));
    
    // Night flights are typically 2-2.5 hours (need 3 hours total, 10 landings)
    let flightTime = 2.2 + z1 * 0.3;
    flightTime = Math.max(2.0, Math.min(2.5, flightTime));
    
    // CFI rate (sometimes higher for night)
    const cfiRate = Math.round(60 + z2 * 10);
    const actualCfiRate = Math.max(45, Math.min(80, cfiRate));
    
    const aircraftCost = Math.round(actualAircraftRate * flightTime);
    const cfiCost = Math.round(actualCfiRate * flightTime);
    const fuelSurcharge = Math.round(10 + Math.random() * 5);
    
    return {
        aircraft: aircraftCost,
        cfi: cfiCost,
        fuel: fuelSurcharge,
        total: aircraftCost + cfiCost + fuelSurcharge,
        hours: flightTime,
        breakdown: `Aircraft: $${aircraftCost}, CFI: $${cfiCost}, Fuel: $${fuelSurcharge}`
    };
}

function calculateSoloFlightCost() {
    // Use normal distribution for random variables
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    
    // Aircraft rental: same as dual
    const aircraftRate = Math.round(165 + z0 * 15);
    const actualAircraftRate = Math.max(120, Math.min(200, aircraftRate));
    
    // Solo flights are typically 1-1.5 hours
    let flightTime = 1.2 + z1 * 0.2;
    flightTime = Math.max(1.0, Math.min(1.5, flightTime));
    
    // No CFI cost for solo
    const aircraftCost = Math.round(actualAircraftRate * flightTime);
    
    return {
        total: aircraftCost,
        aircraft: aircraftCost,
        cfi: 0,
        hobbs: flightTime.toFixed(1),
        isSolo: true,
        aircraftRate: actualAircraftRate
    };
}

// Handle high fatigue flight attempt
function handleHighFatigueFlightAttempt() {
    const eventText = document.getElementById('event-text');
    const actionButtons = document.getElementById('action-buttons');
    
    // CFI intervenes
    eventText.innerHTML = `<strong>⚠️ CFI Safety Intervention</strong><br>
    "Hold on there, you look exhausted! I can't let you fly in this condition - it's not safe. 
    We can do a ground lesson instead, or you can cancel and get some rest. What would you prefer?"`;
    
    // Generate CFI ground rate with normal distribution (mean=$50, std=$15)
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const cfiGroundRate = Math.round(50 + z0 * 15);  // mean=$50, std=$15
    const actualRate = Math.max(30, Math.min(75, cfiGroundRate)); // Clamp to $30-75 range
    
    actionButtons.innerHTML = '';
    
    // Option 1: Take ground lesson
    const groundBtn = document.createElement('button');
    groundBtn.className = 'action-btn-compact';
    groundBtn.innerHTML = `
        <span class="btn-text">Ground Lesson</span>
        <span class="btn-cost">$${actualRate}/hr</span>
    `;
    groundBtn.onclick = () => handleGroundLesson(actualRate);
    actionButtons.appendChild(groundBtn);
    
    // Option 2: Cancel with fee
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'action-btn-compact warning';
    cancelBtn.innerHTML = `
        <span class="btn-text">Cancel Flight</span>
        <span class="btn-cost">$35 fee</span>
    `;
    cancelBtn.onclick = () => handleFlightCancellation();
    actionButtons.appendChild(cancelBtn);
    
    // Option 3: Rest instead (no fee if CFI suggested it)
    const restBtn = document.createElement('button');
    restBtn.className = 'action-btn-compact';
    restBtn.innerHTML = `
        <span class="btn-text">Rest Today</span>
        <span class="btn-cost">No fee</span>
    `;
    restBtn.onclick = () => handleCFIAdvisedRest();
    actionButtons.appendChild(restBtn);
}

// Handle ground lesson with CFI
function handleGroundLesson(rate) {
    // 1.5 hour ground session
    const cost = Math.round(rate * 1.5);
    
    if (gameState.stats.money < cost) {
        document.getElementById('event-text').textContent = 
            `You can't afford the ground lesson ($${cost}). The CFI understands and suggests you rest instead.`;
        showContinueButton();
        return;
    }
    
    // Ground lesson provides excellent knowledge gain, no fatigue impact
    const impacts = {
        knowledge: 12 + Math.floor(Math.random() * 8), // 12-19 knowledge gain
        safety: 10, // Learn about fatigue management
        morale: 5,
        money: -cost,
        fatigue: -2 // Sitting and learning is somewhat restful
    };
    
    // Apply impacts
    for (const [stat, value] of Object.entries(impacts)) {
        if (stat in gameState.stats) {
            gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + value));
            if (stat === 'money') {
                gameState.stats[stat] = Math.max(0, gameState.stats[stat]);
            }
        }
        showStatChange(stat, value);
    }
    
    document.getElementById('event-text').textContent = 
        `Excellent ground session! You covered weather, regulations, and fatigue management. Knowledge +${impacts.knowledge}`;
    
    showContinueButton();
}

// Handle flight cancellation
function handleFlightCancellation() {
    // Apply cancellation fee
    gameState.stats.money = Math.max(0, gameState.stats.money - 35);
    gameState.stats.morale = Math.max(0, gameState.stats.morale - 5);
    
    showStatChange('money', -35);
    showStatChange('morale', -5);
    
    document.getElementById('event-text').textContent = 
        'Flight cancelled. You paid the cancellation fee and headed home to rest.';
    
    showContinueButton();
}

// Handle CFI-advised rest
function handleCFIAdvisedRest() {
    // Since CFI advised it, no fee and good recovery
    const recovery = 8 + Math.floor(Math.random() * 5); // 8-12 recovery
    
    gameState.stats.fatigue = Math.max(0, gameState.stats.fatigue - recovery);
    gameState.stats.morale = Math.min(100, gameState.stats.morale + 3);
    gameState.stats.safety = Math.min(100, gameState.stats.safety + 5);
    
    showStatChange('fatigue', -recovery);
    showStatChange('morale', 3);
    showStatChange('safety', 5);
    
    document.getElementById('event-text').textContent = 
        `Good call listening to your CFI. You went home to rest. Safety awareness improved!`;
    
    showContinueButton();
}