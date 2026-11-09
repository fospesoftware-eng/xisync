# Made-in-China.com (中国制造网) — Official Seller API Briefing

**Research date:** verified live 2026-09-02 (consistent with 2024–2025 evidence).
**Scope:** official, seller/supplier-facing API options for programmatic product-catalog
management (publish / update / list / images / inquiry data) on **made-in-china.com**
(operator: Focus Technology Co., Ltd. 焦点科技股份有限公司).

---

## (a) Verdict — NO official seller catalog API exists today

Made-in-China.com does **not** expose an official supplier/seller product-catalog API
or developer open platform. Findings:

- Every plausible developer hostname **fails DNS resolution**:
  - `open.made-in-china.com`, `openapi.made-in-china.com`, `api.made-in-china.com`,
    `developer.made-in-china.com`, `dev.made-in-china.com`
  - `open.focuschina.com`, `api.focuschina.com`, `developer.focuschina.com`
  - `open.mic.com`, `open.focusaim.com`, etc.
- Made-in-China.com itself returns **404** on `/open`, `/openapi`, `/api`, `/developer`.
- Official help documentation describes product operations as **UI-only** (see (c)).

> Many Chinese content-farm posts ("中国制造网 商品详情 API", "MIC 开放平台 OAuth+MD5 接口")
> describe an open platform whose hosts do **not exist** — these are fabricated or
> scraping-marketing articles. Scraping is explicitly prohibited (see (e)).

## (b) Who can integrate / application flow

- No developer portal, app-key application, or OAuth consent flow exists for sellers.
- Supplier membership (free vs paid **认证供应商 / Audited Supplier**) gates *features*
  (bulk import, data feeds in the member console) — not an API.
- No ERP-partnership API program was found in official materials.
- If your storefront management is required, the sanctioned automated-ish path is the
  supplier console itself:
  - Seller center: `membercenter.made-in-china.com` (product add: `/product-add/`)
  - Supplier services & help: `service.made-in-china.com`
  - Audited Supplier program page: https://www.made-in-china.com/audited-suppliers/for-suppliers/

## (c) Capability list available *without* an API

Official bulk/batch tooling in the supplier console (外贸e家 / Virtual Office):

- **Excel-template bulk product add** — the sanctioned bulk import path:
  http://big5.made-in-china.com/faq/detail1u606362054/madeinchina.html (EN mirror FAQ id 606362054)
- Product ops are UI-driven: add / add-similar / bulk-edit / batch directory-attribute
  edits / 素材库 (image library) / management statuses (on-shelf, off-shelf, rejected).
  Official guides under `service.made-in-china.com/help/guide/product/*`:
  - https://service.made-in-china.com/help/guide/product/1519.htm
  - https://service.made-in-china.com/help/guide/product/1521.htm
  - https://service.made-in-china.com/help/guide/product/3251.htm
  - https://service.made-in-china.com/help/guide/product/16157.htm
  - https://service.made-in-china.com/help/guide/product/16159.htm
- Marketing/business-opportunity data (RFQ etc.) is console/email oriented, not API.

## (d) Auth model

N/A — no public auth/signing scheme to document. (Content-farm "OAuth + MD5 signature"
write-ups reference non-existent hosts and should not be trusted.)

## (e) Scraping / automation restrictions

- Scraping is prohibited by the Made-in-China User Agreement:
  https://login.made-in-china.com/help/user-terms-cn
- Treat any claim of an "unofficial working API" accordingly (ToS + technical fragility risk).

## (f) Ecosystem / related products (not catalog APIs)

- **Focus AIM** (announced July 2024, https://www.focusaim.com/) is Focus Technology's
  AI product family (SourcingAI / Mentarc / AI麦可 / Doba Pilot) — **not** a seller
  catalog-management API. Reference: https://24h.jrj.com.cn/2024/11/03213744882737.shtml
- A March 2026 investor survey mentions a possible future MCP/interface opening — aimed
  at **AI-agent buyer traffic**, not seller catalog sync (no shipped API as of research date).
- 麦可/Mentarc/Doba Pilot support supplier stores in an assistive capacity (content/AI),
  with no documented programmatic catalog surface.

## (g) Practical guidance for XiSync

1. **Export side (today):** generate the official Excel bulk-import template mapped to
   XiSync catalog columns and hand it to the seller console (or offer CSV→console import).
   The XiSync MIC adapter models a forward-compatible connector so this swap-in is UI-neutral.
2. **Import/reconciliation (today):** not automatable via sanctioned API; keep manual or
   re-enter via console, or treat console edits as out-of-band.
3. **Watch items:** Focus Technology AI-Agent interface announcements (MCP-style) may
   eventually open a sanctioned data channel — revisit quarterly.

## Uncertainty flags

- Research was conducted against public web + DNS, not a logged-in supplier console;
  in-console feature diffs between membership tiers could not be enumerated exhaustively.
- No evidence found of an official API — absence of evidence on vendor material is treated
  as "no API", which is the conservative engineering assumption until Focus ships one.
