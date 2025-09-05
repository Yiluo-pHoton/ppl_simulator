# PPL Simulator - Development Guide

## Project Overview
A quirky, text-based Private Pilot License simulator that captures the real student pilot journey with humor and absurd events. Built as a lightweight static web app for GitHub Pages.

## Development Principles

### Keep It Simple & Fun
- **One-night MVP approach**: Build core gameplay first, expand later
- **Feature-first development**: Implement what's fun, polish later
- **No over-engineering**: Use vanilla JS/HTML/CSS until you need more

### Code Standards

#### File Organization
```
ppl_simulator/
├── index.html    # Main game interface
├── style.css     # All styling
├── game.js       # All game logic
└── CLAUDE.md     # This file
```

#### JavaScript Conventions
- Use ES6+ features (const/let, arrow functions, template literals)
- Keep functions focused and named descriptively
- Store game data in simple objects/arrays
- Comment aviation-specific logic and game mechanics

#### CSS Conventions
- Use CSS custom properties for colors and spacing
- Mobile-first responsive design
- Aviation-themed color palette
- Clear, readable typography

### Content Guidelines

#### Aviation Events
- Keep events family-friendly and educational
- Base events on real student pilot experiences
- Balance humor with realism
- Include both positive and challenging scenarios

#### Game Balance
- Starting budget: $15,000 (realistic for PPL training)
- Lesson costs: $200-300 per session (instructor + aircraft)
- Knowledge builds gradually through study and flying
- Morale affected by progress, setbacks, and weather

## Quick Commands

### Local Development
```bash
# Serve locally (any method)
python -m http.server 8000
# or use Live Server in VS Code
```

### Adding Content
```javascript
// Add new event to events array in game.js
{
    text: "Your CFI shows up in flip-flops",
    morale: -10,
    safety: -5,
    money: 0,
    knowledge: 2  // At least you learned something
}
```

### Testing Checklist
- [ ] All three actions work (Study/Fly/Rest)
- [ ] Stats update correctly
- [ ] Random events trigger
- [ ] Game can be won and lost
- [ ] Save/load functionality works
- [ ] Responsive on mobile

### Deployment
- Push to main branch
- GitHub Actions auto-deploys to Pages
- Test on actual mobile device

## Game Design Guidelines

### Player Stats (0-100 scale)
- **Morale**: Affected by progress, weather, instructor interactions
- **Knowledge**: Built through study, ground school, experience
- **Safety**: Maintained through proper procedures, degraded by rushing
- **Money**: Decreases with lessons, tests, equipment
- **Flight Hours**: Progress toward 40-hour PPL minimum
- **Week**: Current week of training

### Milestone System
1. **Ground School** (Week 4-8): Knowledge > 60
2. **First Solo** (Week 12-20): Hours > 15, Safety > 70
3. **Written Test** (Week 20-30): Knowledge > 80, $160 fee
4. **Checkride** (Week 30-50): Hours > 40, all stats > 70, $600 fee

### Endings
- **Success**: PPL obtained with positive stats
- **Financial Ruin**: Money < $500 before completion
- **Burnout**: Morale drops to 0
- **Safety Failure**: Safety drops too low for solo endorsement
- **Time Limit**: Taking too long (knowledge test expires)

## Future Expansion Ideas (Post-MVP)
- Animated instrument gauges (six-pack display)
- Weather system affecting flight availability
- Multiple instructor personalities
- Different aircraft types with varying costs
- Achievement system
- Detailed flight logbook
- Sound effects and animations
- Multiplayer comparison features

## Common Issues & Solutions

### Performance
- Keep DOM updates minimal
- Use CSS transitions for smooth stat changes
- Lazy load content if needed

### Mobile
- Ensure buttons are touch-friendly (min 44px)
- Test on actual devices
- Consider landscape orientation

### Game Balance
- Playtest frequently
- Track typical completion time and cost
- Adjust random event frequency
- Balance challenge with fun

## Contributing Guidelines
- Test changes thoroughly before committing
- Keep the quirky tone consistent
- Maintain aviation accuracy where possible
- Focus on fun over realism when they conflict

---
Last updated: 2025-09-05