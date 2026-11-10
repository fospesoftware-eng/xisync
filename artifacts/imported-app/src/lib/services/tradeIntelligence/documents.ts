import type {
  DocumentCheckInput,
  DocumentCheckIssue,
  DocumentCheckResult,
  DocumentStatus,
} from '../../../types/tradeIntelligence.ts';
import { MARKET_REQUIREMENTS } from './dataset.ts';

const CRITICAL_DOCUMENTS = new Set([
  'commercial_invoice',
  'packing_list',
  'bill_of_lading',
  'certificate_of_origin',
  'customs_declaration',
]);

const STATUS_WEIGHT: Record<DocumentStatus, number> = {
  complete: 1,
  expiring: 0.5,
  missing: 0,
  not_applicable: 0,
};

export function checkDocuments(input: DocumentCheckInput): DocumentCheckResult {
  const required = MARKET_REQUIREMENTS[input.market];
  const items = required.map((key) => ({
    key,
    status: (input.documents[key] ?? 'missing') as DocumentStatus,
  }));
  const applicable = items.filter((item) => item.status !== 'not_applicable');
  const readinessPct =
    applicable.length === 0
      ? 0
      : Math.round(
          (applicable.reduce((sum, item) => sum + STATUS_WEIGHT[item.status], 0) / applicable.length) * 100,
        );

  const issues: DocumentCheckIssue[] = [];
  for (const item of items) {
    if (item.status === 'not_applicable') continue;
    if (item.status === 'missing') {
      issues.push({ key: item.key, severity: CRITICAL_DOCUMENTS.has(item.key) ? 'critical' : 'warning' });
    } else if (item.status === 'expiring') {
      issues.push({ key: item.key, severity: 'warning' });
    }
  }

  const missingCritical = issues.filter((issue) => issue.severity === 'critical').length;
  const verdict =
    readinessPct >= 90 && missingCritical === 0
      ? 'ready'
      : readinessPct >= 65 && missingCritical <= 1
        ? 'conditional'
        : 'blocked';

  const hsValid = /^\d{4}\.\d{2}$/.test(input.hsCode.trim());
  if (!hsValid) {
    issues.push({ key: 'hsCodeFormat', severity: 'warning' });
  }

  const missingCount = items.filter((item) => item.status === 'missing').length;
  const expiringCount = items.filter((item) => item.status === 'expiring').length;
  const summary =
    verdict === 'ready'
      ? {
          en: `${input.productName} is documentation-ready for ${input.market.toUpperCase()} shipment.`,
          zh: `${input.productName} 已具备发往 ${input.market.toUpperCase()} 市场的单证条件。`,
        }
      : verdict === 'conditional'
        ? {
            en: `${missingCount} document(s) missing and ${expiringCount} expiring. Clear the flagged items before booking.`,
            zh: `缺少 ${missingCount} 份单证，${expiringCount} 份即将到期。订舱前请处理标记事项。`,
          }
        : {
            en: `Shipment is blocked: ${missingCritical} critical document(s) missing. Resolve before customs filing.`,
            zh: `暂不可出运：缺少 ${missingCritical} 份关键单证，请在报关前补齐。`,
          };

  return {
    readinessPct,
    verdict,
    items,
    issues,
    summary,
    generatedAt: new Date().toISOString(),
  };
}
