# Alibaba.com (International Station / 阿里国际站, ICBU) — Seller Product-Catalog API Options: Research Briefing

**Research date:** 2025 (live checks against alibaba-owned portals and the Wayback Machine)
**Scope guard-rail:** Everything below concerns **alibaba.com's international B2B seller station (the "Alibaba International Station", ICBU, 阿里巴巴国际站)** — **not** 1688.cn, **not** open.taobao.com *domestic* Taobao/Tmall APIs, **not** AliExpress (openapi.aliexpress.com), and **not** Alibaba Cloud APIs. Where a source turned out to be one of those, it is called out explicitly.

---

## (a) Verdict — does an official API path exist for the seller?

**Yes.** There is an official, currently-operating open platform and an official, actively-maintained set of *ICBU / "国际站"* product-management APIs for the Alibaba.com international seller station. Confidence: **high for existence and currency through 2024** (official ICBU docs show product-interface changes dated **2024‑04‑02**, e.g. support for publishing "半托管/half-managed" products, and a publish guide updated **2024‑02‑21**; the doc system is still live in 2025). Confidence: **medium on the exact self-serve signup steps** (see §b), because the portals are largely login-gated JavaScript apps whose internal flows could not be fully verified anonymously.

Key portal facts (verified):

| Item | Verified finding |
|---|---|
| Developer-facing platform of the international station | Named **"ICBU Open Platform"** in the page title of its announcement area. URL **https://open.alibaba.com** — live; Wayback snapshots from **2025‑03‑18** show active sections `/doc/doc.htm` ("Getting Started – Alibaba.com"), `/doc/api.htm`, `/app/index.htm` (console), `/announcement/index.htm` ("Announcement – ICBU Open Platform"), `/support/index.htm`. Historical predecessor (2015) was branded **"Alibaba Open Platform"** at open.alibaba.com/us/portal, an English portal for "alibaba.com & tmall.hk" developers built on the TOP (Taobao Open Platform) system. |
| Where the actual API documentation lives today | The official **ICBU/国际站 doc tree** (doc-tree id **456** on the TOP documentation system) is served at **https://developer.alibaba.com** and its mirrors **https://api.alidayu.com / doc.alidayu.com**. Individual API pages are of the form `open.taobao.com/api.htm?docId=…&docType=2` (TOP-style) — **these ICBU docs are *international-station* docs hosted on the shared Taobao/TOP developer system, not domestic Taobao APIs** (domestic Taobao/Tmall docs are a *different* tree, id 780). |
| Chinese name | Alibaba documents and the 外贸服务市场 refer to this ecosystem as 国际站 / 阿里巴巴国际站 (open platform = 国际站开放平台 / 阿里巴巴国际站开放平台). |

Caveat on operator: the ICBU (alibaba.com) business is run by the Alibaba.com group of companies (including Alibaba.com Singapore E-Commerce Pte Ltd in recent years), but the developer/API plumbing you actually sign up to is Alibaba's China-based TOP-style developer system (ICPs on these pages are Aliyun/Taobao 浙B2-…). The precise contracting entity for API terms was not verifiable from public pages — flagged **unverified**.

---

## (b) Who can get API access, and the application flow

### Two very different roles — this matters

1. **Sellers do NOT normally get raw API keys.** The product APIs are consumed by **registered third-party software/service providers ("服务商", ISV/ERP vendors)**; the seller's role is (i) **buying/subscribing** to the vendor's app on the official services marketplace, and (ii) **granting consent** (OAuth-style) so the vendor's app may read/write that one store's data. Multiple independent ERP vendors' help pages state this in plain terms, e.g. Lingxing (领星): *"领星ERP和阿里国际站平台通过数据接口实现对接，阿里巴巴官方要求只有用户确认授权数据到第三方系统，才能通过接口进行数据交换"* and *"每个需要授权到领星ERP的阿里国际站店铺均需要购买领星ERP应用"*; Eccang (易仓) requires paying the fuwu.alibaba.com subscription *per account* before authorization succeeds ("未付费时…会显示token获取失败").

2. **Service providers / tool developers** are the ones who obtain **appkey/appsecret** and API permission packages. Official product-API guidance also explicitly names "三方服务商**和自研商家**" (third-party providers *and* self-developing merchants) as intended integrators — i.e. an in-house/seller self-developed system is a contemplated pattern — but **the published walkthroughs and qualification rules we found are for marketplace service providers**. Whether a plain supplier account can today self-register an app *without* becoming a 服务商 is **unverified** and should be asked of the platform.

### Documented qualification rules (服务商/app-tools; official pages, dates noted)

From the **阿里巴巴国际站外贸服务市场应用工具类目管理规范** (activity.alibaba.com/fuwu/d3e35f63.html — current-category management rules) and the **外贸服务市场服务商入驻规则** (fuwu.alibaba.com/fwsc/apply_guide.html, published 2019-05):

- Must be an **enterprise** (公司资质, no individuals): business license whose scope covers e.g. 网络技术开发/信息技术服务/软件开发; **registered capital ≥ ¥500,000**; **≥3 Java/PHP engineers**; 
- **Must deploy on 聚石塔 (Jushita, Alibaba's ISV cloud host)** (exceptions only by official evaluation); callback URL registered;
- **Alipay enterprise account certified in the company's exact name** (支付宝商家认证), matching the business license;
- Conflict-of-interest checks (no serving/former Alibaba Group staff without clearance); no bad standing; category-specific **保证金 (deposit)**;
- Platform may grant **API permission packages "based on the service provider's business scope"**, reclaim APIs with **no calls for 60 days**, and may apply API rate-limiting / app takedown as sanctions.

### Application flow (as documented for the app-tools/子市场 channels)

1. Register an Alibaba.com international-station account (`accounts.alibaba.com/register/cnfm_reg.htm`), do enterprise Alipay certification.
2. On the services marketplace **fuwu.alibaba.com** click 服务商入驻 (ISV onboarding); submit company docs; category-manager review (≈3 working days per older rules); pay deposit.
3. Bind/register a developer identity on the TOP-style developer system (**developer.alibaba.com / open.taobao.com** console — the ICBU sub-market walkthrough explicitly logs in at `open.taobao.com`, creates the app under the 外贸服务市场/国际站 channel, and gets an **APPKEY**; console historically `my.open.taobao.com` / `console.open.taobao.com`).
4. **Apply for API permissions per business scenario** ("申请此场景") — category 小二 approval; this is where the 国际站 product/photobank/category/order/message scopes are unlocked.
5. Publish the app for sale on fuwu.alibaba.com (only online purchase; term 1/3/6/12 months or trial 7/15/30 days; buyer restricted to 国际站 accounts, member type chosen per tool type).
6. **Seller side:** each store buys the app on fuwu.alibaba.com, then the seller logs into their alibaba.com (国际站) store account and confirms authorization on Alibaba's consent page (ERP vendors describe this as "登录阿里巴巴国际站店铺账号，确认授权"). Token/sessionkey is then usable by the app for that store.

Historical note (still the canonical flow description): fuwu.alibaba.com's "新工具开发售卖流程" page (gjjr_rules.html) describes exactly this TOP-based pipeline (create app → choose "B2B国际站" → bind Taobao developer account in the vendor console → deploy on 聚石塔 → publish on the marketplace), and it lists the then-existing 国际站 interface groups: **P4P/直通车 (cid 20677), 商品/products (cid 20692), 数据管家/Data Center (cid 20785)**.

**Not verified / gaps:** whether the modern console is now open.alibaba.com/app vs my.open.taobao.com (both exist; open.alibaba.com is an SPA and login-gated, so we could not observe the registration forms); whether overseas/non-mainland supplier entities can register (all published qualification text assumes mainland Chinese company registration, Alipay corporate certification and Jushita hosting) — **must be confirmed with an Alibaba.com rep before assuming a non-China entity can join**; whether a **paid store membership** (出口通/Gold Supplier / 金品诚企) is a hard precondition for using API tooling — strongly implied by the platform's membership model (the marketplace links sellers to supplier.alibaba.com to become a member) but not stated verbatim in the API rules we retrieved (**unverified**).

---

## (c) Product-management API capability list (国际站/ICBU)

Official catalog (verified from the ICBU doc tree "国际站商品API" and the official change-log "商品接口变动说明" (treeId 456, article 119212, updated 2024-04-01)). "New" = current schema-based system; "legacy" = being retired (2021 notice: 旧接口不再维护, 陆续下线).

**Publishing / offer management (create, update, list, fetch):**
- `alibaba.icbu.product.schema.get` (apiId 50063) — fetch the XML publishing schema/rules for a category ("new" publish)
- `alibaba.icbu.product.schema.add` (docId 50071) — submit/publish product ("new")
- `alibaba.icbu.product.schema.add.draft` (docId 50107) — publish a draft
- `alibaba.icbu.product.schema.update` (docId 50189) — incremental/partial update ("new")
- `alibaba.icbu.product.schema.render` (docId 50188) — fetch live product data as XML (also used as the basis for updates)
- `alibaba.icbu.product.schema.render.draft` (docId 50205) — render draft product data
- `alibaba.icbu.product.list` (apiId 25438, legacy) — list/query products
- `alibaba.icbu.product.get` (apiId 25439, legacy, "will not be taken down") — single product detail
- `alibaba.icbu.product.add` / `product.update` / `product.update.field` / `product.add.draft` (apiIds 25347/25357/27010/46164 — legacy)
- `alibaba.icbu.product.batch.update.display` (apiId 44413) — batch on/off shelf (上下架)
- Product groups: `alibaba.icbu.product.group.get` / `group.add` (25299 / 25300)
- Stock: `alibaba.icbu.product.sku.inventory.get` (docId 57873), `alibaba.icbu.product.inventory.update` (docId 53178)
- Product capability/type check & quality score: `alibaba.icbu.product.type.available.get` (docId 62123), `alibaba.icbu.product.score.get` (apiId 47461)
- ID mapping between old (encrypted) / new (plain) product ids: `alibaba.icbu.product.id.encrypt` (docId 50558), `alibaba.icbu.product.id.decrypt` (apiId 26068)
- **Hard delete:** no explicit product-delete endpoint appeared in the official catalog; delisting is done via the batch display API. **Flag: confirm with the platform whether a delete/draft-delete API exists** (possibly via draft flows).

**Categories & attributes:**
- `alibaba.icbu.category.get.new` (apiId 50064) — category tree ("new")
- `alibaba.icbu.category.schema.level.get` (apiId 51873) — hierarchical attribute levels ("new")
- `alibaba.icbu.category.id.mapping` (apiId 52043) — old↔new category id mapping
- Legacy: `alibaba.icbu.category.get` (25349), `category.attribute.get` (25348), `category.attrvalue.get` (24395), `category.level.attr.get` (48659). Note: in the **new** schema system, per-category attributes are no longer fetched separately — they come embedded in the `schema.get` XML rules.

**Images & media (photobank / 图片银行):**
- `alibaba.icbu.photobank.upload` (24463) — upload image to the seller's photobank
- `alibaba.icbu.photobank.list` (24459) — query photobank images (returns image id for publish)
- `alibaba.icbu.photobank.group.list` (30575) / `photobank.group.operate` (41767) — photobank folders
- `alibaba.icbu.file.urlposting.upload` (apiId 70213) + `alibaba.icbu.task.status.notify` (apiId 70214) — URL-based file transfer / crawl-task notify
- Verified-supplier media retrieval: `alibaba.icbu.data.verified.get` (apiId 68260, "获取金品商家数据（视频、图片、证书、卡片）") — 金品诚企 seller media/cert/card data.
- **Videos:** a dedicated video-bank API was not in the fetched catalog; video may ride on schema components/URL-posting. **Unverified — check the schema fields per category.**

**Orders / trade / messages / logistics (same ICBU station, for completeness):**
- 国际站订单接口说明 (article 119620), 国际站订单发货能力接入指南 (118894) — order state machine + fulfillment guides; order-change push topic **`icbu_trade_OrderNotify`** via TOP message service (`ws://mc.api.taobao.com`), see 国际站消息API接入指南 (118890);
- 国际站在线物流（快递）能力 guide (article 119248) — online express logistics capability;
- Freight/shipping templates: `alibaba.wholesale.shippingline.template.list` (25394) — used when publishing RTS/tradable products.
- (Not product management, but note 直通车/P4P and 数据管家 API groups existed per the fuwu.alibaba.com list — legacy, currentness unverified.)

---

## (d) Auth model (verified from official ICBU user-authorization doc, article 118846)

- **OAuth2.0** (authorization-code, "Server-side flow"; plus "Client-side flow" for JS clients), **appkey (client_id) / appsecret (client_secret)** issued per app.
- Seller consent via the ICBU-branded authorize endpoint: **`https://oauth.alibaba.com/authorize?response_type=code&client_id=<APPKEY>&redirect_uri=…&view=web&sp=icbu`**; tokens at **`https://oauth.alibaba.com/token`** (`grant_type=authorization_code`). (A generic TOP console alternative via `taobao.top.auth.token.create` exists.)
- Returns **access_token (a.k.a. sessionKey) + refresh_token**, expiry fields per security level (r1/r2/w1/w2 buckets). Every product API call passes the seller's sessionKey with the signed appkey/secret.
- **Lifetime is subscription-linked for marketplace tools** (第三方IT工具 class: token valid for the purchased service term, e.g. 1 month/1 year; ~24 h during formal-environment testing); a "商家后台系统"/self-use class is described with a fixed 1-year term, and "服务商后台系统" with subscription-linked terms — from the same ICBU authorization doc. Sellers re-consent / apps refresh when it lapses; logout URL `https://login.alibaba.com/xman/xlogout.htm` only clears SSO cookies, not the grant.
- Data-governance rules (from the marketplace category rules): data obtained is usable only for the same seller that authorized it; aggregating multiple sellers' data in one place is forbidden.

---

## (e) Environments, rate limits, fees

- **No isolated "dummy-data" sandbox is documented for the ICBU APIs.** The official 应用环境说明 (in the ICBU doc tree; mirror page updated 2025) defines only (1) **正式测试环境** — real production data, per-app cap of **5,000 calls/day and ≤5 authorized users** while testing — and (2) **上线运行中** (live). It states explicitly that test and live **share the same data, so write calls affect the real store**. Generic TOP sandbox addresses are referenced in the OAuth doc ("沙箱环境…换成沙箱对应入口地址"), but ICBU-specific sandbox endpoints were not published in anything we retrieved → **partially verified; treat as "no separate sandbox unless the platform confirms one"**.
- **Rate limits:** no per-API QPS numbers for the 国际站 product APIs were found in public docs. The APIs are marked "开放平台免费API" (free APIs with TOP-style quota/security-level management), the test cap above is 5,000/day, and the marketplace rules mention API-rate-limiting only as a sanction and a 60-day-inactivity reclaim rule. **Specific production quotas: unverified.**
- **Fees:** no per-call fee documented (free-API label). The monetization is the vendor's **service-market subscription** (sellers pay the ERP vendor per store, e.g. 通途ERP阿里国际站NEW at ¥1–200/year tiers; trials 7 days), plus platform 技术服务费 terms in the marketplace agreements and the **服务商保证金 (deposit)** for providers. Any "open platform technology-service fee" style charges specific to ICBU were not found → **unverified**.

---

## (f) Official/partner ecosystem evidence (the API is real and in production)

ERP vendors actively selling Alibaba.com international-station product-sync on the official marketplace (fuwu.alibaba.com — "阿里巴巴外贸服务市场" / 外贸服务平台), each with a `ISV…` service code and seller-side "purchase + authorize" instructions:

- 通途 ERP — "通途ERP阿里国际站NEW" (fuwu.alibaba.com/product/buy.htm?code=ISVXX8E0BBB)
- 孚盟 MX ERP (…code=ISVXXA4109E)
- 易仓 Eccang ERP — alibaba(阿里巴巴国际站) 授权说明 (ecwiki.eccang.com/docs/show/3404)
- 领星 ERP — 阿里巴巴国际站店铺授权 (lingxing.com/help/article/AlibabaAuthorization): view online products + 刊登商品 via data interface after purchase+authorization
- 马帮 Maban — "店铺授权--Alibaba(阿里巴巴国际站)" (help.mabangerp.com)
- GitHub OSS client examples exist (e.g. ronknight/alibaba-seller-api — unofficial community code, for reference only)

These are third-party integrations *over* the official interface — their existence corroborates the API, but their pages are **not** authority for API terms.

---

## Full list of cited URLs

**Official ICBU/TOP documentation (doc-tree 456 = 国际站):**
- developer.alibaba.com — ICBU product-API catalog incl. `alibaba.icbu.product.schema.get`: https://developer.alibaba.com/docs/api.htm?apiId=50063
- api.alidayu.com — 国际站商品API catalog: https://api.alidayu.com/docs/api.htm?apiId=50063 ; doc page 商品API接入指南: https://api.alidayu.com/docs/doc.htm?treeId=456&articleId=119211&docType=1
- 【新接口】商品发布接入文档 (updated 2024-02-21): https://api.alidayu.com/docs/doc.htm?treeId=456&articleId=119213&docType=1
- 商品接口变动说明 (updated 2024-04-01; new-vs-legacy mapping incl. schema.add/update/render, photobank, inventory, encrypt/decrypt, 半托管 2024): https://api.alidayu.com/docs/doc.htm?treeId=456&articleId=119212&docType=1
- 国际站用户授权介绍 (OAuth2.0, oauth.alibaba.com, sp=icbu, sessionKey): https://api.alidayu.com/docs/doc.htm?treeId=456&articleId=118846&docType=1
- 应用环境说明 (test environment, 5000/day cap): https://api.alidayu.com/docs/doc.htm?treeId=456&articleId=108&docType=1
- 国际站消息API接入指南 (icbu_trade_OrderNotify): https://api.alidayu.com/docs/doc.htm?treeId=456&articleId=118890&docType=1 ; 国际站订单接口说明: …/treeId=456&articleId=119620&docType=1
- 外贸服务市场子市场接入指引（应用工具类目）(app creation on open.taobao.com, appkey, API-permission application): https://api.alidayu.com/docs/doc.htm?treeId=457&articleId=108049&docType=1
- alibaba.icbu.data.verified.get (金品商家 media data): https://api.alidayu.com/docs/api.htm?apiId=68260

**Portals & marketplace (official):**
- open.alibaba.com (ICBU Open Platform; verified live via Wayback 2025-03-18: /announcement/index.htm title "Announcement - ICBU Open Platform"; /doc/doc.htm "Getting Started – Alibaba.com"; 2015 snapshot "Alibaba Open Platform"): https://open.alibaba.com/ ; archived: https://web.archive.org/web/20250318061449/https://open.alibaba.com/announcement/index.htm and https://web.archive.org/web/20150328011957/http://open.alibaba.com:80/
- fuwu.alibaba.com (阿里巴巴外贸服务市场): https://fuwu.alibaba.com/ ; 服务商入驻规则: https://fuwu.alibaba.com/fwsc/apply_guide.html ; 新工具开发售卖流程 & 国际站接口列表: https://fuwu.alibaba.com/fwsc/gjjr_rules.html ; 通途ERP阿里国际站NEW listing: https://fuwu.alibaba.com/product/buy.htm?code=ISVXX8E0BBB
- 应用工具类目管理规范 (2019-21-era; enterprise-only, 聚石塔, ≥¥500k capital, ≥3 engineers, Alipay cert): https://activity.alibaba.com/fuwu/d3e35f63.html ; 代运营类目管理规范 (developer.alibaba.com as 开放平台; API 权限包/60-day rule): https://fuwu.alibaba.com/fwsc/4f9294a2.html (also listed in search: fuwu.alibaba.com/fwsc/e533179a.html)

**ERP-vendor corroboration (third party):**
- 领星 ERP: https://www.lingxing.com/help/article/AlibabaAuthorization
- 易仓 Eccang: https://ecwiki.eccang.com/docs/show/3404
- 马帮 Maban: https://help.mabangerp.com/nested/details?id=1132&resource_id=1
- 孚盟 MX ERP listing: https://fuwu.alibaba.com/product/buy.htm?code=ISVXXA4109E
- Community code example (unofficial): https://github.com/ronknight/alibaba-seller-api

**Explicitly NOT relevant (checked and excluded):**
- developer.alibaba.com/docs/doc.htm?treeId=780… = **domestic Taobao/Tmall** 商家经营工具 docs (not ICBU)
- open.taobao.com / open.1688.com / developer.aliyun.com 1688 articles = **1688/domestic** APIs
- developers.aliexpress.com & aliexpress.offer.* = **AliExpress**, not alibaba.com
- Alibaba Cloud help = **cloud** APIs
- developer.aliyun.com "国际站商品详情" articles and sites like jishuzhan.net / e-com-net.com = mostly **unofficial reseller/scraper** data APIs, not official — do not confuse with the official ICBU APIs above.

---

## Key uncertainties (flagged)

1. Exact current self-service signup for **open.alibaba.com** (SPA, login-gated) — flows reconstructed from TOP-era docs and marketplace rules; may have changed.
2. Whether a **self-developing merchant** (自研商家) can get an appkey without marketplace 服务商 status — named as an audience in the official guide but no standalone walkthrough found.
3. Whether **non-mainland-China entities/sellers** can register (all qualification docs assume CN company + Alipay corporate certification + Jushita).
4. Whether a **paid membership tier** (出口通/金品诚企) is mandatory for API use (very likely under the membership model; not stated verbatim in API rules).
5. Existence of a product **delete** API and of dedicated **video** management — not present in the retrieved official catalog; delisting is via batch display API.
6. Precise production **QPS quotas/fees** — not published in accessible docs.
7. No isolated sandbox documented for ICBU APIs (test runs against real data at 5,000 calls/day / 5 users).
