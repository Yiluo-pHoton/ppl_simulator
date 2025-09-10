// PPL Simulator - Enhanced Events with Chains and Real-World Scenarios
// Based on actual pilot experiences, ForeFlight Easter eggs, and training mishaps

const enhancedChainEvents = {
    // Weather Chain Events
    weatherChains: [
        {
            id: 'rainbow_after_storm',
            text: "After your smart weather diversion, you break out to see a perfect double rainbow framing the runway.",
            probability: 0.80,  // High chance after good weather decision
            memorable: true,
            chainLink: 'weather_diversion_good',
            condition: (state) => state.decisionHistory?.weather_decision === 'diverted' && 
                                 state.day > (state.decisionHistory.weather_decision?.day || 0),
            buttons: [
                { 
                    text: "Take it all in", 
                    impact: { morale: 35, fatigue: -15 }, 
                    outcome: "This is your reward for good ADM. The photo becomes your checkride good luck charm.",
                    reputation: { safety: 1 }
                },
                { 
                    text: "Share with CFI", 
                    impact: { morale: 30 }, 
                    outcome: "CFI texts back: 'That's why we make safe decisions. Beautiful!'",
                    reputation: { cfi: 2 }
                },
                { 
                    text: "Tell Tower", 
                    impact: { morale: 25 }, 
                    outcome: "'Tower, thanks for the vectors. Amazing rainbow!' 'Our pleasure, great decision making!'",
                    reputation: { atc: 1 }
                }
            ]
        },
        {
            id: 'foreflight_santa',
            text: "Checking weather on ForeFlight, you see: 'METAR: Santa's reindeer reported in vicinity, use caution.'",
            probability: 0.10,
            memorable: true,
            frequency: 'once',
            chainLink: 'foreflight_user',
            condition: (state) => state.decisionHistory?.foreflight_choice === 'digital' && 
                                 new Date().getMonth() === 11,  // December
            buttons: [
                { 
                    text: "Screenshot it!", 
                    impact: { morale: 25 }, 
                    outcome: "You post it online. Goes viral in pilot community! 'ForeFlight has the best Easter eggs!'",
                    chainStart: 'social_media_aviation'
                },
                { 
                    text: "Report to ATC", 
                    impact: { morale: 20 }, 
                    outcome: "'Tower, I have reindeer on my weather brief.' 'Roger, maintain visual separation!'",
                    reputation: { atc: 1 }
                },
                { 
                    text: "Check for more", 
                    impact: { knowledge: 10, morale: 15 }, 
                    outcome: "You find other Easter eggs: Area 51 restricted for 'alien training' on April 1st!"
                }
            ]
        },
        {
            id: 'foreflight_area51',
            text: "ForeFlight shows Area 51 TFR: 'Restricted for alien flight training, use extreme caution.'",
            probability: 0.08,
            memorable: true,
            frequency: 'once',
            chainLink: 'foreflight_user',
            condition: (state) => state.decisionHistory?.foreflight_choice === 'digital' && 
                                 new Date().getMonth() === 3 && new Date().getDate() === 1,  // April 1st
            buttons: [
                { 
                    text: "Share the joke", 
                    impact: { morale: 20 }, 
                    outcome: "Aviation Reddit loves it! ForeFlight developers comment with alien emoji."
                },
                { 
                    text: "Play along", 
                    impact: { morale: 25 }, 
                    outcome: "You file a flight plan to 'avoid alien training areas.' ATC plays along!"
                },
                { 
                    text: "Report 'UFO'", 
                    impact: { morale: 30 }, 
                    outcome: "You report UFO sighting to ATC. They respond: 'Traffic is a flying saucer, maintain separation!'"
                }
            ]
        }
    ],

    // CFI Relationship Events
    cfiEvents: [
        {
            id: 'cfi_job_offer',
            text: "After your flawless emergency handling, your CFI jokes: 'Want my job? You're ready to teach!'",
            probability: 0.02,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.stats.knowledge > 85 && state.stats.safety > 90 && 
                                 state.reputation?.cfi > 4,
            buttons: [
                { 
                    text: "I'm honored!", 
                    impact: { morale: 40, knowledge: 20 }, 
                    outcome: "CFI: 'Seriously though, you should consider becoming an instructor after PPL.'",
                    chainStart: 'cfi_mentorship'
                },
                { 
                    text: "Still learning!", 
                    impact: { morale: 30, safety: 10 }, 
                    outcome: "Humble response. CFI: 'That attitude is why you'll be a great pilot.'",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "Maybe someday", 
                    impact: { morale: 35 }, 
                    outcome: "CFI offers to mentor you toward CFI certificate after PPL. Amazing opportunity!",
                    chainStart: 'cfi_mentorship'
                }
            ]
        }
    ],

    // Neighboring Airport Chaos
    neighboringChaos: [
        {
            id: 'helicopter_autorotation_panic',
            text: "The helicopter school next door is practicing autorotations. Someone called 911 for 'falling aircraft!'",
            probability: 0.08,
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Watch the show", 
                    impact: { knowledge: 15, morale: 15 }, 
                    outcome: "Fire trucks arrive! The helicopter lands perfectly. Firefighters look confused."
                },
                { 
                    text: "Explain to crowd", 
                    impact: { knowledge: 20 }, 
                    outcome: "You calm worried onlookers, explaining autorotation training. Local news interviews you!",
                    reputation: { peers: 2 },
                    chainStart: 'local_news_fame'
                },
                { 
                    text: "Keep preflighting", 
                    impact: { safety: 10 }, 
                    outcome: "Not your circus. You focus on your plane while chaos unfolds nearby."
                }
            ]
        },
        {
            id: 'piper_ditch_memes',
            text: "Neighboring school's Piper rolled into a ditch. Group text memes arrived before the tow truck.",
            probability: 0.06,
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Share best meme", 
                    impact: { morale: 20 }, 
                    outcome: "'Piper: Now with off-road capability!' wins the meme war. Even the embarrassed pilot laughs.",
                    reputation: { peers: 1 }
                },
                { 
                    text: "Offer to help", 
                    impact: { morale: 15 }, 
                    outcome: "You help with recovery. The grateful pilot offers to share their written test prep materials.",
                    reputation: { peers: 2 },
                    chainStart: 'study_buddy_network'
                },
                { 
                    text: "Learn from it", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "You study what went wrong: brake failure during taxi. Mental note: always test brakes early."
                }
            ]
        }
    ],

    // Radio Mishaps
    radioMishaps: [
        {
            id: 'stuck_mic_singing',
            text: "Your mic button stuck while you were singing 'Danger Zone.' Entire frequency heard your performance.",
            probability: 0.05,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 10,
            buttons: [
                { 
                    text: "Own it proudly", 
                    impact: { morale: 25 }, 
                    outcome: "Tower: 'Nice pipes! Frequency clear for encore!' You're now famous as 'Danger Zone pilot.'",
                    reputation: { atc: 2, peers: 3 },
                    chainStart: 'radio_fame'
                },
                { 
                    text: "Apologize profusely", 
                    impact: { morale: -10 }, 
                    outcome: "'Sorry for stuck mic!' Tower: 'Best stuck mic we've had all year!'"
                },
                { 
                    text: "Change airports", 
                    impact: { morale: -15, money: -100 }, 
                    outcome: "Too embarrassed to return. You find a new home airport. They eventually hear the story anyway."
                }
            ]
        },
        {
            id: 'hot_mic_cfi_rant',
            text: "Your CFI's mic is stuck while ranting about another student. The whole pattern hears everything.",
            probability: 0.04,
            condition: (state) => state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Discreetly signal", 
                    impact: { reputation: { cfi: 2 } }, 
                    outcome: "You tap their shoulder and point. They go pale. 'Thanks for having my back.'"
                },
                { 
                    text: "Let it continue", 
                    impact: { morale: 15, knowledge: 10 }, 
                    outcome: "Entertainment value is high. You learn what NOT to do from the rant."
                },
                { 
                    text: "Key your mic", 
                    impact: { safety: 10 }, 
                    outcome: "You break in: 'Aircraft transmitting, check stuck mic.' CFI realizes and is grateful."
                }
            ]
        },
        {
            id: 'atc_singing_along',
            text: "After your stuck mic incident, Tower starts singing Danger Zone whenever you call in.",
            probability: 0.80,
            memorable: true,
            chainLink: 'radio_fame',
            condition: (state) => state.decisionHistory?.stuck_mic_response === 'owned_it',
            buttons: [
                { 
                    text: "Sing back", 
                    impact: { morale: 30 }, 
                    outcome: "You become legend. Other pilots join in. It's now unofficial airport anthem!",
                    reputation: { atc: 3, peers: 3 }
                },
                { 
                    text: "Professional only", 
                    impact: { safety: 10 }, 
                    outcome: "You stay professional. Tower respects it but still hums it off-mic."
                },
                { 
                    text: "Request callsign", 
                    impact: { morale: 35 }, 
                    outcome: "Tower starts calling you 'Maverick' unofficially. You've peaked in aviation!",
                    chainStart: 'maverick_callsign'
                }
            ]
        }
    ],

    // Solo Cross-Country Drama
    soloCrossCountry: [
        {
            id: 'overtaking_aircraft_above',
            text: "On solo XC departure, someone overtakes you FROM ABOVE! TCAS going crazy. They won't respond.",
            probability: 0.07,
            condition: (state) => state.milestones.firstSolo && state.stats.flightHours > 25,
            buttons: [
                { 
                    text: "Descend immediately", 
                    impact: { safety: 20, morale: -10 }, 
                    outcome: "Safe separation achieved. You report the dangerous pilot to FAA.",
                    chainStart: 'faa_report'
                },
                { 
                    text: "Scold on frequency", 
                    impact: { morale: 15 }, 
                    outcome: "'Aircraft overtaking, you nearly hit a STUDENT SOLO!' Other pilots join in scolding.",
                    reputation: { atc: 1, peers: 2 }
                },
                { 
                    text: "Document everything", 
                    impact: { safety: 15, knowledge: 15 }, 
                    outcome: "You file NASA ASRS report. CFI proud of your professionalism. FAA investigates.",
                    reputation: { cfi: 1, safety: 2 }
                }
            ]
        },
        {
            id: 'straight_in_controversy',
            text: "Approaching non-towered airport on solo XC. Long final looks clear. Straight-in or pattern?",
            probability: 0.10,
            condition: (state) => state.milestones.firstSolo && state.stats.flightHours > 25,
            buttons: [
                { 
                    text: "Straight-in approach", 
                    impact: { money: -20, morale: -15 }, 
                    outcome: "Airport manager on CTAF: 'WHO'S THE IDIOT DOING STRAIGHT-IN?!' Pattern etiquette learned hard way.",
                    chainStart: 'straight_in_scolding',
                    reputation: { peers: -2 }
                },
                { 
                    text: "Full pattern entry", 
                    impact: { money: -30, safety: 15, morale: 10 }, 
                    outcome: "Extra fuel but proper procedure. Local pilots: 'Good job, student pilot!'",
                    reputation: { peers: 2, safety: 1 }
                },
                { 
                    text: "Ask on CTAF", 
                    impact: { knowledge: 15, safety: 20 }, 
                    outcome: "'Traffic permitting, request straight-in.' Locals appreciate you asking. Smart!",
                    reputation: { peers: 1 }
                }
            ]
        },
        {
            id: 'student_pilot_magic_words',
            text: "Busy pattern at uncontrolled field. You're getting squeezed out by faster traffic.",
            probability: 0.12,
            condition: (state) => state.milestones.firstSolo && !state.milestones.checkridePassed,
            buttons: [
                { 
                    text: "Announce 'Student pilot'", 
                    impact: { safety: 20, morale: 15 }, 
                    outcome: "Magic words! Everyone gives you space. 'Student pilot, you're number 1, we'll extend.'",
                    reputation: { peers: 2 }
                },
                { 
                    text: "Act experienced", 
                    impact: { safety: -15, morale: -10 }, 
                    outcome: "You try to keep up. Nearly get run over by a Bonanza. Should've spoken up!",
                    reputation: { safety: -1 }
                },
                { 
                    text: "Leave pattern", 
                    impact: { safety: 15, money: -40 }, 
                    outcome: "You exit and re-enter when clear. Safe but expensive extra fuel."
                }
            ]
        }
    ],

    // Airport Life Events
    airportLife: [
        {
            id: 'runway_closure_surprise',
            text: "You arrive at destination to find runway NOTAM'd closed for seal coating. No one checked NOTAMs.",
            probability: 0.08,
            condition: (state) => state.stats.flightHours > 20,
            buttons: [
                { 
                    text: "Divert safely", 
                    impact: { safety: 25, money: -100, knowledge: 15 }, 
                    outcome: "Expensive lesson about ALWAYS checking NOTAMs. CFI impressed with handling.",
                    reputation: { cfi: 1, safety: 2 }
                },
                { 
                    text: "Land on taxiway", 
                    impact: { safety: -40, money: -5000, morale: -50 }, 
                    outcome: "TERRIBLE IDEA! FAA violation. Certificate action. Career-ending decision!",
                    chainStart: 'faa_violation',
                    reputation: { safety: -5, cfi: -5 }
                },
                { 
                    text: "Return home", 
                    impact: { safety: 20, money: -150, morale: -15 }, 
                    outcome: "Expensive round trip to nowhere. You'll never forget NOTAMs again."
                }
            ]
        },
        {
            id: 'warbird_taxi_blast',
            text: "P-51 Mustang taxis up behind you. That's a LOT of prop wash about to hit!",
            probability: 0.04,
            memorable: true,
            condition: (state) => state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Request immediate", 
                    impact: { safety: 20, knowledge: 15 }, 
                    outcome: "Tower: 'Cleared immediate taxi, that Mustang packs a punch!' Smart call.",
                    reputation: { atc: 1 }
                },
                { 
                    text: "Brace for wash", 
                    impact: { safety: -10, morale: 10 }, 
                    outcome: "Your Cessna rocks violently! But you got a wave from a P-51 pilot!",
                    chainStart: 'warbird_friend'
                },
                { 
                    text: "Shut down engine", 
                    impact: { safety: 15, money: -30 }, 
                    outcome: "You wait safely. The Mustang pilot apologizes and offers a tour later!",
                    chainStart: 'warbird_tour'
                }
            ]
        }
    ],

    // Chain Consequences
    chainConsequences: [
        {
            id: 'airport_manager_lecture',
            text: "The airport manager finds you after landing. 'We need to talk about pattern procedures.'",
            probability: 0.90,
            chainLink: 'straight_in_scolding',
            buttons: [
                { 
                    text: "Accept lecture", 
                    impact: { knowledge: 20, morale: -10 }, 
                    outcome: "20-minute lecture on pattern etiquette. Embarrassing but educational."
                },
                { 
                    text: "Explain student status", 
                    impact: { knowledge: 15, morale: -5 }, 
                    outcome: "Manager softens: 'Your CFI should've taught better. Let me explain...'"
                },
                { 
                    text: "Apologize and learn", 
                    impact: { knowledge: 25 }, 
                    outcome: "Manager appreciates humility. Becomes friendly and shares local tips.",
                    reputation: { peers: 1 }
                }
            ]
        },
        {
            id: 'warbird_tour_offer',
            text: "The P-51 pilot finds you: 'Want to see the Mustang up close? Least I can do after the prop blast.'",
            probability: 0.80,
            memorable: true,
            chainLink: 'warbird_tour',
            buttons: [
                { 
                    text: "Absolutely!", 
                    impact: { knowledge: 20, morale: 40 }, 
                    outcome: "You sit in a P-51! They explain systems. You're inspired to get complex endorsement.",
                    chainStart: 'complex_interest'
                },
                { 
                    text: "Bring CFI", 
                    impact: { knowledge: 25, morale: 35 }, 
                    outcome: "CFI joins tour. Warbird pilot offers to teach you aerobatics someday!",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "Rain check", 
                    impact: { morale: -5 }, 
                    outcome: "You miss the chance. The P-51 leaves next day for airshow."
                }
            ]
        },
        {
            id: 'faa_investigation',
            text: "FAA calls about your report of the dangerous overtaking. They're investigating.",
            probability: 0.70,
            chainLink: 'faa_report',
            condition: (state) => state.day > state.decisionHistory?.faa_report?.day + 7,
            buttons: [
                { 
                    text: "Provide details", 
                    impact: { safety: 20, knowledge: 15 }, 
                    outcome: "Your documentation helps. Reckless pilot gets violation. System works!",
                    reputation: { safety: 3 }
                },
                { 
                    text: "Minimal response", 
                    impact: { safety: 10 }, 
                    outcome: "You provide basics. FAA appreciates report but needs more for action."
                },
                { 
                    text: "Withdraw report", 
                    impact: { safety: -10, morale: -10 }, 
                    outcome: "You back down. The dangerous pilot remains a hazard to others."
                }
            ]
        },
        {
            id: 'maverick_reputation',
            text: "Your 'Maverick' reputation spreads. Pilots at other airports know about you!",
            probability: 0.60,
            memorable: true,
            chainLink: 'maverick_callsign',
            buttons: [
                { 
                    text: "Embrace fame", 
                    impact: { morale: 30 }, 
                    outcome: "You lean into it. Get custom 'MAVERICK' embroidered on flight bag.",
                    reputation: { peers: 5 }
                },
                { 
                    text: "Stay humble", 
                    impact: { safety: 15, morale: 20 }, 
                    outcome: "You downplay it but secretly love it. Respect grows for your humility."
                },
                { 
                    text: "Request official", 
                    impact: { morale: 35 }, 
                    outcome: "You apply for custom N-number with MVRCK. Living the dream!",
                    chainStart: 'custom_n_number'
                }
            ]
        }
    ],

    // Community Events
    communityEvents: [
        {
            id: 'aopa_flyin_invite',
            text: "AOPA is hosting a fly-in at nearby airport. Free seminars, vendor tents, hundreds of planes!",
            probability: 0.08,
            condition: (state) => state.day > 30 && state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Fly there solo!", 
                    impact: { money: -100, knowledge: 20, morale: 25 }, 
                    outcome: "Amazing experience! You learn about mountain flying and meet a retired 747 captain.",
                    reputation: { peers: 3 },
                    chainStart: 'airline_connection'
                },
                { 
                    text: "Drive instead", 
                    impact: { money: -30, knowledge: 15, morale: 15 }, 
                    outcome: "Still great! You network and win a free headset in the raffle!"
                },
                { 
                    text: "Skip it", 
                    impact: { morale: -5 }, 
                    outcome: "FOMO hits when you see photos. Looked amazing."
                }
            ]
        },
        {
            id: 'pancake_breakfast',
            text: "Local EAA chapter hosting their famous pancake breakfast fly-in. $10 donation.",
            probability: 0.12,
            condition: (state) => state.milestones.firstSolo && state.day > 25,
            buttons: [
                { 
                    text: "Fly for breakfast", 
                    impact: { money: -60, morale: 20, fatigue: -10 }, 
                    outcome: "Best pancakes ever! Old-timer offers to show you his vintage Stearman.",
                    chainStart: 'vintage_connection'
                },
                { 
                    text: "Volunteer to help", 
                    impact: { fatigue: 15, morale: 15 }, 
                    outcome: "You flip pancakes all morning. Chapter president offers scholarship application!",
                    reputation: { peers: 2 },
                    chainStart: 'eaa_scholarship'
                },
                { 
                    text: "Sleep in", 
                    impact: { fatigue: -15 }, 
                    outcome: "You needed rest but missed great community event."
                }
            ]
        }
    ],

    // Nature Encounters
    natureEncounters: [
        {
            id: 'dolphin_spotting',
            text: "Flying along the coastline, you spot a large pod of dolphins playing in the surf below!",
            probability: 0.06,
            memorable: true,
            condition: (state) => state.stats.flightHours > 20 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Circle to watch", 
                    impact: { money: -30, morale: 35 }, 
                    outcome: "Amazing! You count over 20 dolphins jumping through the waves. Extra fuel worth every penny."
                },
                { 
                    text: "Quick photos", 
                    impact: { morale: 25 }, 
                    outcome: "You grab shots while maintaining course. Friends love the aerial dolphin photos!"
                },
                { 
                    text: "Note position", 
                    impact: { knowledge: 10, morale: 20 }, 
                    outcome: "You report to marine biology center. Common sighting but they appreciate the data!"
                }
            ]
        },
        {
            id: 'northern_lights',
            text: "On night flight, Northern Lights suddenly appear. Sky dances with green fire!",
            probability: 0.02,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 35 && state.day > 60,
            buttons: [
                { 
                    text: "Request altitude", 
                    impact: { money: -20, morale: 40 }, 
                    outcome: "ATC approves climb for better view. Absolutely magical experience!"
                },
                { 
                    text: "Keep flying", 
                    impact: { morale: 30, safety: 10 }, 
                    outcome: "You maintain course enjoying the show. Safety first, but wow!"
                },
                { 
                    text: "Land to watch", 
                    impact: { money: -50, morale: 35 }, 
                    outcome: "You land at nearest airport to watch. Some things are worth the detour."
                }
            ]
        }
    ]
};

// Helper function to get all enhanced events
function getAllEnhancedEvents() {
    return [
        ...enhancedChainEvents.weatherChains,
        ...enhancedChainEvents.cfiEvents,
        ...enhancedChainEvents.neighboringChaos,
        ...enhancedChainEvents.radioMishaps,
        ...enhancedChainEvents.soloCrossCountry,
        ...enhancedChainEvents.airportLife,
        ...enhancedChainEvents.chainConsequences,
        ...enhancedChainEvents.communityEvents,
        ...enhancedChainEvents.natureEncounters
    ];
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enhancedChainEvents,
        getAllEnhancedEvents
    };
}