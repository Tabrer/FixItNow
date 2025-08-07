# **App Name**: FixItNow Onboarding

## Core Features:

- Homepage Navigation: Homepage with clear 'Login as User' and 'Login as Worker' buttons, routing to respective login/signup pages.
- User Onboarding Flow: User Onboarding: Login and Signup sections with input fields for name, email/phone, password, and optional social logins, directing to service dashboard post-login.
- Worker Onboarding Flow: Worker Onboarding: Login and Signup sections with fields for service type, experience, location, optional document uploads, and worker terms agreement, showing 'Awaiting Approval' status post-signup, and directing to worker dashboard after approval.
- Password Reset: 'Forgot Password' functionality with a link on login pages, a backend endpoint to accept email/phone and send a reset token via email/SMS, and a reset flow upon successful token entry.
- Security Implementation: Secure login/signup process with bcrypt password hashing, frontend and backend input validation, JWT token authentication, and protected routes for dashboards and profile sections.

## Style Guidelines:

- Primary color: A deep blue (#3F51B5) evokes trust and reliability.
- Background color: A light blue-gray (#E8EAF6) offers a clean and professional look.
- Accent color: A muted purple (#7E57C2) creates a point of emphasis without overpowering the rest of the palette.
- Headline font: 'Space Grotesk' (sans-serif) provides a modern and technical feel.
- Body font: 'Inter' (sans-serif) offers excellent readability and a neutral aesthetic, to complement Space Grotesk.
- Crisp, clear, and professional icons relevant to plumbing, electrical, and mechanical services.
- Clean, grid-based layout for easy navigation and a professional appearance.
- Subtle transitions and loading animations to improve user experience without distracting.