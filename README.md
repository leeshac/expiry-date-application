## Expiry Date Tracker

A mobile app that uses computer vision to extract expiry dates from household item images, helping users track and manage product lifespans.

### What it does

- Detects and reads expiry dates from photos using a custom trained YOLOv8 object detection model
- Users can take or upload photos via the mobile app to get real-time responses
- Items and their expiry dates are stored per user account, accessible across sessions
- Users can set notifications to be reminded before items expire

### Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React Native |
| Backend | Python, FastAPI, Docker |
| Database | PostgreSQL |
| Deployment | AWS Lightsail (Docker Compose) |
| Auth | Clerk |
| ML Model | YOLOv8 (custom + public dataset) |

### Model Performance

- 90% mAP50 on expiry date detection

### Status

Backend fully deployed and operational.
Frontend is functional. UI refinements in progress.
