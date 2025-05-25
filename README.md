
---

## Live Url
https://videoprogresstracker.onrender.com

Note: It may take 1–2 minutes to load initially because it was uploaded on Render, which may be inactive when first accessed. Please wait patiently......

## Features & Objectives

- **Track Real Progress:**
  - Measure only unique viewing segments.
  - Prevent progress increments from re-watching or skipping.
- **Save and Resume:**
  - Persist watched intervals and progress percentages.
  - Resume playback from the last saved position.
- **User Interface:**
  - Play lecture videos with a progress bar showing unique watch progress.
  - Automatically resume videos from where the user left off.

---

## How It Works — Design & Approach

### 1. Tracking Watched Intervals

- As the user watches, track the start and end times of segments viewed.
- Use `requestAnimationFrame` to capture watched segments.
- On pause, seek, or video end, save the current segment.

### 2. Merging Intervals for Unique Progress

- Maintain an array of watched intervals: e.g., `[{start: 0, end: 20}, {start: 50, end: 60}]`.
- When adding a new interval, merge it with existing intervals to avoid overlaps.
- Calculate total unique seconds watched by summing merged intervals.

### 3. Calculating Progress Percentage

- Divide the total unique seconds watched by the video duration.
- Convert to percentage and update UI accordingly.

### 4. Data Persistence & Resume

- Save the merged intervals and current progress to the backend per user.
- On returning, fetch the saved intervals and resume video from the last watched position.
- The UI reflects the accurate unique watch progress.

---

## Technology Stack

- **Frontend:**
  - React (Hooks & Functional Components)
  - Redux Toolkit for state management
  - Axios for API requests
  - Tailwind CSS for styling

- **Backend:**
  - Node.js + Express (example)
  - MongoDB with Mongoose for data persistence

---


