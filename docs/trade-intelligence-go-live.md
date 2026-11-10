# Trade Intelligence 上线检查清单与部署说明

| 项目 | 内容 |
| --- | --- |
| 应用 | `@workspace/imported-app`（`artifacts/imported-app`） |
| 技术栈 | Vite 7 + React 19 + TypeScript 5.9 + Tailwind 3 + Recharts 2 |
| 发布形态 | 单页应用（SPA），静态资源部署；业务数据按租户存于浏览器 `localStorage` |
| 当前质量门禁 | typecheck 通过；单元测试 20/20 通过；生产构建通过 |
| 文档更新 | 2026-11-09 |

---

## 1. 交付范围

本次上线包含一个指挥中心与六个 Trade Intelligence 模块：

| 模块 | 普通控制台路由 | ULTRA 路由 |
| --- | --- | --- |
| 贸易指挥中心（首页） | `/dashboard` | `/dashboard/ultra` |
| 模块总览 | `/dashboard/trade-intelligence` | `/dashboard/ultra/trade-intelligence` |
| 信保式信用准入评估 | `/dashboard/trade-intelligence/credit` | `/dashboard/ultra/trade-intelligence/credit` |
| 运费与时效预测 | `/dashboard/trade-intelligence/shipping` | `/dashboard/ultra/trade-intelligence/shipping` |
| AI 供需撮合与工作流 | `/dashboard/trade-intelligence/matching` | `/dashboard/ultra/trade-intelligence/matching` |
| 贸易数据分析 | `/dashboard/trade-intelligence/analytics` | `/dashboard/ultra/trade-intelligence/analytics` |
| AI 工具箱（单证 / 报价） | `/dashboard/trade-intelligence/toolkit` | `/dashboard/ultra/trade-intelligence/toolkit` |

所有上述路由均在登录门禁之后（`AuthRequired`），未登录访问会跳转登录页。上线包中不得保留任何 `/qa/*` 之类的免登录验证路由。

---

## 2. 运行时事实（部署前必须理解）

1. **确定性引擎优先**：默认使用本地启发式引擎（`HeuristicTradeProvider`），无需模型服务即可完整运行，结果可复现。
2. **远程模型可选**：配置 `VITE_TRADE_AI_ENDPOINT` 后切换为 `RemoteTradeProvider`。请求为 `POST {endpoint}/{credit|shipping|documents|quote}`，Body 为 `{ "input": ... }`；单次超时 2.5 秒，超时、非 2xx 或返回结构不合法时自动降级到本地引擎，并在界面提示“模型端点不可用”。
3. **工作区持久化**：使用版本化 `localStorage` 仓储，Key 为 `xisync:trade-intelligence:v1:<tenantId>`（演示租户为 `demo-workspace`）。存储内容包含撮合工作流、信用评估、报价、单证检查与每日快照。
4. **每日快照**：打开应用时以及每次状态变更时写入当天快照；同一天重复写入会覆盖当天记录；按日期保留最近 45 天。首次运行没有前一日快照时，KPI 环比显示“建立基准”，简报明确说明“尚无前一日快照”，不会伪造昨日数据。
5. **未处理撮合年龄**：已有持久化工作流的撮合按最近一次阶段变更时间计算；从未处理过的建议行按种子年龄计算（0–18 天）。停留 ≥ 7 天即进入滞留统计与待办队列。
6. **主题**：`light` / `dark` 两套主题，存储于 `xisync-theme`，切换后刷新仍然保持；首次访问跟随系统偏好。
7. **语言**：中英双语，默认中文。界面文案全部来自 `tradeCopy.ts` / `commandCopy.ts`，不依赖后端翻译服务。

---

## 3. 上线前门禁（全部必须为绿）

### 3.1 代码与构建

在仓库根目录执行：

```bash
pnpm install --frozen-lockfile

cd artifacts/imported-app
pnpm typecheck
pnpm test
PORT=4173 BASE_PATH=/ pnpm build
```

| 检查项 | 通过标准 |
| --- | --- |
| 类型检查 | `tsc -p tsconfig.json --noEmit` 退出码 0 |
| 单元测试 | 20 个测试全部通过（含快照无历史、单日历史、多日历史、同日覆盖、45 天裁剪、建议年龄与滞留） |
| 生产构建 | 输出 `artifacts/imported-app/dist/public`，退出码 0 |
| 入口包体积 | 入口 chunk 约 515 kB；Trade 页面均已按路由懒加载，无单页 1.8 MB 回退 |
| 构建环境变量 | 必须提供 `PORT` 与 `BASE_PATH`；`PORT` 仅用于构建配置，不会占用正在运行的开发端口 |

> 注意：构建必须显式传入 `PORT` 与 `BASE_PATH`，否则 `vite.config.ts` 会直接报错退出。开发服务器继续使用 `http://127.0.0.1:5173/`，不要用该端口执行构建或启动第二个服务。

### 3.2 功能验收

- [ ] 指挥中心可加载：每日简报、4 个 KPI、待办队列、资金与敞口、在途看板、管道看板均正常渲染。
- [ ] 首次运行（清空工作区后）：KPI 环比显示“建立基准 / 今日已记录基准”，简报首行为首次运行说明。
- [ ] 次日或注入前一日快照后：KPI 显示具体环比值与基准日期；简报显示“较昨日”或“对比 YYYY-MM-DD（N 天前）”。
- [ ] 修改任一撮合阶段后刷新页面，阶段保持不变；当天的快照被更新。
- [ ] 信用评估、报价草稿、单证检查可保存并在对应模块回显。
- [ ] 未处理的建议行：停留 ≥ 7 天的行出现在“撮合建议已 N 天未处理”待办，并计入管道看板滞留数。
- [ ] 六个模块的加载态、空态、错误态（断网/存储损坏）均有明确文案与重试入口。
- [ ] 中英切换后，所有模块标题、字段、按钮、空态与错误提示均完整翻译，无缺失 Key。
- [ ] 未配置远程端点时功能完整；配置错误端点时出现降级提示，且页面不崩。

### 3.3 浏览器与可访问性

本次已在真实 Chrome 中完成明暗两套主题、桌面与窄屏检查：

| 视口 | 检查结果 |
| --- | --- |
| 1440 × 1000（桌面，深色） | 指挥中心 + 六个模块全部打开；文本对比度、玻璃卡片边界、KPI 迷你图、评分环、图表坐标轴均清晰；无控制台错误 |
| 1440 × 1000（桌面，浅色） | 同上；修正了浅色模式下小号说明文字与状态徽标的对比度 |
| 390 × 844（窄屏，深色/浅色） | 七个页面均无横向溢出；单列布局、筛选项与看板可读 |
| 主题切换 | 切换后 `html.dark` 与 `localStorage` 同步更新；刷新后保持；再次切换可恢复 |

- [ ] 浏览器控制台无 error（允许第三方字体/统计脚本的已知告警，但需在发布记录中列明）。
- [ ] 深色模式下：卡片边框、输入框边框、分隔线可见；空管道列不再呈现为纯黑空洞。
- [ ] 浅色模式下：10px 以下说明文字、琥珀/玫红/翡翠状态徽标达到可读对比度。
- [ ] 评分环、Sparkline、Recharts 坐标轴/网格线在两种主题下均可辨认。
- [ ] 键盘可达：主题切换、语言切换、模块 Tab、待办按钮均可聚焦与触发。

### 3.4 安全与数据

- [ ] 上线路由全部位于 `AuthRequired` 内；确认仓库中不存在临时免登录路由（全局搜索 `/qa` 无结果）。
- [ ] 未在客户端写入任何服务端密钥；`VITE_*` 变量仅包含公开配置。
- [ ] 远程端点使用 HTTPS；转发给端点的输入不含不必要的个人敏感信息。
- [ ] `localStorage` 仅存业务工作区与主题/语言偏好；确认没有把访问令牌写入 Trade 相关 Key。
- [ ] 跨标签页同步生效：在两个标签页修改阶段，另一个标签页通过 `storage` 事件更新。
- [ ] 存储损坏时展示可恢复错误（`TRADE_WORKSPACE_CORRUPTED`），用户可重置工作区。

---

## 4. 环境变量

| 变量 | 何时需要 | 示例 | 说明 |
| --- | --- | --- | --- |
| `PORT` | 构建 / 预览 / 开发 | `4173` | `vite.config.ts` 强制要求；构建时不会真正监听端口 |
| `BASE_PATH` | 构建 / 开发 | `/` 或 `/app/` | 部署在子路径时必须与真实路径一致；React Router 使用它作为 basename |
| `VITE_TRADE_AI_ENDPOINT` | 可选 | `https://ai.example.com/trade` | 不配置则使用确定性本地引擎；配置后启用远程模型与自动降级 |
| Replit Auth 相关变量 | 由托管环境注入 | — | 沿用现有 `@workspace/replit-auth-web` 配置，本模块不新增认证变量 |

远程端点契约：

```http
POST {VITE_TRADE_AI_ENDPOINT}/credit
Content-Type: application/json

{ "input": { /* CreditInput */ } }
```

其余任务为 `shipping`、`documents`、`quote`，请求体结构相同。响应必须是模块对应的完整对象；否则按降级处理。

---

## 5. 构建与部署

### 5.1 构建产物

```bash
cd artifacts/imported-app
PORT=4173 BASE_PATH=/ pnpm build
```

产物目录：`artifacts/imported-app/dist/public/`

发布前确认：

- [ ] `index.html` 中的资源前缀与 `BASE_PATH` 一致。
- [ ] `assets/` 下存在带内容哈希的 JS/CSS 文件。
- [ ] 路由懒加载 chunk 存在（如 `TradeCommandCenter-*.js`、`MatchingPage-*.js`、`TradeCharts-*.js`）。
- [ ] 构建日志无 error；仅有“chunk > 500 kB”的提示，属已知告警。

### 5.2 静态托管要求

1. **SPA 回退**：所有未知路径回退到 `index.html`，否则刷新 `/dashboard/trade-intelligence/matching` 会 404。
2. **缓存策略**：
   - `index.html`：`Cache-Control: no-cache`（确保发布后立即拿到新入口）。
   - `/assets/*`：`Cache-Control: public, max-age=31536000, immutable`（文件名带哈希）。
3. **子路径部署**：若挂在 `/console/` 下，构建时使用 `BASE_PATH=/console/`，并确保反向代理把 `/console/*` 指到同一 `index.html`。

Nginx 示例（仅作参考）：

```nginx
location / {
  root /srv/xisync/dist/public;
  try_files $uri $uri/ /index.html;
}

location /assets/ {
  root /srv/xisync/dist/public;
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 5.3 Replit / 现有托管环境

- 构建命令使用项目脚本，额外注入 `PORT` 与 `BASE_PATH`。
- 生产预览：`PORT=<托管端口> BASE_PATH=/ pnpm serve`（`vite preview`），或由平台的静态托管直接指向 `dist/public`。
- 不要把生产服务配置到 `5173`；该端口属于当前开发会话。
- 认证依赖 Replit 登录态；发布环境需保持与现有控制台一致的登录配置。

### 5.4 发布步骤

1. 冻结发布分支，确认工作区无未审阅改动。
2. 在干净环境执行 `pnpm install --frozen-lockfile`。
3. 依次执行 typecheck、test、build，三项全绿后保留构建日志。
4. 归档上一版 `dist/public`（回滚用）。
5. 上传/发布新 `dist/public`，保持 SPA 回退与缓存策略。
6. 执行第 6 节冒烟测试，记录结果。
7. 通知业务方：首次访问会建立当日基线，次日开始出现日环比。

---

## 6. 发布后冒烟测试（约 10 分钟）

| # | 操作 | 期望结果 |
| --- | --- | --- |
| 1 | 未登录访问 `/dashboard/trade-intelligence` | 跳转登录页，登录后回到目标页 |
| 2 | 打开 `/dashboard` | 指挥中心加载，无白屏、无控制台 error |
| 3 | 查看每日简报首行 | 新工作区显示“首次运行 / 尚无前一日快照”；已有快照显示“较昨日”或“对比某日（N 天前）” |
| 4 | 查看 KPI 卡片 | 有前一日快照时显示环比百分比与基准日期；无快照时显示“建立基准” |
| 5 | 在智能撮合把一条建议推进到“入围” | 成功；刷新后仍为“入围”；管道看板计数更新 |
| 6 | 完成一次信用评估与一次单证检查 | 结果保存；对应模块回显最近记录 |
| 7 | 切换深色/浅色主题并刷新 | 主题保持；文字、图表、评分环清晰 |
| 8 | 窄屏（≈390px）打开指挥中心与撮合页 | 无横向滚动；卡片单列；操作按钮可点 |
| 9 | 检查 `localStorage` | 存在 `xisync:trade-intelligence:v1:demo-workspace`，其中 `snapshots` 仅保留最近 45 天 |
| 10 | 配置错误远程端点后执行一次评估 | 出现降级提示，结果仍由本地引擎返回，页面不崩 |

> 若第 3/4 项在已有工作区中仍显示“首次运行”，说明 `snapshots` 未写入：检查浏览器是否禁用了 `localStorage`，以及控制台是否出现 `TRADE_WORKSPACE_WRITE_FAILED`。

---

## 7. 数据、保留与迁移

| 项目 | 行为 |
| --- | --- |
| 存储 Key | `xisync:trade-intelligence:v1:<tenantId>` |
| 默认租户 | `demo-workspace` |
| 工作区版本 | `version: 1`；读取时做结构归一化，未知字段被忽略 |
| 列表上限 | 评估 / 报价 / 单证各保留最近 25 条 |
| 快照上限 | 最近 45 个自然日，每天最多 1 条，同日覆盖 |
| 快照触发 | 应用打开、撮合阶段变更、保存评估/报价/单证、重置工作区 |
| 首次运行 | 无前一日快照：KPI 环比为 `null`，界面显示“建立基准”；当天快照即为后续基准 |
| 跨设备 | 不支持；数据仅存在于当前浏览器与租户 |
| 清空数据 | 调用 `resetWorkspace()` 或删除对应 `localStorage` Key；主题 Key 为 `xisync-theme` |
| 旧版本兼容 | 缺少 `snapshots` 的旧数据按空数组读取，首次打开后自动补写当天快照 |

本模块没有数据库迁移、没有后端 schema 变更。回滚应用版本不会破坏已有本地数据；向前兼容由 `version` 与 `normalizeState` 保证。

---

## 8. 监控与告警建议

上线后重点观察：

1. **前端错误率**：按路由统计 `pageerror` 与 `console.error`，尤其关注 `TradeCommandCenter` 与 `TradeCharts`。
2. **存储写入失败**：捕获 `TRADE_WORKSPACE_WRITE_FAILED`（配额不足、隐私模式）。
3. **远程模型降级率**：统计 `model_endpoint_unavailable` 出现频率；持续偏高时检查端点延迟（阈值 2.5 秒）与响应结构。
4. **首日基线比例**：新租户首日出现“建立基准”属正常；若老租户持续出现，说明快照未落盘。
5. **包体积告警**：入口 chunk 已接近 500 kB 提示线；后续新增重型依赖时优先按路由拆分。

---

## 9. 回滚方案

1. 静态资源回滚：将上一版 `dist/public` 重新发布，保持相同 `BASE_PATH`。
2. 无需回滚数据库或本地数据；`version: 1` 结构向后兼容。
3. 若新版本读取旧 `localStorage` 异常，优先发布修复而不是清除用户数据；确需清除时仅删除 `xisync:trade-intelligence:v1:*`，不要动 `xisync-theme` 与其他业务 Key。
4. 回滚后执行第 6 节第 1、2、5、7 项，确认登录、指挥中心、撮合持久化与主题正常。

---

## 10. 已知限制与后续项

- **本地持久化**：工作区与快照存于浏览器，不支持多设备同步或团队共享。若上线后需要多人协作，应将 `TradeWorkspaceRepository` 的实现替换为后端 API，页面与聚合逻辑无需重写。
- **快照只在打开/变更时写入**：用户整天未打开应用时不会生成当天记录；次日读取会回退到最近一个更早的快照，并在简报中标注间隔天数。
- **KPI 日环比的数据源**：营收与订单量当前来自月度种子数据，日环比在数据未变化时为 0%；接入真实订单流后才会出现有意义的日波动。
- **建议年龄为种子值**：未处理撮合的建议年龄来自确定性种子（0–18 天），用于演示滞留识别；接入真实撮合时间后应改为首次出现时间。
- **构建体积**：入口 chunk 约 515 kB，构建会提示超过 500 kB；Trade 页面已懒加载，后续可通过 `manualChunks` 进一步拆分 Recharts。
- **主题首帧**：主题在 React 挂载后应用到 `<html>`，极慢设备上可能出现一次浅色闪帧；如需彻底消除，可在 `index.html` 内联首屏主题脚本。

---

## 11. 发布记录模板

| 字段 | 填写 |
| --- | --- |
| 发布版本 / Commit | |
| 发布日期与窗口 | |
| 构建环境（Node / pnpm） | |
| typecheck | 通过 / 失败 |
| 单元测试 | 通过数 / 总数 |
| 生产构建 | 通过 / 失败 |
| `BASE_PATH` | |
| 远程模型端点 | 未启用 / 已启用（地址） |
| 冒烟测试结果 | 通过项 / 总项 |
| 回滚包位置 | |
| 发布人 / 复核人 | |
| 遗留问题 | |
