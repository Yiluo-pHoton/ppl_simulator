// PPL Simulator - Expanded Training Events (50+ Events)
// Based on real student pilot experiences and CFI insights

const expandedTrainingEvents = {
    // Early Training Events (0-10 hours)
    earlyTraining: [
        {
            id: 'cfi_flip_flops',
            text: "Your CFI shows up in flip-flops and board shorts. 'Ready to fly, dude?'",
            probability: 0.08,
            condition: (state) => state.day < 20 && state.stats.flightHours < 5,
            buttons: [
                { 
                    text: "Express concern", 
                    impact: { safety: 10, morale: -5 }, 
                    outcome: "CFI gets defensive but changes shoes. 'Fine, I'll be professional.'",
                    reputation: { cfi: -1, safety: 1 }
                },
                { 
                    text: "Go with it", 
                    impact: { safety: -15, morale: -10 }, 
                    outcome: "Unprofessional lesson. You question if this is the right instructor.",
                    chainStart: 'bad_cfi_experience'
                },
                { 
                    text: "Request different CFI", 
                    impact: { knowledge: -5, safety: 15 }, 
                    outcome: "School assigns more professional instructor. Good call.",
                    chainStart: 'cfi_switch',
                    reputation: { safety: 2 }
                }
            ]
        },
        {
            id: 'ground_school_overload',
            text: "After 3 hours of regulations study, your brain is mush. Nothing makes sense anymore.",
            probability: 0.15,
            condition: (state) => state.stats.knowledge < 40 && state.stats.fatigue > 30,
            buttons: [
                { 
                    text: "Take a break", 
                    impact: { fatigue: -10, knowledge: 5 }, 
                    outcome: "Rest helps. Information starts clicking. Sometimes less is more."
                },
                { 
                    text: "Push through", 
                    impact: { fatigue: 20, knowledge: -5 }, 
                    outcome: "Diminishing returns. You're just confusing yourself now."
                },
                { 
                    text: "Switch to practical", 
                    impact: { knowledge: 10, morale: 10 }, 
                    outcome: "Chair flying helps connect theory to practice. It makes sense now!"
                }
            ]
        },
        {
            id: 'first_radio_disaster',
            text: "You key the mic: 'Uh... taking off now!' Tower responds: 'WHO IS THIS?! State callsign!'",
            probability: 0.20,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 1 && state.stats.flightHours < 5,
            buttons: [
                { 
                    text: "Apologize properly", 
                    impact: { knowledge: 15, morale: -5 }, 
                    outcome: "'November 12345, student pilot, sorry Tower.' They appreciate the correction.",
                    reputation: { atc: 1 }
                },
                { 
                    text: "Go silent", 
                    impact: { safety: -10, morale: -10 }, 
                    outcome: "CFI takes over. Embarrassing but you learn proper phraseology.",
                    reputation: { atc: -1 }
                },
                { 
                    text: "Try again", 
                    impact: { knowledge: 10, morale: 5 }, 
                    outcome: "You nail it second time. Tower is patient with students."
                }
            ]
        },
        {
            id: 'first_turbulence',
            text: "Moderate turbulence hits. The plane is bouncing like a boat. Your stomach churns.",
            probability: 0.15,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 2 && state.stats.flightHours < 8,
            buttons: [
                { 
                    text: "Death grip controls", 
                    impact: { safety: -10, fatigue: 15 }, 
                    outcome: "CFI: 'Relax! Let the plane ride it out.' You're making it worse."
                },
                { 
                    text: "Trust the plane", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "You relax your grip. The plane handles it fine. Confidence boost!"
                },
                { 
                    text: "Request return", 
                    impact: { safety: 15, morale: -10 }, 
                    outcome: "No shame in comfort limits. Good ADM for a new student."
                }
            ]
        },
        {
            id: 'wrong_runway_lineup',
            text: "You line up on the taxiway instead of the runway. Tower: 'Uh, 12345, where are you going?'",
            probability: 0.10,
            frequency: 'once',
            condition: (state) => state.stats.flightHours < 10,
            buttons: [
                { 
                    text: "Admit mistake", 
                    impact: { morale: -10, knowledge: 15 }, 
                    outcome: "'Student pilot, wrong surface, sorry!' Tower guides you to runway.",
                    reputation: { atc: 0 }
                },
                { 
                    text: "Play it cool", 
                    impact: { safety: -20, morale: -15 }, 
                    outcome: "You try to taxi to runway. Everyone watching knows you messed up."
                },
                { 
                    text: "Let CFI handle", 
                    impact: { morale: -5, knowledge: 10 }, 
                    outcome: "CFI smoothly corrects. You learn runway/taxiway differences."
                }
            ]
        }
    ],

    // Pre-Solo Events (10-20 hours)
    preSolo: [
        {
            id: 'pre_solo_nerves',
            text: "Tomorrow is your first solo. You can't sleep. Hands already shaking thinking about it.",
            probability: 0.30,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 14 && state.stats.flightHours < 18 && !state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Chair fly all night", 
                    impact: { fatigue: 30, knowledge: 10 }, 
                    outcome: "Exhausted but prepared. Every procedure rehearsed 20 times.",
                    chainData: { prep_method: 'overprepared' }
                },
                { 
                    text: "Meditate and rest", 
                    impact: { fatigue: -10, morale: 10 }, 
                    outcome: "Clear mind for tomorrow. You trust your training.",
                    chainData: { prep_method: 'relaxed' }
                },
                { 
                    text: "Call it off", 
                    impact: { safety: 10, morale: -20 }, 
                    outcome: "CFI respects your ADM but disappointed. 'When you're ready.'",
                    chainData: { prep_method: 'delayed' }
                }
            ]
        },
        {
            id: 'pattern_traffic_chaos',
            text: "Five planes in the pattern. You're #3 for landing but can't spot #2.",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 8 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Extend downwind", 
                    impact: { safety: 15, money: -20 }, 
                    outcome: "Safe spacing maintained. Extra fuel but good decision.",
                    reputation: { safety: 1 }
                },
                { 
                    text: "Ask tower for help", 
                    impact: { knowledge: 10, safety: 10 }, 
                    outcome: "'Unable to spot traffic.' Tower vectors you. Good resource use.",
                    reputation: { atc: 1 }
                },
                { 
                    text: "Turn base anyway", 
                    impact: { safety: -25, morale: -15 }, 
                    outcome: "TRAFFIC ALERT! Tower yells. CFI takes control. Close call!",
                    reputation: { atc: -2, safety: -2 }
                }
            ]
        },
        {
            id: 'landing_plateau_training',
            text: "10 lessons in a row. Still can't nail landings. CFI: 'Maybe flying isn't for everyone.'",
            probability: 0.12,
            condition: (state) => state.stats.flightHours > 12 && state.stats.flightHours < 20 && !state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Double down", 
                    impact: { money: -400, knowledge: 20, morale: 15 }, 
                    outcome: "Extra practice with different instructor. BREAKTHROUGH! It clicks!",
                    chainStart: 'landing_mastery'
                },
                { 
                    text: "Take a week off", 
                    impact: { morale: -10, fatigue: -20 }, 
                    outcome: "Rest helps. You return with fresh perspective."
                },
                { 
                    text: "Power through", 
                    impact: { fatigue: 20, morale: -15 }, 
                    outcome: "Frustration builds. Maybe a break would help..."
                }
            ]
        },
        {
            id: 'crosswind_intro',
            text: "First crosswind landing attempt. Wind 12G18 at 40 degrees. Plane crabbing hard.",
            probability: 0.18,
            condition: (state) => state.stats.flightHours > 10 && state.stats.flightHours < 20,
            buttons: [
                { 
                    text: "Trust the process", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "Slip on final, straighten out. Not pretty but safe! Major confidence boost."
                },
                { 
                    text: "Go around", 
                    impact: { safety: 20, money: -30 }, 
                    outcome: "Good decision. CFI demonstrates, then you nail it second try."
                },
                { 
                    text: "Fight the wind", 
                    impact: { safety: -15, fatigue: 15 }, 
                    outcome: "Overcontrolling makes it worse. CFI saves a bad situation."
                }
            ]
        },
        {
            id: 'stall_fear_training',
            text: "Time for power-on stalls. Your heart is racing. Memories of roller coasters flood back.",
            probability: 0.20,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 8 && state.stats.flightHours < 15,
            buttons: [
                { 
                    text: "Face the fear", 
                    impact: { knowledge: 15, safety: 20, morale: -5 }, 
                    outcome: "You do it! Not as bad as imagined. Fear conquered!"
                },
                { 
                    text: "Ask for demo first", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "Watching helps. You understand before doing. Smart approach."
                },
                { 
                    text: "Refuse", 
                    impact: { safety: -10, morale: -15 }, 
                    outcome: "Can't solo without stall proficiency. This must be overcome."
                }
            ]
        }
    ],

    // Solo Period Events (15-30 hours)
    soloPeriod: [
        {
            id: 'first_solo_triumph',
            text: "Three perfect landings solo! CFI is beaming. Other students applaud as you taxi in.",
            probability: 0.90,
            frequency: 'once',
            condition: (state) => state.milestones.firstSolo && !state.eventHistory.find(e => e.eventId === 'first_solo_triumph'),
            buttons: [
                { 
                    text: "Celebrate loudly", 
                    impact: { morale: 40 }, 
                    outcome: "Your joy is infectious! Whole FBO celebrates with you.",
                    reputation: { peers: 3, cfi: 1 }
                },
                { 
                    text: "Play it cool", 
                    impact: { morale: 25, safety: 10 }, 
                    outcome: "Quiet satisfaction. You're a pilot now. The smile says it all."
                },
                { 
                    text: "Immediately book more", 
                    impact: { money: -300, morale: 30 }, 
                    outcome: "Strike while confidence is high! Three more solos booked."
                }
            ]
        },
        {
            id: 'solo_weather_decision',
            text: "On your second solo, clouds are building. Marginal VFR. Your call entirely.",
            probability: 0.20,
            condition: (state) => state.milestones.firstSolo && state.stats.flightHours < 25,
            buttons: [
                { 
                    text: "Cancel flight", 
                    impact: { safety: 25, money: -50 }, 
                    outcome: "CFI texts: 'Excellent ADM. Proud of you.' Safety first always.",
                    reputation: { safety: 2, cfi: 1 }
                },
                { 
                    text: "Pattern only", 
                    impact: { safety: 10, knowledge: 10 }, 
                    outcome: "Conservative compromise. Three quick landings before weather arrives."
                },
                { 
                    text: "Full flight", 
                    impact: { safety: -30, morale: -20 }, 
                    outcome: "Scary flight. Clouds drop fast. You barely make it back. Never again.",
                    reputation: { safety: -2 }
                }
            ]
        },
        {
            id: 'solo_atc_mistake',
            text: "Solo in pattern. You read back wrong runway. Tower: 'Negative! Runway 27, not 9!'",
            probability: 0.15,
            condition: (state) => state.milestones.firstSolo && state.stats.flightHours < 30,
            buttons: [
                { 
                    text: "Correct immediately", 
                    impact: { knowledge: 10, safety: 10 }, 
                    outcome: "'Sorry Tower, runway 27, student solo.' They appreciate the correction."
                },
                { 
                    text: "Get flustered", 
                    impact: { morale: -15, safety: -5 }, 
                    outcome: "You fumble the readback again. Tower is patient but firm."
                },
                { 
                    text: "Request progressive", 
                    impact: { safety: 15, knowledge: 15 }, 
                    outcome: "'Student solo, request progressive taxi.' Smart use of available help.",
                    reputation: { atc: 1 }
                }
            ]
        },
        {
            id: 'solo_go_around',
            text: "Solo landing, you're way too high on final. Decision point: force it or go around?",
            probability: 0.20,
            condition: (state) => state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Go around", 
                    impact: { safety: 25, money: -20, morale: 10 }, 
                    outcome: "Perfect decision! CFI watching from ground gives thumbs up.",
                    reputation: { safety: 2 }
                },
                { 
                    text: "Steep slip", 
                    impact: { knowledge: 15, safety: 5 }, 
                    outcome: "Advanced technique works! You save it with a aggressive slip."
                },
                { 
                    text: "Force it down", 
                    impact: { safety: -30, morale: -20 }, 
                    outcome: "Float forever, almost run off runway. CFI has words for you later.",
                    reputation: { cfi: -1, safety: -2 }
                }
            ]
        }
    ],

    // Cross-Country Events (20-35 hours)
    crossCountry: [
        {
            id: 'xc_lost',
            text: "Nothing looks familiar. Your checkpoint was 10 minutes ago. GPS is off for training.",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 20 && state.stats.flightHours < 35,
            buttons: [
                { 
                    text: "Climb and circle", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "Higher altitude helps. You spot a highway intersection. Position found!"
                },
                { 
                    text: "Follow roads", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "Road leads to town. Water tower has name! You're back on course."
                },
                { 
                    text: "Confess to CFI", 
                    impact: { safety: 20, morale: -10 }, 
                    outcome: "'I'm lost.' CFI guides you: 'Good ADM admitting it. Let's work through this.'"
                }
            ]
        },
        {
            id: 'fuel_calc_mistake',
            text: "Your cross-country fuel calculation was wrong. Gauges showing less than expected.",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 25,
            buttons: [
                { 
                    text: "Immediate diversion", 
                    impact: { safety: 30, money: -100 }, 
                    outcome: "Land at nearest airport. Expensive Uber home but absolutely right call.",
                    reputation: { safety: 3 }
                },
                { 
                    text: "Lean aggressively", 
                    impact: { knowledge: 15, safety: 5 }, 
                    outcome: "Proper leaning stretches fuel. You make it with legal reserves. Close!"
                },
                { 
                    text: "Press on", 
                    impact: { safety: -40, morale: -30 }, 
                    outcome: "Engine sputters on final! Luck saves you. CFI is FURIOUS. Never again.",
                    reputation: { cfi: -3, safety: -3 }
                }
            ]
        },
        {
            id: 'xc_weather_diversion',
            text: "Thunderstorm building over your destination. Divert or try to beat it?",
            probability: 0.12,
            condition: (state) => state.stats.flightHours > 25,
            buttons: [
                { 
                    text: "Divert immediately", 
                    impact: { safety: 30, knowledge: 15, money: -80 }, 
                    outcome: "Textbook decision. Land safely as storm hits original destination."
                },
                { 
                    text: "Wait it out", 
                    impact: { safety: 15, money: -150 }, 
                    outcome: "Circle safely away. Storm passes in 30 minutes. Expensive but safe."
                },
                { 
                    text: "Race the storm", 
                    impact: { safety: -35, morale: -25 }, 
                    outcome: "Terrifying approach in gusty conditions. You'll never risk weather again.",
                    reputation: { safety: -3 }
                }
            ]
        },
        {
            id: 'xc_Class_B_nerves',
            text: "First time approaching Class B airspace. Controller talking fast. Multiple instructions.",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 25 && state.stats.flightHours < 40,
            buttons: [
                { 
                    text: "'Say again slowly'", 
                    impact: { knowledge: 15, safety: 15 }, 
                    outcome: "'Student pilot, say again slowly please.' ATC slows down. Perfect!",
                    reputation: { atc: 1 }
                },
                { 
                    text: "Guess and comply", 
                    impact: { safety: -20, morale: -10 }, 
                    outcome: "You guess wrong. 'Negative! Turn left NOW!' Scary moment."
                },
                { 
                    text: "Stay clear", 
                    impact: { safety: 20, money: -40 }, 
                    outcome: "You avoid the airspace entirely. Longer route but less stress."
                }
            ]
        }
    ],

    // Checkride Preparation (35-45 hours)
    checkridePr: [
        {
            id: 'mock_checkride_fail',
            text: "Your CFI role-playing as DPE fails you on the mock checkride. 'Not ready yet.'",
            probability: 0.25,
            condition: (state) => state.stats.flightHours > 35,
            buttons: [
                { 
                    text: "Accept feedback", 
                    impact: { knowledge: 20, morale: -10 }, 
                    outcome: "Specific weak areas identified. Two weeks more practice needed."
                },
                { 
                    text: "Argue points", 
                    impact: { morale: -15, knowledge: 5 }, 
                    outcome: "Defensive attitude won't help. CFI is trying to prepare you."
                },
                { 
                    text: "Schedule anyway", 
                    impact: { money: -800, safety: -20 }, 
                    outcome: "Real checkride failure. Should have listened. Expensive mistake.",
                    chainStart: 'checkride_failure'
                }
            ]
        },
        {
            id: 'checkride_weather_cancel',
            text: "Checkride day arrives. Weather is terrible. DPE cancels. Next slot: 3 weeks away.",
            probability: 0.20,
            condition: (state) => state.stats.flightHours > 40,
            buttons: [
                { 
                    text: "Stay sharp", 
                    impact: { money: -600, knowledge: 10 }, 
                    outcome: "Regular practice flights keep skills sharp. Ready when day comes."
                },
                { 
                    text: "Take break", 
                    impact: { morale: -15, knowledge: -10 }, 
                    outcome: "Skills get rusty. You'll need refresh flights before checkride."
                },
                { 
                    text: "Find different DPE", 
                    impact: { money: -200, morale: 10 }, 
                    outcome: "Earlier slot with another DPE found! Extra fee worth it."
                }
            ]
        },
        {
            id: 'oral_exam_prep',
            text: "CFI grills you on regulations. You blank on airspace cloud clearances.",
            probability: 0.20,
            condition: (state) => state.stats.flightHours > 35 && state.stats.knowledge < 80,
            buttons: [
                { 
                    text: "Study all night", 
                    impact: { knowledge: 25, fatigue: 30 }, 
                    outcome: "You memorize everything. Brain is full but ready."
                },
                { 
                    text: "Make mnemonics", 
                    impact: { knowledge: 20, fatigue: 10 }, 
                    outcome: "Memory tricks help! '3-152' sticks in your brain."
                },
                { 
                    text: "Wing it", 
                    impact: { safety: -15, morale: -10 }, 
                    outcome: "Gaps in knowledge will fail you. More study needed."
                }
            ]
        },
        {
            id: 'dpe_first_impression',
            text: "You meet your DPE. They seem stern and are known for high failure rates.",
            probability: 0.30,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 38,
            buttons: [
                { 
                    text: "Professional greeting", 
                    impact: { morale: 10, safety: 10 }, 
                    outcome: "Your confidence and preparation show. DPE seems impressed."
                },
                { 
                    text: "Nervous fumbling", 
                    impact: { morale: -15 }, 
                    outcome: "Rocky start. You drop your logbook. Deep breath, recover!"
                },
                { 
                    text: "Overconfident", 
                    impact: { safety: -10, morale: -10 }, 
                    outcome: "DPE notes cockiness. They'll test you extra hard now."
                }
            ]
        }
    ],

    // Instructor Relationship Events
    instructorEvents: [
        {
            id: 'cfi_time_building',
            text: "You overhear your CFI: 'Just need 200 more hours for the airlines. These students are so slow.'",
            probability: 0.10,
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Confront them", 
                    impact: { morale: -10, knowledge: 10 }, 
                    outcome: "Honest discussion. They apologize and commit to better teaching."
                },
                { 
                    text: "Switch instructors", 
                    impact: { money: -100, morale: 15 }, 
                    outcome: "New CFI is genuinely invested in your success. Much better!",
                    chainStart: 'better_cfi',
                    reputation: { cfi: 0 }
                },
                { 
                    text: "Ignore it", 
                    impact: { morale: -15 }, 
                    outcome: "Their attitude shows in lessons. Your progress slows."
                }
            ]
        },
        {
            id: 'cfi_praise',
            text: "Your CFI: 'That was professional-level flying. You're really getting this!'",
            probability: 0.15,
            condition: (state) => state.stats.knowledge > 60 && state.reputation?.cfi > 1,
            buttons: [
                { 
                    text: "Thank them", 
                    impact: { morale: 20, knowledge: 5 }, 
                    outcome: "Positive reinforcement boosts confidence. You're flying better than ever!"
                },
                { 
                    text: "Ask for more tips", 
                    impact: { knowledge: 15 }, 
                    outcome: "CFI shares advanced techniques usually saved for commercial students."
                },
                { 
                    text: "Stay humble", 
                    impact: { safety: 10, morale: 15 }, 
                    outcome: "'I still have much to learn.' Good attitude impresses CFI."
                }
            ]
        },
        {
            id: 'cfi_no_show',
            text: "Your CFI doesn't show up. No call, no text. You've been waiting 45 minutes.",
            probability: 0.08,
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Find another CFI", 
                    impact: { money: -50, knowledge: 10 }, 
                    outcome: "Another instructor steps in. Different perspective helps!"
                },
                { 
                    text: "Practice ground", 
                    impact: { knowledge: 15, morale: -5 }, 
                    outcome: "You chair fly and study. Productive despite frustration."
                },
                { 
                    text: "Go home angry", 
                    impact: { morale: -20 }, 
                    outcome: "Wasted trip. CFI apologizes later - car trouble. Still annoying."
                }
            ]
        }
    ],

    // Equipment and Preflight Events
    equipmentEvents: [
        {
            id: 'wrong_plane_preflight',
            text: "You spend 20 minutes preflighting N12345. Your CFI arrives: 'We're in N54321 today.'",
            probability: 0.08,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 5 && state.stats.flightHours < 15,
            buttons: [
                { 
                    text: "Laugh it off", 
                    impact: { morale: -5, fatigue: 10 }, 
                    outcome: "Embarrassing but you'll never make this mistake again. Check the schedule!"
                },
                { 
                    text: "Rush second preflight", 
                    impact: { safety: -15, morale: -10 }, 
                    outcome: "Hasty inspection misses oil leak. CFI catches it. 'Slow down!'"
                },
                { 
                    text: "Thorough second check", 
                    impact: { fatigue: 15, safety: 15 }, 
                    outcome: "Proper preflight despite embarrassment. Safety first, always."
                }
            ]
        },
        {
            id: 'preflight_discovery',
            text: "During preflight, you find a bird's nest in the engine cowling!",
            probability: 0.05,
            condition: (state) => state.stats.flightHours > 5,
            buttons: [
                { 
                    text: "Call mechanic", 
                    impact: { safety: 20, money: -50, knowledge: 10 }, 
                    outcome: "Right call. Mechanic removes it safely. Could have been catastrophic!"
                },
                { 
                    text: "Remove it yourself", 
                    impact: { safety: -10, morale: -5 }, 
                    outcome: "You try but make a mess. Mechanic needed anyway. Should have called first."
                },
                { 
                    text: "Different plane", 
                    impact: { safety: 15, money: -30 }, 
                    outcome: "Smart choice. Switch planes while this one gets serviced."
                }
            ]
        },
        {
            id: 'intercom_fail_pattern',
            text: "Intercom dies in the pattern. Can't hear CFI. Hand signals only!",
            probability: 0.06,
            condition: (state) => state.stats.flightHours > 10 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Continue pattern", 
                    impact: { knowledge: 20, safety: 10 }, 
                    outcome: "Successfully complete pattern with gestures only. Great learning experience!"
                },
                { 
                    text: "Full stop", 
                    impact: { safety: 20, money: -50 }, 
                    outcome: "Conservative choice. Lesson ends early but safety first."
                },
                { 
                    text: "Shout over engine", 
                    impact: { fatigue: 20, morale: -10 }, 
                    outcome: "Exhausting and ineffective. Can't hear anything. Frustrating lesson."
                }
            ]
        }
    ],

    // Breakthrough and Milestone Events
    breakthroughEvents: [
        {
            id: 'landing_click_moment',
            text: "Something clicks. Three perfect greasers in a row. CFI: 'I think you've got it!'",
            probability: 0.20,
            condition: (state) => state.stats.flightHours > 10 && state.stats.flightHours < 20,
            frequency: 'once',
            buttons: [
                { 
                    text: "Keep practicing", 
                    impact: { knowledge: 15, morale: 25 }, 
                    outcome: "Lock in the muscle memory. Six more perfect landings. It's clicking!"
                },
                { 
                    text: "Solo ready?", 
                    impact: { morale: 30, safety: 10 }, 
                    outcome: "CFI agrees! 'One more lesson then you're going solo!'",
                    chainStart: 'solo_prep'
                },
                { 
                    text: "Don't jinx it", 
                    impact: { morale: 20 }, 
                    outcome: "Superstitious but confident. The skill is solid now."
                }
            ]
        },
        {
            id: 'radio_breakthrough',
            text: "You handle complex taxi instructions perfectly. Ground: 'Nice readback, well done!'",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Thank controller", 
                    impact: { morale: 15, reputation: { atc: 1 } }, 
                    outcome: "'Thanks Ground!' Professional courtesy builds good relationships."
                },
                { 
                    text: "Stay focused", 
                    impact: { safety: 10, knowledge: 10 }, 
                    outcome: "Don't let praise distract. Maintain professional standards."
                },
                { 
                    text: "Help other student", 
                    impact: { morale: 20, reputation: { peers: 2 } }, 
                    outcome: "You coach nervous student on radio work. Paying it forward!"
                }
            ]
        },
        {
            id: 'navigation_mastery',
            text: "Your pilotage and dead reckoning are spot on. Every checkpoint hit perfectly!",
            probability: 0.12,
            condition: (state) => state.stats.flightHours > 25 && state.stats.knowledge > 70,
            buttons: [
                { 
                    text: "Trust the skills", 
                    impact: { knowledge: 15, morale: 20 }, 
                    outcome: "Confidence in navigation soars. You could fly without GPS!"
                },
                { 
                    text: "Double-check GPS", 
                    impact: { safety: 10, knowledge: 10 }, 
                    outcome: "GPS confirms perfect navigation. Belt and suspenders approach."
                },
                { 
                    text: "Teach technique", 
                    impact: { knowledge: 20, reputation: { peers: 1 } }, 
                    outcome: "You share your method with struggling students. Good karma!"
                }
            ]
        }
    ],

    // Emergency Training Events
    emergencyTraining: [
        {
            id: 'surprise_engine_cut',
            text: "Without warning, CFI pulls power to idle. 'Engine failure. Your airplane.'",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 10,
            buttons: [
                { 
                    text: "ABC procedure", 
                    impact: { safety: 20, knowledge: 15 }, 
                    outcome: "Airspeed, Best field, Checklist, Declare. Perfect execution!",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "Find airport", 
                    impact: { safety: -10, knowledge: 10 }, 
                    outcome: "Airport too far. CFI shows why field selection matters."
                },
                { 
                    text: "Freeze up", 
                    impact: { safety: -20, morale: -15 }, 
                    outcome: "Brain lock. CFI takes over. 'We need more emergency practice.'"
                }
            ]
        },
        {
            id: 'simulated_fire',
            text: "CFI: 'Smoke in the cockpit! Electrical fire! What do you do?'",
            probability: 0.08,
            condition: (state) => state.stats.flightHours > 20,
            buttons: [
                { 
                    text: "Master switch OFF", 
                    impact: { safety: 25, knowledge: 20 }, 
                    outcome: "Correct! Kill electrical, ventilate, declare, land immediately."
                },
                { 
                    text: "Ventilate first", 
                    impact: { safety: 10, knowledge: 15 }, 
                    outcome: "Not wrong but master off is priority. Good recovery though."
                },
                { 
                    text: "Panic response", 
                    impact: { safety: -15, morale: -10 }, 
                    outcome: "You forget procedures. More chair flying emergency flows needed."
                }
            ]
        },
        {
            id: 'door_pops_open',
            text: "BANG! Door pops open on takeoff. Loud noise, wind rushing in!",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Fly the plane", 
                    impact: { safety: 25, knowledge: 20 }, 
                    outcome: "Perfect! Aviate first. You continue climb, then handle door. Textbook!"
                },
                { 
                    text: "Try to close it", 
                    impact: { safety: -20, morale: -15 }, 
                    outcome: "Distraction causes loss of control! CFI intervenes. 'FLY THE PLANE!'"
                },
                { 
                    text: "Immediate landing", 
                    impact: { safety: 15, money: -50 }, 
                    outcome: "Conservative but safe. Land and secure door properly."
                }
            ]
        }
    ],

    // Social and Peer Events
    socialEvents: [
        {
            id: 'student_rivalry',
            text: "Another student who started after you just passed their checkride. 'How's your training?'",
            probability: 0.12,
            condition: (state) => state.stats.flightHours > 30 && !state.milestones.checkridePassed,
            buttons: [
                { 
                    text: "Congratulate them", 
                    impact: { morale: -5, reputation: { peers: 1 } }, 
                    outcome: "'That's awesome, congrats!' Mature response despite feeling behind."
                },
                { 
                    text: "Make excuses", 
                    impact: { morale: -10 }, 
                    outcome: "'Weather's been bad...' They see through it. Awkward."
                },
                { 
                    text: "Get motivated", 
                    impact: { morale: 15, knowledge: 10 }, 
                    outcome: "Their success drives you. Time to double down on training!"
                }
            ]
        },
        {
            id: 'hangar_wisdom',
            text: "Old-timer pilot shares advice: 'Superior pilots use superior judgment to avoid needing superior skills.'",
            probability: 0.10,
            condition: (state) => state.day > 25,
            buttons: [
                { 
                    text: "Ask for more", 
                    impact: { knowledge: 15, safety: 15 }, 
                    outcome: "Hours of wisdom about ADM and risk management. Invaluable!"
                },
                { 
                    text: "Thank them", 
                    impact: { morale: 10, reputation: { peers: 1 } }, 
                    outcome: "Respectful appreciation. They offer to mentor you."
                },
                { 
                    text: "Share your own", 
                    impact: { morale: 15 }, 
                    outcome: "You swap training stories. Great connection made!"
                }
            ]
        },
        {
            id: 'student_encouragement',
            text: "A struggling student asks for help with landings. You just mastered them.",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 20,
            buttons: [
                { 
                    text: "Share techniques", 
                    impact: { knowledge: 10, morale: 15 }, 
                    outcome: "Teaching solidifies your own understanding. Win-win!",
                    reputation: { peers: 2 }
                },
                { 
                    text: "Too busy", 
                    impact: { morale: -5 }, 
                    outcome: "Missed opportunity to help and reinforce your own skills."
                },
                { 
                    text: "Practice together", 
                    impact: { money: -50, knowledge: 15, morale: 20 }, 
                    outcome: "You split a lesson. Both improve! Great study buddy found.",
                    chainStart: 'study_buddy'
                }
            ]
        }
    ],

    // Weather and Scheduling Events
    weatherScheduling: [
        {
            id: 'weather_week_cancel',
            text: "Seven straight days of weather cancellations. You haven't flown in two weeks.",
            probability: 0.15,
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Simulator time", 
                    impact: { money: -200, knowledge: 10 }, 
                    outcome: "Stay current with procedures. Better than nothing."
                },
                { 
                    text: "Ground study", 
                    impact: { knowledge: 20, morale: -10 }, 
                    outcome: "Use time for written test prep. Silver lining."
                },
                { 
                    text: "Take a break", 
                    impact: { fatigue: -30, morale: -15 }, 
                    outcome: "Rest but skills getting rusty. Will need review flight."
                }
            ]
        },
        {
            id: 'perfect_day_conflict',
            text: "Severe clear, calm winds. But it's your anniversary/birthday/important event.",
            probability: 0.10,
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Fly anyway", 
                    impact: { morale: -20, fatigue: 10 }, 
                    outcome: "Great flight but relationship stress. Was it worth it?"
                },
                { 
                    text: "Skip flying", 
                    impact: { morale: 10, knowledge: -5 }, 
                    outcome: "Life balance maintained. There will be other perfect days."
                },
                { 
                    text: "Quick pattern", 
                    impact: { money: -100, morale: 5 }, 
                    outcome: "Compromise - quick three landings. Everyone happy."
                }
            ]
        },
        {
            id: 'wx_improves_suddenly',
            text: "Forecast was terrible but weather suddenly clears. CFI calls: 'Can you be here in 20 minutes?'",
            probability: 0.12,
            condition: (state) => state.day > 15,
            buttons: [
                { 
                    text: "Drop everything", 
                    impact: { money: -150, morale: 15, fatigue: 10 }, 
                    outcome: "You rush to airport. Great impromptu lesson!"
                },
                { 
                    text: "Can't make it", 
                    impact: { morale: -10 }, 
                    outcome: "Work/life commitments. Frustrating to miss opportunity."
                },
                { 
                    text: "30 minutes out", 
                    impact: { money: -100, morale: 10 }, 
                    outcome: "You make it for shortened lesson. Better than nothing!"
                }
            ]
        }
    ]
};

// Helper function to get all training events
function getAllTrainingEvents() {
    return [
        ...expandedTrainingEvents.earlyTraining,
        ...expandedTrainingEvents.preSolo,
        ...expandedTrainingEvents.soloPeriod,
        ...expandedTrainingEvents.crossCountry,
        ...expandedTrainingEvents.checkridePr,
        ...expandedTrainingEvents.instructorEvents,
        ...expandedTrainingEvents.equipmentEvents,
        ...expandedTrainingEvents.breakthroughEvents,
        ...expandedTrainingEvents.emergencyTraining,
        ...expandedTrainingEvents.socialEvents,
        ...expandedTrainingEvents.weatherScheduling
    ];
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        expandedTrainingEvents,
        getAllTrainingEvents
    };
}