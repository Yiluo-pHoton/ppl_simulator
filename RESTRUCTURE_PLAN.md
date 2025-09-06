# PPL Simulator - Complete Restructuring Plan

**Project**: PPL Simulator v2.0  
**Date**: 2025-09-06  
**Scope**: Transform monolithic 3,793-line codebase into modular architecture  
**Goal**: Maintainable, scalable, professional codebase structure  

---

## Executive Summary

The PPL Simulator has grown from a simple MVP into a complex aviation training simulator with advanced features, but the architecture has not evolved with the functionality. This plan outlines a complete restructuring that will:

- Break down the monolithic 3,793-line `game.js` into focused modules
- Reorganize 3,270-line `style.css` into component-based stylesheets
- Establish proper separation of concerns
- Implement modern JavaScript module architecture
- Create maintainable build and deployment pipeline

## Current Architecture Analysis

### Current File Structure
```
ppl_simulator/
├── index.html (63KB - UI structure)
├── game.js (153KB - monolithic game engine)
├── style.css (76KB - monolithic styling)
├── CLAUDE.md (project instructions)
├── [5 documentation files] (scattered docs)
└── [test files and logs]
```

### Problems Identified

**Code Organization Issues:**
- 110+ functions mixed in single file
- No clear module boundaries
- Circular dependencies embedded
- Hard to locate specific functionality
- Testing individual components impossible

**Specific Function Categories Found:**
- Game state management (10+ functions)
- Cost calculation system (15+ functions)
- Weather simulation (8+ functions)
- UI updates and rendering (20+ functions)
- Event system (15+ functions)
- Milestone tracking (12+ functions)
- Save/load functionality (6+ functions)
- Tutorial and modal systems (8+ functions)

**CSS Structure Issues:**
- 3,270 lines of mixed styles
- No component organization
- Repeated patterns and properties
- Animations mixed with layout styles
- No consistent naming convention

## Proposed New Architecture

### Target File Structure
```
ppl_simulator/
├── index.html
├── src/
│   ├── core/
│   │   ├── GameState.js (state management)
│   │   ├── GameLoop.js (main game loop)
│   │   └── SaveLoad.js (persistence)
│   ├── systems/
│   │   ├── CostCalculator.js (lesson pricing)
│   │   ├── WeatherSystem.js (weather simulation)
│   │   ├── EventSystem.js (random events)
│   │   ├── ProgressTracker.js (milestones)
│   │   └── InstructorSystem.js (CFI management)
│   ├── ui/
│   │   ├── UIRenderer.js (DOM updates)
│   │   ├── ModalManager.js (popups/dialogs)
│   │   ├── TutorialSystem.js (onboarding)
│   │   └── GaugeRenderer.js (instruments)
│   ├── data/
│   │   ├── AviationData.js (events, weather)
│   │   ├── AircraftData.js (aircraft types)
│   │   ├── InstructorData.js (CFI profiles)
│   │   └── PhaseData.js (training phases)
│   └── utils/
│       ├── MathUtils.js (calculations)
│       ├── DateUtils.js (time management)
│       └── ValidationUtils.js (input validation)
├── styles/
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── typography.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── gauges.css
│   │   ├── modals.css
│   │   ├── logbook.css
│   │   └── achievements.css
│   ├── layout/
│   │   ├── header.css
│   │   ├── sidebar.css
│   │   ├── main-panel.css
│   │   └── footer.css
│   └── themes/
│       ├── aviation.css
│       └── animations.css
├── assets/
│   ├── images/
│   ├── icons/
│   └── sounds/ (future)
├── build/
│   ├── bundle.js (concatenated modules)
│   ├── styles.css (compiled CSS)
│   └── build.config.js
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
    ├── API.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

## Module Breakdown Plan

### 1. Core Modules (src/core/)

#### GameState.js
**Purpose**: Central state management  
**Extracted Functions**: 
- State initialization
- State validation
- State transitions
- Computed properties (knowledge from skills)

**Current Code Location**: Lines 1-96 (gameState object)

```javascript
// Example structure
export class GameState {
    constructor() {
        this.state = { /* game state */ };
    }
    
    updateSkill(skill, amount) { /* */ }
    computeKnowledge() { /* */ }
    validateState() { /* */ }
}
```

#### GameLoop.js
**Purpose**: Main game execution flow  
**Extracted Functions**:
- `takeAction()`
- `applyImpacts()`
- `checkEndConditions()`
- `updatePhase()`

#### SaveLoad.js
**Purpose**: Game persistence  
**Extracted Functions**:
- `saveGame()`
- `loadGame()`
- `clearSave()`
- Local storage management

### 2. System Modules (src/systems/)

#### CostCalculator.js
**Purpose**: All financial calculations  
**Functions to Extract** (15+ functions):
- `calculateLessonCost()`
- `calculateFuelCosts()`
- `calculateGroundTime()`
- `calculateWeatherDelay()`
- `calculateAirportFees()`
- `calculateEquipmentRental()`
- `calculateSeasonalAdjustment()`
- `getRegionalMultiplier()`

**Benefits**: Isolated testing of pricing logic, easier cost model adjustments

#### WeatherSystem.js  
**Purpose**: Weather simulation and effects  
**Functions to Extract**:
- `getWeeklyWeather()`
- Weather condition definitions
- Weather impact calculations

#### EventSystem.js
**Purpose**: Random events and narrative  
**Functions to Extract**:
- Event selection logic
- Event impact application
- Aviation events data structure

**Current Code Location**: aviationEvents object (~500 lines)

#### ProgressTracker.js
**Purpose**: Milestone and achievement system  
**Functions to Extract**:
- `checkPrerequisites()`
- `unlockEndorsement()`
- `updateMilestoneTracker()`
- Achievement logic

#### InstructorSystem.js
**Purpose**: CFI management and relationships  
**Functions to Extract**:
- `selectInstructor()`
- Instructor data management
- Relationship tracking

### 3. UI Modules (src/ui/)

#### UIRenderer.js
**Purpose**: DOM updates and rendering  
**Functions to Extract**:
- `updateDisplay()`
- Gauge rendering
- Stats display updates
- Progress bar updates

#### ModalManager.js
**Purpose**: All popup and dialog management  
**Functions to Extract**:
- `showGameOverModal()`
- `showDramaticEnding()`
- `showCelebrationModal()`
- `showTutorial()`

#### GaugeRenderer.js
**Purpose**: Aviation instrument rendering  
**New Module**: Convert progress bars to authentic gauges  
**Features**: SVG-based circular gauges, needle animations

### 4. Data Modules (src/data/)

#### AviationData.js
**Purpose**: Static aviation data  
**Content**: Events, weather conditions, phase definitions

#### AircraftData.js
**Purpose**: Aircraft specifications  
**Content**: Aircraft types, costs, availability

## CSS Restructuring Plan

### Component-Based CSS Architecture

#### Base Styles (styles/base/)
- **variables.css**: CSS custom properties, color schemes
- **reset.css**: Normalize browser differences
- **typography.css**: Font definitions, text styles

#### Component Styles (styles/components/)
- **gauges.css**: Instrument gauge styling
- **modals.css**: All popup and dialog styles  
- **buttons.css**: Button variants and states
- **logbook.css**: Flight log table styling
- **achievements.css**: Milestone and achievement UI

#### Layout Styles (styles/layout/)
- **header.css**: Top navigation and branding
- **sidebar.css**: Left panel with actions
- **main-panel.css**: Central game area
- **footer.css**: Bottom status bar

## Migration Strategy

### Phase 1: Foundation (Week 1)
**Priority**: Set up new structure without breaking existing functionality

1. **Create new directory structure**
2. **Set up build system** (simple concatenation initially)
3. **Extract GameState module** (lowest risk, high impact)
4. **Test functional equivalence**

### Phase 2: Core Systems (Week 2)
**Priority**: Extract major functional systems

1. **Extract CostCalculator.js** (15+ functions)
2. **Extract WeatherSystem.js** (8+ functions)
3. **Extract EventSystem.js** (event data + logic)
4. **Validate all game actions still work**

### Phase 3: UI Separation (Week 3)
**Priority**: Separate presentation from logic

1. **Extract UIRenderer.js** (DOM manipulation)
2. **Extract ModalManager.js** (popup system)
3. **Begin CSS component extraction**
4. **Test UI responsiveness**

### Phase 4: Polish & Testing (Week 4)
**Priority**: Complete extraction and add testing

1. **Extract remaining modules**
2. **Implement unit tests**
3. **CSS optimization and theming**
4. **Performance testing**

## Build System Requirements

### Simple Concatenation Approach (Immediate)
```javascript
// build.config.js
const modules = [
    'src/core/GameState.js',
    'src/systems/CostCalculator.js',
    // ... other modules
    'src/main.js'  // initialization
];

// Simple concatenation for now
```

### Future Build Enhancements
- ES6 module bundling (webpack/rollup)
- CSS preprocessing (SASS/PostCSS)
- Code minification and optimization
- Source maps for debugging

## Dependency Management

### Module Dependencies Graph
```
GameLoop.js
├── GameState.js (state management)
├── CostCalculator.js (pricing)
├── WeatherSystem.js (conditions)
├── EventSystem.js (random events)
└── UIRenderer.js (display updates)

UIRenderer.js
├── GameState.js (read state)
├── ModalManager.js (show popups)
└── GaugeRenderer.js (instruments)
```

### Import/Export Strategy
```javascript
// Modern ES6 modules (future)
export class GameState { /* */ }
import { GameState } from './core/GameState.js';

// Immediate approach: global objects
window.PPLSim = window.PPLSim || {};
PPLSim.GameState = GameState;
```

## Testing Strategy

### Unit Testing Plan
- **CostCalculator**: Test pricing accuracy with known inputs
- **WeatherSystem**: Validate weather generation patterns
- **GameState**: Test state transitions and validations
- **ProgressTracker**: Verify milestone unlock logic

### Integration Testing
- **Game Flow**: Full game completion scenarios
- **Save/Load**: State persistence across sessions
- **UI Consistency**: All UI updates reflect state correctly

### Performance Testing
- **Load Time**: Measure initial game load
- **Memory Usage**: Track state growth over time
- **Render Performance**: UI update speed

## Documentation Requirements

### Technical Documentation
- **API.md**: Function signatures and usage
- **ARCHITECTURE.md**: System design overview
- **DEPLOYMENT.md**: Build and deployment process

### Developer Documentation
- **CONTRIBUTING.md**: Code style and PR process
- **MODULE_GUIDE.md**: How to add new features
- **TESTING.md**: Testing guidelines and setup

## Risk Assessment & Mitigation

### High Risk Items
1. **Breaking existing functionality** during extraction
   - **Mitigation**: Comprehensive testing after each phase
   - **Backup**: Git branches for each extraction step

2. **Performance degradation** from modular structure
   - **Mitigation**: Performance benchmarking
   - **Solution**: Build system optimization

3. **Increased complexity** for simple changes
   - **Mitigation**: Clear documentation and examples
   - **Solution**: Helper functions and utilities

### Medium Risk Items
1. **Build system complexity**
2. **CSS specificity conflicts**
3. **Module circular dependencies**

## Success Metrics

### Code Quality Metrics
- **Cyclomatic Complexity**: Target < 10 per function
- **File Size**: No single file > 500 lines
- **Test Coverage**: Target > 80% for core modules

### Performance Metrics
- **Initial Load**: < 2 seconds
- **Memory Usage**: < 50MB peak
- **UI Responsiveness**: < 100ms for state updates

### Developer Experience Metrics
- **Bug Location Time**: < 5 minutes to find issue
- **New Feature Time**: < 2 hours for simple features
- **Code Review Time**: < 30 minutes per module

## Timeline Summary

| Week | Focus | Deliverables | Risk Level |
|------|-------|--------------|------------|
| 1 | Foundation | New structure, GameState | Low |
| 2 | Core Systems | Cost/Weather/Event modules | Medium |
| 3 | UI Separation | UI/Modal modules, CSS | Medium |
| 4 | Polish | Testing, optimization | Low |

## Conclusion

This restructuring plan transforms the PPL Simulator from a monolithic application into a professional, maintainable codebase. The modular architecture will enable:

- **Easier debugging** and bug fixes
- **Faster feature development**
- **Better testing capabilities**
- **Improved code reuse**
- **Enhanced team collaboration**

The phased approach minimizes risk while delivering immediate benefits. Each phase can be deployed independently, ensuring the game remains functional throughout the transition.

---

**Next Steps**: 
1. Review and approve this plan
2. Create backup branch of current code
3. Begin Phase 1 implementation
4. Set up automated testing framework