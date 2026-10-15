# Learn

A role-based learning institution platform built with Next.js (Pages Router), MongoDB, Cloudinary, Paystack, and Resend.

## Roles
- **Student** — register, browse & pay for courses, follow locked step-by-step sessions, upload work, receive certificates.
- **Staff** — assigned courses, upload materials per session, build quizzes with countdown + passmark, review student submissions.
- **Admin** — manage users, courses, payments, staff assignments, marks, and view activity logs.

## Stack
- Next.js 14 (Pages Router) + TypeScript
- MongoDB (Mongoose)
- Cloudinary (file storage)
- Paystack (payments)
- Resend (transactional email)
- Upstash Redis (rate limiting)
- Tailwind CSS

## Setup
1. `npm install`
2. Copy `.env.local.example` → `.env.local` and fill values.
3. `npm run dev`
