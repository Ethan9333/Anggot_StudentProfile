# Student Profile Cordova Application

A mobile-responsive Cordova web application built for managing a Student Profile dynamically using JavaScript and browser `localStorage`.

## Application Pages & Sections
- **Profile:** Displays the student's primary information, photo, and year level with an Edit Profile option.
- **About:** Displays a dynamic summary description of the student.
- **Skills:** Lists student skills rendered as interactive chips.
- **Projects:** Highlights completed course activities and mobile projects.
- **Contact:** Provides email and contact details.

## Profile Editing & JavaScript Functionality
The application includes an **Edit Profile** feature:
- Clicking **Edit Profile** reveals an input interface prepopulated with existing user data.
- **Validation:** Ensures mandatory fields (`Full Name`, `Course`, `Year Level`, `About Me`, `Skills`) are not left empty. An error message appears if validation fails.
- **Save Functionality:** Dynamically updates the DOM nodes without requiring a full page refresh.
- **Cancel Functionality:** Closes the editing interface and discards any uncommitted field changes.

## Local Data Storage (`localStorage`)
- On startup, the application queries `localStorage` under the key `studentProfile`.
- If profile data exists, it renders the stored details immediately.
- If no data is present, default student details are loaded.
- All saved edits permanently replace the dataset in `localStorage` to preserve state across session restarts.

## Responsive Design
Built using flexible CSS Flexbox containers and viewport meta tags to provide a consistent viewing experience across Mobile, Tablet, and Desktop screen sizes.

## How to Run
1. Ensure Node.js and Apache Cordova are installed.
2. Clone this repository:
   ```bash
   git clone https://github.com/Ethan9333/Anggot_StudentProfile.git