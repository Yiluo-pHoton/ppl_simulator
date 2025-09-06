// PPL Simulator - Game Engine v2.0
// Professional Aviation Training Simulator - Professional Styling Applied
// Version: 2025-01-06_1025 - Professional styling and deployment verification implemented
// A quirky text-based Private Pilot License training simulator

// Game State
// Cached DOM elements for performance
let cachedElements = {};

let gameState = {
    day: 1,
    week: 1, // Keep for compatibility during transition
    phase: 'Ground School',
    currentWeather: null, // Cache current weather
    
    // Enhanced 6-skill system for realistic progression
    skills: {
        groundKnowledge: 30,    // Book learning, regulations, theory
        cockpitSkills: 10,      // Physical flying skills, muscle memory
        radioWork: 5,           // Communication procedures
        weatherReading: 15,     // Weather interpretation skills
        navigation: 5,          // Chart reading, pilotage, GPS
        emergencyProcs: 20      // Emergency procedures, decision making
    },
    
    // Traditional stats for UI compatibility
    stats: {
        morale: 75,
        knowledge: 30,          // Computed from skills average
        safety: 80,
        money: 15000,
        flightHours: 0.0,
        progress: 0,
        fatigue: 0
    },
    
    // Enhanced instructor system
    instructor: {
        name: 'John Peterson',
        quality: 0.9,          // 0.5-1.0 affects learning rate and costs
        relationship: 75,      // 0-100 affects progress and events
        rate: 65,             // Hourly rate
        availability: 0.8,     // Chance available for lessons
        style: 'thorough',    // Affects training approach
        changedCount: 0,      // Track instructor changes
        contractWeeks: 0      // Weeks left on current instructor
    },
    
    // Financial tracking with hidden costs
    finances: {
        totalSpent: 0,
        budgetOverrun: 0,      // Amount over original $15k budget
        hiddenCosts: 0,        // Surprise costs encountered
        equipmentCosts: 0,     // Charts, headsets, etc.
        testCosts: 0,         // Written test, checkride fees
        maintenanceCosts: 0   // Aircraft issues, delays
    },
    
    // Failure tracking system
    failures: {
        writtenAttempts: 0,    // Max 3 before requiring ground school
        checkrideAttempts: 0,  // Each failure costs $800+ and delays
        instructorChanges: 0,  // Each change costs time/money
        weatherCancellations: 0,
        medicalIssues: 0,
        equipmentFailures: 0
    },
    
    // Seasonal progression affects costs and weather
    season: 'Spring',          // Spring, Summer, Fall, Winter
    seasonWeek: 1,             // Week within current season
    
    milestones: {
        groundSchool: false,
        firstSolo: false,
        writtenTest: false,
        checkride: false
    },
    logbook: [
        { day: 1, activity: 'Ground School', hours: 0.0, cost: 0 }
    ],
    totalSpent: 0,
    gameEnded: false,
    endingType: null,
    
    // Skill decay tracking
    lastFlightWeek: 1,         // Track skill decay
    lastStudyWeek: 1,
    
    // Event frequency control
    eventsSinceLastMajor: 0,   // Control major event frequency
    consecutiveGoodDays: 0,    // Track for realistic setbacks
    
    // Training momentum
    momentum: 50               // 0-100, affects learning efficiency
};

// Enhanced cost structure and aircraft types
const aircraftTypes = {
    c152: { name: 'Cessna 152', hourlyRate: 125, difficulty: 0.8, availability: 0.9 },
    c172: { name: 'Cessna 172', hourlyRate: 165, difficulty: 1.0, availability: 0.7 },
    cherokee: { name: 'Cherokee 140', hourlyRate: 155, difficulty: 1.1, availability: 0.8 }
};

const instructors = {
    peterson: { name: 'John Peterson', rate: 65, style: 'thorough', experience: 0.9 },
    martinez: { name: 'Maria Martinez', rate: 70, style: 'efficient', experience: 0.95 },
    wilson: { name: 'Bob Wilson', rate: 60, style: 'relaxed', experience: 0.8 },
    taylor: { name: 'Sarah Taylor', rate: 75, style: 'demanding', experience: 1.0 }
};

// Weather system
const weatherConditions = {
    clear: { description: 'Clear skies', flyingFactor: 1.0, moraleBonus: 5 },
    marginal: { description: 'Marginal VFR', flyingFactor: 0.8, moraleBonus: 0 },
    ifr: { description: 'IFR conditions', flyingFactor: 0.0, moraleBonus: -10 },
    windy: { description: 'High winds', flyingFactor: 0.6, moraleBonus: -5 }
};

// Realistic lesson cost calculation - simplified for accuracy
function calculateLessonCost() {
    console.log(`[COST] calculateLessonCost() called`);
    // Dynamic aircraft selection based on phase and availability
    const selectedAircraft = selectAircraft();
    const selectedInstructor = selectInstructor();
    const currentWeather = getWeeklyWeather();
    
    // Base lesson time varies by phase and lesson type
    let baseHours = calculateLessonDuration();
    
    // REALISTIC COST STRUCTURE:
    // Aircraft rental: $150-200/hour (Hobbs time)
    // CFI: $50-100/hour (typically 2 hours total lesson time)
    // Additional costs: $15-50 for fuel, fees, etc.
    
    // Core costs only - no excessive multipliers
    const aircraftCost = selectedAircraft.hourlyRate * baseHours;
    const instructorCost = selectedInstructor.rate * 2.0; // Fixed 2-hour lesson block
    
    // Minimal additional costs
    const costs = {
        aircraft: aircraftCost,
        instructor: instructorCost,
        fuel: calculateFuelCosts(baseHours, selectedAircraft),
        misc: 15 + Math.floor(Math.random() * 25) // Airport fees, small extras: $15-40
    };
    
    // Calculate total without excessive multipliers
    const subtotal = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    // Small random variation (±5%) instead of complex regional/market adjustments
    const variation = 0.95 + (Math.random() * 0.1); // 95% to 105%
    const totalCost = Math.floor(subtotal * variation);
    
    // Ensure costs stay in realistic range: $300-550 for typical lessons
    const cappedCost = Math.min(Math.max(totalCost, 280), 550);
    
    return {
        cost: cappedCost,
        hours: Math.round(baseHours * 10) / 10,
        aircraft: selectedAircraft,
        instructor: selectedInstructor,
        breakdown: {
            ...costs,
            total: cappedCost
        }
    };
}

function selectAircraft() {
    const stats = gameState.stats;
    const availableAircraft = Object.values(aircraftTypes);
    
    // Advanced students might get better aircraft
    if (stats.flightHours > 20 && stats.safety > 75) {
        // More likely to get the Cessna 172 (more expensive but better)
        return Math.random() < 0.7 ? aircraftTypes.c172 : aircraftTypes.c152;
    }
    
    // Beginners typically get assigned less expensive aircraft
    const weights = [0.6, 0.3, 0.1]; // C152 most likely for beginners
    const aircraftList = [aircraftTypes.c152, aircraftTypes.c172, aircraftTypes.cherokee];
    const random = Math.random();
    
    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
            return aircraftList[i];
        }
    }
    
    return aircraftTypes.c152; // Fallback
}

function selectInstructor() {
    const stats = gameState.stats;
    const phase = gameState.phase;
    const instructorList = Object.values(instructors);
    
    // Advanced phases might require experienced instructors
    if (phase === 'Checkride Prep' || stats.flightHours > 35) {
        // More experienced instructors for checkride prep
        return Math.random() < 0.6 ? instructors.taylor : instructors.martinez;
    }
    
    // Random instructor selection with availability consideration
    const availableInstructors = instructorList.filter(() => Math.random() < 0.8); // 80% availability
    
    if (availableInstructors.length > 0) {
        return availableInstructors[Math.floor(Math.random() * availableInstructors.length)];
    }
    
    return instructors.peterson; // Fallback if no one available
}

function calculateLessonDuration() {
    const phase = gameState.phase;
    const stats = gameState.stats;
    
    let baseDuration;
    
    switch (phase) {
        case 'Ground School':
        case 'Pre-Solo':
            baseDuration = 1.2 + (Math.random() * 0.6); // 1.2-1.8 hours
            break;
        case 'Solo Training':
            baseDuration = 1.0 + (Math.random() * 0.5); // Solo flights shorter
            break;
        case 'Cross-Country':
            baseDuration = 2.0 + (Math.random() * 1.0); // Longer XC flights
            break;
        case 'Checkride Prep':
            baseDuration = 1.5 + (Math.random() * 0.5); // Intensive practice
            break;
        default:
            baseDuration = 1.3 + (Math.random() * 0.4);
    }
    
    // Fatigue reduces lesson effectiveness and may extend time
    if (stats.fatigue > 60) {
        baseDuration *= 1.1 + (stats.fatigue / 500);
    }
    
    return baseDuration;
}

function calculateFuelCosts(hours, aircraft) {
    // Simplified fuel cost - often included in aircraft rental
    // Only charge extra fuel for longer lessons
    const fuelBurnRates = {
        'Cessna 152': 6.0, // GPH
        'Cessna 172': 8.5, // GPH
        'Cherokee 140': 7.8 // GPH
    };
    
    // Lower fuel pricing since often included in wet rates
    const fuelPrice = 6.00; // Fixed price for simplicity
    const burnRate = fuelBurnRates[aircraft.name] || 7.0;
    const fuelUsed = hours * burnRate;
    
    // Most flight schools charge "wet" rates (fuel included)
    // Only add fuel surcharge for long lessons
    return hours > 2.0 ? Math.floor(fuelUsed * fuelPrice * 0.3) : 0;
}

function calculateGroundTime(instructor) {
    // Ground time now included in instructor rate - no extra charge
    return 0;
}

function calculateWeatherDelay(weather) {
    // Weather delays rarely incur extra costs - most schools absorb this
    return 0;
}

function calculateAirportFees() {
    // Most training airports don't charge landing fees for training flights
    return 0;
}

function calculateEquipmentRental() {
    // Equipment costs now included in base lesson rates
    return 0;
}

function calculateSeasonalAdjustment() {
    // Seasonal pricing removed for realistic training costs
    return 0;
}

function calculateDemandSurcharge() {
    // Demand surcharges removed for realistic training costs
    return 0;
}

// Simplified cost transparency system
function generateCostBreakdownText(lessonDetails) {
    const breakdown = lessonDetails.breakdown;
    const majorCosts = [];
    
    majorCosts.push(`Aircraft (${lessonDetails.aircraft.name}): $${Math.floor(breakdown.aircraft)}`);
    majorCosts.push(`Instructor (${lessonDetails.instructor.name}): $${Math.floor(breakdown.instructor)}`);
    
    if (breakdown.fuel > 0) majorCosts.push(`Extra fuel: $${Math.floor(breakdown.fuel)}`);
    if (breakdown.misc > 0) majorCosts.push(`Fees & misc: $${Math.floor(breakdown.misc)}`);
    
    return majorCosts.join(', ');
}

// Regional flight school variations
function getRegionalMultiplier() {
    // Different regions have different costs - could be expanded based on player choice
    const regions = {
        'California': 1.35,      // Expensive - high cost of living
        'Texas': 1.10,           // Moderate - good weather, lower costs
        'Florida': 1.20,         // Higher - popular training destination
        'Midwest': 0.95,         // Lower - less demand, lower costs
        'Northeast': 1.25        // Higher - dense airspace, higher costs
    };
    
    // For now, use a random region or could be player-selected in future
    const regionKeys = Object.keys(regions);
    const randomRegion = regionKeys[Math.floor(Math.random() * regionKeys.length)];
    return regions[randomRegion];
}

// Dynamic pricing based on student progress and market factors
function calculateMarketAdjustment() {
    const stats = gameState.stats;
    let adjustment = 1.0;
    
    // Schools may offer discounts to struggling students or loyal customers
    if (stats.morale < 30 && gameState.day > 60) {
        adjustment *= 0.92; // Retention discount
    }
    
    // Higher costs for students who are doing very well (demand for good instructors)
    if (stats.flightHours > 25 && stats.safety > 85) {
        adjustment *= 1.08; // Premium instructor surcharge
    }
    
    // Bulk lesson discounts for committed students
    if (gameState.day > 90) {
        adjustment *= 0.96; // Long-term student discount
    }
    
    return adjustment;
}

// Generate current weather (cached per 2-3 days for realism)
function getWeeklyWeather() {
    const weatherPeriod = Math.floor(gameState.day / 3); // Weather changes every 3 days
    
    // Return cached weather if it exists and is for current period
    if (gameState.currentWeather && gameState.currentWeather.period === weatherPeriod) {
        return gameState.currentWeather.data;
    }
    
    // Generate new weather for current week
    const weatherTypes = Object.keys(weatherConditions);
    const weights = [0.5, 0.25, 0.15, 0.1]; // Clear most common
    let random = Math.random();
    let weatherType = 'clear';
    
    for (let i = 0; i < weights.length; i++) {
        if (random <= weights[i]) {
            weatherType = weatherTypes[i];
            break;
        }
        random -= weights[i];
    }
    
    const weather = weatherConditions[weatherType];
    
    // Cache the weather for this period
    gameState.currentWeather = {
        period: weatherPeriod,
        data: weather
    };
    
    return weather;
}

// Aviation Events - Quirky and relatable scenarios
// Expanded random events system - categorized by type and phase
const aviationEvents = {
    // Ground School Phase Events
    groundSchool: [
        {
            text: "Ground school instructor goes on a 20-minute tangent about 'back in my day' aviation stories. Half the class falls asleep.",
            morale: -2,
            knowledge: -1,
            safety: 0
        },
        {
            text: "Your ground school textbook costs $200 and weighs more than a small aircraft. The knowledge inside is worth every penny... probably.",
            morale: -5,
            knowledge: 8,
            money: -200,
            fatigue: 3
        },
        {
            text: "Weather theory finally clicks! You understand why clouds form and how pressure systems work. The atmosphere makes sense now.",
            morale: 12,
            knowledge: 15,
            safety: 5
        },
        {
            text: "Fellow student asks if the rudder is the 'steering wheel of the sky.' You die a little inside.",
            morale: -3,
            knowledge: 2,
            safety: 1
        },
        {
            text: "You ace the practice written exam! Your study habits are paying off and confidence is building.",
            morale: 15,
            knowledge: 12,
            safety: 3
        }
    ],

    // Pre-Solo and Early Flight Training
    preSolo: [
        {
            text: "Your CFI shows up in flip-flops and a Hawaiian shirt. 'Weather's perfect for flying!' he says, ignoring the 25-knot crosswind.",
            morale: -5,
            safety: -3,
            knowledge: 2
        },
        {
            text: "First time at the controls! Everything happens too fast, but your CFI calmly talks you through each step.",
            morale: 20,
            knowledge: 8,
            safety: 3,
            fatigue: 15
        },
        {
            text: "You confuse the rudder with the ailerons during your first lesson. Your CFI gently corrects the 'interesting' flight path.",
            morale: -8,
            knowledge: 5,
            safety: -2
        },
        {
            text: "Nailing radio procedures finally! Tower actually understands what you're saying instead of asking you to repeat.",
            morale: 15,
            knowledge: 10,
            safety: 8
        },
        {
            text: "Your headset dies mid-flight. You discover aviation sign language is surprisingly limited.",
            morale: -5,
            safety: -8,
            knowledge: 5
        },
        {
            text: "Perfect flying weather! CAVU conditions, light winds, and your favorite aircraft is available. This is why you started flying.",
            morale: 15,
            safety: 5,
            knowledge: 2
        }
    ],

    // Solo Training Events
    solo: [
        {
            text: "First solo! Your CFI gets out of the airplane and you realize you're completely on your own. Terrifying and exhilarating.",
            morale: 30,
            knowledge: 8,
            safety: 5,
            fatigue: 20
        },
        {
            text: "Solo practice goes smoothly until you forget to switch fuel tanks. The engine coughs once and your heart stops twice.",
            morale: -10,
            knowledge: 12,
            safety: 8
        },
        {
            text: "You nail three perfect landings in a row during solo practice. Maybe you actually know what you're doing now.",
            morale: 18,
            safety: 10,
            knowledge: 5
        },
        {
            text: "Radio dies during solo flight. You remember light gun signals from ground school and safely navigate the silent pattern.",
            morale: 5,
            knowledge: 15,
            safety: 12
        },
        {
            text: "Another student pilot in the pattern keeps calling 'any traffic please advise' on unicom. You cringe but stay professional.",
            morale: -3,
            knowledge: 4,
            safety: 2
        }
    ],

    // Cross-Country Events
    crossCountry: [
        {
            text: "You successfully complete your first solo cross-country flight! The sense of freedom is incredible, even if you did get slightly lost.",
            morale: 25,
            safety: 5,
            knowledge: 8
        },
        {
            text: "Navigation checkpoint is a water tower that was demolished last month. Your sectional chart suddenly feels very outdated.",
            morale: -8,
            knowledge: 10,
            safety: 3
        },
        {
            text: "Perfect cross-country flight! Navigation was spot-on, radio work was crisp, and you even arrived early. Peak pilot achievement.",
            morale: 22,
            knowledge: 12,
            safety: 8
        },
        {
            text: "Headwinds turn your 2-hour cross-country into a 3-hour fuel-conservation exercise. You learn valuable lessons about flight planning.",
            morale: -5,
            knowledge: 15,
            safety: 10,
            fatigue: 8
        },
        {
            text: "ATC vectors you around Class B airspace. Your carefully planned route becomes more like a suggestion.",
            morale: -3,
            knowledge: 12,
            safety: 8
        }
    ],

    // Checkride and Advanced Training
    checkride: [
        {
            text: "Checkride examiner is running 2 hours late. You've memorized every procedure twice and are starting to question your life choices.",
            morale: -15,
            knowledge: 3,
            safety: 0,
            fatigue: 10
        },
        {
            text: "Mock checkride with CFI goes perfectly! You feel confident and prepared for the real thing.",
            morale: 20,
            knowledge: 8,
            safety: 12
        },
        {
            text: "Checkride oral exam covers everything you studied... plus that one regulation you forgot to review. Of course.",
            morale: -8,
            knowledge: 15,
            safety: 5
        },
        {
            text: "DPE says 'show me a short field landing' and you nail it perfectly. The smile on their face tells you everything.",
            morale: 25,
            knowledge: 10,
            safety: 15
        }
    ],

    // Weather-Related Events
    weather: [
        {
            text: "Weather briefer says 'It'll probably be fine' when asked about the scattered thunderstorms. Probably.",
            morale: -8,
            safety: -5,
            knowledge: 3
        },
        {
            text: "Surprise fog rolls in during pattern work. You practice instrument approaches sooner than expected.",
            morale: -5,
            knowledge: 12,
            safety: 5
        },
        {
            text: "Thermal activity makes for a bumpy ride. You learn firsthand why meteorology is so important to pilots.",
            morale: -3,
            knowledge: 8,
            safety: 3,
            fatigue: 8
        }
    ],

    // Mechanical and Equipment Events
    mechanical: [
        {
            text: "The aircraft you're supposed to fly is 'down for maintenance.' The mechanic is standing next to it looking very confused.",
            morale: -10,
            money: 0,
            knowledge: 1
        },
        {
            text: "You discover your training aircraft was previously owned by a crop duster. The cockpit still smells faintly of pesticide and adventure.",
            morale: 5,
            safety: -2,
            knowledge: 1
        },
        {
            text: "Pre-flight inspection reveals a loose oil cap. Your careful attention to detail prevents potential engine problems.",
            morale: 8,
            knowledge: 5,
            safety: 15
        },
        {
            text: "Avionics failure forces you to fly with backup instruments. Old-school flying skills suddenly become very relevant.",
            morale: -5,
            knowledge: 18,
            safety: 10
        }
    ],

    // Social and Learning Events
    social: [
        {
            text: "The tower controller sounds suspiciously like they're eating lunch while giving pattern instructions. You hear what sounds like a sandwich being unwrapped.",
            morale: 3,
            knowledge: 1,
            safety: 0
        },
        {
            text: "Your CFI cancels last minute because their previous student 'got a little creative with the traffic pattern.' You don't ask for details.",
            morale: -7,
            money: 0,
            knowledge: 0
        },
        {
            text: "Airport cafe pilot stories range from inspiring to terrifying. You learn that every flight has a lesson, wanted or not.",
            morale: 5,
            knowledge: 8,
            safety: 3
        },
        {
            text: "You meet a commercial pilot who offers career advice and shares stories from the airlines. Aviation community support is real.",
            morale: 12,
            knowledge: 10,
            safety: 2
        }
    ],

    // Regulatory and Official Events
    regulatory: [
        {
            text: "Ramp check! The friendly FAA inspector wants to see... everything. Your logbook suddenly feels very heavy.",
            morale: -20,
            safety: 5,
            knowledge: 8
        },
        {
            text: "You pass your written exam with flying colors! The test prep actually paid off.",
            morale: 18,
            knowledge: 10,
            safety: 2
        },
        {
            text: "Medical renewal goes smoothly. The AME is actually a pilot too and shares some flying stories during the exam.",
            morale: 8,
            knowledge: 3,
            money: -150
        }
    ],

    // Achievement and Success Events
    achievements: [
        {
            text: "You nail your first crosswind landing! Your CFI actually looks impressed instead of terrified.",
            morale: 20,
            safety: 8,
            knowledge: 3
        },
        {
            text: "Flying at sunset with perfect visibility. The view reminds you why you wanted to learn to fly in the first place.",
            morale: 18,
            safety: 2,
            knowledge: 1
        },
        {
            text: "Everything clicks during today's lesson! Stick and rudder coordination finally feels natural instead of forced.",
            morale: 15,
            knowledge: 8,
            safety: 12
        }
    ],

    // General Training Events
    general: [
        {
            text: "Fellow student shares study materials and offers to quiz you on regulations. The pilot community really does help each other.",
            morale: 8,
            knowledge: 12,
            safety: 3
        },
        {
            text: "You volunteer at a Young Eagles event, giving kids their first airplane rides. Sharing the magic of flight renews your own passion.",
            morale: 20,
            knowledge: 5,
            safety: 5,
            fatigue: 10
        },
        {
            text: "Maintenance delay gives you extra time to study weather patterns and airport information. Every delay is a learning opportunity.",
            morale: -2,
            knowledge: 8,
            safety: 5
        }
    ]
};

// Enhanced prerequisite-based training system
const trainingEndorsements = {
    studentPilot: false,
    preSoloWritten: false,
    soloEndorsement: false,
    crossCountryEndorsement: false,
    writtenTestPassed: false,
    checkridePassed: false
};

// Add endorsements to game state if not present
if (!gameState.endorsements) {
    gameState.endorsements = { ...trainingEndorsements };
}

// Comprehensive training prerequisites and progression
const trainingPrerequisites = {
    // Ground School Phase
    'basic-theory': {
        phase: 'Ground School',
        requirements: {},
        unlocks: []
    },
    'regulations': {
        phase: 'Ground School', 
        requirements: { knowledge: 40 },
        unlocks: []
    },
    'advanced-study': {
        phase: 'Any',
        requirements: { knowledge: 60, money: 30 },
        unlocks: []
    },

    // Pre-Solo Phase
    'pattern-work': {
        phase: 'Pre-Solo',
        requirements: { knowledge: 50, flightHours: 0, safety: 60 },
        unlocks: []
    },
    'emergency-procedures': {
        phase: 'Pre-Solo',
        requirements: { knowledge: 55, flightHours: 5, safety: 65 },
        unlocks: ['preSoloWritten']
    },
    'pre-solo-written': {
        phase: 'Pre-Solo',
        requirements: { knowledge: 60, flightHours: 8, safety: 70 },
        unlocks: ['preSoloWritten'],
        cost: 0,
        description: 'Take pre-solo written exam'
    },

    // Solo Training Phase  
    'first-solo': {
        phase: 'Solo Training',
        requirements: { knowledge: 65, flightHours: 12, safety: 75, endorsements: ['preSoloWritten'] },
        unlocks: ['soloEndorsement'],
        cost: 150,
        description: 'First solo flight with CFI endorsement'
    },
    'solo-practice': {
        phase: 'Solo Training',
        requirements: { flightHours: 15, safety: 75, endorsements: ['soloEndorsement'] },
        unlocks: []
    },
    'night-flying': {
        phase: 'Solo Training',
        requirements: { flightHours: 18, knowledge: 70, safety: 80 },
        unlocks: [],
        cost: 280,
        description: 'Night flying training (required for PPL)'
    },

    // Cross-Country Phase
    'cross-country-dual': {
        phase: 'Cross-Country',
        requirements: { flightHours: 25, knowledge: 75, safety: 75 },
        unlocks: [],
        cost: 350,
        description: 'Cross-country training with CFI'
    },
    'cross-country-endorsement': {
        phase: 'Cross-Country',
        requirements: { flightHours: 28, knowledge: 78, safety: 78 },
        unlocks: ['crossCountryEndorsement'],
        cost: 0,
        description: 'Get cross-country endorsement'
    },
    'solo-cross-country': {
        phase: 'Cross-Country',
        requirements: { flightHours: 30, knowledge: 80, safety: 80, endorsements: ['crossCountryEndorsement'] },
        unlocks: [],
        cost: 200,
        description: 'Solo cross-country flight'
    },
    'written-test': {
        phase: 'Cross-Country',
        requirements: { knowledge: 82, flightHours: 30 },
        unlocks: ['writtenTestPassed'],
        cost: 175,
        description: 'FAA written test'
    },

    // Checkride Preparation
    'checkride-prep': {
        phase: 'Checkride Prep',
        requirements: { flightHours: 38, knowledge: 85, safety: 85, endorsements: ['writtenTestPassed'] },
        unlocks: [],
        cost: 300,
        description: 'Intensive checkride preparation'
    },
    'mock-checkride': {
        phase: 'Checkride Prep',
        requirements: { flightHours: 40, knowledge: 87, safety: 85, endorsements: ['writtenTestPassed'] },
        unlocks: [],
        cost: 250,
        description: 'Practice checkride with CFI'
    },
    'checkride': {
        phase: 'Checkride Prep',
        requirements: { flightHours: 40, knowledge: 85, safety: 80, endorsements: ['writtenTestPassed'] },
        unlocks: ['checkridePassed'],
        cost: 800,
        description: 'Official PPL checkride'
    }
};

// Game phases and their requirements
const phases = {
    'Ground School': { minWeeks: 4, requirements: { knowledge: 60 } },
    'Pre-Solo': { minWeeks: 8, requirements: { knowledge: 65, flightHours: 10, safety: 70 } },
    'Solo Training': { minWeeks: 15, requirements: { flightHours: 25, safety: 75 } },
    'Cross-Country': { minWeeks: 25, requirements: { flightHours: 35, knowledge: 80 } },
    'Checkride Prep': { minWeeks: 35, requirements: { flightHours: 40, knowledge: 85, safety: 80 } }
};

// Prerequisites checking system
function checkPrerequisites(trainingType) {
    const prereqs = trainingPrerequisites[trainingType];
    if (!prereqs) return { available: true, reasons: [] };
    
    const stats = gameState.stats;
    const endorsements = gameState.endorsements || {};
    const reasons = [];
    
    // Check stat requirements
    if (prereqs.requirements.knowledge && stats.knowledge < prereqs.requirements.knowledge) {
        reasons.push(`Need ${prereqs.requirements.knowledge}% knowledge (have ${stats.knowledge}%)`);
    }
    if (prereqs.requirements.flightHours && stats.flightHours < prereqs.requirements.flightHours) {
        reasons.push(`Need ${prereqs.requirements.flightHours} flight hours (have ${stats.flightHours.toFixed(1)})`);
    }
    if (prereqs.requirements.safety && stats.safety < prereqs.requirements.safety) {
        reasons.push(`Need ${prereqs.requirements.safety}% safety (have ${stats.safety}%)`);
    }
    if (prereqs.requirements.money && stats.money < prereqs.requirements.money) {
        reasons.push(`Need $${prereqs.requirements.money} (have $${stats.money})`);
    }
    
    // Check endorsement requirements
    if (prereqs.requirements.endorsements) {
        prereqs.requirements.endorsements.forEach(endorsement => {
            if (!endorsements[endorsement]) {
                reasons.push(`Missing endorsement: ${getEndorsementName(endorsement)}`);
            }
        });
    }
    
    // Check phase requirements (if not 'Any')
    if (prereqs.phase !== 'Any' && gameState.phase !== prereqs.phase) {
        reasons.push(`Available in ${prereqs.phase} phase (currently ${gameState.phase})`);
    }
    
    return {
        available: reasons.length === 0,
        reasons: reasons
    };
}

function getEndorsementName(endorsement) {
    const names = {
        'preSoloWritten': 'Pre-solo written test',
        'soloEndorsement': 'Solo flight endorsement', 
        'crossCountryEndorsement': 'Cross-country endorsement',
        'writtenTestPassed': 'FAA written test',
        'checkridePassed': 'PPL checkride'
    };
    return names[endorsement] || endorsement;
}

function unlockEndorsement(endorsementType) {
    if (!gameState.endorsements) {
        gameState.endorsements = { ...trainingEndorsements };
    }
    
    gameState.endorsements[endorsementType] = true;
    
    // Show achievement notification
    const endorsementNames = {
        'preSoloWritten': 'Pre-Solo Written Test Passed',
        'soloEndorsement': 'Solo Flight Endorsement Earned',
        'crossCountryEndorsement': 'Cross-Country Endorsement Earned',
        'writtenTestPassed': 'FAA Written Test Passed',
        'checkridePassed': 'Private Pilot License Earned'
    };
    
    showAchievement(endorsementNames[endorsementType] || `${endorsementType} unlocked!`);
}

// Get available prerequisite-based training options
function getPrerequisiteBasedActions() {
    const availableActions = [];
    const stats = gameState.stats;
    
    // Check each training option for prerequisites
    Object.keys(trainingPrerequisites).forEach(trainingType => {
        const prereqCheck = checkPrerequisites(trainingType);
        const training = trainingPrerequisites[trainingType];
        
        if (prereqCheck.available && stats.money >= (training.cost || 0)) {
            // Create action from prerequisite definition
            const action = {
                id: trainingType,
                icon: getTrainingIcon(trainingType),
                title: getTrainingTitle(trainingType),
                description: training.description || `${getTrainingTitle(trainingType)} (${training.cost ? '$' + training.cost : 'Free'})`,
                cost: training.cost || 0,
                effects: getTrainingEffects(trainingType),
                available: true,
                unlocks: training.unlocks || []
            };
            availableActions.push(action);
        } else if (!prereqCheck.available) {
            // Add locked action with requirements info
            const action = {
                id: trainingType,
                icon: getTrainingIcon(trainingType),
                title: getTrainingTitle(trainingType),
                description: `Locked: ${prereqCheck.reasons[0]}`, // Show first requirement
                cost: training.cost || 0,
                effects: {},
                available: false,
                unlocks: training.unlocks || [],
                requirements: prereqCheck.reasons
            };
            availableActions.push(action);
        }
    });
    
    return availableActions;
}

function getTrainingIcon(trainingType) {
    const icons = {
        'basic-theory': 'THY',
        'regulations': 'REG', 
        'advanced-study': 'ADV',
        'pattern-work': 'PTN',
        'emergency-procedures': 'EMRG',
        'pre-solo-written': 'TEST',
        'first-solo': 'SOLO',
        'solo-practice': 'SOLO',
        'night-flying': 'NGHT',
        'cross-country-dual': 'XC',
        'cross-country-endorsement': 'NDRS',
        'solo-cross-country': 'XC',
        'written-test': 'FAA',
        'checkride-prep': 'PREP',
        'mock-checkride': 'MOCK',
        'checkride': 'CHK'
    };
    return icons[trainingType] || 'TRN';
}

function getTrainingTitle(trainingType) {
    const titles = {
        'basic-theory': 'Basic Theory',
        'regulations': 'Regulations',
        'advanced-study': 'Advanced Study',
        'pattern-work': 'Pattern Practice',
        'emergency-procedures': 'Emergency Training',
        'pre-solo-written': 'Pre-Solo Written',
        'first-solo': 'First Solo',
        'solo-practice': 'Solo Practice',
        'night-flying': 'Night Flying',
        'cross-country-dual': 'XC Training',
        'cross-country-endorsement': 'XC Endorsement',
        'solo-cross-country': 'Solo XC',
        'written-test': 'Written Test',
        'checkride-prep': 'Checkride Prep',
        'mock-checkride': 'Mock Checkride',
        'checkride': 'PPL Checkride'
    };
    return titles[trainingType] || trainingType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getTrainingEffects(trainingType) {
    // Define effects for each training type
    const effects = {
        'basic-theory': { knowledge: [15, 22], morale: [-2, -6], safety: [3, 7], fatigue: [6, 10] },
        'regulations': { knowledge: [12, 18], morale: [-4, -8], safety: [5, 9], fatigue: [8, 12] },
        'advanced-study': { knowledge: [18, 25], morale: [-1, -4], safety: [6, 10], fatigue: [10, 15] },
        'pattern-work': { knowledge: [4, 10], morale: [10, 18], safety: [0, 4], hours: [1.2, 1.6], fatigue: [10, 16] },
        'emergency-procedures': { knowledge: [8, 15], morale: [5, 12], safety: [10, 18], hours: [1.0, 1.4], fatigue: [12, 18] },
        'pre-solo-written': { knowledge: [5, 10], morale: [8, 15], safety: [5, 10], fatigue: [3, 8] },
        'first-solo': { knowledge: [8, 15], morale: [25, 35], safety: [8, 15], hours: [0.8, 1.2], fatigue: [15, 25] },
        'solo-practice': { knowledge: [2, 8], morale: [15, 25], safety: [5, 10], hours: [0.8, 1.3], fatigue: [10, 18] },
        'night-flying': { knowledge: [10, 18], morale: [12, 20], safety: [8, 15], hours: [1.5, 2.0], fatigue: [18, 25] },
        'cross-country-dual': { knowledge: [12, 20], morale: [15, 25], safety: [10, 18], hours: [2.5, 3.5], fatigue: [20, 30] },
        'cross-country-endorsement': { knowledge: [8, 15], morale: [15, 25], safety: [5, 12], fatigue: [5, 12] },
        'solo-cross-country': { knowledge: [15, 25], morale: [20, 35], safety: [12, 20], hours: [2.0, 3.0], fatigue: [25, 35] },
        'written-test': { knowledge: [15, 25], morale: [10, 20], safety: [5, 10], fatigue: [8, 15] },
        'checkride-prep': { knowledge: [10, 18], morale: [8, 15], safety: [15, 25], hours: [1.5, 2.0], fatigue: [15, 25] },
        'mock-checkride': { knowledge: [12, 20], morale: [5, 15], safety: [12, 20], hours: [1.8, 2.2], fatigue: [18, 28] },
        'checkride': { knowledge: [8, 15], morale: [20, 40], safety: [10, 20], hours: [2.0, 2.5], fatigue: [20, 35] }
    };
    
    return effects[trainingType] || { knowledge: [5, 10], morale: [0, 5], safety: [0, 5] };
}

// Initialize the game
function cacheDOMElements() {
    const statNames = ['morale', 'knowledge', 'safety', 'money', 'hours', 'progress', 'fatigue'];
    statNames.forEach(stat => {
        const valueEl = document.getElementById(`${stat}-value`);
        const needleEl = document.getElementById(`${stat}-needle`);
        const instrumentEl = document.getElementById(`${stat}-instrument`);
        
        // Safety instrument doesn't have a needle - uses horizon rotation instead
        // Progress might be implemented differently
        const needsNeedle = !['safety', 'progress'].includes(stat);
        
        if (!valueEl || !instrumentEl || (needsNeedle && !needleEl)) {
            console.error(`Missing DOM element for stat: ${stat}`, {
                value: !!valueEl,
                needle: needsNeedle ? !!needleEl : 'not required',
                instrument: !!instrumentEl
            });
            return; // Skip this stat but continue with others
        }
        
        cachedElements[`${stat}-value`] = valueEl;
        cachedElements[`${stat}-instrument`] = instrumentEl;
        
        // Only cache needle if instrument uses one
        if (needsNeedle && needleEl) {
            cachedElements[`${stat}-needle`] = needleEl;
        }
    });
    
    // Cache other frequently used elements
    cachedElements.eventText = document.getElementById('event-text');
    cachedElements.studyBtn = document.getElementById('study-btn');
    cachedElements.flyBtn = document.getElementById('fly-btn'); 
    cachedElements.restBtn = document.getElementById('rest-btn');
    
    // Log cached button elements for debugging
    console.log('Cached button elements:', {
        study: !!cachedElements.studyBtn,
        fly: !!cachedElements.flyBtn,
        rest: !!cachedElements.restBtn
    });
    cachedElements.eventWeek = document.querySelector('.event-week');
    cachedElements.eventType = document.querySelector('.event-type');
    cachedElements.eventImpact = document.getElementById('event-impact');
}

function initGame() {
    console.log('Initializing PPL Simulator...');
    cacheDOMElements();
    console.log('DOM elements cached, updating display...');
    updateDisplay();
    console.log('Display updated, updating logbook...');
    updateLogbook();
    console.log('Game initialization complete!');
    showCurrentEvent();
    checkTutorial();
}

// Take an action (Study/Fly/Rest)
function takeAction(action) {
    if (gameState.gameEnded) return;
    
    console.log(`[ACTION] === TAKING ACTION: ${action.toUpperCase()} ===`);
    console.log(`[ACTION] Current game state before action:`);
    console.log(`[ACTION] - Day: ${gameState.day}, Morale: ${gameState.stats.morale}, Fatigue: ${gameState.stats.fatigue}`);
    console.log(`[ACTION] - Money: $${gameState.stats.money}, Safety: ${gameState.stats.safety}`);
    
    const currentWeather = getWeeklyWeather();
    console.log(`[ACTION] Current weather: ${currentWeather.description} (flyingFactor: ${currentWeather.flyingFactor})`);
    
    let eventText = '';
    let impact = { morale: 0, knowledge: 0, safety: 0, money: 0, hours: 0 };
    
    switch (action) {
        case 'study':
            // Varied study effectiveness based on phase and fatigue
            const studyEffectiveness = gameState.phase === 'Ground School' ? 1.2 : 0.8;
            const fatigueReduction = Math.max(0.5, 1 - (gameState.stats.fatigue / 200)); // Reduced effectiveness when fatigued
            
            impact = { 
                morale: -5 + Math.floor(Math.random() * 4), 
                knowledge: Math.floor(12 * studyEffectiveness * fatigueReduction) + Math.floor(Math.random() * 6), 
                safety: 3 + Math.floor(Math.random() * 4), 
                money: 0,
                fatigue: 8 + Math.floor(Math.random() * 7) // Studying increases fatigue
            };
            
            const studyTopics = [
                'aviation regulations and weather theory',
                'aircraft systems and performance charts', 
                'navigation principles and radio procedures',
                'aerodynamics and flight planning',
                'emergency procedures and airspace rules'
            ];
            const topic = studyTopics[Math.floor(Math.random() * studyTopics.length)];
            eventText = `You spend hours studying ${topic}. Your brain hurts, but you're definitely learning.`;
            break;
            
        case 'fly':
            const lessonDetails = calculateLessonCost();
            console.log(`[FLY] Lesson cost: $${lessonDetails.cost}, Current money: $${gameState.stats.money}`);
            console.log(`[FLY] Weather flying factor: ${currentWeather.flyingFactor} (need > 0.5 to fly)`);
            
            if (gameState.stats.money >= lessonDetails.cost && currentWeather.flyingFactor > 0.5) {
                console.log('[FLY] ✈️  FLYING - Conditions good, money available');
                // Weather affects lesson quality
                const weatherImpact = currentWeather.flyingFactor;
                const baseKnowledge = 6 + Math.floor(Math.random() * 6);
                const baseMorale = 8 + Math.floor(Math.random() * 8);
                
                // Fatigue affects flying performance and learning
                const flyingFatigueReduction = Math.max(0.6, 1 - (gameState.stats.fatigue / 150));
                
                impact = { 
                    morale: Math.floor((baseMorale * weatherImpact * flyingFatigueReduction)) + currentWeather.moraleBonus, 
                    knowledge: Math.floor(baseKnowledge * weatherImpact * flyingFatigueReduction), 
                    safety: Math.floor((-1 + Math.floor(Math.random() * 3)) * flyingFatigueReduction), 
                    money: -lessonDetails.cost, 
                    hours: lessonDetails.hours,
                    fatigue: 12 + Math.floor(Math.random() * 8) // Flying lessons are tiring
                };
                
                const lessonTypes = [
                    'pattern work and landings',
                    'cross-country navigation', 
                    'emergency procedures practice',
                    'steep turns and slow flight',
                    'radio work and airspace transitions'
                ];
                const lesson = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
                
                if (currentWeather.flyingFactor < 1.0) {
                    eventText = `${currentWeather.description} made for challenging conditions, but you practiced ${lesson}. `;
                } else {
                    eventText = `Perfect flying weather! You worked on ${lesson}. `;
                }
                
                eventText += `($${lessonDetails.cost} - ${lessonDetails.hours} hours)`;
                
            } else if (currentWeather.flyingFactor <= 0.5) {
                console.log('[FLY] ❌ WEATHER CANCEL - Bad weather, doing ground school instead');
                impact = { morale: -8, knowledge: 3, safety: 0, money: -50 }; // Ground school instead
                eventText = `${currentWeather.description} canceled your flight lesson. You did ground school instead, but lost the scheduling deposit.`;
                
            } else {
                console.log('[FLY] 💸 NO MONEY - Cannot afford lesson');
                impact = { morale: -12, knowledge: 0, safety: 0, money: 0 };
                eventText = `You can't afford today's lesson ($${lessonDetails.cost}). Time to find a part-time job or hit the books.`;
            }
            break;
            
        case 'rest':
            // Rest varies based on current stress level and reduces fatigue significantly
            const stressRelief = gameState.stats.morale < 50 ? 20 : 15;
            const restFatigueReduction = -(20 + Math.floor(Math.random() * 15)); // Rest reduces fatigue
            
            impact = { 
                morale: stressRelief + Math.floor(Math.random() * 5), 
                knowledge: -2 - Math.floor(Math.random() * 3), 
                safety: 5 + Math.floor(Math.random() * 6), 
                money: 0,
                fatigue: restFatigueReduction
            };
            
            const restActivities = [
                'take a break from training to recharge',
                'visit the airport to watch other pilots',
                'attend a local EAA chapter meeting',
                'work part-time to build up flight funds',
                'spend time with non-aviation friends and family'
            ];
            const activity = restActivities[Math.floor(Math.random() * restActivities.length)];
            eventText = `You ${activity}. Sometimes stepping back helps you see the bigger picture.`;
            break;
    }
    
    // Add random aviation event (enhanced frequency system)
    const baseEventFrequencies = {
        study: 0.3,
        fly: 0.7,
        rest: 0.1
    };
    const baseEventChance = baseEventFrequencies[action] || 0.3;
    
    if (Math.random() < baseEventChance && action !== 'rest') {
        // Try contextual event first, fallback to general events
        let randomEvent = getContextualEvent(action);
        
        if (!randomEvent && typeof aviationEvents === 'object') {
            // Fix: aviationEvents is an object with categories, convert to flat array
            const allEventsList = Object.values(aviationEvents).flat().filter(event => event && event.text);
            if (allEventsList.length > 0) {
                randomEvent = allEventsList[Math.floor(Math.random() * allEventsList.length)];
            }
        }
        
        if (randomEvent) {
            eventText += ` ${randomEvent.text}`;
            impact.morale += randomEvent.morale || 0;
            impact.knowledge += randomEvent.knowledge || 0;
            impact.safety += randomEvent.safety || 0;
            impact.money += randomEvent.money || 0;
        }
    }
    
    // Check for fatigue-based burnout events
    const fatigueEvent = checkFatigueEffects(gameState.stats.fatigue + (impact.fatigue || 0), impact);
    if (fatigueEvent) {
        eventText += fatigueEvent;
    }
    
    // Apply impacts
    console.log(`[ACTION] Final impact calculated:`, impact);
    console.log(`[ACTION] Event text: ${eventText}`);
    applyImpacts(impact);
    
    // Add to logbook
    addLogbookEntry(action, impact.hours || 0, Math.abs(impact.money) || 0);
    
    // Advance day and update week for compatibility
    gameState.day++;
    gameState.week = Math.ceil(gameState.day / 7);
    console.log(`[ACTION] Advanced to Day ${gameState.day}`);
    
    // Update phase if conditions met
    updatePhase();
    
    // Check win/lose conditions
    console.log(`[ACTION] About to check end conditions...`);
    checkEndConditions();
    console.log(`[ACTION] End conditions check complete. Game ended: ${gameState.gameEnded}`);
    
    // Auto-save game progress (unless game ended)
    if (!gameState.gameEnded) {
        saveGame();
        console.log(`[ACTION] Game saved`);
    } else {
        console.log(`[ACTION] Skipping save - game has ended`);
    }
    
    // Update display
    console.log(`[ACTION] Updating display...`);
    updateDisplay();
    showWeeklyEvent(eventText, impact);
    updateLogbook();
    console.log(`[ACTION] === ACTION COMPLETE ===`);
}

// Check for fatigue-related effects and burnout
function checkFatigueEffects(projectedFatigue, impact) {
    // High fatigue triggers burnout events
    if (projectedFatigue >= 80 && Math.random() < 0.4) {
        const burnoutEvents = [
            {
                text: " You're completely exhausted and make several basic mistakes during the session. Time for a mandatory rest period.",
                morale: -15,
                safety: -10,
                knowledge: -8
            },
            {
                text: " You fall asleep during ground school. Your instructor suggests taking a break before continuing.",
                morale: -12,
                knowledge: -5,
                hours: Math.max(0, impact.hours - 0.5) // Shortened lesson
            },
            {
                text: " Mental fatigue causes you to miss critical radio calls. Your CFI takes control and ends the lesson early.",
                morale: -18,
                safety: -15,
                hours: Math.max(0, impact.hours - 0.8),
                money: Math.min(-50, impact.money) // Still pay partial lesson fee
            },
            {
                text: " You're so tired you forget basic procedures. Time to step back and recharge before risking safety.",
                morale: -20,
                safety: -12,
                knowledge: -3
            }
        ];
        
        const burnoutEvent = burnoutEvents[Math.floor(Math.random() * burnoutEvents.length)];
        
        // Apply burnout effects
        impact.morale += burnoutEvent.morale;
        impact.knowledge += burnoutEvent.knowledge || 0;
        impact.safety += burnoutEvent.safety || 0;
        if (burnoutEvent.hours !== undefined) impact.hours = burnoutEvent.hours;
        if (burnoutEvent.money !== undefined) impact.money = Math.min(impact.money, burnoutEvent.money);
        
        return burnoutEvent.text;
    } else if (projectedFatigue >= 60 && Math.random() < 0.3) {
        // Mild fatigue effects
        const fatigueWarnings = [
            " You're feeling mentally drained but push through the session.",
            " Concentration is difficult today - fatigue is catching up with you.",
            " You notice your decision-making is slower due to accumulated tiredness.",
            " Physical and mental fatigue are starting to affect your performance."
        ];
        
        const warning = fatigueWarnings[Math.floor(Math.random() * fatigueWarnings.length)];
        
        // Mild penalties for moderate fatigue
        impact.morale -= 3;
        impact.safety -= 2;
        
        return warning;
    }
    return null;
}

// Apply stat impacts with bounds checking
function applyImpacts(impact) {
    gameState.stats.morale = Math.max(0, Math.min(100, gameState.stats.morale + impact.morale));
    gameState.stats.knowledge = Math.max(0, Math.min(100, gameState.stats.knowledge + impact.knowledge));
    gameState.stats.safety = Math.max(0, Math.min(100, gameState.stats.safety + impact.safety));
    gameState.stats.money = Math.max(0, gameState.stats.money + impact.money);
    gameState.stats.flightHours = Math.max(0, gameState.stats.flightHours + (impact.hours || 0));
    gameState.stats.fatigue = Math.max(0, Math.min(100, gameState.stats.fatigue + (impact.fatigue || 0)));
    
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
// Update milestone progress tracker
function updateMilestoneTracker() {
    const stats = gameState.stats;
    
    // Define milestone requirements
    const milestones = {
        ground: { met: stats.knowledge >= 60, req: 'Knowledge: 60%' },
        presolo: { met: stats.flightHours >= 15 && stats.safety >= 70, req: '15+ hrs, Safety: 70%' },
        solo: { met: stats.flightHours >= 25 && stats.morale >= 75 && stats.knowledge >= 75 && stats.safety >= 75, req: '25+ hrs, All: 75%' },
        cross: { met: stats.flightHours >= 35 && stats.knowledge >= 80, req: '35+ hrs, Knowledge: 80%' },
        checkride: { met: stats.flightHours >= 40 && stats.morale >= 80 && stats.knowledge >= 80 && stats.safety >= 80, req: '40+ hrs, All: 80%' }
    };
    
    // Update each milestone's visual state
    Object.keys(milestones).forEach((key, index) => {
        const milestone = document.getElementById(`milestone-${key}`);
        if (!milestone) return;
        
        // Determine status
        let status = 'locked';
        const isCurrent = Object.values(milestones).slice(0, index).every(m => m.met) && !milestones[key].met;
        const isCompleted = milestones[key].met;
        
        if (isCompleted) status = 'completed';
        else if (isCurrent || (key === 'ground' && index === 0)) status = 'current';
        
        milestone.setAttribute('data-status', status);
    });
}

function updatePhase() {
    const stats = gameState.stats;
    const day = gameState.day;
    
    if (day >= 120 && stats.flightHours >= 40 && stats.knowledge >= 85 && stats.safety >= 80) {
        gameState.phase = 'Checkride Prep';
    } else if (day >= 90 && stats.flightHours >= 35 && stats.knowledge >= 80) {
        gameState.phase = 'Cross-Country';
    } else if (day >= 60 && stats.flightHours >= 25 && stats.safety >= 75) {
        gameState.phase = 'Solo Training';
    } else if (day >= 30 && stats.knowledge >= 65 && stats.flightHours >= 10 && stats.safety >= 70) {
        gameState.phase = 'Pre-Solo';
    } else if (day >= 14 && stats.knowledge >= 60) {
        gameState.phase = 'Pre-Solo';
    }
    
    // Enhanced milestone achievement system with detailed celebrations
    checkAndCelebrateMilestones();
    
    // Update milestone tracker
    updateMilestoneTracker();
}

// Check for game ending conditions
function checkEndConditions() {
    const stats = gameState.stats;
    
    console.log(`[DEBUG] === CHECKING END CONDITIONS - Day ${gameState.day} ===`);
    console.log(`[DEBUG] Money: $${stats.money}, Morale: ${stats.morale}%, Fatigue: ${stats.fatigue}%`);
    console.log(`[DEBUG] Safety: ${stats.safety}%, Hours: ${stats.flightHours}, Progress: ${stats.progress}%`);
    console.log(`[DEBUG] Knowledge: ${stats.knowledge}%`);
    
    // Win condition - PPL obtained
    if (stats.flightHours >= 40 && stats.knowledge >= 85 && stats.safety >= 80 && stats.progress >= 95) {
        console.log('[ENDING] ✅ SUCCESS: PPL requirements met!');
        endGame('success', `Congratulations! You've earned your Private Pilot License! 
                            Total time: ${gameState.day} days
                            Flight hours: ${stats.flightHours.toFixed(1)}
                            Total cost: $${gameState.totalSpent.toLocaleString()}`);
        return;
    }
    
    // Lose conditions
    if (gameState.day >= 365) {
        console.log('[ENDING] ❌ TIMEOUT: Reached 1-year limit');
        endGame('timeout', `Time's up! You've reached the 1-year limit without completing your PPL. 
                           You got to ${stats.progress}% completion with ${stats.flightHours.toFixed(1)} hours logged.
                           Don't give up - many pilots take longer than expected!`);
        return;
    }
    
    if (stats.money <= 500 && stats.progress < 90) {
        console.log('[ENDING] ❌ BANKRUPT: Out of money before completion');
        endGame('broke', 'You ran out of money before completing your training. Maybe try a different approach to managing your budget.');
        return;
    }
    
    if (stats.morale <= 0) {
        console.log('[ENDING] ❌ BURNOUT: Morale hit zero');
        endGame('burnout', 'Your motivation hit rock bottom. Flying is supposed to be fun! Take a break and come back when you\'re ready.');
        return;
    }
    
    if (stats.fatigue >= 100) {
        console.log('[ENDING] ❌ EXHAUSTED: Fatigue maxed out');
        endGame('exhausted', 'You\'re completely exhausted and can no longer safely continue training. Rest and recovery are essential - pushing through extreme fatigue is dangerous in aviation.');
        return;
    }
    
    if (stats.safety <= 30 && stats.flightHours > 15) {
        console.log('[ENDING] ❌ SAFETY: Safety too low with significant hours');
        endGame('safety', 'Your CFI has grounded you due to safety concerns. Time to go back to the basics.');
        return;
    }
    
    if (gameState.day > 700) {  // About 2 years - very realistic max timeline
        console.log('[ENDING] ❌ TIME LIMIT: Training took too long');
        endGame('timeout', 'Your training has taken too long and you\'ve lost momentum. Maybe aviation isn\'t for everyone.');
        return;
    }
    
    console.log('[DEBUG] ✅ No ending conditions met - continuing game');
}

// End the game with a specific ending
function endGame(endingType, message) {
    console.log(`[CRITICAL] ===== GAME ENDING TRIGGERED =====`);
    console.log(`[CRITICAL] Ending Type: ${endingType}`);
    console.log(`[CRITICAL] Message: ${message}`);
    console.log(`[CRITICAL] Game State Before: gameEnded=${gameState.gameEnded}`);
    
    gameState.gameEnded = true;
    gameState.endingType = endingType;
    
    console.log(`[CRITICAL] Game State After: gameEnded=${gameState.gameEnded}`);
    
    // Show celebration modal for successful completion
    if (endingType === 'success') {
        console.log('[CRITICAL] Showing celebration modal for success');
        showCelebrationModal();
    } else {
        console.log('[CRITICAL] Showing game over modal for failure scenario');
        console.log('[CRITICAL] About to call showGameOverModal()...');
        
        // Show prominent game over modal for failure scenarios
        showGameOverModal(endingType, message);
        
        console.log('[CRITICAL] showGameOverModal() call completed');
        
        // Disable action buttons with game-ended class for proper styling
        const actionButtons = document.querySelectorAll('.action-btn');
        console.log(`[CRITICAL] Disabling ${actionButtons.length} action buttons for game end`);
        actionButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('game-ended'); // This triggers the "GAME OVER" CSS
            console.log(`[CRITICAL] Disabled button: ${btn.textContent || btn.id}`);
        });
    }
    
    console.log(`[CRITICAL] ===== END GAME FUNCTION COMPLETE =====`);
}

function getEndingIcon(type) {
    const icons = {
        success: 'SUCCESS',
        broke: 'BROKE',
        burnout: 'BURNOUT',
        safety: 'WARNING',
        timeout: 'TIMEOUT',
        exhausted: 'FATIGUE'
    };
    return icons[type] || 'AIRCRAFT';
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

// Tutorial Modal Functions
function showTutorial() {
    const modal = document.getElementById('tutorial-modal');
    modal.classList.add('active');
}

function closeTutorial() {
    const modal = document.getElementById('tutorial-modal');
    modal.classList.remove('active');
    // Mark tutorial as seen
    localStorage.setItem('ppl_tutorial_seen', 'true');
}

// Celebration Modal Functions
function showCelebrationModal() {
    const modal = document.getElementById('celebration-modal');
    
    // Calculate final statistics
    const trainingDuration = Math.ceil(gameState.day / 7);
    const totalCost = gameState.totalSpent;
    const remainingMoney = gameState.stats.money;
    
    // Update celebration content with final stats
    document.getElementById('celebration-date').textContent = `Training Completed in ${trainingDuration} days`;
    document.getElementById('final-hours').textContent = `${gameState.stats.flightHours.toFixed(1)} hrs`;
    document.getElementById('final-duration').textContent = `${trainingDuration} days`;
    document.getElementById('final-cost').textContent = `$${totalCost.toLocaleString()}`;
    document.getElementById('final-knowledge').textContent = `${gameState.stats.knowledge}%`;
    document.getElementById('final-safety').textContent = `${gameState.stats.safety}%`;
    document.getElementById('final-money').textContent = `$${remainingMoney.toLocaleString()}`;
    
    // Create personalized celebration message
    let personalMessage = "You've successfully completed your private pilot training! ";
    
    if (trainingDuration <= 30) {
        personalMessage += "Impressive speed - you completed your training ahead of schedule! ";
    } else if (trainingDuration <= 45) {
        personalMessage += "You completed your training right on schedule! ";
    } else {
        personalMessage += "Persistence pays off - you never gave up despite challenges! ";
    }
    
    if (remainingMoney >= 5000) {
        personalMessage += "And you managed your finances excellently, with plenty left over for your first cross-country adventures!";
    } else if (remainingMoney >= 1000) {
        personalMessage += "You managed your budget well and still have some funds remaining for future flying.";
    } else {
        personalMessage += "You used nearly every dollar to achieve your dream - true dedication to aviation!";
    }
    
    document.getElementById('celebration-message').textContent = personalMessage;
    
    // Show the modal
    modal.classList.add('active');
    
    // Disable action buttons
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
}

function closeCelebration() {
    const modal = document.getElementById('celebration-modal');
    modal.classList.remove('active');
}

// DRAMATIC ENDING SYSTEM - 25+ Narrative Variations
const endingNarratives = {
    fatigue: [
        {
            title: "Wings Folded",
            text: "The sky that once called to you now feels impossibly distant. Your logbook sits closed, its pages filled with dreams that grew too heavy for weary shoulders to carry. The runway lights blur as exhaustion claims what passion once fueled."
        },
        {
            title: "Grounded by Gravity",
            text: "Every pilot knows the weight of the earth pulling downward, but few feel it in their soul. The cockpit that once felt like home now seems foreign, and the horizon you chased has faded into gray uncertainty."
        },
        {
            title: "Fuel Exhausted",
            text: "Like an aircraft on empty tanks, your spirit has run dry. The engine of ambition sputters to silence, leaving only the whisper of wind through motionless wings and the echo of what might have been."
        },
        {
            title: "Course Deviation",
            text: "Navigation requires more than instruments—it needs the strength to continue when weather turns rough. Today, the storm proved stronger than your reserves, forcing an early landing on unfamiliar ground."
        },
        {
            title: "Emergency Landing",
            text: "Every pilot trains for emergencies, but some battles are fought in the heart rather than the sky. You've executed a perfect landing on the field of self-preservation, choosing safety over the uncertain heights ahead."
        },
        {
            title: "Radio Silence",
            text: "The tower calls, but your spirit no longer answers. In the quiet of an empty hangar, dreams settle like dust on unused wings, waiting for the day when the frequency clears and you're ready to respond again."
        },
        {
            title: "Below Minimums",
            text: "Weather has dropped below your personal minimums for continuing this flight. Like a wise pilot checking conditions before takeoff, you've recognized when it's time to remain grounded until clearer skies return."
        }
    ],
    financial: [
        {
            title: "Fuel Price Spike",
            text: "The dream of flight has a currency all its own, and today the market closed higher than your reserves could sustain. Like countless pilots before you, the economics of aviation have clipped wings that were meant to soar."
        },
        {
            title: "Hangar Rent Due",
            text: "Even the most skillful pilots must sometimes surrender to the mathematics of money. Your aircraft sits grounded not by mechanical failure, but by the harsh reality that dreams require more than desire—they need sustainable funding."
        },
        {
            title: "Budget Overrun",
            text: "The flight plan looked perfect on paper, but like so many aviation adventures, the actual costs exceeded the estimates. Your wallet, like an empty fuel tank, has forced an unscheduled landing on the runway of financial reality."
        },
        {
            title: "Maintenance Costs",
            text: "Aviation teaches expensive lessons, and today's curriculum exceeded your tuition budget. The aircraft of ambition requires more maintenance than your bank account can provide, grounding dreams until better-funded weather arrives."
        },
        {
            title: "Insurance Lapse",
            text: "Every pilot knows the importance of proper coverage, but sometimes life's expenses compete with aviation's demands. Without the safety net of adequate funding, even the most eager student must wait in the hangar of deferred dreams."
        },
        {
            title: "Loan Denied",
            text: "The bank's decision falls like turbulence on clear-sky plans. Your application for aviation funding has been denied, leaving dreams temporarily grounded while you rebuild the financial foundation needed for sustained flight."
        },
        {
            title: "Equipment Costs",
            text: "Headsets, charts, and training materials—the hidden costs of learning to fly accumulate like ice on wings. Today, the weight of these expenses has exceeded your aircraft's financial payload capacity."
        }
    ],
    safety: [
        {
            title: "No-Go Decision",
            text: "The mark of a true aviator is knowing when not to fly. Today, your inner weather radar detected conditions beyond your current capabilities. This isn't failure—it's the wisdom that separates skilled pilots from cautionary tales."
        },
        {
            title: "Abort Takeoff",
            text: "Speed builds down the runway of ambition, but something feels wrong. Like a pilot aborting takeoff when engine parameters aren't right, you've chosen safety over the pressure to continue into uncertain skies."
        },
        {
            title: "Pattern Work Required",
            text: "Some skills need more time in the pattern before attempting solo flight. Your instructor's voice echoes through the radio of self-awareness: 'More practice needed before this bird is ready to fly alone.'"
        },
        {
            title: "Medical Grounding",
            text: "The FAA medical examiner of life has identified conditions that require attention before returning to flight status. Like many pilots, you must address these concerns before your certificate to fly can be renewed."
        },
        {
            title: "Weather Below Minimums",
            text: "Even instrument-rated dreams have weather minimums. Today's conditions—ceiling too low, visibility poor—have dropped below what your current experience level can safely handle. The wise pilot waits for better weather."
        },
        {
            title: "Equipment Malfunction",
            text: "Your personal aircraft has developed systems issues that ground student pilots. Unlike mechanical problems that mechanics can fix, these require the specialized maintenance only time and self-care can provide."
        },
        {
            title: "Instructor Recommendation",
            text: "Your CFI has made the difficult but caring decision that more preparation is needed before soloing. This temporary setback protects both your safety and your future aviation career—a mark of professional instruction."
        }
    ],
    timeLimit: [
        {
            title: "Certificate Expired",
            text: "Like medical certificates and flight reviews, dreams have expiration dates. Time has run out on this attempt, but aviation is full of renewal opportunities. The knowledge gained never expires—only the temporary authorization to continue this particular flight."
        },
        {
            title: "Sunset Landing",
            text: "Every flight has day/night limitations for student pilots. As the sun sets on this training attempt, remember that tomorrow brings new daylight hours and fresh opportunities to return to the pattern of learning."
        },
        {
            title: "Clock Running Out",
            text: "The Hobbs meter of life has logged more hours than your training budget allowed. Like aircraft rental by the hour, dreams sometimes exceed their booked time slot, requiring a return to base for refueling and rescheduling."
        },
        {
            title: "Duty Time Exceeded",
            text: "Even airline pilots have duty time limitations. Your personal flight time requirements have exceeded safe parameters for continued operation, mandating a required rest period before returning to service."
        },
        {
            title: "Seasonal Grounding",
            text: "Some aircraft are grounded during harsh seasons for maintenance and preparation. Your aviation dreams enter their winter hangar today, but spring always returns with longer days and better flying weather."
        },
        {
            title: "Training Window Closed",
            text: "Weather windows for flight training don't stay open indefinitely. Conditions that seemed perfect for learning have shifted, requiring patience until the next favorable period opens for student operations."
        },
        {
            title: "Final Approach",
            text: "This training flight has reached its final approach phase. Like all flights, it must eventually touch down, but every landing is simply preparation for the next takeoff when conditions and resources align again."
        }
    ]
};

// Dramatic Game Over Modal Functions
function showGameOverModal(endingType, message) {
    // Map legacy ending types to new narrative types
    const endingTypeMap = {
        'exhausted': 'fatigue',
        'bankrupt': 'financial',
        'safety': 'safety',
        'timeout': 'timeLimit',
        'timeLimit': 'timeLimit'
    };
    
    const mappedType = endingTypeMap[endingType] || 'fatigue';
    console.log(`[DEBUG] Game ending triggered: ${endingType} -> ${mappedType}`);
    
    showDramaticEnding(mappedType);
}

function showDramaticEnding(endingType) {
    try {
        const modal = document.getElementById('gameover-modal');
        const title = document.getElementById('dramatic-title');
        const narrativeText = document.getElementById('narrative-text');
        const epilogueText = document.getElementById('epilogue-text');
        
        // Validate required DOM elements exist
        if (!modal || !title || !narrativeText || !epilogueText) {
            console.error('[ERROR] Required DOM elements missing for dramatic ending');
            console.error('Modal:', modal, 'Title:', title, 'Narrative:', narrativeText, 'Epilogue:', epilogueText);
            
            // Fallback to alert if modal system fails
            alert(`Game Over: ${endingType}\n\nYour training has ended. Please refresh the page to try again.`);
            return;
        }
        
        // Select random narrative for this ending type
        const narratives = endingNarratives[endingType] || endingNarratives.fatigue;
        const selectedNarrative = narratives[Math.floor(Math.random() * narratives.length)];
        
        console.log(`[DEBUG] Selected narrative: ${selectedNarrative.title}`);
        
        // Set title
        title.textContent = selectedNarrative.title;
        
        // Update journey stats with error handling
        const updateStat = (elementId, value) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`[WARNING] Element not found: ${elementId}`);
            }
        };
        
        updateStat('journey-days', gameState.day);
        updateStat('journey-hours', gameState.stats.flightHours.toFixed(1));
        updateStat('journey-spent', `$${gameState.totalSpent.toLocaleString()}`);
        updateStat('journey-progress', `${gameState.stats.progress}%`);
        
        // Generate encouraging epilogue
        const epilogue = generateEpilogue(endingType);
        epilogueText.textContent = epilogue;
        
        // Show modal - ensure it's visible
        modal.style.display = 'flex';  // Force display first
        modal.classList.add('active');  // Then add active class
        console.log('[DEBUG] Modal activated - display:', modal.style.display, 'classes:', modal.className);
        
        // Start typewriter effect for narrative
        typewriterEffect(narrativeText, selectedNarrative.text, 30);
        
    } catch (error) {
        console.error('[CRITICAL] Failed to show dramatic ending:', error);
        // Emergency fallback
        alert(`Game Over!\n\nYour training has ended due to: ${endingType}\n\nRefresh the page to start a new game.`);
    }
}

function closeDramaticEnding() {
    const modal = document.getElementById('gameover-modal');
    modal.classList.remove('active');
}

// Alias for backwards compatibility
function closeGameOver() {
    closeDramaticEnding();
}

// Typewriter effect for dramatic text reveal
function typewriterEffect(element, text, speed = 30) {
    element.textContent = '';
    element.style.opacity = '1';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    
    setTimeout(typeChar, 500); // Start after a short delay
}

// Generate encouraging epilogue based on ending type
function generateEpilogue(endingType) {
    const epilogues = {
        fatigue: [
            "Every accomplished pilot has faced moments of exhaustion. Rest well—the sky will be waiting when you're ready to return.",
            "The strongest wings are those that know when to fold and when to spread. Your aviation journey is paused, not ended.",
            "Fatigue is temporary, but the dream of flight is eternal. Take time to recharge—great pilots always fly another day."
        ],
        financial: [
            "Aviation has always been expensive, but resourceful pilots find ways to make it work. This pause creates opportunity for better planning.",
            "Many legendary aviators started with empty pockets but full hearts. Your financial situation is temporary—your passion is permanent.",
            "Smart pilots know when to invest and when to conserve. This break allows you to return with a stronger financial foundation."
        ],
        safety: [
            "The safest pilots are those who respect their limitations. Today's caution is tomorrow's continued flying.",
            "Aviation safety is built on countless good decisions. Your choice to pause reflects the judgment of a future professional pilot.",
            "Every experienced aviator has stories of times they chose safety over schedule. This wisdom will serve you well throughout your flying career."
        ],
        timeLimit: [
            "Timing in aviation is everything. This pause in your training creates space for the perfect conditions to align.",
            "Like weather windows, training opportunities come and go. The patient pilot catches the next favorable period.",
            "Every master pilot has faced scheduling challenges. Your dedication to return when the time is right shows true aviation spirit."
        ]
    };
    
    const options = epilogues[endingType] || epilogues.fatigue;
    return options[Math.floor(Math.random() * options.length)];
}

// Generate encouraging progress summary for game over screen
function generateProgressSummary() {
    const stats = gameState.stats;
    const milestones = [];
    
    if (gameState.milestones.groundSchool) milestones.push('📚 Ground School Complete');
    if (gameState.milestones.preSolo) milestones.push('✈️ Pre-Solo Eligible');
    if (gameState.milestones.firstSolo) milestones.push('🎉 Solo Flight Achieved');
    if (gameState.milestones.crossCountry) milestones.push('🗺️ Cross-Country Ready');
    if (gameState.milestones.writtenTest) milestones.push('📝 Written Test Passed');
    
    let summary = '<div class="progress-achievements"><h4>Your Aviation Journey So Far:</h4>';
    
    if (milestones.length > 0) {
        summary += '<div class="achievements-list">';
        milestones.forEach(milestone => {
            summary += `<div class="achievement-item">${milestone}</div>`;
        });
        summary += '</div>';
    } else {
        summary += '<p>Every pilot starts somewhere, and you\'ve taken the first step!</p>';
    }
    
    // Add encouraging message based on progress
    if (stats.flightHours >= 30) {
        summary += '<p class="encouragement">You\'ve built significant flight experience. Your aviation foundation is solid!</p>';
    } else if (stats.flightHours >= 15) {
        summary += '<p class="encouragement">You\'ve logged meaningful flight time. Many pilots face setbacks during training.</p>';
    } else if (stats.flightHours >= 5) {
        summary += '<p class="encouragement">You\'ve started your flight training journey. Every hour in the cockpit teaches valuable lessons.</p>';
    } else {
        summary += '<p class="encouragement">You\'ve begun the incredible journey of flight training. This experience will make you a better pilot.</p>';
    }
    
    summary += '</div>';
    return summary;
}

// Update milestone display in game over modal
function updateGameOverMilestones() {
    const container = document.getElementById('gameover-milestones');
    if (!container) return;
    
    const milestonesData = [
        { key: 'groundSchool', name: 'Ground School', icon: '📚' },
        { key: 'preSolo', name: 'Pre-Solo', icon: '✈️' },
        { key: 'firstSolo', name: 'Solo Flight', icon: '🎉' },
        { key: 'crossCountry', name: 'Cross-Country', icon: '🗺️' },
        { key: 'writtenTest', name: 'Written Test', icon: '📝' },
        { key: 'checkride', name: 'Checkride', icon: '🏆' }
    ];
    
    let html = '';
    milestonesData.forEach(milestone => {
        const achieved = gameState.milestones[milestone.key];
        const status = achieved ? 'achieved' : 'not-achieved';
        html += `<div class="milestone-status ${status}">
            <span class="milestone-icon">${milestone.icon}</span>
            <span class="milestone-name">${milestone.name}</span>
            <span class="milestone-check">${achieved ? '✓' : '✗'}</span>
        </div>`;
    });
    
    container.innerHTML = html;
}

// Enhanced ending data with detailed explanations and context
function getDetailedEndingData(endingType) {
    const endings = {
        exhausted: {
            title: 'TRAINING SUSPENDED',
            subtitle: 'Exhaustion Grounding',
            icon: '😴',
            explanation: 'Your training has been suspended due to dangerous fatigue levels. In aviation, fatigue is a serious safety concern that can impair judgment, reaction time, and decision-making skills.',
            context: 'Professional pilots are required to ground themselves when too tired to fly safely. This is exactly the right decision - aviation safety always comes first. Rest up and you can return to training when refreshed.'
        },
        broke: {
            title: 'FINANCIALLY GROUNDED',
            subtitle: 'Insufficient Training Funds',
            icon: '💸',
            explanation: 'You\'ve run out of money before completing your PPL training. Flight training is expensive, and many student pilots face financial challenges during their journey.',
            context: 'This is more common than you might think. Many successful pilots had to pause training to save more money, take on additional work, or find creative financing solutions. Your progress isn\'t lost - when you\'re ready to return, you\'ll pick up where you left off.'
        },
        burnout: {
            title: 'MOTIVATION LOST',
            subtitle: 'Training Burnout',
            icon: '😞',
            explanation: 'Your motivation has dropped to critically low levels, making it impossible to continue effective training. Flying should be enjoyable and engaging - when it becomes a burden, it\'s time to step back.',
            context: 'Burnout affects many student pilots, especially during challenging phases of training. Taking a break, finding a new instructor, or changing your approach can often reignite your passion for aviation. This setback doesn\'t define your potential as a pilot.'
        },
        safety: {
            title: 'SAFETY GROUNDING',
            subtitle: 'Training Standards Violation',
            icon: '⚠️',
            explanation: 'Your Certified Flight Instructor has grounded you due to safety concerns. This decision protects both you and others in the aviation community.',
            context: 'Safety groundings, while disappointing, are actually a sign of good instruction. Your CFI is prioritizing safety over schedule - exactly what professional aviation demands. Additional ground study, practice, or a fresh perspective can help you return to safe flying standards.'
        },
        timeout: {
            title: 'TRAINING EXPIRED',
            subtitle: 'Time Limit Exceeded',
            icon: '⏰',
            explanation: 'Your training has exceeded reasonable time limits. Prolonged training can lead to skill degradation, knowledge gaps, and increased costs.',
            context: 'While there\'s no legal time limit for PPL training, most successful students complete within 6-18 months. Extended training often indicates the need for more intensive study, more frequent lessons, or addressing underlying challenges. Consider a focused training restart.'
        }
    };
    return endings[endingType] || {
        title: 'TRAINING ENDED',
        subtitle: 'Flight Training Terminated',
        icon: '✈️',
        explanation: 'Your training has ended unexpectedly.',
        context: 'Every pilot\'s journey is unique, with its own challenges and opportunities.'
    };
}

// Legacy function for backwards compatibility
function getEndingData(endingType) {
    const detailed = getDetailedEndingData(endingType);
    return {
        title: detailed.subtitle,
        icon: detailed.icon,
        reason: detailed.explanation
    };
}

// Fatigue Warning System
let lastFatigueWarning = 0; // Track last warning level to avoid spam

function checkFatigueWarnings(fatigue) {
    const fatigueInstrument = document.getElementById('fatigue-instrument');
    
    // Remove existing warning classes
    fatigueInstrument.classList.remove('fatigue-warning', 'fatigue-critical');
    
    if (fatigue >= 90 && lastFatigueWarning < 90) {
        // Critical warning
        fatigueInstrument.classList.add('fatigue-critical');
        showFatigueAlert('CRITICAL FATIGUE!', 
            'You are dangerously exhausted! Take immediate rest or your training will be terminated for safety reasons.', 
            'critical');
        lastFatigueWarning = 90;
    } else if (fatigue >= 80 && lastFatigueWarning < 80) {
        // High warning
        fatigueInstrument.classList.add('fatigue-warning');
        showFatigueAlert('HIGH FATIGUE WARNING', 
            'Your fatigue levels are getting dangerous. Consider taking a rest day to avoid exhaustion.', 
            'warning');
        lastFatigueWarning = 80;
    } else if (fatigue < 80) {
        // Reset warning level when fatigue drops
        lastFatigueWarning = 0;
    }
}

function showFatigueAlert(title, message, type) {
    // Create floating alert that doesn't block gameplay but is very visible
    const alert = document.createElement('div');
    alert.className = `fatigue-alert ${type}`;
    alert.innerHTML = `
        <div class="alert-header">
            <span class="alert-icon">${type === 'critical' ? '🚨' : '⚠️'}</span>
            <span class="alert-title">${title}</span>
        </div>
        <div class="alert-message">${message}</div>
    `;
    
    // Add styles directly to avoid dependency on CSS order
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: ${type === 'critical' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #f39c12, #e67e22)'};
        color: white;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-family: 'Kalam', cursive;
        animation: ${type === 'critical' ? 'fatigueAlertPulse' : 'fatigueAlertSlide'} 0.5s ease-out;
        border: 3px solid ${type === 'critical' ? '#ff6b6b' : '#f1c40f'};
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'fatigueAlertFadeOut 0.5s ease-out forwards';
            setTimeout(() => alert.remove(), 500);
        }
    }, 5000);
}

// Comprehensive Warning System
let lastWarnings = {
    money: 0,
    morale: 0,
    safety: 0,
    fatigue: 0
};

function checkAllWarnings() {
    const stats = gameState.stats;
    
    // Check fatigue warnings
    checkFatigueWarnings(stats.fatigue);
    
    // Check money warnings
    checkMoneyWarnings(stats.money);
    
    // Check morale warnings
    checkMoraleWarnings(stats.morale);
    
    // Check safety warnings  
    checkSafetyWarnings(stats.safety, stats.flightHours);
}

function checkMoneyWarnings(money) {
    if (money <= 500 && lastWarnings.money < 500) {
        showAchievement('CRITICAL: Very low funds! Training may end soon if you run out of money.', 'critical');
        lastWarnings.money = 500;
    } else if (money <= 1000 && lastWarnings.money < 1000) {
        showAchievement('LOW FUNDS WARNING: Consider managing expenses carefully to complete training.', 'warning');
        lastWarnings.money = 1000;
    } else if (money > 1000) {
        lastWarnings.money = 0;
    }
}

function checkMoraleWarnings(morale) {
    if (morale <= 10 && lastWarnings.morale < 10) {
        showAchievement('CRITICAL MORALE: You\'re losing motivation! Consider taking a break or changing your approach.', 'critical');
        lastWarnings.morale = 10;
    } else if (morale <= 30 && lastWarnings.morale < 30) {
        showAchievement('LOW MORALE: Flying should be enjoyable. Consider rest or celebrating small wins.', 'warning');
        lastWarnings.morale = 30;
    } else if (morale > 30) {
        lastWarnings.morale = 0;
    }
}

function checkSafetyWarnings(safety, hours) {
    // Safety becomes more critical as hours increase
    const criticalThreshold = hours > 10 ? 40 : 30;
    const warningThreshold = hours > 10 ? 55 : 45;
    
    if (safety <= criticalThreshold && lastWarnings.safety < criticalThreshold) {
        showAchievement('SAFETY CRITICAL: Your CFI may ground you if safety doesn\'t improve soon!', 'critical');
        lastWarnings.safety = criticalThreshold;
    } else if (safety <= warningThreshold && lastWarnings.safety < warningThreshold) {
        showAchievement('SAFETY WARNING: Focus on procedures and safety habits during training.', 'warning');
        lastWarnings.safety = warningThreshold;
    } else if (safety > warningThreshold) {
        lastWarnings.safety = 0;
    }
}

// Check and celebrate newly achieved milestones
function checkAndCelebrateMilestones() {
    const stats = gameState.stats;
    
    // Initialize missing milestone properties if needed
    if (!gameState.milestones.preSolo) gameState.milestones.preSolo = false;
    if (!gameState.milestones.crossCountry) gameState.milestones.crossCountry = false;
    
    // Check each milestone for new achievements
    if (!gameState.milestones.groundSchool && stats.knowledge >= 60) {
        gameState.milestones.groundSchool = true;
        celebrateMilestone('groundSchool');
    }
    
    if (!gameState.milestones.preSolo && stats.flightHours >= 15 && stats.safety >= 70) {
        gameState.milestones.preSolo = true;
        celebrateMilestone('preSolo');
    }
    
    if (!gameState.milestones.firstSolo && stats.flightHours >= 25 && stats.morale >= 75 && stats.knowledge >= 75 && stats.safety >= 75) {
        gameState.milestones.firstSolo = true;
        celebrateMilestone('firstSolo');
    }
    
    if (!gameState.milestones.crossCountry && stats.flightHours >= 35 && stats.knowledge >= 80) {
        gameState.milestones.crossCountry = true;
        celebrateMilestone('crossCountry');
    }
    
    if (!gameState.milestones.checkride && stats.flightHours >= 40 && stats.morale >= 80 && stats.knowledge >= 80 && stats.safety >= 80) {
        gameState.milestones.checkride = true;
        celebrateMilestone('checkride');
    }
}

// Add CSS animations for fatigue alerts dynamically
if (!document.getElementById('fatigue-alert-styles')) {
    const style = document.createElement('style');
    style.id = 'fatigue-alert-styles';
    style.textContent = `
        @keyframes fatigueAlertSlide {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fatigueAlertPulse {
            0% { transform: translateX(100%) scale(0.9); opacity: 0; }
            50% { transform: translateX(0) scale(1.05); opacity: 1; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes fatigueAlertFadeOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .fatigue-alert .alert-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .fatigue-alert .alert-icon {
            font-size: 1.2rem;
        }
        
        .fatigue-alert .alert-message {
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .fatigue-instrument.fatigue-warning {
            border-color: #f39c12 !important;
            box-shadow: 0 0 15px rgba(243, 156, 18, 0.5) !important;
        }
        
        .fatigue-instrument.fatigue-critical {
            border-color: #e74c3c !important;
            box-shadow: 0 0 20px rgba(231, 76, 60, 0.7) !important;
            animation: fatigueInstrumentPulse 1s ease-in-out infinite alternate;
        }
        
        @keyframes fatigueInstrumentPulse {
            from { box-shadow: 0 0 20px rgba(231, 76, 60, 0.7); }
            to { box-shadow: 0 0 30px rgba(231, 76, 60, 1); }
        }
    `;
    document.head.appendChild(style);
}

// Check if tutorial should be shown on load
function checkTutorial() {
    const tutorialSeen = localStorage.getItem('ppl_tutorial_seen');
    if (!tutorialSeen) {
        // Show tutorial after a brief delay for page load
        setTimeout(showTutorial, 500);
    }
}

// Enhanced Achievement System with Milestone Celebrations
function showAchievement(text, type = 'milestone') {
    const achievement = document.createElement('div');
    achievement.className = `achievement-popup ${type}`;
    
    const iconMap = {
        milestone: '🎯',
        warning: '⚠️',
        critical: '🚨',
        success: '✅',
        celebration: '🎉'
    };
    
    achievement.innerHTML = `
        <div class="achievement-icon">${iconMap[type] || '🎯'}</div>
        <div class="achievement-text">${text}</div>
        <div class="achievement-close" onclick="this.parentElement.remove()">×</div>
    `;
    
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'warning' ? '#f39c12' : type === 'critical' ? '#e74c3c' : 'var(--success-green)'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(achievement);
    
    // Auto-remove after delay (longer for critical messages)
    const delay = type === 'critical' ? 8000 : type === 'warning' ? 5000 : 4000;
    setTimeout(() => {
        if (achievement.parentElement) {
            achievement.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => achievement.remove(), 300);
        }
    }, delay);
}

// Comprehensive Milestone Celebration System
function celebrateMilestone(milestone) {
    const milestoneData = {
        groundSchool: {
            title: '📚 Ground School Complete!',
            message: 'You\'ve mastered the fundamentals! Time to take your knowledge to the skies.',
            icon: '🎓',
            nextStep: 'Next: Build 15+ flight hours for pre-solo training'
        },
        preSolo: {
            title: '✈️ Pre-Solo Eligible!', 
            message: 'Your skills are developing well. Solo flight is within reach!',
            icon: '🛩️',
            nextStep: 'Next: Demonstrate consistent safety for solo endorsement'
        },
        firstSolo: {
            title: '🎉 First Solo Flight!',
            message: 'Congratulations! You\'ve achieved every pilot\'s dream - flying solo!',
            icon: '👨‍✈️',
            nextStep: 'Next: Build cross-country navigation skills'
        },
        crossCountry: {
            title: '🗺️ Cross-Country Ready!',
            message: 'You can now navigate to distant airports. The world is opening up!',
            icon: '🌍',
            nextStep: 'Next: Prepare for your written exam'
        },
        writtenTest: {
            title: '📝 Written Test Passed!',
            message: 'Knowledge test complete! You\'re ready for the practical exam.',
            icon: '✅',
            nextStep: 'Next: Schedule your checkride when ready'
        },
        checkride: {
            title: '🏆 PPL Earned!',
            message: 'Welcome to the community of certificated pilots!',
            icon: '👨‍✈️',
            nextStep: 'The sky is no longer the limit!'
        }
    };
    
    const data = milestoneData[milestone];
    if (!data) return;
    
    // Show detailed milestone notification
    showDetailedMilestone(data.title, data.message, data.icon, data.nextStep);
    
    // Animate milestone tracker
    const milestoneEl = document.getElementById(`milestone-${milestone}`);
    if (milestoneEl) {
        milestoneEl.classList.add('milestone-celebration');
        setTimeout(() => {
            milestoneEl.classList.remove('milestone-celebration');
        }, 3000);
    }
}

function showDetailedMilestone(title, message, icon, nextStep) {
    const modal = document.createElement('div');
    modal.className = 'milestone-modal-overlay';
    
    modal.innerHTML = `
        <div class="milestone-modal">
            <div class="milestone-header">
                <div class="milestone-icon-large">${icon}</div>
                <h2 class="milestone-title">${title}</h2>
                <p class="milestone-message">${message}</p>
            </div>
            <div class="milestone-content">
                <div class="milestone-next-step">
                    <strong>What's Next:</strong> ${nextStep}
                </div>
                <div class="milestone-progress-summary">
                    <div>Flight Hours: <strong>${gameState.stats.flightHours.toFixed(1)}</strong></div>
                    <div>Days Training: <strong>${gameState.day}</strong></div>
                    <div>Money Spent: <strong>$${gameState.totalSpent.toLocaleString()}</strong></div>
                </div>
            </div>
            <button class="milestone-continue-btn" onclick="this.parentElement.parentElement.remove()">Continue Training</button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 10 seconds if not manually closed
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 10000);
}

// Update all display elements
function updateDisplay() {
    try {
        const stats = gameState.stats;
        
        // Update header with safe element access
        const weekCounter = document.getElementById('week-counter');
        const phaseIndicator = document.getElementById('phase-indicator');
        
        if (weekCounter) weekCounter.textContent = `Day ${gameState.day}`;
        if (phaseIndicator) phaseIndicator.textContent = gameState.phase;
    
    // Update gauge values and progress bars
    updateGauge('morale', stats.morale);
    updateGauge('knowledge', stats.knowledge);
    updateGauge('safety', stats.safety);
    updateGauge('money', stats.money, '$', true);
    updateGauge('hours', stats.flightHours, '', false, 1);
    updateGauge('fatigue', stats.fatigue);
    updateGauge('progress', stats.progress);
    
    // Check for fatigue warnings
    checkFatigueWarnings(stats.fatigue);
    
    // Update milestone tracker
    updateMilestoneTracker();
    
    // Update current conditions and strategic guidance
    updateCurrentConditions();
    
    // Update dynamic action buttons
    updateActionButtons();
    
    // Update action button states with dynamic pricing (fallback for static system)
    const lessonCost = calculateLessonCost();
    const currentWeather = getWeeklyWeather();
    const flyBtn = cachedElements.flyBtn;
    
    // Add null check for flyBtn
    if (!flyBtn) {
        console.warn('fly-btn element not found in cache - DOM may not be ready');
        return;
    }
    
    if (currentWeather.flyingFactor <= 0.5) {
        flyBtn.classList.add('disabled');
        const btnDesc = flyBtn.querySelector('.btn-description');
        if (btnDesc) btnDesc.textContent = `${currentWeather.description} - No flying`;
    } else if (stats.money < lessonCost.cost) {
        flyBtn.classList.add('disabled');
        const btnDesc = flyBtn.querySelector('.btn-description');
        if (btnDesc) btnDesc.textContent = `Need $${lessonCost.cost}`;
    } else {
        flyBtn.classList.remove('disabled');
        const btnDesc = flyBtn.querySelector('.btn-description');
        if (btnDesc) btnDesc.textContent = `Book lesson ($${lessonCost.cost})`;
    }
    
    // Debug all action button states
    const actionButtons = document.querySelectorAll('.action-btn');
    console.log(`[DEBUG] Action button states:`);
    actionButtons.forEach((btn, i) => {
        const btnTitle = btn.querySelector('.btn-title');
        const btnDesc = btn.querySelector('.btn-description');
        console.log(`[DEBUG] Button ${i} (${btn.id}): title="${btnTitle?.textContent}", disabled=${btn.disabled}, classes="${btn.className}"`);
    });
    
    console.log('Display update completed successfully');
    
    // Add visual feedback for stat changes
    addVisualFeedback();
    
    } catch (error) {
        console.error('Error in updateDisplay:', error);
        console.error('GameState at error:', gameState);
        console.error('Cached elements:', cachedElements);
    }
}

// Enhanced Visual Feedback System
function addVisualFeedback() {
    // Add subtle animations to instruments that changed
    Object.keys(gameState.stats).forEach(statName => {
        const instrumentEl = cachedElements[`${statName}-instrument`];
        if (instrumentEl && Math.random() < 0.3) {
            // Add subtle glow effect for active instruments
            instrumentEl.style.filter = 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))';
            setTimeout(() => {
                instrumentEl.style.filter = '';
            }, 1000);
        }
    });
}

// Action Feedback System
function showActionResult(actionType, success = true) {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.classList.add(success ? 'action-success' : 'action-error');
        setTimeout(() => {
            actionButtons.classList.remove('action-success', 'action-error');
        }, 600);
    }
}

// Progress Celebration
function celebrateMilestone(milestone) {
    const milestoneEl = document.getElementById(`milestone-${milestone}`);
    if (milestoneEl) {
        milestoneEl.classList.add('progress-celebration');
        setTimeout(() => {
            milestoneEl.classList.remove('progress-celebration');
        }, 2000);
    }
}

// Update individual gauge display with authentic aircraft instrument animations
function updateGauge(statName, value, prefix = '', isCurrency = false, decimals = 0) {
    const valueEl = cachedElements[`${statName}-value`];
    const needleEl = cachedElements[`${statName}-needle`];
    const instrumentEl = cachedElements[`${statName}-instrument`];
    
    // Validate input value
    if (value === null || value === undefined || isNaN(value)) {
        console.warn(`Invalid value for ${statName}: ${value}, using 0 as fallback`);
        value = 0;
    }
    
    // For safety and progress, check if needle element is expected
    const needsNeedle = !['safety', 'progress'].includes(statName);
    
    // Add null checks with detailed logging
    if (!valueEl || !instrumentEl || (needsNeedle && !needleEl)) {
        console.warn(`Cannot update gauge ${statName} - missing DOM elements:`, {
            value: !!valueEl,
            needle: needsNeedle ? !!needleEl : 'not required', 
            instrument: !!instrumentEl
        });
        return;
    }
    
    // Format display value
    let displayValue;
    let percentage = 0;
    let needleRotation = 0;
    
    if (isCurrency) {
        displayValue = `$${value.toLocaleString()}`;
        percentage = Math.min(100, (value / 15000) * 100); // Scale to starting amount
        // Money needle: Full (0°) to Empty (240°) - fuel gauge style
        needleRotation = (1 - (percentage / 100)) * 240;
    } else if (statName === 'hours') {
        displayValue = value.toFixed(decimals);
        percentage = Math.min(100, (value / 50) * 100); // Scale to 50 hours max
        // Hours needle: 0 hrs (180°) to 50 hrs (0°) - tachometer style 
        needleRotation = 180 - (percentage / 100) * 180;
    } else if (statName === 'progress') {
        displayValue = `${value}%`;
        percentage = value;
        // Progress compass: 0% (North/0°) clockwise to 100% (full circle)
        needleRotation = (percentage / 100) * 360;
        // Special handling for progress arc
        const progressArc = document.getElementById('progress-arc');
        if (progressArc) {
            const angle = (percentage / 100) * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            const endX = 100 + 75 * Math.sin(angle * Math.PI / 180);
            const endY = 100 - 75 * Math.cos(angle * Math.PI / 180);
            progressArc.setAttribute('d', `M 100 25 A 75 75 0 ${largeArcFlag} 1 ${endX} ${endY}`);
        }
    } else if (statName === 'safety') {
        displayValue = `${value}%`;
        percentage = value;
        // Safety attitude indicator: horizon line rotation
        const horizonEl = document.getElementById('safety-horizon');
        if (horizonEl) {
            // Rotate horizon based on safety level (100% = level, 0% = -30° bank)
            const bankAngle = (100 - percentage) * -0.3; // Max -30° bank for 0% safety
            horizonEl.setAttribute('transform', `rotate(${bankAngle} 100 100)`);
        }
        needleRotation = 0; // No needle for attitude indicator
    } else {
        displayValue = `${value}%`;
        percentage = value;
        
        // Different needle behaviors for different instruments
        if (statName === 'morale') {
            // Morale altimeter: 0% (270°) to 100% (0°) 
            needleRotation = 270 - (percentage / 100) * 270;
        } else if (statName === 'knowledge') {
            // Knowledge airspeed: 0% (225°) to 100% (0°)
            needleRotation = 225 - (percentage / 100) * 225;
        } else if (statName === 'fatigue') {
            // Fatigue temperature gauge: 0% (240°) to 100% (0°)
            needleRotation = 240 - (percentage / 100) * 240;
        }
    }
    
    // Update display value
    if (valueEl) {
        valueEl.textContent = displayValue;
    }
    
    // Update needle rotation (except for safety attitude indicator) with performance optimization
    if (needleEl && statName !== 'safety') {
        // Ensure needleRotation is valid before using
        if (isNaN(needleRotation)) {
            console.warn(`NaN needleRotation for ${statName}, using 0`);
            needleRotation = 0;
        }
        
        // Performance optimization: only update if rotation actually changed
        const currentTransform = needleEl.getAttribute('transform') || '';
        const newTransform = `rotate(${needleRotation} 100 100)`;
        
        if (currentTransform !== newTransform) {
            // Set CSS custom property for animation reference
            needleEl.style.setProperty('--needle-angle', `${needleRotation}deg`);
            needleEl.setAttribute('transform', newTransform);
            
            // Add subtle vibration effect for needle realism (skip for very small changes)
            const oldRotation = parseFloat(currentTransform.match(/rotate\(([^)]+)/)?.[1] || '0');
            if (Math.abs(needleRotation - oldRotation) > 5) {
                needleEl.classList.add('needle-moving');
                setTimeout(() => needleEl.classList.remove('needle-moving'), 800);
            }
        }
    }
    
    // Add status classes to instrument with enhanced logic and change detection
    if (instrumentEl) {
        // Store current status for change detection
        const oldStatus = instrumentEl.classList.contains('critical') ? 'critical' :
                         instrumentEl.classList.contains('warning') ? 'warning' : 'good';
        
        instrumentEl.classList.remove('critical', 'warning', 'good');
        
        // Special handling for different stats with more nuanced thresholds
        let newStatus;
        if (statName === 'fatigue') {
            // Fatigue: higher is worse (inverted)
            if (percentage >= 75) newStatus = 'critical';
            else if (percentage >= 50) newStatus = 'warning';
            else newStatus = 'good';
        } else if (statName === 'money') {
            // Money: based on remaining funds with more granular warnings
            if (percentage <= 15) newStatus = 'critical';
            else if (percentage <= 35) newStatus = 'warning';
            else newStatus = 'good';
        } else {
            // Standard stats: higher is better with adjusted thresholds
            if (percentage <= 20) newStatus = 'critical';
            else if (percentage <= 55) newStatus = 'warning';
            else newStatus = 'good';
        }
        
        instrumentEl.classList.add(newStatus);
        
        // Add status change animation if status actually changed
        if (oldStatus !== newStatus) {
            instrumentEl.classList.add('status-changed');
            setTimeout(() => instrumentEl.classList.remove('status-changed'), 600);
        }
    }
    
    // Animation effect
    if (instrumentEl) {
        instrumentEl.classList.add('stat-updated');
        setTimeout(() => instrumentEl.classList.remove('stat-updated'), 300);
    }
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
            <span class="event-week">Day ${gameState.day}</span>
            <span class="event-type">${getPhaseIcon(gameState.phase)} ${gameState.phase}</span>
        </div>
        <div class="event-content">${text}</div>
        <div class="event-stats">${impactText}</div>
    `;
}

function getPhaseIcon(phase) {
    const icons = {
        'Ground School': 'GND',
        'Pre-Solo': 'PRE',
        'Solo Training': 'SOLO',
        'Cross-Country': 'XC',
        'Checkride Prep': '📋'
    };
    return icons[phase] || 'FLIGHT';
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
        day: gameState.day,
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
    
    // Instructor initials array for variety
    const instructorInitials = ['J.P.', 'M.K.', 'S.R.', 'A.W.', 'T.L.', 'D.M.'];
    
    // Show last 8 entries to fill the authentic logbook
    const recentEntries = gameState.logbook.slice(-8);
    entriesContainer.innerHTML = recentEntries.map((entry, index) => {
        const instructor = instructorInitials[index % instructorInitials.length];
        return `
            <div class="logbook-entry">
                <div class="entry-cell date-col">Day ${entry.day || entry.week * 7}</div>
                <div class="entry-cell activity-col">${entry.activity}</div>
                <div class="entry-cell hours-col">${entry.hours.toFixed(1)}</div>
                <div class="entry-cell cost-col">$${entry.cost}</div>
                <div class="entry-cell instructor-col">${instructor}</div>
            </div>
        `;
    }).join('');
    
    // Update totals with authentic styling
    totalHours.textContent = `${gameState.stats.flightHours.toFixed(1)} hrs`;
    totalSpent.textContent = `$${gameState.totalSpent.toLocaleString()}`;
}

// Save/Load functionality removed - Game is designed as a single session experience

// Save/Load Game Functions
function saveGame() {
    try {
        const saveData = {
            gameState: gameState,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem('ppl_simulator_save', JSON.stringify(saveData));
        console.log('Game saved successfully');
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

function loadGame() {
    try {
        const saveData = localStorage.getItem('ppl_simulator_save');
        if (!saveData) {
            alert('No saved game found!');
            return false;
        }
        
        const parsed = JSON.parse(saveData);
        if (!parsed.gameState) {
            alert('Invalid save file!');
            return false;
        }
        
        // Restore game state
        gameState = parsed.gameState;
        
        // Re-enable buttons if game wasn't ended
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(btn => btn.disabled = gameState.gameEnded);
        
        // Update display
        updateDisplay();
        updateLogbook();
        
        console.log('Game loaded successfully from:', parsed.timestamp);
        alert('Game loaded successfully!');
        return true;
    } catch (error) {
        console.error('Failed to load game:', error);
        alert('Failed to load saved game!');
        return false;
    }
}

function hasSavedGame() {
    return localStorage.getItem('ppl_simulator_save') !== null;
}

function resetGame() {
    if (confirm('Are you sure you want to start a new game? This will delete your current progress.')) {
        gameState = {
            day: 1,
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
                preSolo: false,
                firstSolo: false,
                crossCountry: false,
                writtenTest: false,
                checkride: false
            },
            logbook: [
                { day: 1, activity: 'Ground School', hours: 0.0, cost: 0 }
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

// Action preview system
function showActionPreview(action) {
    // This function can be enhanced to show dynamic previews
    // For now, the CSS hover effect handles the display
}

function hideActionPreview() {
    // This function can be enhanced to hide previews
    // For now, the CSS handles this automatically
}

// Strategic guidance system
function getStrategicRecommendation() {
    const stats = gameState.stats;
    const phase = gameState.phase;
    
    // Determine what the player should focus on
    if (stats.knowledge < 60 && phase === 'Ground School') {
        return 'Recommended: Focus on studying to unlock pre-solo training';
    } else if (stats.flightHours < 15 && stats.knowledge >= 60) {
        return 'Recommended: Build flight hours with regular lessons';
    } else if (stats.safety < 70 && stats.flightHours >= 15) {
        return 'Recommended: Practice safety procedures and emergency training';
    } else if (stats.morale < 50) {
        return 'Recommended: Take a rest day to recharge motivation';
    } else if (stats.money < 1000) {
        return 'Recommended: Take a break to earn money or focus on free study';
    } else if (stats.flightHours >= 35 && stats.knowledge < 80) {
        return 'Recommended: Study for written test and cross-country planning';
    } else if (stats.flightHours >= 40) {
        return 'Recommended: Polish skills and prepare for checkride';
    } else {
        return 'Recommended: Continue balanced training - you\'re making great progress!';
    }
}

// Update weather and conditions display
function updateCurrentConditions() {
    const currentWeather = getWeeklyWeather();
    const weatherText = document.getElementById('weather-text');
    const weatherIcon = document.querySelector('.weather-icon');
    const recommendation = document.getElementById('action-recommendation');
    
    // Update weather display
    const weatherIcons = {
        clear: 'CLEAR',
        marginal: 'MARG',
        ifr: 'IFR', 
        windy: 'WIND'
    };
    
    if (weatherIcon && weatherText) {
        weatherIcon.textContent = weatherIcons[Object.keys(weatherConditions).find(key => 
            weatherConditions[key].description === currentWeather.description
        )] || 'CLEAR';
        weatherText.textContent = currentWeather.description + (currentWeather.flyingFactor < 0.6 ? ' - Limited flying' : ' - Good for flying!');
    }
    
    // Update strategic recommendation
    if (recommendation) {
        recommendation.textContent = getStrategicRecommendation();
    }
    
    // Update flight button with dynamic pricing
    const lessonCost = calculateLessonCost();
    const flyDescription = document.getElementById('fly-description');
    if (flyDescription) {
        if (currentWeather.flyingFactor <= 0.5) {
            flyDescription.textContent = `Weather too poor for flying`;
        } else {
            flyDescription.textContent = `Book lesson ($${lessonCost.cost})`;
        }
    }
}

// Dynamic Action System with Prerequisites
function getAvailableActions() {
    const stats = gameState.stats;
    const weather = getWeeklyWeather();
    const actions = [];
    
    // Get prerequisite-based training actions
    const prereqActions = getPrerequisiteBasedActions();
    
    // Filter to available actions first, then add some locked ones for visibility
    const availableActions = prereqActions.filter(action => action.available);
    const lockedActions = prereqActions.filter(action => !action.available).slice(0, 1); // Show 1 locked action
    
    actions.push(...availableActions.slice(0, 2)); // Show 2 available training actions
    actions.push(...lockedActions); // Show 1 locked action for progression visibility
    
    // Add rest actions if needed (fatigue management)
    const restActions = getRestActions();
    if (stats.fatigue > 50 || stats.morale < 40) {
        actions.push(restActions[0]);
    }
    
    // CRITICAL FIX: Ensure basic actions are always available as fallback
    // If no actions were found, provide basic Study/Fly/Rest options
    if (actions.length === 0) {
        console.log('No dynamic actions available, falling back to basic actions');
        actions.push(
            {
                id: 'study',
                icon: 'STUDY',
                title: 'Study',
                description: 'Hit the books (Free)',
                cost: 0,
                available: true,
                effects: { knowledge: [12, 18], morale: [-3, -7], safety: [3, 6] }
            },
            {
                id: 'fly',
                icon: 'FLY',
                title: 'Schedule Flight',
                description: 'Book lesson ($250)',
                cost: 250,
                available: true,
                effects: { hours: [1.3, 1.7], knowledge: [6, 12], morale: [8, 15], money: [-250] }
            },
            {
                id: 'rest',
                icon: 'REST',
                title: 'Rest',
                description: 'Take a break (Free)',
                cost: 0,
                available: true,
                effects: { morale: [15, 25], safety: [5, 10], knowledge: [-2, -5] }
            }
        );
    }
    
    // Limit to 3 actions for UI simplicity
    return actions.slice(0, 3);
}

function getStudyActions() {
    const stats = gameState.stats;
    const actions = [];
    
    if (gameState.phase === 'Ground School') {
        if (stats.knowledge < 40) {
            actions.push({
                id: 'basic-theory',
                icon: 'THY',
                title: 'Basic Theory',
                description: 'Fundamentals of flight (Free)',
                cost: 0,
                effects: { knowledge: [15, 22], morale: [-2, -6], safety: [3, 7], fatigue: [6, 10] }
            });
        } else {
            actions.push({
                id: 'regulations',
                icon: 'REG',
                title: 'Regulations',
                description: 'FARs and airspace (Free)',
                cost: 0,
                effects: { knowledge: [12, 18], morale: [-4, -8], safety: [5, 9], fatigue: [8, 12] }
            });
        }
    } else if (gameState.phase === 'Cross-Country') {
        actions.push({
            id: 'navigation',
            icon: 'NAV',
            title: 'Navigation Study',
            description: 'Chart work and planning (Free)',
            cost: 0,
            effects: { knowledge: [10, 16], morale: [-3, -7], safety: [4, 8], fatigue: [7, 11] }
        });
    } else {
        actions.push({
            id: 'review',
            icon: 'REV',
            title: 'Review',
            description: 'General study (Free)',
            cost: 0,
            effects: { knowledge: [8, 15], morale: [-3, -7], safety: [2, 6], fatigue: [6, 10] }
        });
    }
    
    // Advanced study option if knowledge is high enough
    if (stats.knowledge >= 60) {
        actions.push({
            id: 'advanced-study',
            icon: 'ADV',
            title: 'Advanced Topics',
            description: 'Complex systems ($30)',
            cost: 30,
            effects: { knowledge: [18, 25], morale: [-1, -4], safety: [6, 10], fatigue: [10, 15] }
        });
    }
    
    return actions;
}

function getFlightActions(weather) {
    const stats = gameState.stats;
    const actions = [];
    const lessonCost = calculateLessonCost();
    
    // Can't fly if weather is too poor or no money
    if (weather.flyingFactor <= 0.5) {
        actions.push({
            id: 'ground-sim',
            icon: 'SIM',
            title: 'Simulator',
            description: 'Weather alternate ($120)',
            cost: 120,
            effects: { knowledge: [8, 14], morale: [3, 8], safety: [2, 5], hours: [0.8, 1.2], fatigue: [8, 12] },
            available: stats.money >= 120
        });
        return actions;
    }
    
    if (stats.money < lessonCost.cost) {
        return actions; // No flight options if broke
    }
    
    // Different lesson types based on phase
    if (gameState.phase === 'Ground School' || gameState.phase === 'Pre-Solo') {
        actions.push({
            id: 'pattern-work',
            icon: 'PTN',
            title: 'Pattern Practice',
            description: `Takeoffs/landings ($${lessonCost.cost})`,
            cost: lessonCost.cost,
            effects: { 
                knowledge: [4, 10], 
                morale: [10, 18], 
                safety: [0, 4], 
                hours: [lessonCost.hours - 0.2, lessonCost.hours + 0.2],
                fatigue: [10, 16]
            },
            available: true
        });
    } else if (gameState.phase === 'Solo Training') {
        actions.push({
            id: 'solo-practice',
            icon: 'SOLO',
            title: 'Solo Practice',
            description: `Flying alone ($${lessonCost.cost - 65})`,
            cost: lessonCost.cost - 65, // No instructor cost
            effects: { 
                knowledge: [2, 8], 
                morale: [15, 25], 
                safety: [1, 3], 
                hours: [lessonCost.hours, lessonCost.hours + 0.3],
                fatigue: [12, 18]
            },
            available: stats.safety >= 75
        });
    } else if (gameState.phase === 'Cross-Country') {
        actions.push({
            id: 'cross-country',
            icon: 'XC',
            title: 'Cross Country',
            description: `Navigation flight ($${lessonCost.cost + 50})`,
            cost: lessonCost.cost + 50, // Longer flight
            effects: { 
                knowledge: [8, 15], 
                morale: [12, 20], 
                safety: [3, 7], 
                hours: [lessonCost.hours + 0.5, lessonCost.hours + 1.0],
                fatigue: [15, 22]
            },
            available: true
        });
    }
    
    return actions;
}

function getRestActions() {
    const stats = gameState.stats;
    const actions = [];
    
    if (stats.fatigue >= 70) {
        actions.push({
            id: 'deep-rest',
            icon: 'SLEEP',
            title: 'Full Rest Day',
            description: 'Sleep and recover (Free)',
            cost: 0,
            effects: { morale: [18, 28], knowledge: [-1, -4], safety: [8, 12], fatigue: [-25, -35] }
        });
    } else if (stats.morale < 40) {
        actions.push({
            id: 'recreational',
            icon: 'FUN',
            title: 'Recreation',
            description: 'Fun activities (Free)',
            cost: 0,
            effects: { morale: [20, 30], knowledge: [-2, -5], safety: [3, 7], fatigue: [-15, -25] }
        });
    } else if (stats.money < 2000) {
        actions.push({
            id: 'part-time-work',
            icon: 'WORK',
            title: 'Part-time Work',
            description: 'Earn money ($200-400)',
            cost: 0,
            effects: { morale: [-5, -10], knowledge: [-1, -3], safety: [1, 3], money: [200, 400], fatigue: [5, 10] }
        });
    } else {
        actions.push({
            id: 'light-rest',
            icon: 'REST',
            title: 'Light Rest',
            description: 'Relaxation time (Free)',
            cost: 0,
            effects: { morale: [12, 20], knowledge: [-1, -3], safety: [4, 8], fatigue: [-12, -20] }
        });
    }
    
    return actions;
}

// Update action buttons with dynamic content
function updateActionButtons() {
    const availableActions = getAvailableActions();
    const actionContainer = document.querySelector('.action-buttons');
    
    if (!actionContainer) return;
    
    // CRITICAL FIX: Do NOT clear existing buttons - preserve static HTML buttons
    // Instead, update the existing static buttons with current state
    
    // Get the static buttons that should always exist
    const studyBtn = document.getElementById('study-btn');
    const flyBtn = document.getElementById('fly-btn');
    const restBtn = document.getElementById('rest-btn');
    
    // Update button states based on current game conditions
    updateStaticButton(studyBtn, 'study');
    updateStaticButton(flyBtn, 'fly');
    updateStaticButton(restBtn, 'rest');
    
    // Legacy dynamic button creation - only if static buttons don't exist (fallback)
    if (!studyBtn || !flyBtn || !restBtn) {
        console.log('Static buttons missing, creating dynamic buttons as fallback');
        // Clear and create dynamic buttons only if static ones are missing
        actionContainer.innerHTML = '';
        
        // Create new buttons for each available action
        availableActions.forEach((action, index) => {
            const button = document.createElement('button');
            button.className = `action-btn ${!action.available && action.available !== undefined ? 'disabled' : ''}`;
            button.id = `action-${action.id}`;
            button.onclick = () => takeDynamicAction(action);
            
            // Create preview effects text
            const effects = action.effects;
            const previewHTML = Object.keys(effects).map(stat => {
                // Calculate average for cleaner display - handle both arrays and single values
                let average;
                if (Array.isArray(effects[stat])) {
                    if (stat === 'hours') {
                        // For hours, show average to 1 decimal place
                        average = (effects[stat][0] + effects[stat][1]) / 2;
                    } else {
                        // For other stats, round to integer
                        average = Math.round((effects[stat][0] + effects[stat][1]) / 2);
                    }
                } else {
                    average = effects[stat];
                }
            
                if (stat === 'money' && average > 0) {
                    return `<span class="preview-stat ${stat}">+$${average}</span>`;
                } else if (stat === 'money') {
                    return `<span class="preview-stat ${stat}">-$${Math.abs(average)}</span>`;
                } else if (stat === 'hours') {
                    return `<span class="preview-stat ${stat}">HRS +${average.toFixed(1)}</span>`;
                } else if (stat === 'fatigue') {
                    const sign = average >= 0 ? '+' : '';
                    return `<span class="preview-stat ${stat}">FTG ${sign}${average}</span>`;
                } else {
                    const sign = average >= 0 ? '+' : '';
                    return `<span class="preview-stat ${stat}">${stat.toUpperCase().substring(0,3)} ${sign}${average}</span>`;
                }
            }).join(' ');
        
        button.innerHTML = `
            <span class="btn-icon">${action.icon}</span>
            <div class="btn-content">
                <div class="btn-title">${action.title}</div>
                <div class="btn-description">${action.description}</div>
                <div class="btn-preview">${previewHTML}</div>
            </div>
        `;
        
        actionContainer.appendChild(button);
    });
    }
}

// NEW FUNCTION: Update static button properties without destroying them
function updateStaticButton(button, actionType) {
    if (!button) return;
    
    const stats = gameState.stats;
    const weather = getWeeklyWeather();
    
    // Determine if action should be available
    let available = true;
    let description = '';
    let cost = 0;
    
    switch (actionType) {
        case 'study':
            available = true; // Study is always available
            description = 'Hit the books (Free)';
            cost = 0;
            break;
            
        case 'fly':
            // Use realistic cost calculation instead of hardcoded $250
            const lessonCost = calculateLessonCost();
            cost = lessonCost.cost;
            available = stats.money >= cost && weather.flyingFactor > 0; // Can afford and weather allows
            description = available ? `Book lesson ($${cost})` : (stats.money < cost ? `Need $${cost}` : 'Weather too bad');
            console.log(`[BUTTON] updateStaticButton FLY: money=$${stats.money}, cost=$${cost}, weather=${weather.flyingFactor}, available=${available}`);
            break;
            
        case 'rest':
            available = true; // Rest is always available
            description = 'Take a break (Free)';
            cost = 0;
            break;
    }
    
    // Update button appearance
    if (available) {
        button.classList.remove('disabled');
        button.disabled = false;
    } else {
        button.classList.add('disabled');
        button.disabled = true;
    }
    
    // Update description text
    const descriptionElement = button.querySelector('.btn-description');
    if (descriptionElement) {
        descriptionElement.textContent = description;
    }
    
    // Update preview stats with clear single values
    const previewElement = button.querySelector('.btn-preview');
    if (previewElement) {
        updateButtonPreview(previewElement, actionType, cost);
    }
}

// Helper function to update button preview with clean single values
function updateButtonPreview(previewElement, actionType, cost) {
    if (!previewElement) return;
    
    // Define action effects (same as fallback actions)
    const actionEffects = {
        study: { knowledge: [12, 18], morale: [-3, -7], safety: [3, 6] },
        fly: { hours: [1.3, 1.7], knowledge: [6, 12], morale: [8, 15], money: typeof cost === 'number' && !isNaN(cost) ? -cost : -250 },
        rest: { morale: [15, 25], safety: [5, 10], knowledge: [-2, -5] }
    };
    
    const effects = actionEffects[actionType];
    if (!effects) return;
    
    // Generate preview HTML with single average values
    const previewHTML = Object.keys(effects).map(stat => {
        let value;
        if (Array.isArray(effects[stat])) {
            // Calculate average for range
            value = Math.round((effects[stat][0] + effects[stat][1]) / 2);
        } else {
            // Single value (like money cost)
            value = effects[stat];
        }
        
        if (stat === 'money' && value > 0) {
            return `<span class="preview-stat ${stat}">+$${value}</span>`;
        } else if (stat === 'money') {
            return `<span class="preview-stat ${stat}">-$${Math.abs(value)}</span>`;
        } else if (stat === 'hours') {
            return `<span class="preview-stat ${stat}">HRS +${value.toFixed ? value.toFixed(1) : value}</span>`;
        } else if (stat === 'fatigue') {
            const sign = value >= 0 ? '+' : '';
            return `<span class="preview-stat ${stat}">FTG ${sign}${value}</span>`;
        } else {
            const sign = value >= 0 ? '+' : '';
            return `<span class="preview-stat ${stat}">${stat.toUpperCase().substring(0,3)} ${sign}${value}</span>`;
        }
    }).join(' ');
    
    previewElement.innerHTML = previewHTML;
}

// Handle dynamic actions
function takeDynamicAction(action) {
    if (gameState.gameEnded) return;
    if (!action.available && action.available !== undefined) return;
    if (gameState.stats.money < action.cost) return;
    
    const currentWeather = getWeeklyWeather();
    let eventText = '';
    let impact = { morale: 0, knowledge: 0, safety: 0, money: -action.cost, hours: 0, fatigue: 0 };
    
    // Apply the action's effects
    Object.keys(action.effects).forEach(stat => {
        const range = action.effects[stat];
        const value = range[0] + Math.random() * (range[1] - range[0]);
        impact[stat] += Math.round(value);
    });
    
    // Generate contextual event text based on action type
    eventText = generateActionEventText(action, impact);
    
    // Add cost breakdown for expensive lessons (transparency)
    if (action.cost > 300 && Math.random() < 0.3) {
        const lessonDetails = calculateLessonCost();
        const costBreakdown = generateCostBreakdownText(lessonDetails);
        eventText += ` Cost breakdown: ${costBreakdown}.`;
    }
    
    // Apply contextual aviation events frequently (70% for flying, 30% for study, 10% for rest)
    const eventFrequencies = {
        study: 0.3,
        fly: 0.7,
        rest: 0.1
    };
    const eventChance = eventFrequencies[action] || 0.3;
    
    if (Math.random() < eventChance) {
        const randomEvent = getContextualEvent(action);
        if (randomEvent) {
            eventText += ` ${randomEvent.text}`;
            impact.morale += randomEvent.morale || 0;
            impact.knowledge += randomEvent.knowledge || 0;
            impact.safety += randomEvent.safety || 0;
            impact.money += randomEvent.money || 0;
            impact.fatigue += randomEvent.fatigue || 0;
        }
    }
    
    // Check for fatigue-based burnout events
    const fatigueEvent = checkFatigueEffects(gameState.stats.fatigue + (impact.fatigue || 0), impact);
    if (fatigueEvent) {
        eventText += fatigueEvent;
    }
    
    // Apply impacts
    applyImpacts(impact);
    
    // Handle endorsement unlocking
    if (action.unlocks && action.unlocks.length > 0) {
        action.unlocks.forEach(endorsement => {
            unlockEndorsement(endorsement);
        });
    }
    
    // Add to logbook
    addLogbookEntry(action.title, impact.hours || 0, Math.abs(impact.money) || 0);
    
    // Advance day and update week for compatibility
    gameState.day++;
    gameState.week = Math.ceil(gameState.day / 7);
    
    // Update phase if conditions met
    updatePhase();
    
    // Check win/lose conditions
    checkEndConditions();
    
    // Update display
    updateDisplay();
    showWeeklyEvent(eventText, impact);
    updateLogbook();
}

function generateActionEventText(action, impact) {
    const textMap = {
        'basic-theory': [
            'You dive deep into the fundamentals of lift, thrust, drag, and weight. The four forces finally start making sense.',
            'Studying Bernoulli\'s principle and airfoil design. Your brain hurts, but the concepts are clicking.',
            'Working through basic aerodynamics problems. Each equation brings you closer to understanding flight.'
        ],
        'regulations': [
            'Memorizing Federal Aviation Regulations feels like learning a new language, but it\'s essential knowledge.',
            'Studying airspace classifications and communication procedures. Complex, but crucial for safe flight.',
            'Working through weather minimums and equipment requirements. Tedious but necessary.'
        ],
        'navigation': [
            'Plotting courses on sectional charts and calculating headings. Navigation is both art and science.',
            'Practicing pilotage and dead reckoning techniques. Getting lost on paper is better than in the air.',
            'Studying GPS procedures and backup navigation methods. Technology helps, but skills matter more.'
        ],
        'review': [
            'Going over previous lessons and filling knowledge gaps. Repetition builds competence.',
            'Reviewing mistake patterns and challenging concepts. Learning from errors prevents future ones.',
            'Consolidating scattered knowledge into a coherent understanding of aviation.'
        ],
        'advanced-study': [
            'Tackling complex systems and advanced procedures. This material challenges even experienced students.',
            'Studying sophisticated avionics and automation. Modern aviation demands continuous learning.',
            'Delving into advanced meteorology and performance calculations. The details make all the difference.'
        ],
        'pattern-work': [
            'Practicing takeoffs and landings in the traffic pattern. Each circuit builds muscle memory and confidence.',
            'Working on crosswind techniques and emergency procedures. Repetition in the pattern pays dividends.',
            'Refining approach speeds and landing flare. The pattern is your practice laboratory.'
        ],
        'solo-practice': [
            'Flying alone for the first time is both exhilarating and nerve-wracking. You handle it with growing confidence.',
            'Solo flight means making all the decisions yourself. Each flight builds independence and judgment.',
            'The airplane feels different without an instructor. You\'re truly becoming a pilot now.'
        ],
        'cross-country': [
            'Planning and executing a cross-country flight. Navigation, weather, and decision-making all come together.',
            'Flying to distant airports and dealing with different controllers. Every XC flight teaches new lessons.',
            'Building cross-country time toward your license requirements. The country looks different from above.'
        ],
        'ground-sim': [
            'Using the flight simulator as a weather alternative. Not quite like flying, but valuable instrument practice.',
            'Simulator sessions focus on procedures and emergency handling. Safe practice for dangerous situations.',
            'Ground-based training keeps skills sharp when weather prevents actual flight.'
        ],
        'deep-rest': [
            'Taking a complete break from aviation studies. Sleep and relaxation are essential for safe learning.',
            'Giving your mind time to process and consolidate aviation knowledge. Rest prevents burnout.',
            'Stepping back from training intensity. Even pilots need recovery time.'
        ],
        'recreational': [
            'Enjoying non-aviation activities to maintain balance and perspective in your training journey.',
            'Taking time for hobbies and social activities. A well-rounded pilot is a safer pilot.',
            'Recharging through recreation and fun. Training should enhance life, not consume it.'
        ],
        'part-time-work': [
            'Working part-time to fund your flying habit. Aviation dreams require financial commitment.',
            'Earning money for flight training through honest work. Every dollar brings you closer to your license.',
            'Balancing work and training requires discipline, but the goal makes it worthwhile.'
        ],
        'light-rest': [
            'Taking a light break from intensive training. Moderate rest maintains momentum while preventing fatigue.',
            'Enjoying some downtime while staying connected to your aviation goals.',
            'Balancing training intensity with necessary recovery time.'
        ]
    };
    
    const texts = textMap[action.id] || [`You complete ${action.title.toLowerCase()} training.`];
    return texts[Math.floor(Math.random() * texts.length)];
}

// Contextual event selection system
function getContextualEvent(action = null) {
    const stats = gameState.stats;
    const phase = gameState.phase;
    const currentWeather = getWeeklyWeather();
    const allEvents = [];
    
    // Phase-specific events
    if (phase === 'Ground School') {
        allEvents.push(...aviationEvents.groundSchool);
    } else if (phase === 'Pre-Solo') {
        allEvents.push(...aviationEvents.preSolo);
        allEvents.push(...aviationEvents.general);
    } else if (phase === 'Solo Training') {
        allEvents.push(...aviationEvents.solo);
        allEvents.push(...aviationEvents.general);
    } else if (phase === 'Cross-Country') {
        allEvents.push(...aviationEvents.crossCountry);
        allEvents.push(...aviationEvents.general);
    } else if (phase === 'Checkride Prep') {
        allEvents.push(...aviationEvents.checkride);
        allEvents.push(...aviationEvents.general);
    }
    
    // Weather-related events if weather is poor
    if (currentWeather.flyingFactor < 0.7) {
        allEvents.push(...aviationEvents.weather);
    }
    
    // Add mechanical events occasionally for flight actions
    if (action && (action.id === 'pattern-work' || action.id === 'solo-practice' || action.id === 'cross-country')) {
        if (Math.random() < 0.3) {
            allEvents.push(...aviationEvents.mechanical);
        }
    }
    
    // Social events are always possible
    allEvents.push(...aviationEvents.social);
    
    // Achievement events for successful players
    if (stats.morale > 70 && stats.safety > 75) {
        allEvents.push(...aviationEvents.achievements);
    }
    
    // Regulatory events for advanced students
    if (stats.flightHours > 30 || phase === 'Checkride Prep') {
        allEvents.push(...aviationEvents.regulatory);
    }
    
    // Select random event from contextual pool
    if (allEvents.length > 0) {
        return allEvents[Math.floor(Math.random() * allEvents.length)];
    }
    
    return null;
}

// Keyboard Navigation and Accessibility Features
function initKeyboardNavigation() {
    // Create focusable elements array
    const focusableElements = [
        '#morale-instrument',
        '#knowledge-instrument', 
        '#safety-instrument',
        '#money-instrument',
        '#hours-instrument',
        '#fatigue-instrument',
        '#progress-instrument',
        '#study-btn',
        '#fly-btn', 
        '#rest-btn'
    ];
    
    let currentFocusIndex = 0;
    
    // Keyboard event handler
    document.addEventListener('keydown', (e) => {
        if (gameState.gameEnded) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'Tab':
                e.preventDefault();
                currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
                focusElement(currentFocusIndex);
                break;
                
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                currentFocusIndex = currentFocusIndex <= 0 ? focusableElements.length - 1 : currentFocusIndex - 1;
                focusElement(currentFocusIndex);
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
                focusElement(currentFocusIndex);
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                activateCurrentElement();
                break;
                
            case '1':
                e.preventDefault();
                takeAction('study');
                break;
                
            case '2':
                e.preventDefault();
                takeAction('fly');
                break;
                
            case '3':
                e.preventDefault();
                takeAction('rest');
                break;
                
            case 'n':
            case 'N':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    resetGame();
                }
                break;
                
            case 'h':
            case 'H':
            case '?':
                e.preventDefault();
                showTutorial();
                break;
        }
    });
    
    function focusElement(index) {
        const element = document.querySelector(focusableElements[index]);
        if (element) {
            element.focus();
            
            // Announce to screen readers
            announceToScreenReader(getElementDescription(element));
        }
    }
    
    function activateCurrentElement() {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('action-btn')) {
            activeElement.click();
        } else if (activeElement.classList.contains('instrument')) {
            // Announce instrument value to screen reader
            const instrumentId = activeElement.id.replace('-instrument', '');
            announceInstrumentValue(instrumentId);
        }
    }
    
    function getElementDescription(element) {
        if (element.classList.contains('instrument')) {
            const label = element.getAttribute('aria-label');
            const value = element.getAttribute('aria-valuenow');
            return `${label}: ${value}`;
        } else if (element.classList.contains('action-btn')) {
            return element.getAttribute('aria-label');
        }
        return '';
    }
}

// Screen Reader Announcements
function announceToScreenReader(message) {
    // Create or update live region for screen reader announcements
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
}

function announceInstrumentValue(instrumentId) {
    const stat = gameState.stats;
    let message = '';
    
    switch(instrumentId) {
        case 'morale':
            message = `Morale: ${stat.morale}%. ${getStatusDescription(stat.morale, 'morale')}`;
            break;
        case 'knowledge':
            message = `Knowledge: ${stat.knowledge}%. ${getStatusDescription(stat.knowledge, 'knowledge')}`;
            break;
        case 'safety':
            message = `Safety: ${stat.safety}%. ${getStatusDescription(stat.safety, 'safety')}`;
            break;
        case 'money':
            message = `Budget: $${stat.money.toLocaleString()}. ${getMoneyStatus(stat.money)}`;
            break;
        case 'hours':
            message = `Flight Hours: ${stat.flightHours.toFixed(1)}. Need ${Math.max(0, 40 - stat.flightHours).toFixed(1)} more for PPL`;
            break;
        case 'fatigue':
            message = `Fatigue: ${stat.fatigue}%. ${getFatigueStatus(stat.fatigue)}`;
            break;
        case 'progress':
            message = `Training Progress: ${stat.progress}%. ${getProgressPhase()}`;
            break;
    }
    
    announceToScreenReader(message);
}

function getStatusDescription(value, type) {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Needs improvement';
    return 'Critical - needs immediate attention';
}

function getMoneyStatus(money) {
    if (money >= 10000) return 'Sufficient funds';
    if (money >= 5000) return 'Running low';
    if (money >= 2000) return 'Very low funds';
    return 'Critical - may not complete training';
}

function getFatigueStatus(fatigue) {
    if (fatigue <= 20) return 'Well rested';
    if (fatigue <= 50) return 'Somewhat tired';
    if (fatigue <= 80) return 'Very tired - consider rest';
    return 'Exhausted - rest required';
}

function getProgressPhase() {
    return `Current phase: ${gameState.phase}`;
}

// Update ARIA values when game state changes
function updateAccessibilityValues() {
    const stat = gameState.stats;
    
    // Update aria-valuenow for all instruments
    const instruments = [
        { id: 'morale-instrument', value: stat.morale },
        { id: 'knowledge-instrument', value: stat.knowledge },
        { id: 'safety-instrument', value: stat.safety },
        { id: 'money-instrument', value: stat.money },
        { id: 'hours-instrument', value: Math.round(stat.flightHours) },
        { id: 'fatigue-instrument', value: stat.fatigue },
        { id: 'progress-instrument', value: stat.progress }
    ];
    
    instruments.forEach(inst => {
        const element = document.getElementById(inst.id);
        if (element) {
            element.setAttribute('aria-valuenow', inst.value);
        }
    });
}

// Enhance existing updateDisplay function to include accessibility
const originalUpdateDisplay = updateDisplay;
updateDisplay = function() {
    originalUpdateDisplay.call(this);
    updateAccessibilityValues();
};

// Verify critical DOM elements exist
function verifyModalElements() {
    const requiredElements = [
        'gameover-modal',
        'dramatic-title', 
        'narrative-text',
        'epilogue-text',
        'journey-days',
        'journey-hours', 
        'journey-spent',
        'journey-progress'
    ];
    
    const missingElements = [];
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('[CRITICAL] Missing required DOM elements:', missingElements);
        console.error('The dramatic ending system may not function properly.');
        return false;
    } else {
        console.log('[INFO] All modal elements verified successfully');
        return true;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initKeyboardNavigation();
    verifyModalElements(); // Verify all modal elements exist
});