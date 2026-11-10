import type { Buyer, Lane, OrderAnomaly, OrderRecord, TradeAlert } from '../../../types/tradeIntelligence.ts';
import { BUYERS, LANES, ORDERS } from './dataset.ts';

const SEVERITY_WEIGHT = { critical: 3, warning: 2, info: 1 } as const;

export function buildTradeAlerts(
  buyers: Buyer[] = BUYERS,
  lanes: Lane[] = LANES,
  orders: OrderRecord[] = ORDERS,
): TradeAlert[] {
  const alerts: TradeAlert[] = [];

  for (const buyer of buyers) {
    if (buyer.sanctionsFlag) {
      alerts.push({
        id: `sanctions-${buyer.id}`,
        severity: 'critical',
        category: 'risk',
        title: { en: `Sanctions match: ${buyer.name.en}`, zh: `制裁名单命中：${buyer.name.zh}` },
        detail: {
          en: 'Screening returned a potential match. Do not book freight or release documents until compliance clears the party.',
          zh: '筛查发现潜在命中。在合规团队放行前，请勿订舱或放行单证。',
        },
        action: { en: 'Escalate to compliance', zh: '提交合规复核' },
      });
    } else if (buyer.countryRiskScore < 55) {
      alerts.push({
        id: `country-${buyer.id}`,
        severity: 'critical',
        category: 'credit',
        title: { en: `Elevated country risk: ${buyer.name.en}`, zh: `国别风险偏高：${buyer.name.zh}` },
        detail: {
          en: `${buyer.country.en} scores ${buyer.countryRiskScore}/100 on country risk. Require secured payment terms or insurance cover.`,
          zh: `${buyer.country.zh} 国别风险评分 ${buyer.countryRiskScore}/100，建议采用担保付款条件或投保。`,
        },
        action: { en: 'Review credit terms', zh: '复核授信条件' },
      });
    }

    const ratio = buyer.orderValueUsd / Math.max(1, buyer.insuredLimitUsd);
    if (ratio > 1.15) {
      alerts.push({
        id: `limit-${buyer.id}`,
        severity: 'warning',
        category: 'credit',
        title: { en: `Insured limit exceeded: ${buyer.name.en}`, zh: `超出投保限额：${buyer.name.zh}` },
        detail: {
          en: `Exposure is ${ratio.toFixed(2)}x the insured limit. Increase the declared limit or split the shipment.`,
          zh: `风险敞口达到投保限额的 ${ratio.toFixed(2)} 倍，请提高申报限额或分批发运。`,
        },
        action: { en: 'Adjust insured limit', zh: '调整投保限额' },
      });
    }

    if (buyer.documentsCompletePct < 70) {
      alerts.push({
        id: `docs-${buyer.id}`,
        severity: 'warning',
        category: 'risk',
        title: { en: `Documentation gap: ${buyer.name.en}`, zh: `单证缺口：${buyer.name.zh}` },
        detail: {
          en: `Only ${buyer.documentsCompletePct}% of required documents are on file. Customs holds are likely.`,
          zh: `必备单证完整度仅 ${buyer.documentsCompletePct}%，存在海关扣关风险。`,
        },
        action: { en: 'Open document check', zh: '打开单证检查' },
      });
    }
  }

  for (const lane of lanes) {
    if (lane.congestion === 'high') {
      alerts.push({
        id: `congestion-${lane.id}`,
        severity: 'warning',
        category: 'logistics',
        title: {
          en: `Port congestion: ${lane.destination.en}`,
          zh: `港口拥堵：${lane.destination.zh}`,
        },
        detail: {
          en: `${lane.carrier} reports high congestion on ${lane.origin.en} → ${lane.destination.en}; on-time performance is ${Math.round(lane.onTimePct * 100)}%.`,
          zh: `${lane.carrier} 报告 ${lane.origin.zh} → ${lane.destination.zh} 航线拥堵严重，准班率 ${Math.round(lane.onTimePct * 100)}%。`,
        },
        action: { en: 'Compare alternatives', zh: '比较替代方案' },
      });
    }
  }

  const exceptions = orders.filter((order) => order.status === 'exception');
  if (exceptions.length > 0) {
    alerts.push({
      id: 'order-exceptions',
      severity: 'warning',
      category: 'logistics',
      title: { en: `${exceptions.length} shipment exception(s) open`, zh: `${exceptions.length} 票在途异常未关闭` },
      detail: {
        en: 'Exceptions are concentrated on higher-value shipments. Review the anomaly feed before the next carrier cut-off.',
        zh: '异常集中在高货值订单上，请在下一航次截关前查看异常清单。',
      },
      action: { en: 'Review orders', zh: '查看订单' },
    });
  }

  alerts.push({
    id: 'tariff-us-301',
    severity: 'info',
    category: 'tariff',
    title: { en: 'US Section 301: LED lighting review', zh: '美国 301 关税：LED 照明复审' },
    detail: {
      en: 'HTS 9405.42 remains in the Section 301 review list. Build a landed-cost buffer of 7.5% into US quotes.',
      zh: 'HTS 9405.42 仍在 301 复审清单内，建议美国报价预留 7.5% 到岸成本缓冲。',
    },
    action: { en: 'Update quote buffer', zh: '更新报价缓冲' },
  });

  alerts.push({
    id: 'tariff-eu-cbam',
    severity: 'info',
    category: 'tariff',
    title: { en: 'EU CBAM reporting window opens', zh: '欧盟 CBAM 报告窗口开启' },
    detail: {
      en: 'Industrial part exports to the EU need embedded-emissions data attached to the commercial invoice.',
      zh: '工业部件出口欧盟需在商业发票中附随隐含排放数据。',
    },
    action: { en: 'Collect emissions data', zh: '收集排放数据' },
  });

  return alerts.sort((a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const LANE_CONGESTION_DAYS = { low: 0, medium: 1, high: 3 } as const;

export function detectOrderAnomalies(
  orders: OrderRecord[] = ORDERS,
  buyers: Buyer[] = BUYERS,
  lanes: Lane[] = LANES,
): OrderAnomaly[] {
  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));
  const buyerAverage = new Map(
    buyers.map((buyer) => {
      const values = orders.filter((order) => order.buyerId === buyer.id).map((order) => order.valueUsd);
      return [buyer.id, average(values)] as const;
    }),
  );
  const laneAverageMargin = new Map(
    lanes.map((lane) => {
      const margins = orders.filter((order) => order.laneId === lane.id).map((order) => order.marginPct);
      return [lane.id, average(margins)] as const;
    }),
  );
  const mainLaneByBuyer = new Map<string, string>();
  for (const buyer of buyers) {
    const counts = new Map<string, number>();
    for (const order of orders.filter((item) => item.buyerId === buyer.id)) {
      counts.set(order.laneId, (counts.get(order.laneId) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) mainLaneByBuyer.set(buyer.id, top[0]);
  }

  const anomalies: OrderAnomaly[] = [];

  for (const order of orders) {
    const buyer = buyerById.get(order.buyerId);
    if (!buyer) continue;
    const avg = buyerAverage.get(order.buyerId) ?? order.valueUsd;
    const laneMargin = laneAverageMargin.get(order.laneId) ?? order.marginPct;
    const candidates: { key: string; score: number; detail: { en: string; zh: string } }[] = [];

    if (order.valueUsd > buyer.insuredLimitUsd * 1.1 && order.status !== 'delivered') {
      candidates.push({
        key: 'over_limit',
        score: Math.min(96, 62 + (order.valueUsd / buyer.insuredLimitUsd - 1) * 60),
        detail: {
          en: `Open exposure USD ${order.valueUsd.toLocaleString('en-US')} exceeds the insured limit by ${Math.round(
            (order.valueUsd / buyer.insuredLimitUsd - 1) * 100,
          )}%.`,
          zh: `在途敞口 USD ${order.valueUsd.toLocaleString('en-US')} 超投保限额 ${Math.round(
            (order.valueUsd / buyer.insuredLimitUsd - 1) * 100,
          )}%。`,
        },
      });
    }

    if (avg > 0 && order.valueUsd > avg * 1.7) {
      candidates.push({
        key: 'value_spike',
        score: Math.min(92, 48 + (order.valueUsd / avg - 1) * 32),
        detail: {
          en: `Order value is ${(order.valueUsd / avg).toFixed(1)}x this buyer's average (USD ${Math.round(
            avg,
          ).toLocaleString('en-US')}).`,
          zh: `订单货值为该买家平均值的 ${(order.valueUsd / avg).toFixed(1)} 倍（均值 USD ${Math.round(
            avg,
          ).toLocaleString('en-US')}）。`,
        },
      });
    }

    if (order.marginPct < laneMargin - 6) {
      candidates.push({
        key: 'margin_outlier',
        score: Math.min(88, 46 + (laneMargin - order.marginPct) * 3),
        detail: {
          en: `Margin ${order.marginPct}% is ${(laneMargin - order.marginPct).toFixed(1)} points below the lane average of ${laneMargin.toFixed(1)}%.`,
          zh: `利润率 ${order.marginPct}% 低于该航线均值 ${laneMargin.toFixed(1)}% 达 ${(laneMargin - order.marginPct).toFixed(1)} 个百分点。`,
        },
      });
    }

    if (order.status === 'exception') {
      candidates.push({
        key: 'exception_exposure',
        score: 70,
        detail: {
          en: 'Shipment is in exception status with open commercial value at risk.',
          zh: '该票处于异常状态，尚有商业货值处于风险中。',
        },
      });
    } else if (!order.onTime && order.valueUsd > 200000) {
      candidates.push({
        key: 'late_pattern',
        score: 55,
        detail: {
          en: `High-value shipment missed its promised transit window for ${buyer.name.en}.`,
          zh: `${buyer.name.zh} 的高货值订单未达到承诺运输时效。`,
        },
      });
    }

    const mainLane = mainLaneByBuyer.get(order.buyerId);
    if (mainLane && mainLane !== order.laneId && order.valueUsd > 100000) {
      candidates.push({
        key: 'route_deviation',
        score: 44,
        detail: {
          en: 'Order is routed away from the buyer’s usual lane; confirm freight terms and responsibility.',
          zh: '订单偏离该买家常用航线，请确认运费条款与责任划分。',
        },
      });
    }

    if (candidates.length === 0) continue;
    const selected = candidates.reduce((best, current) => (current.score > best.score ? current : best));
    anomalies.push({
      orderId: order.id,
      score: Math.round(selected.score),
      reasonKey: selected.key,
      detail: selected.detail,
    });
  }

  return anomalies.sort((a, b) => b.score - a.score).slice(0, 6);
}

export function laneTransitDays(lane: Lane): number {
  return lane.transitBaseDays + LANE_CONGESTION_DAYS[lane.congestion];
}
