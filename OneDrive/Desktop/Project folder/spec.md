# CivicEye – AI-Powered Civic Intelligence & Grievance Management Platform

## 1. Project Overview & Tech Stack

### Project Overview

Build a full-stack AI-powered civic intelligence platform called **CivicEye** that enables citizens to report civic infrastructure problems such as potholes, damaged roads, garbage accumulation, water leakage and pollution.

The platform uses Generative AI and image analysis to automatically identify reported problems, classify their categories, estimate their severity and generate structured complaint summaries.

Citizens can submit complaints using photographs, descriptions and geographical locations. The system displays submitted complaints on an interactive city map and provides an administrative dashboard to monitor, prioritise and update complaint statuses.

The platform aims to transform unstructured citizen complaints into actionable civic intelligence through AI-powered analysis, geospatial visualisation and transparent complaint tracking.

### Tech Stack

- **Frontend:** React.js, Vite, JavaScript, CSS, Axios and Lucide React icons.
- **Backend:** Node.js, Express.js, REST APIs and Multer for image uploads.
- **Database:** MongoDB Atlas with Mongoose.
- **AI Integration:** Google Gemini API for image understanding, complaint classification, severity estimation and summarisation.
- **Maps:** Leaflet.js with OpenStreetMap.
- **Charts:** Recharts for complaint analytics.
- **Deployment:** Vercel (frontend) and Render (backend).
- **Version Control:** Git and GitHub.

The application must be responsive and work on desktop, tablet and mobile devices.

---

## 2. Core Features & AI Intelligence

### 2.1 Citizen Complaint Reporting

Create a citizen-facing complaint submission system.

Features:

- Enter citizen name.
- Select civic problem category.
- Upload a photograph of the issue.
- Enter problem description.
- Select the geographical location using an interactive map.
- Submit a complaint.
- Generate a unique complaint ID.
- Display successful submission confirmation.

Supported categories:

1. Road Damage / Potholes
2. Garbage Accumulation
3. Water Leakage
4. Air Pollution
5. Drainage Problems
6. Streetlight Issues
7. Other Civic Issues

### 2.2 AI-Powered Image Analysis

Integrate Google Gemini API to analyse uploaded photographs.

The AI should:

1. Analyse the uploaded image.
2. Identify the visible civic problem.
3. Predict the problem category.
4. Estimate the severity as LOW, MEDIUM or HIGH.
5. Generate a short problem description.
6. Suggest an appropriate corrective action.
7. Return structured JSON output.

Example AI response:

```json
{
  "category": "Road Damage",
  "severity": "HIGH",
  "confidence": 0.92,
  "description": "A large pothole is visible on the road.",
  "recommendedAction": "Inspect the damaged section and arrange road repairs."
}
```

The AI-generated severity and confidence are suggestions, not verified engineering assessments. Allow administrators to review and override them.

If AI analysis fails, allow manual complaint submission with a clear indication that AI analysis is unavailable.

### 2.3 Smart Complaint Prioritisation

Automatically prioritise complaints using:

- AI-estimated severity.
- Civic problem category.
- Report frequency in the same area.
- Administrator review.

Priority levels:

- HIGH – Potentially dangerous infrastructure problems.
- MEDIUM – Problems requiring timely attention.
- LOW – General maintenance issues.

Display severity using clear colour-coded labels.

### 2.4 Interactive Civic Intelligence Map

Integrate Leaflet.js and OpenStreetMap.

Features:

- Display complaints as geographical markers.
- Use different marker colours for different severity levels.
- Show complaint details when a marker is clicked.
- Filter reports by category.
- Filter reports by severity.
- Display complaint locations on the map.
- Allow citizens to select a location while submitting a complaint.

Use actual coordinates selected by the user. Do not generate fake geographical coordinates.

### 2.5 Admin Dashboard

Create an administrative dashboard to monitor civic complaints.

Dashboard components:

- Total Complaints.
- Pending Complaints.
- In Progress Complaints.
- Resolved Complaints.
- High-Severity Complaints.
- Complaint Category Distribution.
- Severity Distribution.
- Recent Complaints.
- Interactive Complaint Map.

Administrators should be able to:

- View all complaints.
- Search complaints using complaint ID.
- Filter by category and severity.
- Review AI analysis.
- Update complaint status.
- Add administrative remarks.
- Mark complaints as resolved.

For the hackathon MVP, use a clearly labelled demonstration admin view without claiming actual government integration.

### 2.6 Complaint Tracking

Every submitted complaint should receive a unique tracking ID.

Complaint statuses:

- SUBMITTED
- UNDER_REVIEW
- IN_PROGRESS
- RESOLVED
- REJECTED

Citizens should be able to search using their complaint ID and view the latest status.

Maintain a timestamped history whenever the status changes.

### 2.7 Civic Accountability & Analytics

Create a dashboard that displays:

- Number of complaints received.
- Number of resolved complaints.
- Resolution percentage.
- High-priority unresolved complaints.
- Category-wise complaint statistics.
- Area-wise complaint distribution.
- Average resolution time, calculated only from actual timestamps.

Do not represent unverified administrative responses as completed government actions.

---

## 3. Frontend Pages

The application should contain the following pages:

### `/` – Landing Page

- CivicEye introduction.
- Hero section.
- Project mission.
- How it works.
- Key features.
- Report a Problem CTA.
- View Civic Dashboard CTA.

### `/report` – Citizen Complaint Submission

- Citizen details.
- Category selection.
- Image upload.
- Image preview.
- Problem description.
- Interactive map location selection.
- AI analysis preview.
- Submit complaint button.
- Submission confirmation and complaint ID.

### `/track` – Complaint Tracking

- Complaint ID search.
- Complaint information.
- AI-generated classification.
- Severity information.
- Current complaint status.
- Status history.

### `/dashboard` – Admin Dashboard

- Complaint metrics.
- Analytics charts.
- Recent complaints.
- Severity filters.
- Category filters.
- Interactive map.
- Complaint management.

### `/complaints/:id` – Complaint Details

- Complaint information.
- Uploaded image, when available.
- Location.
- AI analysis.
- Severity.
- Status history.
- Administrative remarks.
- Status update controls in admin mode.

---

## 4. Backend Architecture & Database Collections

### Backend Architecture

Organise the backend into the following layers:

- **Routes:** Handles API endpoints.
- **Controllers:** Processes requests and responses.
- **Services:** Contains complaint management and AI business logic.
- **AI Service:** Handles Gemini API integration and response validation.
- **Models:** Defines MongoDB schemas.
- **Middleware:** Handles request validation, errors and security.

Keep the architecture simple and maintainable.

### Database Collections

#### 1. Complaints

Stores citizen complaints.

Fields:

- complaintId
- citizenName
- category
- description
- locationName
- latitude
- longitude
- imageUrl (optional)
- aiCategory
- aiSeverity
- aiConfidence
- aiDescription
- recommendedAction
- priority
- status
- adminRemarks
- createdAt
- updatedAt

#### 2. StatusHistory

Stores complaint status changes.

Fields:

- complaintId
- previousStatus
- newStatus
- remarks
- changedAt

#### 3. AdminActions

Stores administrative actions performed in the demonstration environment.

Fields:

- complaintId
- action
- remarks
- createdAt

---

## 5. API Endpoints

### Health

- GET `/api/health` – Check backend availability.

### Complaints

- POST `/api/complaints` – Submit a new complaint.
- GET `/api/complaints` – Retrieve all complaints.
- GET `/api/complaints/:id` – Retrieve complaint details.
- GET `/api/complaints/track/:complaintId` – Track complaint using its ID.
- PATCH `/api/complaints/:id/status` – Update complaint status.
- GET `/api/complaints/stats` – Retrieve dashboard statistics.

### AI Analysis

- POST `/api/ai/analyze` – Analyse an uploaded civic issue photograph.
- POST `/api/ai/classify` – Classify a complaint description when no image is available.

### Map

- GET `/api/map/complaints` – Retrieve complaints with valid geographical coordinates.

All endpoints should validate incoming data and return consistent JSON responses.

---

## 6. Folder Structure

### Frontend Structure

```text
client/
└── src/
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ComplaintForm.jsx
    │   ├── ImageUpload.jsx
    │   ├── AIAnalysisCard.jsx
    │   ├── ComplaintCard.jsx
    │   ├── SeverityBadge.jsx
    │   ├── MapView.jsx
    │   └── DashboardStats.jsx
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Report.jsx
    │   ├── Track.jsx
    │   ├── Dashboard.jsx
    │   └── ComplaintDetails.jsx
    │
    ├── services/
    │   └── api.js
    │
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

### Backend Structure

```text
server/
└── src/
    ├── config/
    │   └── db.js
    │
    ├── routes/
    │   ├── complaintRoutes.js
    │   ├── aiRoutes.js
    │   └── dashboardRoutes.js
    │
    ├── controllers/
    │   ├── complaintController.js
    │   ├── aiController.js
    │   └── dashboardController.js
    │
    ├── services/
    │   ├── complaintService.js
    │   ├── aiService.js
    │   └── dashboardService.js
    │
    ├── models/
    │   ├── Complaint.js
    │   ├── StatusHistory.js
    │   └── AdminAction.js
    │
    ├── middleware/
    │   ├── errorHandler.js
    │   └── upload.js
    │
    └── server.js
```

---

## 7. Development Phases

### Phase 1 – Project Setup & Frontend

- Create React application using Vite.
- Configure routing.
- Design responsive landing page.
- Build citizen complaint form.
- Implement image upload and preview.
- Create admin dashboard layout.
- Add complaint cards and severity badges.

### Phase 2 – Backend & Database

- Create Node.js and Express server.
- Connect MongoDB Atlas.
- Create complaint model.
- Implement complaint submission API.
- Implement complaint listing API.
- Implement complaint tracking API.
- Implement complaint status updates.

### Phase 3 – AI Integration

- Integrate Google Gemini API.
- Implement image analysis.
- Identify civic issue categories.
- Generate severity estimates.
- Generate recommended actions.
- Validate AI-generated JSON.
- Implement fallback behaviour when AI is unavailable.

### Phase 4 – Interactive Map & Analytics

- Integrate Leaflet and OpenStreetMap.
- Display complaint markers.
- Implement location selection.
- Add category and severity filters.
- Create dashboard statistics.
- Implement complaint tracking history.

### Phase 5 – Testing & Deployment

- Test the complete complaint submission process.
- Test image analysis.
- Test complaint tracking.
- Test dashboard status updates.
- Fix frontend and backend errors.
- Deploy the frontend and backend.
- Prepare sample complaints for the final demonstration.

---

## 8. UI & UX Requirements

Design a modern civic technology platform with a professional, clean and trustworthy appearance.

### Design Direction

- Primary colour: Navy Blue.
- Secondary colour: Sky Blue.
- Background: Light Grey or White.
- Accent colours: Green, Orange and Red for status and severity.
- Use modern cards, subtle shadows and rounded corners.
- Use Lucide icons.
- Responsive layouts.
- Clear typography and readable text.

### User Experience

- Simple complaint reporting process.
- Clear image upload instructions.
- AI analysis loading indicator.
- Success and error notifications.
- Easy complaint tracking.
- Interactive map.
- Fast dashboard navigation.
- Accessible forms and buttons.

---

## 9. Security & Reliability Requirements

- Store API keys in environment variables.
- Never expose the Gemini API key in frontend code.
- Validate uploaded image file types.
- Restrict image file sizes.
- Validate all incoming API requests.
- Use Helmet for HTTP security headers.
- Apply CORS restrictions.
- Add basic API rate limiting.
- Handle AI API failures gracefully.
- Avoid storing unnecessary personal information.
- Never claim AI predictions are verified facts.

---

## 10. Final Expected Outcome

The completed CivicEye MVP should allow citizens to report civic infrastructure problems using photographs, descriptions and geographical locations.

The platform should use AI to identify civic issues, estimate their severity, classify complaints and suggest corrective actions.

The application should display complaints on an interactive map and provide an administrative dashboard to manage complaint statuses and monitor civic issue statistics.

The final demonstration should showcase a complete working journey:

1. Citizen opens CivicEye.
2. Citizen uploads a photograph of a pothole.
3. AI analyses the photograph.
4. AI identifies the issue as road damage.
5. AI estimates the severity.
6. Citizen submits the complaint.
7. The system generates a complaint ID.
8. The complaint appears on the dashboard and map.
9. Administrator updates the complaint status.
10. Citizen checks the complaint tracking page.

**Final product vision:** A practical AI-powered civic intelligence platform that helps turn citizen-reported problems into structured, prioritised and trackable civic actions.

---

## 11. AI Coding Agent Instructions

Build CivicEye phase by phase. Do not attempt to generate the entire application in one response.

Follow these instructions strictly:

1. Start with project setup and frontend development.
2. Build one feature at a time.
3. Follow the specified folder structure.
4. Use React functional components and hooks.
5. Keep frontend components reusable.
6. Keep backend controllers thin and business logic inside services.
7. Use MongoDB for persistent complaint storage.
8. Integrate Gemini through the backend only.
9. Validate and safely parse AI-generated JSON.
10. Use Leaflet for geographical visualisation.
11. Make all frontend forms connect to actual backend endpoints.
12. Do not use fake AI responses while claiming actual AI integration.
13. Do not invent complaint locations or resolution statistics.
14. Include loading, success and error states.
15. Ensure the application runs without compilation errors.
16. Provide installation commands and environment variable instructions.
17. Explain where every generated file belongs.
18. Test each phase before moving to the next.
19. Avoid unnecessary authentication, OAuth integrations, microservices and complex agent frameworks.
20. Prioritise a working end-to-end MVP within the three-day hackathon deadline.

### Important Development Workflow

After completing every phase, provide:

- Files created or modified.
- Commands to run.
- Features implemented.
- Testing instructions.
- Any configuration required.
- Known errors or limitations.
- The next development phase.

Do not proceed to the next phase until the current phase runs successfully.

**Primary objective: Deliver a functional, visually impressive and demonstrable CivicEye MVP within three days.**