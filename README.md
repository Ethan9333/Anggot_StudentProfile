# Mobile UI/UX Student Profile

An upgraded, responsive, accessible Student Profile built using HTML and CSS, bundled for Android via Apache Cordova.

## 1. Project Description
This application serves as a digital student profile. It highlights my personal background information, interests, education, goals, and technical skill sets.

## 2. Application Structure
Header: houses the user profile avatar, complete name, subtitle, and primary navigation bar.<br>
Navigation Menu: accessible links allowing intra-page navigation between sections.<br>
About Section: contains background information, personal interests, education details, and future aspirations.<br>
Skills Section: itemizes core technical skills alongside clear descriptive details.<br>
Footer: displays my copyright notice and year.

## 3. Responsive Design
The application utilizes a mobile-first fluid layout implemented with standard CSS media queries.<br>
Mobile: Single-column stacked layout avoiding horizontal scroll.<br>
Tablet: Flexible inline header alignment and enhanced padding for medium screens.<br>
Desktop: Two-column grid layout utilizing screen real estate efficiently while keeping line lengths comfortable to read.

## 4. UI/UX Principles Applied
Responsive Layout: Fluid width styling combined with CSS Grid/Flexbox to prevent overflow and text truncation.<br>
Mobile-Friendly Spacing: Standardized outer padding and margins ensure distinct boundaries between text blocks and cards.<br>
Appropriate Typography: Uses scalable font sizes, high line-height, and modern system font stacks for optimal readability.<br>
Clear Visual Hierarchy: Distinct font weights and colors separate section titles, subtitles, bold labels, and body copy.<br>
Usable Controls: Touch-friendly navigation targets designed with minimum click targets and clear hover/focus indicators.<br>
Basic Accessibility: Contrast-compliant background colors, semantic HTML structural tags, dynamic image alt text, and clear focus styling.<br>
Consistent Design: Utilizes CSS custom variables for color scheme, font stacks, border radiuses, and spacing patterns.

## 5. Navigation
The intra-page navigation uses native HTML anchor links. It requires zero JavaScript and relies on standard HTML document fragment identifier scrolling with CSS.

## 6. How to Run

# Clean previous builds
cordova clean android

# Build the Android APK
cordova build android

# Run android
cordova run android


## 7. Application Screenshots

### Desktop Layout
![Desktop View](screenshots/desktop.png)

### Tablet Layout
![Tablet View](screenshots/tablet.png)

### Mobile Layout
![Mobile View](screenshots/mobile.png)