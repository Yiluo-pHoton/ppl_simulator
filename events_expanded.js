// PPL Simulator - Expanded Event System (100+ Events)
// Complete event library with chains, consequences, and memorable moments

// Event chains are tracked in events.js - reuse if exists
if (typeof eventChains === 'undefined') {
    var eventChains = {};
}

// Weather conditions that affect available options
// Reuse weatherTypes from events.js if it exists, otherwise define it
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
        flyable: false,
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

// Expanded event templates with frequency and chain support
// Extend the existing dynamicEvents if it exists, otherwise create new
if (typeof dynamicEvents === 'undefined') {
    var dynamicEvents = {};
}

// Add new event categories to dynamicEvents
Object.assign(dynamicEvents, {
    // Ultra-Rare Events (0.5-2% probability)
    ultraRare: [
        {
            id: 'celebrity_encounter',
            text: "Is that... Harrison Ford preflighting the Husky next to you? He notices your student pilot badge and walks over.",
            probability: 0.01,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 10 && state.day > 30,
            buttons: [
                { 
                    text: "Ask for advice", 
                    impact: { knowledge: 20, morale: 30 }, 
                    outcome: "He shares a story about his training days and the importance of always being a student.",
                    reputation: { peers: 2 }
                },
                { 
                    text: "Play it cool", 
                    impact: { safety: 10, morale: 15 }, 
                    outcome: "He nods approvingly at your thorough preflight. 'Good habits,' he says.",
                    reputation: { safety: 1 }
                },
                { 
                    text: "Fanboy/girl out", 
                    impact: { morale: 40, fatigue: 10 }, 
                    outcome: "Best day ever! You got a selfie but forgot half your checklist in excitement."
                }
            ]
        },
        {
            id: 'bird_strike',
            text: "THUMP! A large bird hits your windscreen at 500 feet. Visibility compromised, feathers everywhere.",
            probability: 0.015,
            memorable: true,
            condition: (state) => state.lastAction === 'fly' && state.stats.flightHours > 5,
            buttons: [
                { 
                    text: "Immediate landing", 
                    impact: { safety: 25, money: -400 }, 
                    outcome: "Textbook emergency response. You declare and land safely. Expensive windscreen repair.",
                    reputation: { cfi: 2, safety: 2 }
                },
                { 
                    text: "Continue pattern", 
                    impact: { safety: -30, morale: -20 }, 
                    outcome: "CFI takes controls immediately. 'What were you thinking?!' Bad decision.",
                    reputation: { cfi: -2, safety: -2 }
                },
                { 
                    text: "Request priority", 
                    impact: { safety: 20, knowledge: 15 }, 
                    outcome: "ATC clears all traffic. Perfect emergency handling under pressure.",
                    reputation: { atc: 1, safety: 2 }
                }
            ]
        },
        {
            id: 'youtube_famous',
            text: "Your horrible landing was filmed by a planespotter. The video 'Student Pilot Bounces 5 Times' has 2M views.",
            probability: 0.008,
            memorable: true,
            frequency: 'once',
            chainStart: 'social_media_fame',
            condition: (state) => state.stats.flightHours > 8 && state.stats.flightHours < 25,
            buttons: [
                { 
                    text: "Laugh it off", 
                    impact: { morale: 5 }, 
                    outcome: "You become a meme legend at the flight school. At least you're famous!",
                    chainData: { fame_reaction: 'humor' }
                },
                { 
                    text: "Get defensive", 
                    impact: { morale: -20 }, 
                    outcome: "The comments section destroys you. Maybe don't read those.",
                    chainData: { fame_reaction: 'defensive' }
                },
                { 
                    text: "Make response video", 
                    impact: { knowledge: 10, money: 200 }, 
                    outcome: "Your 'What I Learned' video goes viral too. You monetize your mistake!",
                    chainData: { fame_reaction: 'capitalize' }
                }
            ]
        },
        {
            id: 'lottery_ticket_win',
            text: "The scratchers ticket you bought at the FBO... just won $5,000!",
            probability: 0.005,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "All on flying!", 
                    impact: { money: 5000, morale: 35 }, 
                    outcome: "Your training is now fully funded! Dreams do come true."
                },
                { 
                    text: "Save half", 
                    impact: { money: 2500, safety: 10, morale: 20 }, 
                    outcome: "Smart financial planning. You're set for training and emergencies."
                },
                { 
                    text: "Buy everyone drinks", 
                    impact: { money: 4500, morale: 20 }, 
                    outcome: "You're the FBO hero for a day! Everyone loves the generous student pilot.",
                    reputation: { peers: 3, fbo: 2 }
                }
            ]
        },
        {
            id: 'engine_failure_real',
            text: "The engine coughs, sputters, and goes silent. This isn't a drill. 2,500 feet AGL.",
            probability: 0.01,
            memorable: true,
            condition: (state) => state.stats.flightHours > 15 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Best glide immediately", 
                    impact: { safety: 30, knowledge: 25 }, 
                    outcome: "Perfect emergency procedure. You pick a field and execute flawlessly. CFI is impressed.",
                    reputation: { cfi: 3, safety: 3 }
                },
                { 
                    text: "Troubleshoot first", 
                    impact: { safety: 15, knowledge: 20 }, 
                    outcome: "Mixture, mags, fuel... It restarts! Still land immediately but engine is running.",
                    reputation: { cfi: 2 }
                },
                { 
                    text: "Panic", 
                    impact: { safety: -20, morale: -30 }, 
                    outcome: "CFI saves the day while you freeze up. You'll need remedial emergency training.",
                    reputation: { cfi: -2 }
                }
            ]
        }
    ],

    // Legendary Events (0.1-0.3% probability)
    legendary: [
        {
            id: 'air_force_one_tfr',
            text: "You accidentally clip a TFR. Two F-16s appear on your wing. The President is below.",
            probability: 0.002,
            memorable: true,
            frequency: 'once',
            chainStart: 'faa_investigation',
            condition: (state) => state.stats.flightHours > 20,
            buttons: [
                { 
                    text: "Immediate compliance", 
                    impact: { safety: 10, money: -2000, morale: -25 }, 
                    outcome: "You follow the F-16s to a nearby airport. FAA violation but could be much worse.",
                    chainData: { tfr_response: 'compliant' }
                },
                { 
                    text: "Radio failure excuse", 
                    impact: { safety: -30, money: -5000, morale: -40 }, 
                    outcome: "This doesn't go well. License suspended 90 days. Huge fine.",
                    chainData: { tfr_response: 'excuse' }
                },
                { 
                    text: "'I'm just a student!'", 
                    impact: { morale: -40, knowledge: 30 }, 
                    outcome: "Terrifying but educational. The FAA is somewhat understanding. Still a violation.",
                    chainData: { tfr_response: 'student' }
                }
            ]
        },
        {
            id: 'instructor_heart_event',
            text: "Your CFI suddenly slumps over during climb-out. They're unconscious!",
            probability: 0.001,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 20 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Take controls, declare", 
                    impact: { safety: 50, knowledge: 40, morale: -20 }, 
                    outcome: "You declare emergency, fly the plane, and land safely. Hero student pilot! CFI recovers.",
                    reputation: { safety: 5, cfi: 5, atc: 3 }
                },
                { 
                    text: "Try to wake them", 
                    impact: { safety: -20, morale: -30 }, 
                    outcome: "Wasting precious time! Another pilot talks you through it on radio. Close call.",
                    reputation: { safety: -2 }
                },
                { 
                    text: "Level off and assess", 
                    impact: { safety: 35, knowledge: 30 }, 
                    outcome: "Good ADM. You maintain control, get help on radio, and land with ATC assistance.",
                    reputation: { safety: 3, atc: 2 }
                }
            ]
        },
        {
            id: 'ufo_sighting',
            text: "You and your CFI see something impossible - a silver disc hovering, then accelerating vertically at impossible speed.",
            probability: 0.003,
            memorable: true,
            frequency: 'once',
            chainStart: 'ufo_aftermath',
            condition: (state) => state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Report to ATC", 
                    impact: { knowledge: 5 }, 
                    outcome: "ATC: 'Uhh... no radar contact. Say again?' They think you're joking.",
                    chainData: { ufo_report: true }
                },
                { 
                    text: "Stay quiet", 
                    impact: { morale: 10 }, 
                    outcome: "You and your CFI share a bonding moment. 'Did we just see...?' 'Yep.'",
                    chainData: { ufo_report: false }
                },
                { 
                    text: "Film it", 
                    impact: { morale: 50 }, 
                    outcome: "The footage is blurry but goes viral. You're now 'UFO pilot' at the school.",
                    chainData: { ufo_report: 'filmed' }
                }
            ]
        },
        {
            id: 'plane_raffle_win',
            text: "Your flight school raffled off 10 free flight hours. YOUR TICKET WON!",
            probability: 0.004,
            memorable: true,
            frequency: 'once',
            chainStart: 'karma_chain',
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Use immediately", 
                    impact: { flightHours: 10, morale: 30 }, 
                    outcome: "10 free hours added to your logbook! Accelerated training here we come!",
                    chainData: { raffle_choice: 'selfish' }
                },
                { 
                    text: "Spread them out", 
                    impact: { flightHours: 10, morale: 20, knowledge: 5 }, 
                    outcome: "Smart planning. You'll use them strategically for best training value.",
                    chainData: { raffle_choice: 'smart' }
                },
                { 
                    text: "Share with struggling student", 
                    impact: { flightHours: 5, morale: 40 }, 
                    outcome: "You give half to Jake who's out of money. The karma will return!",
                    chainData: { raffle_choice: 'generous', helped_student: 'Jake' },
                    reputation: { peers: 5 }
                }
            ]
        },
        {
            id: 'celebrity_cfi',
            text: "Your regular CFI is sick. The substitute? Bob Hoover's nephew, an aerobatic champion.",
            probability: 0.003,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 10,
            buttons: [
                { 
                    text: "Request aerobatic lesson", 
                    impact: { knowledge: 30, fatigue: 20, morale: 40 }, 
                    outcome: "Mind-blowing experience! Loops, rolls, and wisdom from a master.",
                    reputation: { cfi: 2 }
                },
                { 
                    text: "Stick to syllabus", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "Even basic maneuvers are art with this instructor. Precision flying at its best."
                },
                { 
                    text: "Ask for autograph", 
                    impact: { morale: 25 }, 
                    outcome: "He signs your logbook with a sketch of an airplane. This is going on the wall!",
                    reputation: { peers: 1 }
                }
            ]
        }
    ],

    // Absurd but Realistic Events
    absurd: [
        {
            id: 'cow_on_runway',
            text: "On short final, a cow wanders onto the runway. This is not a drill.",
            probability: 0.02,
            condition: (state) => state.stats.flightHours > 8 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Go around", 
                    impact: { safety: 20, money: -30 }, 
                    outcome: "Good decision. Extra pattern work while ground crew plays cowboy.",
                    reputation: { safety: 1 }
                },
                { 
                    text: "Land anyway", 
                    impact: { safety: -40, morale: -20 }, 
                    outcome: "WHAT WERE YOU THINKING?! CFI is furious. The cow is unimpressed.",
                    reputation: { cfi: -3, safety: -3 }
                },
                { 
                    text: "Buzz the cow", 
                    impact: { safety: -20, morale: 10 }, 
                    outcome: "It works but your CFI is NOT amused. 'We need to talk about judgment.'",
                    reputation: { cfi: -1, peers: 1 }
                }
            ]
        },
        {
            id: 'drone_near_miss',
            text: "A large drone appears at your altitude, way above legal limits. It's filming you.",
            probability: 0.025,
            chainStart: 'faa_drone_report',
            condition: (state) => state.stats.flightHours > 5 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Evasive action", 
                    impact: { safety: 15 }, 
                    outcome: "You avoid it safely and report to ATC. FAA will investigate.",
                    chainData: { drone_response: 'evade' }
                },
                { 
                    text: "Wave at camera", 
                    impact: { morale: 10, safety: -5 }, 
                    outcome: "Priorities? At least you might be in someone's cool video.",
                    chainData: { drone_response: 'wave' }
                },
                { 
                    text: "Follow it down", 
                    impact: { safety: -20, knowledge: 5 }, 
                    outcome: "You track the operator for authorities. Risky but helps catch the violator.",
                    chainData: { drone_response: 'pursue' }
                }
            ]
        },
        {
            id: 'marriage_proposal_banner',
            text: "Another student hired a banner plane: 'MARRY ME SARAH?' Sarah is your CFI.",
            probability: 0.01,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.day > 40,
            buttons: [
                { 
                    text: "Awkward silence", 
                    impact: { morale: -5 }, 
                    outcome: "She says yes but adds 'After we land, let's focus.' Professional!"
                },
                { 
                    text: "Congratulate", 
                    impact: { morale: 15 }, 
                    outcome: "She's beaming! Best lesson ever - she teaches with extra enthusiasm.",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "'Can we land?'", 
                    impact: { safety: 10 }, 
                    outcome: "Professional response. She appreciates your focus on flying.",
                    reputation: { safety: 1 }
                }
            ]
        },
        {
            id: 'tesla_sponsorship',
            text: "Elon Musk's assistant calls: Tesla wants to sponsor your training for autopilot research PR.",
            probability: 0.002,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.day > 60 && state.stats.knowledge > 50,
            buttons: [
                { 
                    text: "Accept sponsorship", 
                    impact: { money: 10000, morale: 40 }, 
                    outcome: "Full training paid! You'll wear a Tesla cap in all photos. Worth it!",
                    chainStart: 'tesla_sponsor'
                },
                { 
                    text: "Decline politely", 
                    impact: { safety: 10 }, 
                    outcome: "You avoid the media circus and focus on pure aviation."
                },
                { 
                    text: "Negotiate terms", 
                    impact: { money: 5000, knowledge: 10 }, 
                    outcome: "Smart business move. Half sponsorship, less obligation.",
                    chainStart: 'tesla_sponsor_partial'
                }
            ]
        },
        {
            id: 'movie_filming',
            text: "Tom Cruise is filming Top Gun 3 at your airport. They need background Cessnas.",
            probability: 0.005,
            memorable: true,
            frequency: 'once',
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Volunteer", 
                    impact: { money: 500, morale: 50, fatigue: 30 }, 
                    outcome: "12-hour day but you're in a movie! Cruise gives you a thumbs up.",
                    reputation: { peers: 2 }
                },
                { 
                    text: "Too busy training", 
                    impact: { safety: 10, knowledge: 10 }, 
                    outcome: "You focus on your goals. The filming is distracting anyway."
                },
                { 
                    text: "Watch from ground", 
                    impact: { morale: 20 }, 
                    outcome: "Amazing aerobatics show! Free entertainment and aviation inspiration."
                }
            ]
        }
    ],

    // Financial Events (Mix of one-time and rare)
    financialExpanded: [
        // Keep existing financial events
        {
            id: 'ppl_coin_intro_expanded',
            text: "A fellow student pilot excitedly shows you his phone. 'Check out PPL Coin! It's a new crypto for pilots. I've already doubled my training fund!'",
            probability: 0.15,
            frequency: 'once',
            condition: (state) => state.day > 10 && state.stats.money > 3000 && !eventChains['ppl_coin'],
            buttons: [
                { 
                    text: "Invest $2000", 
                    impact: { money: -2000 }, 
                    outcome: "You buy 4000 PPL Coins at $0.50 each. Time will tell if this was wise...",
                    chainStart: 'ppl_coin',
                    chainData: { coins: 4000, buyPrice: 0.5 }
                },
                { 
                    text: "Invest $500", 
                    impact: { money: -500 }, 
                    outcome: "You buy 1000 PPL Coins. A small gamble on aviation crypto.",
                    chainStart: 'ppl_coin',
                    chainData: { coins: 1000, buyPrice: 0.5 }
                },
                { 
                    text: "Pass on crypto", 
                    impact: { safety: 3 }, 
                    outcome: "You politely decline. Your training fund stays safe in the bank."
                }
            ]
        },
        {
            id: 'foreflight_subscription_expanded',
            text: "Your paper charts are getting expensive to update. ForeFlight has a special student discount.",
            probability: 0.15,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 5 && state.stats.knowledge > 30,
            buttons: [
                { 
                    text: "Basic Plus ($99/yr)", 
                    impact: { money: -99, knowledge: 5 }, 
                    outcome: "Digital charts and basic flight planning. A huge upgrade from paper!",
                    chainStart: 'foreflight_user',
                    chainData: { plan: 'basic' }
                },
                { 
                    text: "Pro Plus ($199/yr)", 
                    impact: { money: -199, knowledge: 8, safety: 5 }, 
                    outcome: "Synthetic vision, hazard advisor, and more. Professional-grade tools!",
                    chainStart: 'foreflight_user',
                    chainData: { plan: 'pro' }
                },
                { 
                    text: "Stick with paper", 
                    impact: { money: -30 }, 
                    outcome: "You buy updated sectionals. Old school, but it works.",
                    chainStart: 'paper_charts_user'
                }
            ]
        },
        {
            id: 'flight_bag_upgrade',
            text: "Your old backpack isn't cutting it. Time for a proper flight bag?",
            probability: 0.15,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 5,
            buttons: [
                { 
                    text: "Brightline B7 ($250)", 
                    impact: { money: -250, morale: 10 }, 
                    outcome: "Professional pilot bag with perfect organization. You feel like a real pilot!",
                    reputation: { peers: 1 }
                },
                { 
                    text: "Amazon basic ($50)", 
                    impact: { money: -50 }, 
                    outcome: "It holds your stuff. That's about it."
                },
                { 
                    text: "Keep backpack", 
                    impact: { morale: -2 }, 
                    outcome: "It's falling apart but still functional. Sort of."
                }
            ]
        },
        {
            id: 'e6b_vs_app',
            text: "You need a flight computer for navigation calculations. Old school or modern?",
            probability: 0.10,
            frequency: 'once',
            condition: (state) => state.stats.knowledge > 35,
            buttons: [
                { 
                    text: "Metal E6B ($70)", 
                    impact: { money: -70, knowledge: 10 }, 
                    outcome: "Classic tool that never needs batteries. You master the whiz wheel!",
                    chainStart: 'e6b_user'
                },
                { 
                    text: "Electronic E6B ($150)", 
                    impact: { money: -150, knowledge: 5 }, 
                    outcome: "Quick calculations but you don't really understand the principles."
                },
                { 
                    text: "Phone app ($10)", 
                    impact: { money: -10 }, 
                    outcome: "Works great until your phone dies. Hope that doesn't happen in flight!",
                    chainStart: 'app_dependent'
                }
            ]
        },
        {
            id: 'insurance_quote',
            text: "After your first solo, renter's insurance is recommended. AOPA quotes you.",
            probability: 0.10,
            frequency: 'once',
            condition: (state) => state.stats.flightHours > 10 && state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Full coverage ($800/yr)", 
                    impact: { money: -800, safety: 15 }, 
                    outcome: "Peace of mind. You're covered for $80k hull damage and liability.",
                    reputation: { safety: 1 }
                },
                { 
                    text: "Basic coverage ($400/yr)", 
                    impact: { money: -400, safety: 8 }, 
                    outcome: "Liability only, but better than nothing."
                },
                { 
                    text: "Risk it", 
                    impact: { safety: -10 }, 
                    outcome: "You're personally liable for any damage. Hope nothing happens!",
                    chainStart: 'uninsured_risk'
                }
            ]
        }
    ],

    // Social Events (expanded)
    socialExpanded: [
        // Keep existing social events and add new ones
        {
            id: 'cfi_evaluation_expanded',
            text: "Your CFI sits you down: 'We need to talk about your progress. I have some concerns.'",
            probability: 0.2,
            condition: (state) => state.day > 10,
            buttons: [
                { 
                    text: "Listen openly", 
                    impact: { knowledge: 10, safety: 8, morale: -3 }, 
                    outcome: "Hard to hear, but valuable feedback about your steep turns and radio work.",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "Get defensive", 
                    impact: { morale: -10, knowledge: 2 }, 
                    outcome: "The conversation goes poorly. You realize later they were trying to help.",
                    reputation: { cfi: -1 }
                },
                { 
                    text: "Ask for specific help", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "Together you create a focused improvement plan. Great session!",
                    reputation: { cfi: 2 }
                }
            ]
        },
        {
            id: 'hangar_bbq_invite',
            text: "The old-timers are having their monthly hangar BBQ. 'Hey student, want to join us?'",
            probability: 0.10,
            chainStart: 'social_network',
            condition: (state) => state.day > 15,
            buttons: [
                { 
                    text: "Join them", 
                    impact: { money: -20, knowledge: 10, morale: 15 }, 
                    outcome: "Amazing stories and connections! A retired airline captain offers to mentor you.",
                    chainData: { network: 'joined' },
                    reputation: { peers: 2 }
                },
                { 
                    text: "Too busy", 
                    impact: { morale: -3 }, 
                    outcome: "You study instead. The opportunity for connections passes by."
                },
                { 
                    text: "Quick visit", 
                    impact: { morale: 8 }, 
                    outcome: "You grab a burger and hear one great story before heading out."
                }
            ]
        },
        {
            id: 'young_eagles_event',
            text: "EAA is hosting a Young Eagles event. They need pilot helpers (ground support for you).",
            probability: 0.08,
            chainStart: 'young_eagles_karma',
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Volunteer all day", 
                    impact: { fatigue: 15, morale: 25, knowledge: 5 }, 
                    outcome: "Inspiring kids discover aviation! One parent is an aviation attorney - good contact!",
                    chainData: { volunteered: true },
                    reputation: { peers: 3, fbo: 1 }
                },
                { 
                    text: "Help briefly", 
                    impact: { morale: 10 }, 
                    outcome: "You help with registration for an hour. Every bit helps!"
                },
                { 
                    text: "Focus on training", 
                    impact: { knowledge: 5 }, 
                    outcome: "You study while planes fly kids overhead. Mixed feelings."
                }
            ]
        },
        {
            id: 'cfi_switch_suggestion',
            text: "Another student pulls you aside: 'Have you considered switching instructors? Just saying...'",
            probability: 0.08,
            condition: (state) => state.day > 30 && state.stats.morale < 60,
            buttons: [
                { 
                    text: "Consider it", 
                    impact: { morale: 5 }, 
                    outcome: "Maybe a fresh perspective would help? You'll think about it.",
                    chainStart: 'instructor_change'
                },
                { 
                    text: "Defend your CFI", 
                    impact: { morale: -5 }, 
                    outcome: "You're loyal, but are you being honest with yourself?",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "Ask why", 
                    impact: { knowledge: 8 }, 
                    outcome: "They share specific concerns. Good feedback to discuss with your CFI."
                }
            ]
        },
        {
            id: 'solo_shirt_cutting',
            text: "You just soloed! Time for the traditional shirt tail cutting ceremony.",
            probability: 1.0,  // Always happens
            frequency: 'once',
            condition: (state) => state.milestones.firstSolo && !state.eventHistory.find(e => e.eventId === 'solo_shirt_cutting'),
            buttons: [
                { 
                    text: "Embrace tradition", 
                    impact: { morale: 30 }, 
                    outcome: "Your shirt tail joins hundreds on the wall. You're part of aviation history!",
                    reputation: { peers: 2, cfi: 1 }
                },
                { 
                    text: "Keep shirt intact", 
                    impact: { morale: 10 }, 
                    outcome: "You frame the whole shirt instead. Still meaningful!"
                },
                { 
                    text: "Social media it", 
                    impact: { morale: 25 }, 
                    outcome: "Your solo post gets 500 likes! Friends are inspired by your achievement."
                }
            ]
        }
    ],

    // Training Events (expanded with more challenges)
    trainingExpanded: [
        {
            id: 'simulated_engine_failure',
            text: "Without warning, your CFI pulls the power to idle. 'Engine failure, what do you do?'",
            probability: 0.12,
            condition: (state) => state.stats.flightHours > 8 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "ABC checklist", 
                    impact: { safety: 15, knowledge: 10 }, 
                    outcome: "Airspeed, Best field, Checklist. Perfect execution of emergency procedure!",
                    reputation: { cfi: 1 }
                },
                { 
                    text: "Find airport", 
                    impact: { safety: -5, knowledge: 5 }, 
                    outcome: "You try to glide to an airport 10 miles away. 'We'd never make it,' CFI explains."
                },
                { 
                    text: "Freeze up", 
                    impact: { safety: -10, morale: -10 }, 
                    outcome: "CFI takes control. 'We need to practice emergencies more.'"
                }
            ]
        },
        {
            id: 'lost_procedures_test',
            text: "Your CFI covers the GPS and instruments. 'You're lost. Show me how you'd find yourself.'",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 12,
            buttons: [
                { 
                    text: "VOR triangulation", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "You tune two VORs and triangulate perfectly. Old school navigation works!"
                },
                { 
                    text: "Pilotage", 
                    impact: { knowledge: 12, safety: 8 }, 
                    outcome: "You identify landmarks and roads. Good visual navigation skills!"
                },
                { 
                    text: "Admit confusion", 
                    impact: { safety: 15, knowledge: 8 }, 
                    outcome: "CFI appreciates honesty. You learn proper lost procedures together."
                }
            ]
        },
        {
            id: 'night_flight_opportunity',
            text: "Your CFI offers: 'Want to do some night flying? It's beautiful but different.'",
            probability: 0.08,
            frequency: 'rare',
            condition: (state) => state.stats.flightHours > 25,
            buttons: [
                { 
                    text: "Absolutely!", 
                    impact: { money: -300, knowledge: 20, morale: 15 }, 
                    outcome: "City lights like stars below! You learn night illusions and procedures.",
                    chainStart: 'night_flying'
                },
                { 
                    text: "Not ready", 
                    impact: { safety: 10 }, 
                    outcome: "Good ADM. You'll try when you're more confident."
                },
                { 
                    text: "Just pattern work", 
                    impact: { money: -150, knowledge: 10 }, 
                    outcome: "You stay in the pattern for night currency. Good compromise."
                }
            ]
        },
        {
            id: 'spin_training_offer',
            text: "An aerobatic instructor offers spin training. 'Every pilot should experience spins safely.'",
            probability: 0.04,
            frequency: 'rare',
            condition: (state) => state.stats.flightHours > 20,
            buttons: [
                { 
                    text: "Sign me up!", 
                    impact: { money: -400, knowledge: 25, safety: 20 }, 
                    outcome: "Terrifying but educational! You'll never accidentally spin now.",
                    reputation: { safety: 2 }
                },
                { 
                    text: "Maybe later", 
                    impact: { morale: -2 }, 
                    outcome: "You'll stick to stall recovery for now."
                },
                { 
                    text: "Watch from ground", 
                    impact: { knowledge: 5 }, 
                    outcome: "You watch another student's lesson. Looks intense!"
                }
            ]
        }
    ],

    // Weather Events
    weather: [
        {
            id: 'perfect_flying_day',
            text: "Severe clear! Calm winds, unlimited visibility, and smooth air. These days are rare!",
            probability: 0.15,
            condition: (state) => state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Extra flight time", 
                    impact: { money: -150, morale: 20, flightHours: 0.5 }, 
                    outcome: "You extend the lesson. Perfect conditions for practice!"
                },
                { 
                    text: "Normal lesson", 
                    impact: { morale: 10 }, 
                    outcome: "Great productive lesson in ideal conditions."
                },
                { 
                    text: "Practice everything", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "You nail every maneuver in these perfect conditions!"
                }
            ]
        },
        {
            id: 'surprise_fog_bank',
            text: "A fog bank rolls in from nowhere during your flight. Visibility dropping fast.",
            probability: 0.10,
            condition: (state) => state.lastAction === 'fly' && state.stats.flightHours > 10,
            buttons: [
                { 
                    text: "Immediate return", 
                    impact: { safety: 20 }, 
                    outcome: "Smart decision. You land just before field goes IFR.",
                    reputation: { safety: 2 }
                },
                { 
                    text: "Climb above", 
                    impact: { knowledge: 10, safety: -5 }, 
                    outcome: "You escape on top but now what? CFI talks you through it."
                },
                { 
                    text: "Scud run", 
                    impact: { safety: -25, morale: -15 }, 
                    outcome: "Terrible idea! CFI takes control immediately. Serious debrief coming.",
                    reputation: { cfi: -2, safety: -2 }
                }
            ]
        },
        {
            id: 'density_altitude_surprise',
            text: "It's 95°F on the ramp. 'Today we learn about density altitude,' your CFI says ominously.",
            probability: 0.10,
            condition: (state) => state.day > 120 && state.lastAction === 'fly',  // Summer
            buttons: [
                { 
                    text: "Calculate performance", 
                    impact: { knowledge: 15, safety: 15 }, 
                    outcome: "You calculate reduced performance. The takeoff roll is eye-opening!"
                },
                { 
                    text: "Normal takeoff", 
                    impact: { safety: -15, knowledge: 10 }, 
                    outcome: "Using way more runway than expected! Valuable scary lesson."
                },
                { 
                    text: "Delay flight", 
                    impact: { safety: 20, money: -50 }, 
                    outcome: "You wait for evening cooler temps. Smart ADM but costs a reschedule fee."
                }
            ]
        }
    ],

    // Equipment Failures (Rare - 2-3 times max)
    equipment: [
        {
            id: 'attitude_indicator_failure',
            text: "The attitude indicator starts tumbling during flight. You're in partial panel.",
            probability: 0.05,
            frequency: 'rare',
            maxOccurrences: 2,
            condition: (state) => state.stats.flightHours > 15 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Use turn coordinator", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "You fly partial panel successfully. Great instrument scan!"
                },
                { 
                    text: "Visual flight only", 
                    impact: { safety: 10 }, 
                    outcome: "You maintain visual references. Works in good weather."
                },
                { 
                    text: "Get confused", 
                    impact: { safety: -10, morale: -5 }, 
                    outcome: "Spatial disorientation starts. CFI helps you recover."
                }
            ]
        },
        {
            id: 'comm_radio_static',
            text: "Your radio starts crackling with static. Communication is getting difficult.",
            probability: 0.08,
            frequency: 'rare',
            maxOccurrences: 3,
            chainStart: 'radio_issues',
            condition: (state) => state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Troubleshoot systematically", 
                    impact: { knowledge: 10, safety: 10 }, 
                    outcome: "You check connections, squelch, and frequency. Problem identified!",
                    chainData: { handled_well: true }
                },
                { 
                    text: "Switch radios", 
                    impact: { safety: 5 }, 
                    outcome: "Com 2 works fine. Good resource management."
                },
                { 
                    text: "Continue with static", 
                    impact: { safety: -5, fatigue: 5 }, 
                    outcome: "You struggle through it. ATC is getting annoyed with repeat requests."
                }
            ]
        },
        {
            id: 'gps_database_expired',
            text: "The GPS shows 'Database Expired' warning. Your CFI asks, 'Can we still use it?'",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 10,
            buttons: [
                { 
                    text: "VFR only", 
                    impact: { knowledge: 15, safety: 10 }, 
                    outcome: "Correct! Expired database is ok for VFR situational awareness only."
                },
                { 
                    text: "Not at all", 
                    impact: { knowledge: 8 }, 
                    outcome: "Too conservative. CFI explains proper usage rules."
                },
                { 
                    text: "Who cares?", 
                    impact: { safety: -10, knowledge: 5 }, 
                    outcome: "Wrong attitude! CFI explains the legal implications."
                }
            ]
        }
    ],

    // Life Events with consequences
    lifeExpanded: [
        {
            id: 'relationship_pressure_expanded',
            text: "Your partner sits you down: 'You're always at the airport. We need to talk about us.'",
            probability: 0.15,
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Promise to balance better", 
                    impact: { morale: -8, fatigue: 5 }, 
                    outcome: "You agree to reduce training frequency. Relationships require compromise.",
                    chainStart: 'relationship_balance'
                },
                { 
                    text: "Explain your dream", 
                    impact: { morale: 10, knowledge: 2 }, 
                    outcome: "They understand better now and even offer to visit the airport with you!",
                    chainStart: 'supportive_partner'
                },
                { 
                    text: "Take a break", 
                    impact: { morale: -15, fatigue: -10 }, 
                    outcome: "You pause training for a week. Sometimes perspective helps."
                }
            ]
        },
        {
            id: 'work_bonus_surprise',
            text: "Your boss calls you in: 'Great quarter! Here's a $3000 performance bonus.'",
            probability: 0.05,
            frequency: 'rare',
            condition: (state) => state.day > 45,
            buttons: [
                { 
                    text: "All to flying!", 
                    impact: { money: 3000, morale: 25 }, 
                    outcome: "Your training fund gets a massive boost! Checkride here we come!"
                },
                { 
                    text: "Save half", 
                    impact: { money: 1500, morale: 15 }, 
                    outcome: "Balanced approach. Training continues with a safety cushion."
                },
                { 
                    text: "Celebrate first", 
                    impact: { money: 2500, morale: 30, fatigue: 10 }, 
                    outcome: "You take everyone out for drinks, then fund flying. Life is good!"
                }
            ]
        }
    ],

    // Safety/Close Call Events
    safetyExpanded: [
        {
            id: 'wake_turbulence_encounter',
            text: "Following a 737 too closely, you hit their wake. The plane rolls 60 degrees!",
            probability: 0.02,
            condition: (state) => state.stats.flightHours > 10 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Full opposite controls", 
                    impact: { safety: 25, knowledge: 20 }, 
                    outcome: "You recover from the upset. Heart pounding but successful!",
                    reputation: { cfi: 2, safety: 2 }
                },
                { 
                    text: "Ride it out", 
                    impact: { safety: -15, morale: -10 }, 
                    outcome: "Bad choice! CFI takes control and recovers. Lucky escape."
                },
                { 
                    text: "Should've waited", 
                    impact: { knowledge: 20, safety: 15 }, 
                    outcome: "You reflect on wake turbulence separation. Valuable learning moment."
                }
            ]
        },
        {
            id: 'near_midair',
            text: "Traffic suddenly appears at your altitude, same direction. Tower didn't call it out.",
            probability: 0.08,
            condition: (state) => state.stats.flightHours > 10 && state.lastAction === 'fly',
            buttons: [
                { 
                    text: "Immediate evasive action", 
                    impact: { safety: 15, morale: -8, knowledge: 10 }, 
                    outcome: "Quick thinking! You realize the importance of always scanning for traffic.",
                    reputation: { safety: 2 }
                },
                { 
                    text: "Report to Tower", 
                    impact: { safety: 12, knowledge: 8 }, 
                    outcome: "Tower apologizes and vectors the traffic. You learn about pilot advocacy.",
                    reputation: { atc: 1 }
                }
            ]
        }
    ],

    // Chain Consequence Events
    chainConsequences: [
        // ForeFlight Chain Events
        {
            id: 'ipad_overheating',
            text: "Your iPad shuts down from heat during a critical phase of flight. ForeFlight is gone.",
            probability: 0.15,
            chainLink: 'foreflight_user',
            condition: (state) => state.day > state.decisionHistory?.foreflight_choice?.day + 20,
            buttons: [
                { 
                    text: "Revert to paper backup", 
                    impact: { safety: 15, knowledge: 10 }, 
                    outcome: "Good thing you kept paper charts! Always have backups."
                },
                { 
                    text: "Wait for cooling", 
                    impact: { safety: -10, morale: -5 }, 
                    outcome: "You circle while waiting. Not ideal in busy airspace."
                },
                { 
                    text: "Use phone", 
                    impact: { safety: 5, fatigue: 10 }, 
                    outcome: "Your phone saves the day but the screen is tiny."
                }
            ]
        },
        {
            id: 'outdated_chart_drama',
            text: "The untowered airport changed traffic pattern direction last week. Your paper chart is old.",
            probability: 0.15,
            chainLink: 'paper_charts_user',
            condition: (state) => state.day > state.decisionHistory?.foreflight_choice?.day + 15,
            buttons: [
                { 
                    text: "Call UNICOM", 
                    impact: { safety: 10, knowledge: 5 }, 
                    outcome: "Smart move! You get current info and enter the pattern correctly."
                },
                { 
                    text: "Circle and observe", 
                    impact: { safety: 15, money: -30 }, 
                    outcome: "You spot other traffic and follow them. Extra fuel burned but safe."
                },
                { 
                    text: "Just guess", 
                    impact: { safety: -20, morale: -10 }, 
                    outcome: "Wrong pattern! You cause confusion and get yelled at on CTAF."
                }
            ]
        },

        // Karma Chain Events (Helped struggling student)
        {
            id: 'study_buddy_offer',
            text: "Remember Jake you helped with flight hours? He aced his written and offers to tutor you.",
            probability: 0.80,
            chainLink: 'helped_student',
            condition: (state) => state.day > state.decisionHistory?.helped_student?.day + 10,
            buttons: [
                { 
                    text: "Study together", 
                    impact: { knowledge: 20, morale: 15 }, 
                    outcome: "Jake's study methods are amazing! Your knowledge skyrockets.",
                    reputation: { peers: 1 }
                },
                { 
                    text: "Too proud", 
                    impact: { knowledge: 5 }, 
                    outcome: "You decline but Jake shares his notes anyway. Good guy."
                },
                { 
                    text: "Rain check", 
                    impact: { morale: 5 }, 
                    outcome: "You'll connect later. The offer stands!"
                }
            ]
        },
        {
            id: 'emergency_loan_offer',
            text: "Jake heard you're low on funds: 'You helped me fly, let me loan you $1000, no interest.'",
            probability: 0.70,
            chainLink: 'helped_student',
            condition: (state) => state.stats.money < 2000 && state.day > state.decisionHistory?.helped_student?.day + 25,
            buttons: [
                { 
                    text: "Accept gratefully", 
                    impact: { money: 1000, morale: 20 }, 
                    outcome: "True friendship! You promise to pay it forward someday.",
                    chainData: { owes_jake: 1000 }
                },
                { 
                    text: "Decline politely", 
                    impact: { morale: 10 }, 
                    outcome: "You appreciate the offer but will manage. Friendship intact!"
                }
            ]
        },

        // CFI Relationship Chain
        {
            id: 'cfi_weekend_flyin',
            text: "Your CFI invites you to a weekend fly-in: 'You've earned this. Want to come?'",
            probability: 0.60,
            chainLink: 'cfi_good_relationship',
            condition: (state) => state.reputation?.cfi > 3 && state.day > 40,
            buttons: [
                { 
                    text: "Absolutely!", 
                    impact: { money: -100, knowledge: 15, morale: 25 }, 
                    outcome: "Amazing experience! You meet pilots, see cool planes, and learn tons.",
                    reputation: { peers: 2, cfi: 1 }
                },
                { 
                    text: "Can't afford", 
                    impact: { morale: -5 }, 
                    outcome: "Your CFI understands. 'Next time!'"
                }
            ]
        },

        // Cheap headset consequence
        {
            id: 'hearing_concerns',
            text: "After months with the cheap headset, you're getting headaches. Time to upgrade?",
            probability: 0.50,
            chainLink: 'cheap_headset',
            condition: (state) => state.day > state.decisionHistory?.headset_choice?.day + 45,
            buttons: [
                { 
                    text: "Upgrade now", 
                    impact: { money: -600, safety: 15 }, 
                    outcome: "The ANR headset is life-changing. Why did you wait so long?"
                },
                { 
                    text: "Deal with it", 
                    impact: { fatigue: 10 }, 
                    outcome: "You push through but flying is less enjoyable. False economy.",
                    chainData: { permanent_fatigue: true }
                }
            ]
        }
    ]
});

// Function to check for chain events
function checkChainEvents(gameState) {
    const chainEvents = [];
    
    // Check each active chain
    for (const [chainId, chainData] of Object.entries(eventChains)) {
        // Find applicable chain consequence events
        const consequences = dynamicEvents.chainConsequences.filter(event => {
            return event.chainLink === chainId && 
                   (!event.condition || event.condition(gameState));
        });
        
        if (consequences.length > 0) {
            // Random chance to trigger chain event
            consequences.forEach(event => {
                if (Math.random() < event.probability) {
                    chainEvents.push(event);
                }
            });
        }
    }
    
    return chainEvents;
}

// Function to get a random event based on conditions and frequency
function selectRandomEvent(gameState) {
    // First check for chain events
    const chainEvents = checkChainEvents(gameState);
    if (chainEvents.length > 0 && Math.random() < 0.3) {  // 30% chance to prioritize chain events
        return chainEvents[Math.floor(Math.random() * chainEvents.length)];
    }
    
    // Collect all events from all categories
    const allEvents = [
        ...dynamicEvents.ultraRare,
        ...dynamicEvents.legendary,
        ...dynamicEvents.absurd,
        ...dynamicEvents.financial,
        ...dynamicEvents.social,
        ...dynamicEvents.training,
        ...dynamicEvents.weather,
        ...dynamicEvents.equipment,
        ...dynamicEvents.life,
        ...dynamicEvents.safety,
        ...dynamicEvents.chainConsequences
    ];
    
    // Filter events by condition, frequency, and recent history
    const validEvents = allEvents.filter(event => {
        // Check basic condition
        if (event.condition && !event.condition(gameState)) {
            return false;
        }
        
        // Check frequency restrictions
        if (event.frequency === 'once') {
            const occurred = gameState.eventHistory?.some(h => h.eventId === event.id);
            if (occurred) return false;
        } else if (event.frequency === 'rare' && event.maxOccurrences) {
            const occurrences = gameState.eventHistory?.filter(h => h.eventId === event.id).length || 0;
            if (occurrences >= event.maxOccurrences) return false;
        }
        
        // Check if event was recently shown (within 7 days for repeatable events)
        if (event.frequency !== 'once' && gameState.eventHistory) {
            const recentOccurrence = gameState.eventHistory.some(
                h => h.eventId === event.id && gameState.day - h.day < 7
            );
            if (recentOccurrence) return false;
        }
        
        return true;
    });
    
    if (validEvents.length === 0) return null;
    
    // Weight events by probability
    const totalWeight = validEvents.reduce((sum, event) => sum + (event.probability || 0.1), 0);
    let random = Math.random() * totalWeight;
    
    for (const event of validEvents) {
        random -= (event.probability || 0.1);
        if (random <= 0) {
            return event;
        }
    }
    
    // Fallback to random selection
    return validEvents[Math.floor(Math.random() * validEvents.length)];
}

// Function to process event choice and update game state
function processEventChoice(gameState, event, buttonIndex) {
    const button = event.buttons[buttonIndex];
    
    // Apply impacts
    if (button.impact) {
        for (const [stat, value] of Object.entries(button.impact)) {
            if (gameState.stats[stat] !== undefined) {
                gameState.stats[stat] += value;
            }
        }
    }
    
    // Update reputation if specified
    if (button.reputation) {
        if (!gameState.reputation) gameState.reputation = {};
        for (const [rep, value] of Object.entries(button.reputation)) {
            gameState.reputation[rep] = (gameState.reputation[rep] || 0) + value;
        }
    }
    
    // Start or update chain if specified
    if (button.chainStart) {
        eventChains[button.chainStart] = button.chainData || {};
        if (!gameState.decisionHistory) gameState.decisionHistory = {};
        gameState.decisionHistory[button.chainStart] = {
            day: gameState.day,
            data: button.chainData
        };
    }
    
    // Record event in history
    if (!gameState.eventHistory) gameState.eventHistory = [];
    gameState.eventHistory.push({
        eventId: event.id,
        day: gameState.day,
        choice: buttonIndex,
        memorable: event.memorable || false
    });
    
    // Update event occurrence tracking
    if (!gameState.eventOccurrences) gameState.eventOccurrences = {};
    gameState.eventOccurrences[event.id] = (gameState.eventOccurrences[event.id] || 0) + 1;
    
    return button.outcome;
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        dynamicEvents,
        selectRandomEvent,
        processEventChoice,
        checkChainEvents,
        weatherTypes
    };
}