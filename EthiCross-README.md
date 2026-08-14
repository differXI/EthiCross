# EthiCross

EthiCross is a web-based educational crossword puzzle game designed to help students learn and understand **software ethics terminology** through interactive gameplay.

The project is developed for the course **Ethics and Professionalism for Software Engineers (953420)** at Chiang Mai University.

## Project Goal

Many students find software ethics difficult to remember when it is taught mainly through lectures and text-based materials. EthiCross provides a more interactive learning experience by combining crossword puzzles with ethical concepts, hints, explanations, and real-world software engineering examples.

The prototype focuses on demonstrating the core learning experience:

**Clue → Answer → Validation → Explanation → Progress**

## Target Users

- Software Engineering students
- Computer Science students
- Information Technology students
- Students studying software ethics or professional practices
- Novice programmers interested in software ethics

## Software Ethics Topics

The first prototype should focus on a small set of core terms:

- Privacy
- Security
- Fairness
- Accountability
- Transparency
- Copyright
- Accessibility

The terminology, definitions, clues, and examples should be based on credible academic or professional sources.

## Prototype Scope

The first prototype should prioritize the main gameplay flow instead of implementing the complete production system.

### 1. Home Page

Provide a simple landing page containing:

- EthiCross title/logo
- Short description of the game
- `Start Game` button
- Optional `How to Play` section

### 2. Crossword Game

The player should be able to:

1. Start a crossword puzzle.
2. View the crossword grid.
3. Select a crossword cell.
4. View the corresponding clue.
5. Enter an answer.
6. Submit/check the answer.
7. Receive immediate feedback.
8. Continue solving the puzzle.

### 3. Clues and Hints

Each clue should provide a definition, situation, or explanation related to software ethics.

Example:

> Clue: The principle of protecting a person's personal information from unauthorized access or misuse.

Answer:

`PRIVACY`

A hint may be provided without directly revealing the answer.

### 4. Answer Validation

The prototype should validate submitted answers.

- Correct answer → mark the word/cells as correct.
- Incorrect answer → show feedback and allow another attempt.
- Answers should be case-insensitive.
- Do not reveal the complete answer when an answer is incorrect.

### 5. Learning Explanation

When a player correctly completes a term, display:

- Term
- Definition
- Ethical significance
- Real-world software engineering example

Example:

**Privacy**

**Definition:** Protecting personal information from unauthorized collection, access, use, or disclosure.

**Why it matters:** Software systems often process sensitive user information, so developers have a responsibility to protect users' data.

**Example:** A mobile application should not collect a user's location data without a valid reason and appropriate user consent.

### 6. Progress / Performance

After completing the puzzle, display:

- Final score
- Completion time
- Number of correct answers
- Number of attempts/retries
- Ethics terms learned
- Short review of the concepts

## Prototype UI Structure

```text
EthiCross
│
├── Home
│   ├── Project introduction
│   └── Start Game
│
├── Game
│   ├── Crossword Grid
│   ├── Across Clues
│   ├── Down Clues
│   ├── Hint
│   ├── Check Answer
│   └── Score / Timer
│
├── Explanation
│   ├── Ethics Term
│   ├── Definition
│   ├── Ethical Significance
│   └── Real-world Example
│
└── Result
    ├── Final Score
    ├── Completion Time
    ├── Terms Learned
    └── Review
```

## Recommended Prototype Architecture

```text
Frontend
React.js
   │
   ├── Home Page
   ├── Crossword Board
   ├── Clue Panel
   ├── Hint System
   ├── Explanation Panel
   └── Result Page
          │
          ▼
Backend
Node.js + Express.js
   │
   ├── Puzzle API
   ├── Answer Validation
   ├── Score Management
   └── Progress Management
          │
          ▼
Database
MySQL
   │
   ├── Users
   ├── Puzzles
   ├── Ethics Terms
   ├── Clues
   ├── Scores
   └── Learning Progress
```

For the **first prototype**, the crossword data may be stored locally as JSON instead of connecting to MySQL immediately. The database can be added after the main gameplay flow works.

## Suggested Project Structure

```text
ethicross/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CrosswordBoard.jsx
│   │   │   ├── CluePanel.jsx
│   │   │   ├── HintButton.jsx
│   │   │   ├── ExplanationCard.jsx
│   │   │   └── ProgressBar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Game.jsx
│   │   │   └── Result.jsx
│   │   │
│   │   ├── data/
│   │   │   └── puzzle.json
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── server.js
│
└── README.md
```

## First Prototype Requirements

The prototype is considered successful when a user can complete the following flow:

```text
Open EthiCross
      ↓
Click "Start Game"
      ↓
See Crossword Puzzle
      ↓
Select a Clue
      ↓
Enter Answer
      ↓
Submit Answer
      ↓
Correct?
 ┌────┴────┐
Yes        No
 ↓          ↓
Show       Show
Explanation Feedback
 ↓          ↓
Continue   Retry
      ↓
Complete Puzzle
      ↓
Show Score + Time + Terms Learned
```

## Initial Puzzle Data

The prototype can begin with approximately **7–10 ethics terms**.

Example data format:

```json
{
  "term": "PRIVACY",
  "clue": "The protection of personal information from unauthorized access or misuse.",
  "hint": "Think about protecting user data.",
  "definition": "Protecting personal information from unauthorized collection, access, use, or disclosure.",
  "importance": "Software systems often process sensitive user information, so developers should protect users' data.",
  "example": "An application should not collect a user's location without a valid reason and appropriate consent."
}
```

Recommended initial terms:

```text
PRIVACY
SECURITY
FAIRNESS
ACCOUNTABILITY
TRANSPARENCY
COPYRIGHT
ACCESSIBILITY
```

## Scoring Concept

A simple scoring system is sufficient for the first prototype.

Example:

```text
Correct answer       +100 points
Using a hint          -25 points
Incorrect attempt      0 points
Complete puzzle      +500 bonus
```

The exact scoring rules can be adjusted during testing.

## Design Principles

The interface should follow the ethical considerations defined in the project proposal.

### Educational Accuracy

Definitions and examples should come from credible academic or professional sources.

### Privacy

The prototype should collect only the minimum information necessary. Avoid collecting sensitive personal information.

### Accessibility

Use:

- Clear typography
- Readable text
- Good color contrast
- Clear buttons
- Simple navigation
- Keyboard-friendly interactions where possible

Do not use color alone to communicate whether an answer is correct or incorrect.

### Fairness

All players should receive:

- The same puzzle content
- The same scoring rules
- The same answer-validation criteria
- The same learning explanations

## Technology Stack

### Frontend

- React.js
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Development Tools

- Git
- GitHub
- Visual Studio Code

## Prototype Development Priority

### Phase 1 — Core UI

- [ ] Create Home page
- [ ] Create Crossword page
- [ ] Create clue panel
- [ ] Create answer input
- [ ] Create Result page
- [ ] Apply responsive styling

### Phase 2 — Core Gameplay

- [ ] Create crossword grid
- [ ] Add crossword terms
- [ ] Add clues
- [ ] Implement answer validation
- [ ] Implement incorrect-answer feedback
- [ ] Implement hints
- [ ] Add timer
- [ ] Add score

### Phase 3 — Learning

- [ ] Add term definitions
- [ ] Add ethical significance
- [ ] Add real-world examples
- [ ] Display explanation after correct answers

### Phase 4 — Results

- [ ] Calculate final score
- [ ] Display completion time
- [ ] Display terms learned
- [ ] Add learning review

### Phase 5 — Backend / Database

- [ ] Create Express API
- [ ] Create MySQL schema
- [ ] Store puzzle data
- [ ] Store scores
- [ ] Store learning progress

For the first prototype, **Phases 1–4 are the main priority**. Backend and database integration can follow once the core gameplay is stable.

## Out of Scope for the First Prototype

The following features are not required for the first prototype:

- Complex user account management
- Multiplayer gameplay
- Leaderboards
- Advanced crossword generation
- Large question banks
- Teacher/admin dashboard
- Detailed analytics
- Cloud deployment

These can be considered in later development stages.

## Team Responsibilities

| Member | Responsibility |
|---|---|
| Wanikkasit Nopthiraitthikun | UI/UX Designer & Frontend Developer |
| Chonchanun Khachonphurithanakul | System Tester & Quality Assurance |
| Thanachai Naksomboon | Backend Developer & Database Administrator |
| Panuwat Songkram | Frontend Developer & Game Logic |
| Ratthasas Singhamanee | Project Manager & Documentation |

## Development Goal

The first prototype should demonstrate that EthiCross can turn software ethics terminology into an interactive learning activity.

The most important part is not the number of features. The prototype should clearly demonstrate:

> **Learn → Play → Receive Feedback → Understand → Review**

This prototype will later be improved through student testing and feedback, with performance data such as score, completion time, and retries used as supporting evidence of the learning experience.

## Course Information

**Project:** EthiCross  
**Course:** Ethics and Professionalism for Software Engineers (953420)  
**Program:** Bachelor of Science Software Engineering  
**Institution:** College of Arts, Media, and Technology, Chiang Mai University

### Instructors

- Asst. Prof. Dr. Pradorn Sureephong
- Asst. Prof. Dr. Suepphong Chernbumroong
