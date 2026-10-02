---
name: Import connection scope
description: Preserving the imported app when external connection settings are unavailable.
---

Preserve the existing Supabase database and accounts unless the user explicitly authorizes changing providers. The user dismissed the connection-settings request during the import. The working preview therefore supports public pages and the original demo identities, with a visible missing-connection notice. Real sign-in and database mutations must return configuration errors, not fabricated success.

**Why:** Replacing a database without approval could disconnect the user's existing data and accounts. Missing connection settings must not prevent public pages from rendering or imply that demo data is live.

**How to apply:** Keep the notice and explicit errors until the existing connection is configured. Do not turn original demo identities into trusted backend identities.