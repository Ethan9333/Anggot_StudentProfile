# Activity 4: Multi-Page Student Profile Application

## 1. Project Description
This application is a responsive, multi-page Student Profile mobile app built using Apache Cordova, standard HTML5, and modern CSS3. It reorganizes a single-page student profile into dedicated, accessible sections that showcase personal details, technical skills, academic projects, and contact avenues.

## 2. Application Pages
The application is structured into five distinct pages:
- **Profile (index.html):** Serves as the primary entry point/homepage featuring a high-level overview, profile photo, and core introduction.
- **About (about.html):** Details educational background, personal background, interests, and professional aspirations.
- **Skills (skills.html):** Displays a structured breakdown of technical competencies across web development, programming, database administration, and developer tools.
- **Projects (projects.html):** Highlights featured academic and personal software projects, roles held, and underlying technologies used.
- **Contact (contact.html):** Provides functional contact endpoints (Email, GitHub, LinkedIn) and a structured messaging form layout.

## 3. Navigation Implementation
Navigation across pages is implemented using standard HTML anchor tags (`<a href="...">`). No JavaScript is used for dynamic routing or dynamic page loading, ensuring static accessibility and clean multi-page compilation within Apache Cordova. Active page state is styled via CSS (`class="active"`).

## 4. Responsive Design
The app adheres to fluid, mobile-first design principles using CSS Flexbox and CSS Grid:
- **Mobile Viewports (<600px):** Navigation stacks vertically, and skill/project cards render in a single column to prevent horizontal scrolling or overflowing elements.
- **Tablet Viewports (600px - 899px):** Navigation aligns horizontally alongside the brand title, and content cards arrange into 2-column grids.
- **Desktop Viewports (≥900px):** Content expands into a centered 3-column layout maintaining maximum readability standards.

## 5. UI/UX Principles Applied (Module 4)
- **Consistency:** Standardized palette (`#1e3a8a`, `#2563eb`), uniform margins, typography specs, and navigation across all 5 pages.
- **Visual Hierarchy:** Distinct heading styling (`h1`, `h2`), bold element identifiers, and card elevation shadows highlight priority information.
- **Usability & Readability:** High-contrast text against dark/light backgrounds ensures legibility. Navigational indicators visually declare current screen positioning.

## 6. How to Build and Run (Cordova)
1. Ensure Node.js, Cordova CLI, and Android SDK are properly installed.
2. Open terminal in the project directory:
   ```bash
   cd <LastName>_StudentProfile