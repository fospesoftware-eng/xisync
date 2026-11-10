import type { Incoterm, QuoteDraft, QuoteInput } from '../../../types/tradeIntelligence.ts';

const FREIGHT_RATE: Record<Incoterm, number> = {
  EXW: 0,
  FOB: 0.012,
  CFR: 0.045,
  CIF: 0.05,
  DDP: 0.085,
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function stableHash(value: string): string {
  let hash = 17;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 65536;
  }
  return hash.toString(16).toUpperCase().padStart(4, '0');
}

export function draftQuote(input: QuoteInput): QuoteDraft {
  const quantity = Math.max(1, Math.round(input.quantity));
  const unitPrice = Math.max(0, input.unitPriceUsd);
  const subtotal = roundMoney(quantity * unitPrice);
  const freight = roundMoney(subtotal * FREIGHT_RATE[input.incoterm]);
  const insurance =
    input.incoterm === 'CIF' || input.incoterm === 'DDP'
      ? roundMoney((subtotal + freight) * 0.0045)
      : 0;
  const total = roundMoney(subtotal + freight + insurance);
  const reference = `Q-${new Date().toISOString().slice(2, 7).replace('-', '')}-${stableHash(
    `${input.buyerName}|${input.productName}|${quantity}|${unitPrice}|${input.incoterm}`,
  )}`;

  const lines = [
    { key: 'quantity', value: quantity.toLocaleString('en-US') },
    { key: 'unitPrice', value: `USD ${unitPrice.toFixed(2)}` },
    { key: 'incoterm', value: input.incoterm },
    { key: 'leadTime', value: `${Math.max(1, Math.round(input.leadTimeDays))} days` },
    { key: 'paymentTerms', value: input.paymentTerms },
    { key: 'validity', value: `${Math.max(1, Math.round(input.validityDays))} days` },
  ];

  return {
    reference,
    subtotalUsd: subtotal,
    freightUsd: freight,
    insuranceUsd: insurance,
    totalUsd: total,
    lines,
    summary: {
      en: `Quotation ${reference} for ${input.buyerName}: ${quantity.toLocaleString('en-US')} units of ${input.productName} at USD ${unitPrice.toFixed(2)} ${input.incoterm}, total USD ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      zh: `报价单 ${reference} 致 ${input.buyerName}：${input.productName} 共 ${quantity.toLocaleString('en-US')} 件，单价 USD ${unitPrice.toFixed(2)}，${input.incoterm} 条款，合计 USD ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}。`,
    },
    generatedAt: new Date().toISOString(),
  };
}
