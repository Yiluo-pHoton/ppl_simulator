# PPL Simulator - Cleanup and Refactoring Checklist

**Project**: PPL Simulator v2.0  
**Date**: 2025-09-06  
**Status**: Pre-Refactoring Preparation  
**Goal**: Step-by-step transformation from monolithic to modular architecture  

---

## Pre-Refactoring Safety Checklist

### ✅ Backup and Version Control
- [ ] **Create backup branch**: `git checkout -b backup/pre-refactor`
- [ ] **Tag current version**: `git tag -a v2.0-monolithic -m "Pre-refactor stable version"`
- [ ] **Document current functionality**: Complete feature audit
- [ ] **Create test game saves**: Multiple save states for testing
- [ ] **Screenshot current UI**: Visual regression testing reference

### ✅ Code Analysis Preparation
- [ ] **Run current game end-to-end**: Verify all features work
- [ ] **Document all known bugs**: Update ISSUES.md with current state
- [ ] **Map function dependencies**: Identify circular references
- [ ] **List global variables**: Document shared state
- [ ] **Audit DOM element access**: Find all DOM queries

---

## Phase 1: Documentation Cleanup and Organization

### Documentation File Consolidation
**Goal**: Reduce from 5+ scattered docs to organized structure

#### Files to Consolidate/Remove:
```
CURRENT DOCS (to clean up):
├── ISSUES.md (keep, reorganize)
├── REFACTORING.md (merge into RESTRUCTURE_PLAN.md)
├── SESSION_CONTEXT_2025-01-06.md (archive or remove)
├── BUTTON_FIX_SUMMARY.md (merge into ISSUES.md)
├── CONTEXT_MANAGEMENT.md (archive)
├── server.log (remove)
├── button_test.html (remove)
└── .DS_Store (remove)

TARGET DOCS (organized):
├── docs/
│   ├── ARCHITECTURE.md (new)
│   ├── API_REFERENCE.md (new)
│   ├── DEPLOYMENT.md (new)
│   └── CHANGELOG.md (new)
├── RESTRUCTURE_PLAN.md (keep)
├── CLEANUP_CHECKLIST.md (this file)
├── ISSUES.md (reorganized)
├── CLAUDE.md (keep)
└── README.md (create from CLAUDE.md)
```

#### Cleanup Tasks:
- [ ] **Remove temporary files**:
  - [ ] `rm server.log`
  - [ ] `rm button_test.html`
  - [ ] `rm .DS_Store`
  - [ ] `git rm --cached .DS_Store`

- [ ] **Consolidate documentation**:
  - [ ] Merge BUTTON_FIX_SUMMARY.md content into ISSUES.md
  - [ ] Archive SESSION_CONTEXT_2025-01-06.md to docs/archives/
  - [ ] Archive CONTEXT_MANAGEMENT.md to docs/archives/
  - [ ] Keep REFACTORING.md for now (reference during work)

- [ ] **Create organized docs structure**:
  - [ ] `mkdir docs docs/archives`
  - [ ] Move archived files
  - [ ] Create README.md from CLAUDE.md content

---

## Phase 2: Core Module Extraction Priority

### Priority Order (Low Risk → High Risk)

#### Priority 1: Data Modules (LOWEST RISK)
**Risk Level**: 🟢 LOW - Pure data, no side effects

- [ ] **Extract AviationData.js**
  - [ ] `const aviationEvents` (lines ~400-900)
  - [ ] `const weatherConditions` (lines ~120-180)
  - [ ] `const trainingEndorsements` (lines ~300-400)
  - [ ] Test: Events still trigger correctly

- [ ] **Extract AircraftData.js**
  - [ ] `const aircraftTypes` (lines ~100-120)
  - [ ] Test: Aircraft selection works

- [ ] **Extract InstructorData.js**
  - [ ] `const instructors` (lines ~180-250)
  - [ ] Test: Instructor assignment works

#### Priority 2: Utility Modules (LOW RISK)
**Risk Level**: 🟢 LOW - Pure functions, no state

- [ ] **Extract MathUtils.js**
  - [ ] Math calculation helpers
  - [ ] Regional multiplier functions
  - [ ] Test: All calculations produce same results

- [ ] **Extract DateUtils.js**
  - [ ] Week/season calculations
  - [ ] Time progression logic
  - [ ] Test: Time advances correctly

#### Priority 3: Core State Management (MEDIUM RISK)
**Risk Level**: 🟡 MEDIUM - Central to game, but well-isolated

- [ ] **Extract GameState.js**
  - [ ] `let gameState` object (lines 10-96)
  - [ ] State validation functions
  - [ ] Computed property methods
  - [ ] Test: All actions update state correctly

- [ ] **Extract SaveLoad.js**
  - [ ] `saveGame()` function
  - [ ] `loadGame()` function
  - [ ] Local storage management
  - [ ] Test: Save/load preserves all state

#### Priority 4: System Modules (MEDIUM-HIGH RISK)
**Risk Level**: 🟡 MEDIUM - Complex logic, many dependencies

- [ ] **Extract CostCalculator.js**
  - [ ] `calculateLessonCost()` and 15+ related functions
  - [ ] All cost calculation logic
  - [ ] Test: Lesson costs match current values

- [ ] **Extract WeatherSystem.js**
  - [ ] `getWeeklyWeather()` function
  - [ ] Weather impact calculations
  - [ ] Test: Weather affects lessons correctly

- [ ] **Extract EventSystem.js**
  - [ ] Event selection algorithms
  - [ ] Event impact application
  - [ ] Test: Events trigger and apply impacts

#### Priority 5: UI Modules (HIGH RISK)
**Risk Level**: 🔴 HIGH - Many DOM dependencies, visual impact

- [ ] **Extract ModalManager.js**
  - [ ] All `show*Modal()` functions
  - [ ] Modal creation and management
  - [ ] Test: All popups display correctly

- [ ] **Extract UIRenderer.js**
  - [ ] `updateDisplay()` function
  - [ ] All DOM update functions
  - [ ] Test: UI reflects game state accurately

---

## Phase 3: CSS Restructuring Checklist

### CSS Analysis Tasks
- [ ] **Audit current styles** (3,270 lines):
  - [ ] Count animation definitions (50+ keyframes)
  - [ ] Identify component boundaries
  - [ ] Find repeated patterns and variables
  - [ ] Map CSS to HTML elements

### CSS Extraction Priority

#### Step 1: Extract Variables and Base Styles
- [ ] **Create styles/base/variables.css**:
  - [ ] Extract all color values
  - [ ] Extract spacing and sizing values
  - [ ] Extract font definitions
  - [ ] Test: Colors and typography unchanged

#### Step 2: Extract Animations
- [ ] **Create styles/themes/animations.css**:
  - [ ] All `@keyframes` definitions (50+ animations)
  - [ ] Animation utility classes
  - [ ] Test: All animations work correctly

#### Step 3: Extract Components
- [ ] **Create styles/components/buttons.css**:
  - [ ] Button base styles and variants
  - [ ] Hover and active states
  - [ ] Test: All buttons styled correctly

- [ ] **Create styles/components/gauges.css**:
  - [ ] Instrument panel styles
  - [ ] Gauge animations and transitions
  - [ ] Test: Gauges display and animate

- [ ] **Create styles/components/modals.css**:
  - [ ] Modal backdrop and content styles
  - [ ] Modal animations
  - [ ] Test: All popups display correctly

#### Step 4: Layout Extraction
- [ ] **Create styles/layout/header.css**
- [ ] **Create styles/layout/sidebar.css**
- [ ] **Create styles/layout/main-panel.css**
- [ ] Test: Layout remains consistent

---

## Phase 4: Build System Implementation

### Build Configuration Setup
- [ ] **Create build directory**: `mkdir build`
- [ ] **Create simple concatenation script**:
  ```javascript
  // build/concatenate.js
  const fs = require('fs');
  const modules = [
    'src/data/AviationData.js',
    'src/core/GameState.js',
    // ... other modules
  ];
  ```

- [ ] **Create CSS compilation script**:
  ```javascript
  // build/compile-css.js
  const cssFiles = [
    'styles/base/variables.css',
    'styles/base/reset.css',
    // ... other stylesheets
  ];
  ```

- [ ] **Update index.html**: Point to compiled bundle.js and styles.css
- [ ] **Test build output**: Verify game works with bundled files

### Build Verification Checklist
- [ ] **Game loads correctly** from bundled files
- [ ] **All features functional** (complete playthrough)
- [ ] **CSS styling intact** (visual comparison)
- [ ] **Performance acceptable** (load time < 3 seconds)

---

## Phase 5: Testing Implementation

### Unit Testing Setup
- [ ] **Choose testing framework**: Jest or Mocha + Chai
- [ ] **Create test directory structure**:
  ```
  tests/
  ├── unit/
  │   ├── CostCalculator.test.js
  │   ├── WeatherSystem.test.js
  │   └── GameState.test.js
  ├── integration/
  │   └── GameFlow.test.js
  └── test-data/
      └── mock-game-states.js
  ```

### Test Implementation Priority
- [ ] **CostCalculator tests** (highest value, pure functions):
  - [ ] Test lesson cost calculations
  - [ ] Test fuel cost calculations
  - [ ] Test seasonal adjustments

- [ ] **GameState tests**:
  - [ ] Test state initialization
  - [ ] Test skill updates
  - [ ] Test computed properties

- [ ] **Integration tests**:
  - [ ] Test complete game flow
  - [ ] Test save/load functionality
  - [ ] Test milestone progression

### Test Automation Setup
- [ ] **Package.json scripts**:
  ```json
  {
    "scripts": {
      "test": "jest",
      "test:watch": "jest --watch",
      "build": "node build/concatenate.js",
      "dev": "python -m http.server 8000"
    }
  }
  ```

---

## Quality Assurance Checklist

### Before Each Module Extraction
- [ ] **Create feature branch**: `git checkout -b extract/[module-name]`
- [ ] **Identify all functions** to extract
- [ ] **Map all dependencies** (what this module needs)
- [ ] **Map all dependents** (what needs this module)
- [ ] **Plan import/export strategy**

### After Each Module Extraction
- [ ] **Run full game test**: Complete successful game
- [ ] **Test save/load**: Verify persistence works
- [ ] **Check console errors**: No JavaScript errors
- [ ] **Visual comparison**: Screenshots match
- [ ] **Performance check**: No significant slowdown
- [ ] **Git commit**: With descriptive message

### Before Major Phase Completion
- [ ] **Full regression test**:
  - [ ] Start new game successfully
  - [ ] Complete study/fly/rest actions
  - [ ] Trigger random events
  - [ ] Reach first milestone
  - [ ] Test game over conditions
  - [ ] Test victory condition

- [ ] **Cross-browser testing**:
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari (if available)
  - [ ] Mobile browsers

---

## Code Quality Standards Enforcement

### Function Complexity Limits
- [ ] **Maximum function length**: 50 lines
- [ ] **Maximum cyclomatic complexity**: 10
- [ ] **Maximum parameters**: 5
- [ ] **Use ESLint configuration** for enforcement

### Naming Convention Enforcement
- [ ] **Functions**: `camelCase` and descriptive
- [ ] **Classes**: `PascalCase`
- [ ] **Constants**: `UPPER_SNAKE_CASE`
- [ ] **CSS classes**: `kebab-case`

### Documentation Requirements
- [ ] **All exported functions** have JSDoc comments
- [ ] **Complex algorithms** have inline comments
- [ ] **Magic numbers** replaced with named constants
- [ ] **Module purposes** documented in header comments

---

## Rollback Procedures

### Emergency Rollback Plan
If refactoring breaks critical functionality:

1. **Immediate rollback**:
   ```bash
   git checkout backup/pre-refactor
   git checkout -b hotfix/rollback-refactor
   ```

2. **Identify specific issue**:
   - Compare broken vs working versions
   - Identify specific module causing problems
   - Fix in isolation before re-attempting

3. **Gradual re-application**:
   - Apply modules one at a time
   - Test thoroughly after each addition
   - Skip problematic modules for later investigation

### Module-Level Rollback
For individual module problems:
1. **Revert specific module**: Put functions back in main file
2. **Keep other improvements**: Don't roll back entire refactor
3. **Document issue**: Add to ISSUES.md for future resolution

---

## Success Criteria

### Technical Metrics
- [ ] **Zero functionality regressions**: Game works identically
- [ ] **Performance maintained**: < 10% performance degradation
- [ ] **Code size manageable**: No single file > 500 lines
- [ ] **Test coverage**: > 70% for core modules

### Developer Experience Metrics
- [ ] **Faster debugging**: Can isolate issues to specific modules
- [ ] **Easier feature addition**: Clear places to add new functionality  
- [ ] **Better code review**: Smaller, focused changes
- [ ] **Improved documentation**: Clear module boundaries and APIs

### Project Health Metrics
- [ ] **Reduced technical debt**: Cleaner, more maintainable codebase
- [ ] **Improved collaboration**: Multiple developers can work simultaneously
- [ ] **Enhanced testing**: Individual modules can be tested in isolation
- [ ] **Better deployment**: Clear build and deployment process

---

## Timeline Estimates

| Phase | Estimated Time | Risk Factor | Dependencies |
|-------|---------------|-------------|--------------|
| Documentation Cleanup | 4 hours | Low | None |
| Data Module Extraction | 8 hours | Low | Docs complete |
| Core Module Extraction | 16 hours | Medium | Data modules |
| System Module Extraction | 24 hours | Medium-High | Core modules |
| UI Module Extraction | 20 hours | High | System modules |
| CSS Restructuring | 16 hours | Medium | UI modules |
| Build System Setup | 12 hours | Medium | All modules |
| Testing Implementation | 20 hours | Low | Build system |

**Total Estimated Time**: 120 hours (3-4 weeks at 30-40 hours/week)

---

## Final Verification Checklist

### Before Declaring Refactor Complete
- [ ] **All original features working**: Complete game playthrough
- [ ] **All tests passing**: Unit and integration tests green
- [ ] **Documentation complete**: All modules documented
- [ ] **Build system reliable**: Consistent deployments
- [ ] **Performance acceptable**: No significant slowdown
- [ ] **Code quality high**: ESLint passing, low complexity
- [ ] **Team approval**: Code review completed

### Post-Refactor Tasks
- [ ] **Update CLAUDE.md**: Reflect new architecture
- [ ] **Create deployment guide**: Document new build process
- [ ] **Update contributor guide**: New module addition process
- [ ] **Archive old documentation**: Move outdated docs
- [ ] **Tag stable version**: `git tag -a v2.1-modular`

---

**Notes for Execution:**
- Work on one module at a time
- Test thoroughly after each extraction
- Keep commits small and focused
- Document any deviations from plan
- Don't rush - quality over speed