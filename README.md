# UNIC-CODES

A simple public-facing UNIC Locker demo webpage.

## Features
- Registration form with email, phone, OTP, personal details, password creation, and automatic UNIC number generation (alpha + numeric format).
- Post-registration redirect to login using UNIC number + password.
- Logged-in dashboard tabs: Home, Update Personal Details, Upload Documents, and Log Out.
- Document upload section for Aadhaar, 10th certificate, 12th certificate, and other documents.

## Run locally
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.
