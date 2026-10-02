---
name: Import connection scope
description: Preserving the imported app when external connection settings are unavailable.
---

The user explicitly approved replacing XiSync's Supabase dependency with Replit PostgreSQL and Replit sign-in. The old database was empty, and no live Supabase export is available; do not claim that historical records or accounts were migrated. Each new Replit user receives a private XiSync workspace. The server derives tenant scope from that user's profile and ignores client-supplied tenant IDs.

**Why:** The user chose the new provider and login path, but no legacy data source was available to transfer. Isolating each new identity avoids inventing ownership or exposing another user's records.

**How to apply:** Do not use the former demo identities for writes. All private data routes must authenticate first and resolve the active tenant on the server before reading or mutating records.