// Morale Challenge Events - Realistic training frustrations
const moraleChallengeEvents = {
    
    // Training Plateaus and Struggles
    trainingStruggles: [
        {
            id: 'landing_plateau_morale',
            text: "Your landings have been consistently terrible lately. CFI says 'You're overthinking it.'",
            probability: 0.15,
            condition: (state) => state.stats.flightHours > 10 && state.stats.flightHours < 30,
            buttons: [
                { 
                    text: "Practice pattern work", 
                    impact: { money: -200, morale: -8, safety: 5 }, 
                    outcome: "Another rough session. Progress feels impossible right now."
                },
                { 
                    text: "Take a break", 
                    impact: { morale: -12, knowledge: 2 }, 
                    outcome: "You step back to reset mentally. Sometimes that's necessary."
                },
                { 
                    text: "Watch landing videos", 
                    impact: { morale: -5, knowledge: 3 }, 
                    outcome: "YouTube helps a bit, but you need stick time, not screen time."
                }
            ]
        },
        {
            id: 'radio_anxiety',
            text: "You freeze on the radio again. Tower sounds annoyed. Other pilots are waiting.",
            probability: 0.12,
            condition: (state) => state.stats.flightHours < 20,
            buttons: [
                { 
                    text: "Apologize and continue", 
                    impact: { morale: -10, safety: -3 }, 
                    outcome: "Tower: 'Take your time.' But you know you're that student pilot everyone's waiting for."
                },
                { 
                    text: "Practice at home", 
                    impact: { morale: -6, knowledge: 4 }, 
                    outcome: "You buy a radio simulator. Helps, but real ATC still intimidates you."
                }
            ]
        },
        {
            id: 'peer_comparison',
            text: "That 20-year-old who started after you just soloed. You're still doing pattern work.",
            probability: 0.10,
            condition: (state) => state.stats.flightHours > 15 && !state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Focus on your journey", 
                    impact: { morale: -8 }, 
                    outcome: "You try not to compare, but it stings. Everyone learns at their own pace... right?"
                },
                { 
                    text: "Push harder", 
                    impact: { morale: -12, fatigue: 10 }, 
                    outcome: "You book extra lessons. The pressure is getting to you."
                }
            ]
        },
        {
            id: 'stall_fear_morale',
            text: "Power-on stalls still terrify you. Your CFI notices you're not pushing to full stall.",
            probability: 0.08,
            condition: (state) => state.stats.flightHours > 8 && state.stats.flightHours < 25,
            buttons: [
                { 
                    text: "Admit your fear", 
                    impact: { morale: -7, safety: 8 }, 
                    outcome: "CFI works with you patiently, but you feel like a coward."
                },
                { 
                    text: "Power through it", 
                    impact: { morale: -10, safety: -5 }, 
                    outcome: "You white-knuckle through stalls. Not learning, just surviving."
                }
            ]
        }
    ],

    // Weather and Scheduling Frustrations
    weatherFrustrations: [
        {
            id: 'weather_streak',
            text: "Third weekend in a row cancelled for weather. You haven't flown in 2 weeks.",
            probability: 0.20,
            condition: (state) => state.day > 20,
            buttons: [
                { 
                    text: "Wait it out", 
                    impact: { morale: -15, knowledge: -2 }, 
                    outcome: "Skills are getting rusty. You'll need review flights when weather clears."
                },
                { 
                    text: "Simulator time", 
                    impact: { money: -80, morale: -8 }, 
                    outcome: "The sim helps, but it's not the same. You miss real flying."
                }
            ]
        },
        {
            id: 'winter_blues',
            text: "It's been gray and windy for weeks. Low ceilings every day. Training feels stuck.",
            probability: 0.15,
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Study instead", 
                    impact: { morale: -10, knowledge: 5 }, 
                    outcome: "More book work. You're becoming a ground school expert who can't fly."
                },
                { 
                    text: "Take time off", 
                    impact: { morale: -12 }, 
                    outcome: "Maybe a break will help. Or maybe you're just making excuses."
                }
            ]
        },
        {
            id: 'scheduling_nightmare',
            text: "Plane broke, CFI sick, weather bad, repeat. You've rescheduled 4 times this month.",
            probability: 0.12,
            condition: (state) => state.day > 15,
            buttons: [
                { 
                    text: "Stay flexible", 
                    impact: { morale: -13 }, 
                    outcome: "You're trying to be patient, but this is getting ridiculous."
                },
                { 
                    text: "Find new school", 
                    impact: { morale: -8, money: -100 }, 
                    outcome: "You check other schools. Same problems everywhere, higher prices."
                }
            ]
        }
    ],

    // Social and Family Pressures
    socialPressures: [
        {
            id: 'spouse_ultimatum',
            text: "Your partner: 'It's been 6 months and thousands of dollars. When does this end?'",
            probability: 0.08,
            condition: (state) => state.day > 40 && state.stats.money < 8000,
            buttons: [
                { 
                    text: "Promise to finish soon", 
                    impact: { morale: -15 }, 
                    outcome: "You make promises you're not sure you can keep. The pressure is mounting."
                },
                { 
                    text: "Explain the process", 
                    impact: { morale: -10 }, 
                    outcome: "They listen but don't really understand. The tension remains."
                },
                { 
                    text: "Consider quitting", 
                    impact: { morale: -25, knowledge: 5 }, 
                    outcome: "You seriously consider stopping. Is this dream worth the relationship stress?"
                }
            ]
        },
        {
            id: 'family_mockery',
            text: "Family dinner: 'Still playing with toy planes?' Everyone laughs. You're 'that relative.'",
            probability: 0.10,
            condition: (state) => state.day > 25,
            buttons: [
                { 
                    text: "Laugh it off", 
                    impact: { morale: -12 }, 
                    outcome: "You smile, but it hurts. They'll never understand what this means to you."
                },
                { 
                    text: "Stop sharing", 
                    impact: { morale: -8 }, 
                    outcome: "You stop talking about flying with family. Now you feel isolated."
                }
            ]
        },
        {
            id: 'friend_success',
            text: "Your friend just bought a house. You're spending house money on flying lessons.",
            probability: 0.09,
            condition: (state) => state.stats.money < 10000,
            buttons: [
                { 
                    text: "Question choices", 
                    impact: { morale: -18 }, 
                    outcome: "Are you being irresponsible? The doubt creeps in at night."
                },
                { 
                    text: "Double down", 
                    impact: { morale: -10 }, 
                    outcome: "Different dreams, different paths. But the comparison stings."
                }
            ]
        }
    ],

    // Age and Medical Concerns
    medicalConcerns: [
        {
            id: 'vision_concern',
            text: "You're squinting more. Night landings are getting harder. Age showing?",
            probability: 0.06,
            condition: (state) => state.day > 30,
            buttons: [
                { 
                    text: "Get eyes checked", 
                    impact: { money: -200, morale: -12 }, 
                    outcome: "New prescription needed. Another expense, another reminder you're not young."
                },
                { 
                    text: "Deny the problem", 
                    impact: { morale: -8, safety: -10 }, 
                    outcome: "You pretend it's fine, but deep down you know you're compromising safety."
                }
            ]
        },
        {
            id: 'medical_worry',
            text: "Blood pressure slightly elevated at last physical. Doctor mentions it could affect medical.",
            probability: 0.05,
            condition: (state) => state.day > 35,
            buttons: [
                { 
                    text: "Start exercising", 
                    impact: { morale: -15, fatigue: 5 }, 
                    outcome: "You start running. Everything hurts. Is your body failing you now?"
                },
                { 
                    text: "Take medication", 
                    impact: { money: -50, morale: -10 }, 
                    outcome: "Another monthly expense. You research FAA medication rules anxiously."
                }
            ]
        },
        {
            id: 'age_comment',
            text: "Young CFI: 'Most of my students your age take longer to solo.' Ouch.",
            probability: 0.07,
            condition: (state) => state.stats.flightHours > 18 && !state.milestones.firstSolo,
            buttons: [
                { 
                    text: "Feel defeated", 
                    impact: { morale: -20 }, 
                    outcome: "Maybe you're too old for this. The comment echoes in your head."
                },
                { 
                    text: "Prove them wrong", 
                    impact: { morale: -12, fatigue: 8 }, 
                    outcome: "You'll show them. But the seed of doubt is planted."
                }
            ]
        }
    ],

    // CFI and Training Environment Issues
    trainingEnvironment: [
        {
            id: 'cfi_criticism',
            text: "CFI after your landing: 'I don't know what else to tell you.' The frustration is mutual.",
            probability: 0.08,
            condition: (state) => state.stats.flightHours > 15,
            buttons: [
                { 
                    text: "Ask for new CFI", 
                    impact: { morale: -15, money: -150 }, 
                    outcome: "Switching CFIs feels like admitting failure. New CFI means starting over."
                },
                { 
                    text: "Take the criticism", 
                    impact: { morale: -18 }, 
                    outcome: "You nod silently. Confidence shattered. Maybe you're just not cut out for this."
                }
            ]
        },
        {
            id: 'cfi_availability',
            text: "Your CFI is cutting back hours. You're getting bumped for their 'better' students.",
            probability: 0.06,
            condition: (state) => state.day > 25,
            buttons: [
                { 
                    text: "Find another CFI", 
                    impact: { morale: -12, money: -200 }, 
                    outcome: "New CFI means relearning their style. Progress slows. Costs increase."
                },
                { 
                    text: "Work around it", 
                    impact: { morale: -15 }, 
                    outcome: "You take whatever slots are left. Usually bad weather days. Great."
                }
            ]
        },
        {
            id: 'fbo_attitude',
            text: "FBO staff clearly treats you as 'just another student.' You feel like a nuisance.",
            probability: 0.10,
            condition: (state) => state.day > 10,
            buttons: [
                { 
                    text: "Kill them with kindness", 
                    impact: { morale: -8 }, 
                    outcome: "You stay polite, but their attitude wears on you every visit."
                },
                { 
                    text: "Minimize interaction", 
                    impact: { morale: -10 }, 
                    outcome: "You avoid the FBO desk. Now you miss important announcements and feel disconnected."
                }
            ]
        }
    ]
};

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = moraleChallengeEvents;
}