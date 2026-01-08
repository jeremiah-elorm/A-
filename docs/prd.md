# A++ — Product Requirements Document (PRD)

**Product Name:** A++  
**Product Type:** Practice-First Exam Preparation Web App  
**Target Exams:** BECE, WASSCE  
**Version:** v1.0 (Practice Engine)  
**Owner:** Product & Engineering  
**Status:** Approved for Build
**Current Phase:** Phase 3 (Practice + tracking + simulation)

---

## 1. Product Vision

A++ is a **practice-first, zero-friction exam preparation platform** that allows BECE and WASSCE candidates to test themselves using real past questions **without creating an account**.

Users only sign up **after** seeing their results—when tracking progress becomes valuable.

> Core belief: **Practice creates clarity. Clarity drives commitment.**

---

## 2. Core Product Principles

1. **Anonymous First**  
   No login required before value is delivered.

2. **Exam Realism Over Content Volume**  
   Feels like the real exam, not a textbook.

3. **Conversion After Proof**  
   Signup only appears after score + breakdown.

4. **Phase Discipline**  
   Each phase solves one problem only.

---

## 3. Target Users

### Primary
- BECE candidates (JHS)
- WASSCE candidates (SHS & private)

### Secondary (Future Phases)
- Parents
- Teachers
- Schools

---

## 4. Success Metrics (North Star)

| Metric | Target |
|---|---|
Time to first test | < 30 seconds |
Test completion rate | > 70% |
Post-result signup rate | > 20% |
Repeat anonymous usage | Increasing |
Registered user improvement | Measurable |

---

## 5. Product Phases Overview

| Phase | Goal |
|---|---|
Phase 1 | Anonymous practice + scoring |
Phase 2 | Performance tracking |
Phase 3 | Full exam simulation |
Phase 4 | Learning + AI insights |
Phase 5 | Monetization & scale |

---

# PHASE 1 — CORE PRACTICE ENGINE (MVP)

**Objective:**  
Deliver a high-quality, anonymous exam practice experience with instant scoring and explanations.

---

## 6. User Flow (Phase 1)

1. Land on A++
2. Choose exam (BECE / WASSCE)
3. Configure test
4. Take test
5. See results + explanations
6. Optional signup to track performance

---

## 7. Functional Requirements (Phase 1)

### 7.1 Landing Page
- Exam selection (BECE / WASSCE)
- CTA: **“Start Practicing — No Login Required”**
- Minimal copy, fast load

---

### 7.2 Test Setup
**User selects:**
- Exam type
- Subject(s)
- Question type:
  - MCQ
  - Essay
  - Mixed
- Number of questions
- Timed or untimed

**System:**
- Validates availability
- Randomizes questions
- Creates anonymous session

---

### 7.3 Test Interface

#### MCQ
- One question per screen
- Next / Previous
- Flag question
- Progress indicator
- Timer (if enabled)
- Support diagrams/images with captions when provided

#### Essay
- Large text area
- Word count
- Local auto-save
- No auto-grading (v1)

---

### 7.4 Submission & Scoring

#### MCQ
- Automatic grading
- Score (%)
- Correct / incorrect indicators

#### Essay
- Display marking guide
- Show sample answer
- Self-assessment prompt

---

### 7.5 Results Page (Critical Conversion Surface)

**Displayed:**
- Overall score
- Pass / Borderline / Needs Work
- Topic-level breakdown
- Time spent
- Correct answers + explanations

**Conversion CTA:**
> “Track your progress and improve faster”

Options:
- Create free account
- Continue without tracking

---

### 7.6 Signup (Post-Value Only)
- Email + password
- Google sign-in (optional)
- Automatically attach last anonymous attempt

---

### 7.7 Admin Panel (Phase 1 – Minimal)
- Create / edit questions
- Tag by exam, subject, topic
- Bulk upload (CSV)
- Publish / unpublish
- Access restricted via `ADMIN_EMAILS` allowlist

---

## 8. Explicit Non-Goals (Phase 1)

❌ Lessons  
❌ AI grading  
❌ Gamification  
❌ Payments  
❌ Parent / teacher dashboards  

---

## 9. Phase 1 Deliverables

- Anonymous test engine
- Scoring & results engine
- Question admin panel
- Analytics hooks
- Pilot-ready deployment

---

# PHASE 2 — PERFORMANCE TRACKING

**Objective:**  
Help registered users understand progress and weaknesses.

---

## Features
- User dashboard
- Historical test records
- Weak topic detection
- Smart test recommendations
- Email reminders

**No AI yet. Rule-based only.**

---

# PHASE 3 — EXAM SIMULATION

**Objective:**  
Deliver full BECE/WASSCE realism.

---

## Features
- Full paper simulation
- Official timing
- Section navigation
- Enhanced essay guidance

---

# PHASE 4 — LEARNING & AI PERSONALIZATION

**Objective:**  
Turn data into guidance.

---

## Features
- Topic micro-lessons
- Spaced repetition
- AI-generated study plans
- Performance-based insights

---

# PHASE 5 — MONETIZATION & SCALE

## Monetization
- Free: limited practice
- Pro:
  - Unlimited tests
  - Advanced analytics
  - Essay feedback
  - Study plans

## Scale
- School dashboards
- Teacher tools
- Offline support
- Mobile apps

---

## 10. Technical Requirements

### Frontend
- Mobile-first responsive web app
- Fast initial load (<2s)

### Backend
- Question generation engine
- Scoring engine
- Analytics engine
- Anonymous session handling

### Database
- Questions
- Test attempts
- Responses
- Users (post-signup)

---

## 11. Key Risks & Mitigation

| Risk | Mitigation |
|---|---|
Low question quality | Admin review + tagging |
Essay ambiguity | Guides first, AI later |
Traffic spikes | CDN + caching |
Scope creep | Phase locking |

---

## 12. Product Discipline Notes

This PRD intentionally:
- Prioritizes **speed to value**
- Converts users **after trust**
- Keeps AI out until data exists
- Scales cleanly without re-architecture

---
