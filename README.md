🔐 Privacy-Preserving KYC Verification System

Verify locally. Prove cryptographically. Share nothing.

A Hybrid Zero-Knowledge Proof (ZKP)-based identity verification system enabling eligibility checks (e.g., Age ≥ 18, Residency) without revealing Aadhaar number, DOB, or personal data.

🌍 Overview

Traditional KYC systems require repeated disclosure of sensitive identity information.
This system replaces data sharing with cryptographic proof of correctness.

The prototype demonstrates:

Local Aadhaar QR verification

Zero-Knowledge Proof (ZKP) generation

Privacy-preserving verifier validation

No exposure of raw identity data

🏗 Architecture Overview
🔹 Hybrid Verification Model
Mode 1 — Direct Aadhaar QR → ZKP

User scans Aadhaar QR locally

UIDAI signature verified offline

Age / residency computed locally

ZKP generated proving:

QR authenticity

Correct age computation

Age ≥ threshold

Mode 2 — Credential-Based Verification (Future)

Optional reusable digital credential issuance

Multi-service privacy-preserving verification

Selective attribute disclosure

🔐 Trust Model
✅ Verifier Trusts

UIDAI public key

ZKP verification algorithm

Cryptographic proof

❌ Verifier Does NOT Trust

User device

Raw Aadhaar data

Firebase storage (demo-only layer)

🚀 Prototype Setup

This prototype uses Firebase to simulate cross-session proof validation between:

User Dashboard (Prover)

Verifier Dashboard

⚠️ In production, proof verification will be handled by a dedicated verifier service (no centralized proof storage).

📦 Prerequisites

Node.js v18+

npm

🛠 Installation
git clone https://github.com/<your-username>/privacy-kyc-system.git
cd privacy-kyc-system
npm install
npm run dev


Open in browser:

http://localhost:5173

🔑 Demo Credentials
👤 User Dashboard (Prover)
Email: user@demo.com
Password: 123456

🏦 Verifier Dashboard
ID: BankDemo
Password: 123456

🧩 Features
🔹 Zero-Knowledge Proof Generation

Select attributes (Age, Residency)

Generate cryptographic proof

No Aadhaar number or DOB shared

🔹 Local QR Verification

Offline UIDAI signature validation

No UIDAI API dependency

No document upload to server

🔹 Secure Proof Flow

Proof transmitted via HTTPS

Firestore used only for demo proof transport

Verifier sees only VALID / INVALID

🔹 Simulated Bank Integration

“Login with ZKP” onboarding flow

Demonstrates real-world KYC scenario

🔹 Modern Secure UI

React + Tailwind CSS

Glassmorphism security-themed design

☁ Production Deployment Strategy (MVP)
🔹 Planned Cloud Infrastructure
Layer	Technology
Frontend	AWS S3 + CloudFront
Verifier API	AWS EC2 / Elastic Beanstalk
Key Management	AWS KMS
API Security	AWS WAF + IAM
Monitoring	AWS CloudWatch
🔐 Planned Security Enhancements

Nonce-based time-bound proofs

Anti-replay protection

Session-bound verification

Stateless verifier architecture

🤖 ML Integration (Future Roadmap)

Machine Learning will be integrated only at the verification boundary for:

QR tampering detection

Forgery anomaly detection

Behavioral fraud signals

Planned Platform: Amazon SageMaker

Constraints:

ML never stores identity data

ML never replaces cryptographic verification

ML remains separate from ZKP logic

⚠️ Architecture Note

Firebase is used only to simulate proof transport between dashboards.

In production:

Proofs verified live via dedicated verifier API

No centralized proof storage

No identity database

No Aadhaar number retention

🔐 Security Principles

Data minimization by design

Cryptographic correctness enforcement

No identity disclosure

No centralized PII storage

Compliance-aligned architecture

🛣 Roadmap

Optimize ZKP circuits

Remove centralized proof exchange

Deploy verifier microservice

Integrate anti-replay mechanisms

Enable reusable digital credentials

Pilot with financial sandbox partner

📌 Disclaimer

This system is a research prototype demonstrating privacy-preserving KYC concepts.

It is:

Not affiliated with UIDAI

Not an official Aadhaar authentication method

Not intended to replace government KYC systems

🏆 Vision

To build a scalable, cryptographically verifiable, privacy-first digital identity layer for financial and public digital infrastructure.

⭐ If you find this project interesting

Please consider giving it a star ⭐ on GitHub — it helps visibility and research impact.
