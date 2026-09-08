# Task: Design the Complete SatQuery AI Website UI

Design the complete frontend UI/UX for **SatQuery AI**, including both:

1. A professional **Landing Page**
2. The actual **AI Analysis Dashboard/Application**

This is a serious SIH 2026 project based on the ISRO problem statement:

**"SatQuery AI - An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis through Text Queries."**

The website should look like a professional AI + satellite/remote-sensing platform, not a generic chatbot.

---

# PART 1 — LANDING PAGE

The landing page is the public-facing entry point.

Its purpose is to quickly explain:

* What SatQuery AI is
* What problem it solves
* How it works
* What types of satellite imagery it supports
* What makes it different
* What users can do with it
* How to launch the application

---

## 1. Navbar

Create a clean professional navbar.

Left:

**🛰 SatQuery AI**

Navigation:

* Home
* Features
* How It Works
* Capabilities
* About

Right:

**Launch SatQuery AI**

The navbar should remain clean and minimal.

---

# 2. Hero Section

Create a strong hero section.

Main heading:

> **Ask Questions. Understand Satellite Imagery.**

Supporting text:

> SatQuery AI is an agentic Vision-Language Assistant that understands natural-language queries and analyzes remote-sensing imagery using specialized AI models.

Primary CTA:

**Launch SatQuery AI**

Secondary CTA:

**Explore Capabilities**

---

## Hero Visual

Do NOT use a generic AI robot.

Create a sophisticated visual showing:

* Satellite imagery
* Image layers
* AI analysis
* Geographic regions
* Bounding boxes
* Change detection
* Optical + SAR imagery

The visual should communicate:

```text
Satellite Images
       +
Natural Language Query
       ↓
    AI Agent
       ↓
Specialized Models
       ↓
Evidence-Grounded Result
```

---

# 3. Problem Section

Section heading:

> **Understanding Earth Observation Data Shouldn't Require a GIS Expert.**

Explain the problem simply.

Existing remote-sensing AI systems often focus on individual tasks such as:

* Classification
* Object detection
* VQA
* Captioning
* Change detection

Users often need technical knowledge to choose the correct model and configure the analysis.

SatQuery AI simplifies this through natural-language interaction and agentic model selection.

Use a visual comparison:

```text
Traditional Approach

User
 ↓
Understand dataset
 ↓
Choose model
 ↓
Configure parameters
 ↓
Run analysis
 ↓
Interpret output


SatQuery AI

User
 ↓
Ask a question
 ↓
AI Agent
 ↓
Select appropriate tool
 ↓
Analyze
 ↓
Answer + Evidence
```

---

# 4. Core Features Section

Heading:

> **One Interface. Multiple Remote-Sensing Capabilities.**

Create feature cards for:

### Visual Question Answering

Ask natural-language questions about a satellite image.

Example:

> "What type of land cover is visible?"

---

### Scene Description

Generate meaningful descriptions of remote-sensing scenes.

---

### Visual Grounding

Ask where an object or region is located.

Example:

> "Highlight the water body."

Show a bounding box/highlighted region.

---

### Change Analysis

Compare images from different dates.

Example:

> "What changed between 2022 and 2025?"

Show:

Before → After → Change Map

---

### Optical + SAR Analysis

Combine complementary information from optical and SAR imagery.

Example:

> "Identify built-up and water-covered regions using both images."

---

### Agentic AI Orchestration

The system automatically determines which specialist model/tool should process the request.

This is one of the most important features.

---

# 5. How It Works

Heading:

> **From Question to Insight**

Create a visual 5-step workflow.

```text
01
Upload
Satellite Image(s)

↓

02
Ask
Natural Language Query

↓

03
Understand
AI Agent identifies the task

↓

04
Analyze
Specialized remote-sensing model

↓

05
Explain
Answer + Visual Evidence
```

Add subtle animations between steps.

---

# 6. Supported Image Analysis

Create a visually strong section showing the three major input modes.

### Single Image

```text
Satellite Image
      ↓
VQA / Captioning / Grounding
```

### Bi-Temporal Images

```text
Image A          Image B
2022             2025
   \              /
      ↓
Change Analysis
```

### Optical + SAR

```text
OPTICAL          SAR
   \              /
       ↓
Cross-Modal Analysis
```

Use actual-looking satellite imagery rather than generic stock images.

---

# 7. Agentic Architecture Section

This should be a major section because agentic orchestration is the project's key novelty.

Heading:

> **One Agent. Multiple Specialist Models.**

Show:

```text
                 User Query
                     ↓
              AI Agent / Controller
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
       VQA       Grounding      Change
        │            │            │
        └────────────┼────────────┘
                     ↓
              Result Integrator
                     ↓
          Answer + Visual Evidence
```

Explain:

> Instead of relying on one generic model for every task, SatQuery AI selects the appropriate remote-sensing specialist model based on the user's query and available imagery.

---

# 8. Results Preview

Create a realistic mock analysis interface.

Show:

```text
User Query:

"Has the built-up area increased?"

        ↓

Before Image | After Image | Change Map

        ↓

Analysis Result

Built-up area increased in the selected region.

Confidence
91%

Selected Task
Change-based VQA

Models Used
Change Detection Model
Remote-Sensing VQA Model
```

This section should visually demonstrate what the actual application does.

---

# 9. Evidence-Grounded AI

Heading:

> **Don't Just Get an Answer. See the Evidence.**

Explain that results can include:

* Highlighted regions
* Bounding boxes
* Change maps
* Before/after comparisons
* Confidence information
* Execution summary

Use a satellite-image visual with highlighted regions.

---

# 10. Use Cases

Create cards for:

* Agriculture
* Disaster Management
* Urban Planning
* Forest Monitoring
* Water Resources
* Infrastructure Mapping
* Environmental Monitoring

Keep the section concise and professional.

---

# 11. Technology / Research Section

Show the project's major technical components:

```text
Remote-Sensing VLM
        +
Specialist AI Models
        +
Agentic Orchestration
        +
Multimodal Satellite Imagery
        +
Evidence-Grounded Results
```

Do not overpopulate the landing page with programming-language logos.

Focus on the actual research/technical capabilities.

---

# 12. Final CTA

Create a strong final section.

Heading:

> **Explore Satellite Imagery Through Natural Language.**

Text:

> Upload remote-sensing imagery, ask your question, and let SatQuery AI determine how to analyze it.

Button:

**Launch SatQuery AI →**

---

# PART 2 — APPLICATION / ANALYSIS DASHBOARD

After clicking **Launch SatQuery AI**, navigate to the main application.

This should be a separate dashboard experience.

---

# 13. Dashboard Layout

Use:

```text
┌──────────────┬────────────────────────────────────┐
│              │                                    │
│   SIDEBAR    │          MAIN WORKSPACE            │
│              │                                    │
│ New Analysis │                                    │
│ History      │                                    │
│ Reports      │                                    │
│ Models       │                                    │
│ Settings     │                                    │
│              │                                    │
└──────────────┴────────────────────────────────────┘
```

---

# 14. Sidebar

Include:

**SatQuery AI**

* New Analysis
* Analysis History
* Saved Reports
* Models & Tools
* Settings

Bottom:

```text
● AI System Ready
```

---

# 15. Analysis Workspace

Top heading:

> **New Analysis**

Subtitle:

> Upload remote-sensing imagery and ask a question.

---

# 16. Image Upload

Create a large drag-and-drop area.

Support:

* GeoTIFF
* TIFF
* PNG/JPEG for supported benchmark datasets

Show:

* Filename
* Format
* Dimensions
* Modality
* Acquisition date
* Validation status

---

# 17. Dynamic Image Configuration

The UI should adapt to uploaded images.

### Single Image

Show one image.

### Bi-Temporal

Show:

```text
Image A                    Image B

Date 1                     Date 2
```

### Optical + SAR

Show:

```text
Optical                    SAR
```

The user should not need to manually select complicated technical settings.

---

# 18. Natural Language Query

Create a large query box.

Placeholder:

> "Ask a question about your satellite imagery..."

Suggested queries:

* Describe the land-cover in this image.
* Highlight the water body.
* What changed between these two dates?
* Has the built-up area increased?
* Identify built-up and water-covered regions using optical and SAR imagery.

Button:

**✦ Analyze with SatQuery AI**

---

# 19. Agent Processing UI

Do not show a generic loading spinner only.

Show the actual agentic workflow:

```text
Analyzing request...

✓ Input validated
✓ Query understood
✓ Task identified
✓ Specialist model selected
● Running analysis...
○ Generating visual evidence
○ Preparing response
```

This makes the agentic nature visible to the user.

---

# 20. Results Interface

Display:

### Final Answer

Large readable answer.

### Confidence

Example:

**91% — High confidence**

### Visual Evidence

Show the appropriate visualization.

---

# 21. Evidence Viewer

For different tasks:

### VQA

Image + answer

### Grounding

Image + highlighted region

### Change Analysis

Before + After + Change Map

### Optical + SAR

Optical + SAR + Combined result

Include:

* Zoom
* Pan
* Layer visibility
* Image comparison

---

# 22. Execution Summary

Create an expandable panel:

> **How SatQuery AI analyzed this**

Show:

```text
Task
Change-based VQA

Input
2 Bi-temporal Images

Selected Tools
Change Detection
Remote-Sensing VQA

Pipeline
Validation
→ Change Detection
→ Change Interpretation
→ Answer Generation

Status
Completed
```

---

# 23. Model & Tools Page

Create cards for:

* Remote-Sensing VQA
* Image Captioning
* Visual Grounding
* Change Analysis
* Change VQA
* Optical + SAR Analysis

Each card should show:

* Description
* Status
* Model/tool name
* Supported input

---

# 24. History Page

Show previous analyses:

```text
Query
Task
Date
Confidence
View Result
Download Report
```

---

# 25. Reports Page

Allow users to generate/download reports containing:

* Query
* Input images
* Analysis type
* Answer
* Visual evidence
* Confidence
* Models/tools used
* Execution summary

---

# 26. Error States

Design proper states for:

* Invalid file
* Unsupported format
* Wrong number of images
* Incompatible image pair
* Missing metadata
* Model unavailable
* Analysis failure

Never leave the user with only a generic "Something went wrong."

---

# 27. Visual Design System

The overall visual language should feel:

**Scientific + Geospatial + AI + Professional**

Use:

* Clean typography
* Strong information hierarchy
* Dark/light professional interface
* Subtle satellite/geospatial visual elements
* Minimal but meaningful animations
* High-quality satellite imagery
* Clear cards and panels
* Professional data visualization

Avoid:

* Generic AI robot graphics
* Cartoon illustrations
* Excessive gradients
* Excessive glassmorphism
* Neon cyberpunk styling
* Generic ChatGPT clone appearance
* Excessive animations

---

# 28. Responsive Design

Support:

* Desktop
* Laptop
* Tablet

Prioritize desktop because satellite imagery requires large visualization areas.

---

# 29. Technical Requirement

Use the existing frontend technology of the project.

If the project uses React, continue using React.

Create reusable components.

Suggested structure:

```text
frontend/
│
├── components/
│   ├── Navbar/
│   ├── Sidebar/
│   ├── Hero/
│   ├── FeatureCard/
│   ├── Workflow/
│   ├── ImageUploader/
│   ├── ImagePreview/
│   ├── QueryBox/
│   ├── AgentStatus/
│   ├── ResultCard/
│   ├── EvidenceViewer/
│   ├── ConfidenceCard/
│   └── ExecutionSummary/
│
├── pages/
│   ├── Landing/
│   ├── Dashboard/
│   ├── Analysis/
│   ├── History/
│   ├── Models/
│   ├── Reports/
│   └── Settings/
│
└── ...
```

---

# 30. Important Constraint

This task is primarily **UI/UX implementation**.

Do NOT implement real:

* VQA inference
* Change detection inference
* SAR processing
* Model fine-tuning
* Dataset downloading
* Agent intelligence
* AI backend

Use realistic mock data and mock API responses where necessary.

However, structure the frontend so that real backend APIs can easily replace the mock data later.

---

# 31. Final User Journey

The complete website should provide this journey:

```text
LANDING PAGE
     ↓
Learn about SatQuery AI
     ↓
Launch SatQuery AI
     ↓
DASHBOARD
     ↓
Upload Image(s)
     ↓
Ask Natural-Language Question
     ↓
AI Agent Processing
     ↓
Specialist Model
     ↓
Result
     ↓
Visual Evidence
     ↓
Confidence
     ↓
Execution Summary
     ↓
Generate Report
```

The final result should look like a **real, polished, research-grade remote-sensing AI product suitable for an SIH 2026 demonstration**.

Build the UI in a modular way so the AI/backend functionality can be integrated later without redesigning the interface.