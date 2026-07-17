# ConverterTrue

<p align="center">
  <img src="./screenshots/homepage.png" alt="ConverterTrue Homepage" width="100%" />
</p>

<h1 align="center">ConverterTrue</h1>

<p align="center">
A modern full-stack file conversion platform built with React, TanStack Start and NestJS.
</p>

<p align="center">
Convert images, documents, videos and audio files through a fast, responsive and intuitive interface.
</p>

<p align="center">
<a href="https://convertertrue.vercel.app"><strong>Live Demo</strong></a> •
<a href="https://github.com/Bedirhanelcik/convertertrue"><strong>Repository</strong></a> •
<a href="https://www.linkedin.com/in/bedirhanelcik/"><strong>LinkedIn</strong></a>
</p>

---

## Overview

ConverterTrue is a modern full-stack file conversion platform supporting image, document, video and audio conversion through a clean, responsive interface. It demonstrates a production-ready React frontend communicating with a NestJS backend through a REST API.

## Screenshot

![Homepage](./screenshots/homepage.png)

## Core Features

- Drag & Drop Upload
- Multiple File Selection
- Image, Document, Video & Audio Conversion
- Dynamic Output Format Selection
- Responsive Design
- Mobile Support
- Dark & Light Theme
- REST API Integration
- Production Deployment

## Supported Conversions

| Category | Examples |
|---|---|
| Images | PNG ↔ JPG, WEBP, AVIF |
| Documents | PDF ↔ DOCX, PPTX, XLSX |
| Video | MP4 ↔ WEBM, MOV |
| Audio | MP3 ↔ WAV, FLAC |

## Tech Stack

| Frontend | Backend | Deployment |
|---|---|---|
| React | NestJS | Vercel |
| TanStack Start | Node.js | Railway |
| TypeScript | REST API | GitHub |
| Tailwind CSS | Multipart Upload | |

## Architecture

```mermaid
flowchart LR
User --> Frontend
Frontend -->|FormData| Backend
Backend --> Converter
Converter --> Backend
Backend --> Frontend
Frontend --> User
```

## Project Structure

```text
ConverterTrue/
├── backend/
├── public/
├── screenshots/
├── src/
├── package.json
└── README.md
```

## API

```env
VITE_API_URL=https://your-backend-url
```

```text
POST /api/convert
```

## Local Development

```bash
git clone https://github.com/Bedirhanelcik/convertertrue.git
cd convertertrue
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run start:dev
```

## Deployment

Frontend: Vercel

Backend: Railway

Repository: GitHub

## Future Improvements

- Batch Conversion
- Conversion History
- File Preview
- Cloud Storage
- OCR Support
- Authentication

## Author

**Bedirhan Elçik**

- GitHub: https://github.com/Bedirhanelcik
- LinkedIn: https://www.linkedin.com/in/bedirhanelcik/

## License

Copyright © 2026 Bedirhan Elçik.

Portfolio project for educational and evaluation purposes.

---

<p align="center"><strong>ConverterTrue — Convert Any File, Fast & Free.</strong></p>
