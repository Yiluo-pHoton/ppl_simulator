// PPL Simulator - Dynamic Event System
// Comprehensive event library with context-based actions

// Event chain tracking - initialize only if not already defined
if (typeof eventChains === 'undefined') {
    var eventChains = {};
}

// Weather conditions that affect available options
if (typeof weatherTypes === 'undefined') {
    var weatherTypes = {
    clear: { 
        name: 'Clear skies', 
        flyable: true, 
        color: 'linear-gradient(90deg, #87CEEB, #98D8E8)',
        textColor: '#1e3a5f'
    },
    marginal: { 
        name: 'Marginal VFR', 
        flyable: false,  // Student pilots shouldn't fly in MVFR
        color: 'linear-gradient(90deg, #FFA500, #FFB84D)',
        textColor: '#333'
    },
    ifr: { 
        name: 'IFR conditions', 
        flyable: false, 
        color: 'linear-gradient(90deg, #FF6B6B, #FF8A8A)',
        textColor: 'white'
    },
    storms: { 
        name: 'Thunderstorms', 
        flyable: false, 
        color: 'linear-gradient(90deg, #6F42C1, #8A5DD8)',
        textColor: 'white'
    }
    };
}

// Dynamic event templates
if (typeof dynamicEvents === 'undefined') {
    var dynamicEvents = {
    // Financial Events
    financial: [
        {
            id: 'ppl_coin_intro',
            text: "A fellow student pilot excitedly shows you his phone. 'Check out PPL Coin! It's a new crypto for pilots. I've already doubled my training fund!'",
            probability: 0.15,
            condition: (state) => state.day > 10 && state.stats.money > 3000 && !eventChains['ppl_coin'],  // Has money to invest and chain not started
            buttons: [
                { 
                    text: "Invest $2000", 
                    impact: { money: -2000 }, 
                    outcome: "You buy 4000 PPL Coins at $0.50 each. Time will tell if this was wise...",
                    chainStart: 'ppl_coin',
                    chainData: { coins: 4000, buyPrice: 0.5 }
                },
                { 
                    text: "Research first", 
                    impact: { knowledge: 2 }, 
                    outcome: "You discover it's unregulated and based mostly on aviation memes. Concerning."
                },
                { 
                    text: "Hard pass", 
                    impact: { safety: 3 }, 
                    outcome: "You politely decline. Your training fund stays safe in the bank."
                }
            ]
        },
        {
            id: 'headset_decision',
            text: "Your borrowed headset finally died mid-flight. The FBO has several options available.",
            probability: 0.2,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 2 && state.stats.flightHours < 30,  // Early in training when equipment needs arise
            buttons: [
                { 
                    text: "Basic passive ($100)", 
                    impact: { money: -100, safety: -2 }, 
                    outcome: "It works, but the engine noise is fatiguing and ATC is hard to hear."
                },
                { 
                    text: "ANR Lightspeed ($800)", 
                    impact: { money: -800, safety: 8, morale: 10 }, 
                    outcome: "Crystal clear audio and amazing comfort. Flying is so much more enjoyable!"
                },
                { 
                    text: "Mid-range Faro ($350)", 
                    impact: { money: -350, safety: 5, morale: 5 }, 
                    outcome: "Good balance of features and cost. The noise reduction helps with fatigue."
                }
            ]
        },
        {
            id: 'foreflight_subscription',
            text: "Your paper charts are getting expensive to update. ForeFlight has a special student discount.",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 5 && state.stats.knowledge > 30,  // After basic navigation training starts
            buttons: [
                { 
                    text: "Basic Plus ($99/yr)", 
                    impact: { money: -99, knowledge: 5 }, 
                    outcome: "Digital charts and basic flight planning. A huge upgrade from paper!"
                },
                { 
                    text: "Pro Plus ($199/yr)", 
                    impact: { money: -199, knowledge: 8, safety: 5 }, 
                    outcome: "Synthetic vision and hazard awareness. Your situational awareness improves dramatically."
                },
                { 
                    text: "Stick with paper", 
                    impact: { money: -30 }, 
                    outcome: "You buy updated sectionals. Old school, but it works."
                }
            ]
        },
        {
            id: 'fuel_price_spike',
            text: "Fuel prices just jumped 30% due to supply issues. The FBO is apologetic but firm on new rates.",
            probability: 0.1,
            frequency: 'once',
            condition: (state) => state.day > 7 && state.stats.money > 5000,  // After initial training, when money matters more
            buttons: [
                { 
                    text: "Absorb the cost", 
                    impact: { money: -150, morale: -5 }, 
                    outcome: "You'll manage, but your budget is getting tighter. All future flights cost more.",
                    chainData: { fuelPriceIncreased: true }
                },
                { 
                    text: "Switch to cheaper airport", 
                    impact: { fatigue: 10, morale: -3 }, 
                    outcome: "You find an airport 45min away with better prices. The extra driving adds fatigue to every flight.",
                    chainData: { cheaperAirport: true, extraDriving: true }
                },
                { 
                    text: "Reduce flight frequency", 
                    impact: { morale: -10, knowledge: -2 }, 
                    outcome: "You space out lessons more to afford them. Progress slows but budget stays manageable.",
                    chainData: { reducedFrequency: true }
                }
            ]
        }
    ],

    // Personal/Social Events
    social: [
        {
            id: 'cfi_evaluation',
            text: "Your CFI sits you down: 'We need to talk about your progress. I have some concerns.'",
            probability: 0.2,
            condition: (state) => state.day > 10,
            buttons: [
                { 
                    text: "Listen openly", 
                    impact: { knowledge: 10, safety: 8, morale: -3 }, 
                    outcome: "Hard to hear, but valuable feedback about your steep turns and radio work."
                },
                { 
                    text: "Get defensive", 
                    impact: { morale: -10, knowledge: 2 }, 
                    outcome: "The conversation goes poorly. You realize later they were trying to help."
                },
                { 
                    text: "Ask for specific help", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "Together you create a focused improvement plan. Great session!"
                }
            ]
        },
        {
            id: 'atc_friendly',
            text: "Tower controller recognizes your tail number: 'Hey, you're sounding more confident on the radio!'",
            probability: 0.15,
            condition: (state) => state.lastAction === 'fly' && state.stats.flightHours > 3,  // Only after flying
            buttons: [
                { 
                    text: "Thank you, Tower!", 
                    impact: { morale: 15, knowledge: 3 }, 
                    outcome: "The encouragement means a lot. ATC are people too!"
                }
            ]
        },
        {
            id: 'student_competition_pre_solo',
            text: "Another student who started after you just soloed. They ask, 'Haven't you soloed yet?'",
            probability: 0.2,
            condition: (state) => !state.milestones.firstSolo && state.stats.flightHours > 8,
            buttons: [
                { 
                    text: "Each at own pace", 
                    impact: { morale: 5, safety: 5 }, 
                    outcome: "You remind yourself that safe progression matters more than speed."
                },
                { 
                    text: "Feel pressured", 
                    impact: { morale: -15, safety: -5 }, 
                    outcome: "The comparison stings. You consider rushing your training."
                },
                { 
                    text: "Congratulate them", 
                    impact: { morale: 8, knowledge: 2 }, 
                    outcome: "You're genuinely happy for them. They share some helpful solo tips."
                }
            ]
        },
        {
            id: 'student_competition_post_solo',
            text: "A newer student asks about your training. 'Wow, you've already soloed? Any tips?'",
            probability: 0.2,
            condition: (state) => state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Share wisdom", 
                    impact: { morale: 10, knowledge: 5 }, 
                    outcome: "Teaching others reinforces your own knowledge. You feel like a mentor!"
                },
                { 
                    text: "Stay humble", 
                    impact: { morale: 5, safety: 5 }, 
                    outcome: "You share that every pilot's journey is different. Keep focusing on safety."
                },
                { 
                    text: "Encourage them", 
                    impact: { morale: 8, safety: 3 }, 
                    outcome: "You reassure them they'll get there. The aviation community supports each other."
                }
            ]
        },
        {
            id: 'cfi_late',
            text: "Your CFI is 45 minutes late. The Hobbs meter is running on the scheduled plane.",
            probability: 0.15,
            condition: (state) => state.lastAction === 'fly',  // Only when planning to fly
            buttons: [
                { 
                    text: "Wait patiently", 
                    impact: { money: -50, morale: -5 }, 
                    outcome: "They arrive apologetic. You lose money but maintain the relationship."
                },
                { 
                    text: "Cancel and leave", 
                    impact: { morale: -8, safety: 3 }, 
                    outcome: "You stand up for yourself but miss the lesson."
                },
                { 
                    text: "Use time to preflight", 
                    impact: { knowledge: 5, safety: 8 }, 
                    outcome: "Most thorough preflight ever! You find a nail in the tire - good catch!"
                }
            ]
        }
    ],

    // Aviation World Events
    world: [
        {
            id: 'airventure_bounce',
            text: "Video from Oshkosh shows a Bonanza bouncing three times before the left wing strikes the ground. The pilot was fine but shaken.",
            probability: 0.1,
            condition: (state) => state.stats.flightHours > 3,  // After basic landing training begins
            buttons: [
                { 
                    text: "Study landing technique", 
                    impact: { knowledge: 8, safety: 10 }, 
                    outcome: "You learn about porpoising and the go-around decision. Valuable lesson."
                },
                { 
                    text: "That's why we train", 
                    impact: { safety: 5, morale: 3 }, 
                    outcome: "You appreciate the importance of solid fundamentals."
                }
            ]
        },
        {
            id: 'new_regulations',
            text: "The FAA just announced changes to BasicMed requirements, potentially affecting your future flying.",
            probability: 0.08,
            condition: (state) => state.stats.knowledge > 25,  // When student understands basic regulations
            buttons: [
                { 
                    text: "Research the changes", 
                    impact: { knowledge: 10 }, 
                    outcome: "You understand the new rules. Knowledge of regs will help on your written test."
                },
                { 
                    text: "Ask CFI to explain", 
                    impact: { knowledge: 8, morale: 3 }, 
                    outcome: "Your instructor gives a practical breakdown of what it means for you."
                }
            ]
        },
        {
            id: 'local_accident',
            text: "A plane crashed at a nearby airport after attempting to land with a tailwind. Both occupants survived.",
            probability: 0.1,
            condition: (state) => state.stats.flightHours > 5 && state.stats.safety > 40,  // When safety awareness matters
            buttons: [
                { 
                    text: "Review wind decisions", 
                    impact: { knowledge: 10, safety: 15, morale: -5 }, 
                    outcome: "Sobering reminder about the importance of wind awareness and go-around decisions."
                },
                { 
                    text: "Avoid the news", 
                    impact: { morale: 2, safety: -3 }, 
                    outcome: "You try not to think about it, but ignoring safety lessons isn't wise."
                }
            ]
        }
    ],
    
    // Life Events - Real world impacts on training
    life: [
        {
            id: 'relationship_pressure',
            text: "Your partner sits you down: 'You're always at the airport. We need to talk about us.'",
            probability: 0.15,
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Promise to balance better", 
                    impact: { morale: -8, fatigue: 5 }, 
                    outcome: "You agree to reduce training frequency. Relationships require compromise."
                },
                { 
                    text: "Explain your dream", 
                    impact: { morale: 10, knowledge: 2 }, 
                    outcome: "They understand better now and even offer to visit the airport with you!"
                },
                { 
                    text: "Take a break", 
                    impact: { morale: -15, fatigue: -10 }, 
                    outcome: "You pause training for a week. Sometimes perspective helps."
                }
            ]
        },
        {
            id: 'work_bonus',
            text: "Surprise! Your annual review went great and you got a $2000 bonus!",
            probability: 0.08,
            condition: (state) => state.day > 15,
            buttons: [
                { 
                    text: "All to flight training!", 
                    impact: { money: 2000, morale: 20 }, 
                    outcome: "Your training fund gets a huge boost! PPL here you come!"
                },
                { 
                    text: "Split it wisely", 
                    impact: { money: 1000, morale: 15 }, 
                    outcome: "Half for flying, half for life. Balance is important."
                }
            ]
        },
        {
            id: 'aopa_scholarship',
            text: "Email notification: 'Congratulations! You've been awarded a $500 AOPA flight training scholarship!'",
            probability: 0.05,
            condition: (state) => state.stats.knowledge > 50,
            buttons: [
                { 
                    text: "Amazing news!", 
                    impact: { money: 500, morale: 25 }, 
                    outcome: "Every bit helps! You're that much closer to your dream."
                }
            ]
        },
        {
            id: 'car_breakdown',
            text: "Your car won't start at the airport. The mechanic quotes $1200 for a new transmission.",
            probability: 0.1,
            buttons: [
                { 
                    text: "Fix it (no choice)", 
                    impact: { money: -1200, morale: -20 }, 
                    outcome: "There goes three flight lessons. Life always finds a way to interrupt dreams."
                },
                { 
                    text: "Cheap patch ($400)", 
                    impact: { money: -400, morale: -10, safety: -5 }, 
                    outcome: "It'll last a few months. You're cutting corners everywhere now."
                }
            ]
        },
        {
            id: 'family_doubt',
            text: "Your parent calls: 'Isn't flying dangerous? I saw another small plane crash on the news.'",
            probability: 0.12,
            condition: (state) => state.day > 5 && state.stats.flightHours > 2,  // After family knows you're actively flying
            buttons: [
                { 
                    text: "Explain safety stats", 
                    impact: { knowledge: 5, morale: -5 }, 
                    outcome: "You share facts about GA safety, but their worry still weighs on you."
                },
                { 
                    text: "Brush it off", 
                    impact: { morale: -10 }, 
                    outcome: "You change the subject, but their doubt lingers in your mind."
                },
                { 
                    text: "Invite them to visit", 
                    impact: { morale: 15, money: -50 }, 
                    outcome: "They meet your CFI and see the plane. Now they're your biggest supporter!"
                }
            ]
        },
        {
            id: 'health_scare',
            text: "You've been having dizzy spells. The doctor wants tests that could affect your medical.",
            probability: 0.08,
            condition: (state) => state.stats.fatigue > 50,
            buttons: [
                { 
                    text: "Get checked immediately", 
                    impact: { money: -300, safety: 15, morale: -10 }, 
                    outcome: "Just dehydration and fatigue. Relief! But a reminder to take care of yourself."
                },
                { 
                    text: "Wait and see", 
                    impact: { safety: -20, morale: -15 }, 
                    outcome: "Probably nothing, but the worry affects your flying confidence."
                }
            ]
        },
        {
            id: 'old_friend_encouragement',
            text: "An old friend texts: 'Saw your flight training posts! So proud of you chasing your dreams!'",
            probability: 0.1,
            condition: (state) => state.day > 15 && state.stats.morale < 70,  // When morale boost is most needed
            buttons: [
                { 
                    text: "Thanks, means a lot!", 
                    impact: { morale: 20 }, 
                    outcome: "Sometimes a little encouragement is all you need to keep going."
                }
            ]
        },
        {
            id: 'work_overtime',
            text: "Your boss needs you to work weekends for the next month. 'It's critical for the project.'",
            probability: 0.15,
            condition: (state) => state.day > 10,
            buttons: [
                { 
                    text: "Accept (need job)", 
                    impact: { morale: -15, fatigue: 20, money: 500 }, 
                    outcome: "Extra pay helps, but no weekend flying for a month. Progress stalls."
                },
                { 
                    text: "Negotiate mornings off", 
                    impact: { morale: -5, fatigue: 10 }, 
                    outcome: "You can still fly early mornings. Exhausting but manageable."
                },
                { 
                    text: "Risk saying no", 
                    impact: { morale: 10, safety: 5 }, 
                    outcome: "Surprisingly, they respect your boundary. 'We'll find another way.'"
                }
            ]
        },
        {
            id: 'tax_refund',
            text: "Your tax refund arrived - $1,800! More than you expected.",
            probability: 0.08,
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Straight to flying!", 
                    impact: { money: 1800, morale: 18 }, 
                    outcome: "That's 8-10 more flight hours funded! Perfect timing."
                },
                { 
                    text: "Save half", 
                    impact: { money: 900, morale: 10 }, 
                    outcome: "Emergency fund and flight fund both win. Smart choice."
                }
            ]
        },
        {
            id: 'rent_increase',
            text: "Letter from landlord: Rent is increasing by $200/month starting next month.",
            probability: 0.1,
            condition: (state) => state.day > 25,
            buttons: [
                { 
                    text: "Accept it", 
                    impact: { morale: -25 }, 
                    outcome: "That's one less flight lesson per month, indefinitely. Dreams just got harder."
                },
                { 
                    text: "Find roommate", 
                    impact: { morale: -10, fatigue: 5 }, 
                    outcome: "Sharing space isn't ideal, but it keeps the dream alive."
                }
            ]
        },
        {
            id: 'employer_support',
            text: "HR emails: 'We're starting an employee development fund. Flying lessons could qualify for $1000!'",
            probability: 0.05,
            condition: (state) => state.stats.knowledge > 40,
            buttons: [
                { 
                    text: "Apply immediately!", 
                    impact: { money: 1000, morale: 30 }, 
                    outcome: "Approved! Your company believes in your growth. What a boost!"
                },
                { 
                    text: "Too good to be true?", 
                    impact: { morale: -5 }, 
                    outcome: "You hesitate and miss the deadline. Opportunity lost."
                }
            ]
        },
        {
            id: 'social_media_inspiration',
            text: "You see a post: 'One year ago I was scared of flying. Today I passed my checkride!' with celebration photos.",
            probability: 0.1,
            condition: (state) => state.stats.morale < 65 && state.day > 10,  // When inspiration is most helpful
            buttons: [
                { 
                    text: "If they can, I can!", 
                    impact: { morale: 15, knowledge: 2 }, 
                    outcome: "You reach out and they share helpful tips. The aviation community is amazing."
                }
            ]
        },
        {
            id: 'credit_card_offer',
            text: "Pre-approved for a credit card with 0% APR for 18 months. Could fund training now, pay later.",
            probability: 0.08,
            condition: (state) => state.stats.money < 8000 && state.day > 20,  // When money is getting tight
            buttons: [
                { 
                    text: "Take $3000 advance", 
                    impact: { money: 3000, morale: -5 }, 
                    outcome: "Risky but it accelerates training. Just need discipline to pay it back."
                },
                { 
                    text: "Too risky", 
                    impact: { safety: 5 }, 
                    outcome: "Debt and flying stress don't mix well. Slow and steady."
                }
            ]
        },
        {
            id: 'pet_emergency',
            text: "Your dog needs emergency surgery. The vet bill is $2000.",
            probability: 0.08,
            condition: (state) => state.stats.money > 3000 && state.day > 15,  // When you have some money saved
            buttons: [
                { 
                    text: "Do whatever it takes", 
                    impact: { money: -2000, morale: -15 }, 
                    outcome: "Your furry friend recovers fully, but training is on hold for months."
                },
                { 
                    text: "Payment plan", 
                    impact: { money: -500, morale: -8 }, 
                    outcome: "Vet offers monthly payments. Training slows but doesn't stop."
                }
            ]
        }
    ],

    // Training Challenges
    training: [
        {
            id: 'plane_maintenance',
            text: "Your usual training plane is down for its 100-hour inspection. The only alternative is a more expensive model.",
            probability: 0.2,
            condition: (state) => state.lastAction === 'fly' && state.stats.flightHours > 3,  // After some flight experience
            buttons: [
                { 
                    text: "Fly the expensive one", 
                    // Store calculated values for outcome message
                    calculatedValues: {},
                    impact: function(state) {
                        // Calculate cost with premium aircraft rate
                        // G1000 equipped planes typically cost $50-80/hr more
                        const u1 = Math.random();
                        const u2 = Math.random();
                        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        const z1 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
                        const z2 = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
                        
                        // Premium aircraft rate: mean $235/hr (regular + $70), std $15
                        const aircraftRate = Math.round(235 + z0 * 15);
                        const actualAircraftRate = Math.max(200, Math.min(280, aircraftRate));
                        
                        // Same CFI rate: mean $85/hr, std $12
                        const cfiRate = Math.round(85 + z1 * 12);
                        const actualCFIRate = Math.max(60, Math.min(110, cfiRate));
                        
                        // Flight time: 0.7-1.8 hours for 2-hour lesson
                        let flightTime = 1.2 + z2 * 0.3;
                        flightTime = Math.max(0.7, Math.min(1.8, flightTime));
                        
                        const lessonHours = 2.0;
                        const aircraftCost = Math.round(actualAircraftRate * flightTime);
                        const cfiCost = Math.round(actualCFIRate * lessonHours);
                        const totalCost = aircraftCost + cfiCost;
                        
                        // Store values for outcome message
                        this.calculatedValues.flightTime = flightTime.toFixed(1);
                        this.calculatedValues.totalCost = totalCost;
                        
                        return { 
                            money: -totalCost, 
                            knowledge: 8,  // Better plane = better learning
                            flightHours: flightTime,
                            fatigue: 8
                        };
                    },
                    outcome: function(state) {
                        return `The G1000 equipped plane is amazing! ${this.calculatedValues.flightTime} flight hours in advanced avionics. Total: $${this.calculatedValues.totalCost}.`;
                    }
                },
                { 
                    text: "Ground school instead", 
                    impact: { knowledge: 8, morale: -3 }, 
                    outcome: "Productive study session, though you really wanted to fly."
                },
                { 
                    text: "Wait for your plane", 
                    impact: { morale: -5 }, 
                    outcome: "Frustrating delay, but you save money."
                }
            ]
        },
        {
            id: 'crosswind_challenge',
            text: "Winds are 15 knots at 40 degrees off the runway. Your CFI asks, 'Want to try it?'",
            probability: 0.15,
            condition: (state) => state.lastAction === 'fly' && state.stats.flightHours > 5,  // Only during flight lessons
            buttons: [
                { 
                    text: "Let's do this!", 
                    impact: { knowledge: 10, safety: 8, morale: 15 }, 
                    outcome: "Challenging but you nail it! Major confidence boost."
                },
                { 
                    text: "Watch you demo first", 
                    impact: { knowledge: 12, safety: 10 }, 
                    outcome: "Smart choice. You learn the technique before trying it yourself."
                },
                { 
                    text: "Too windy for me", 
                    impact: { safety: 15, morale: -5 }, 
                    outcome: "Good ADM. Your CFI respects your conservative decision."
                }
            ]
        },
        {
            id: 'radio_failure',
            text: "During pattern work, your radio dies completely. Tower can't hear you.",
            probability: 0.1,
            condition: (state) => state.lastAction === 'fly' && state.stats.flightHours > 8,  // Only during flight
            buttons: [
                { 
                    text: "Squawk 7600", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "Perfect! You squawk 7600 immediately. Remember: 'Seventy-six, radio needs fix!' Tower sees your transponder code and clears traffic. You watch for light gun signals and land safely."
                },
                { 
                    text: "Continue pattern normally", 
                    impact: { safety: -10, knowledge: 5 }, 
                    outcome: "Bad idea! Other aircraft can't hear your position calls. Tower frantically tries light signals. You eventually realize you should squawk 7600."
                },
                { 
                    text: "Leave pattern immediately", 
                    impact: { safety: -5, morale: -8, knowledge: 8 }, 
                    outcome: "You turn out without proper communication. Should have squawked 7600 first! Remember: transponder code for lost comms is 7600."
                }
            ]
        }
    ],

    // Safety Learning Events
    safety: [
        {
            id: 'near_miss',
            text: "Traffic suddenly appears at your altitude, same direction. Tower didn't call it out.",
            probability: 0.08,
            condition: (state) => state.stats.flightHours > 10,
            buttons: [
                { 
                    text: "Immediate evasive action", 
                    impact: { safety: 15, morale: -8, knowledge: 10 }, 
                    outcome: "Quick thinking! You realize the importance of always scanning for traffic."
                },
                { 
                    text: "Report to Tower", 
                    impact: { safety: 12, knowledge: 8 }, 
                    outcome: "Tower apologizes and vectors the traffic. You learn about pilot advocacy."
                }
            ]
        },
        {
            id: 'weather_deteriorating',
            text: "Clouds are dropping fast during your cross-country. Visibility decreasing.",
            probability: 0.12,
            condition: (state) => state.stats.flightHours > 20,
            buttons: [
                { 
                    text: "Immediate 180", 
                    impact: { safety: 20, knowledge: 10, morale: -3 }, 
                    outcome: "Perfect decision! You escape deteriorating conditions safely."
                },
                { 
                    text: "Descend and continue", 
                    impact: { safety: -15, morale: -10, knowledge: 5 }, 
                    outcome: "Bad choice. Your CFI takes control. Scary lesson in weather respect."
                },
                { 
                    text: "Land immediately", 
                    impact: { safety: 18, knowledge: 12, money: -100 }, 
                    outcome: "You divert to nearest airport. Expensive Uber home, but safe!"
                }
            ]
        },
        {
            id: 'discovery_flight_referral',
            text: "A friend wants to try a discovery flight and asks if you know a good instructor. Your CFI offers a referral bonus.",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 10 && state.stats.morale > 50,  // When you're enthusiastic enough to promote flying
            buttons: [
                { 
                    text: "Make the referral", 
                    impact: { money: 100, morale: 10 }, 
                    outcome: "Your friend loves flying! Your CFI gives you a referral bonus."
                },
                { 
                    text: "Just give contact info", 
                    impact: { morale: 5 }, 
                    outcome: "You help without expecting anything. Good pilot community spirit."
                }
            ]
        }
    ],

    // Legacy chain data removed - now using dynamic system in checkChainEvents()
    };
}

// Function to get a random event based on conditions (no double probability filtering)
function selectRandomEvent(gameState) {
    const allEvents = [
        ...dynamicEvents.financial,
        ...dynamicEvents.social,
        ...dynamicEvents.world,
        ...dynamicEvents.training,
        ...dynamicEvents.safety
    ];
    
    // Filter events by condition and recent history
    const validEvents = allEvents.filter(event => {
        if (event.condition && !event.condition(gameState)) {
            return false;
        }
        // Check if event was recently shown (within 7 days)
        if (gameState.eventHistory && gameState.eventHistory.some(h => h.eventId === event.id && gameState.day - h.day < 7)) {
            return false;
        }
        return true;
    });
    
    if (validEvents.length === 0) return null;
    
    // Use probability as weight for selection
    const totalWeight = validEvents.reduce((sum, event) => sum + (event.probability || 0.2), 0);
    let random = Math.random() * totalWeight;
    
    for (const event of validEvents) {
        const weight = event.probability || 0.2;
        random -= weight;
        if (random <= 0) {
            return event;
        }
    }
    
    return validEvents[0];
}

// Function to check for chain event triggers
function checkChainEvents(state, chainId) {
    const chain = eventChains[chainId];
    if (!chain) return null;
    
    // Check if it's time for next phase
    const daysSinceStart = state.day - chain.startDay;
    
    // PPL Coin chain
    if (chainId === 'ppl_coin') {
        if (daysSinceStart === 5) {
            return {
                id: 'ppl_coin_rise',
                text: "PPL Coin is mooning! It's now at $2.50. Your investment is worth $10,000!",
                buttons: [
                    {
                        text: "HODL to the moon!",
                        impact: {},
                        outcome: "Diamond hands! You're keeping all 4000 coins.",
                        nextPhase: 'crash'
                    },
                    {
                        text: "Sell half",
                        impact: { money: 5000 },
                        outcome: "You cash out $5000, keeping 2000 coins. Smart hedging!",
                        chainData: { coins: 2000 }
                    },
                    {
                        text: "Sell everything",
                        impact: { money: 10000, morale: 20 },
                        outcome: "You pocket $10,000 profit! Perfect timing.",
                        endChain: true
                    }
                ]
            };
        } else if (daysSinceStart === 10 && chain.phase === 'crash') {
            return {
                id: 'ppl_coin_crash',
                text: "PPL Coin crashed overnight! The founder was arrested for fraud. It's now worthless.",
                buttons: [
                    {
                        text: "Accept the loss",
                        impact: { morale: -25, knowledge: 10 },
                        outcome: "Expensive lesson learned. At least you have a story for the hangar.",
                        endChain: true
                    }
                ]
            };
        }
    }
    
    // Checkride prep chain
    if (chainId === 'checkride_prep' && state.stats.flightHours >= 38) {
        if (!chain.phase || chain.phase === 'initial') {
            return {
                id: 'checkride_phase1',
                text: "Your CFI announces: 'I think you're ready for your checkride! Let's do a mock exam.'",
                buttons: [
                    {
                        text: "Let's do this!",
                        impact: { money: -200, knowledge: 15, safety: 10 },
                        outcome: "The mock checkride goes well. A few rough spots but you're close!",
                        nextPhase: 'checkride'
                    },
                    {
                        text: "Need more practice",
                        impact: { safety: 5 },
                        outcome: "You decide to fly a few more hours first. Better safe than sorry."
                    }
                ]
            };
        } else if (chain.phase === 'checkride' && state.stats.flightHours >= 40) {
            return {
                id: 'checkride_final',
                text: "Today's the day! Your DPE examiner awaits. Ready for your Private Pilot checkride?",
                buttons: [
                    {
                        text: "Take checkride ($500)",
                        impact: { money: -500 },
                        outcome: state.stats.knowledge >= 80 && state.stats.safety >= 75 ? 
                            "CONGRATULATIONS! You passed! You're now a licensed Private Pilot!" :
                            "You didn't pass. The DPE suggests more practice on steep turns and emergency procedures.",
                        triggerEnding: state.stats.knowledge >= 80 && state.stats.safety >= 75 ? 'success' : null,
                        endChain: true
                    },
                    {
                        text: "Postpone",
                        impact: { morale: -5 },
                        outcome: "You reschedule for next week. Sometimes discretion is the better part of valor."
                    }
                ]
            };
        }
    }
    
    return null;
}

// Function to start an event chain
function startEventChain(chainId, data = {}) {
    eventChains[chainId] = {
        startDay: gameState.day,
        phase: 'initial',
        ...data
    };
}

// Function to advance event chain
function advanceEventChain(chainId, nextPhase) {
    if (eventChains[chainId]) {
        eventChains[chainId].phase = nextPhase;
    }
}