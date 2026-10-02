import { ComplianceViolation } from '../../../types/mediaBuyer';

export interface PreFlightCheckResult {
  isPassed: boolean;
  score: number; // 0 - 100
  violations: ComplianceViolation[];
  cleanedHeadlineEn: string;
  cleanedDescriptionEn: string;
}

export class AdComplianceScreener {
  // Prohibited superlatives under Chinese Advertising Law & Global Ad Policies
  private static BANNED_SUPERLATIVES = [
    { regex: /\b(world'?s? best|no\.?\s?1|number one|top 1|cheapest in the world)\b/gi, suggestion: 'Industry-Leading ISO Certified Manufacturer' },
    { regex: /\b(100% guaranteed profit|risk[- ]free investment)\b/gi, suggestion: 'Verified OEM/ODM Wholesale Direct' },
    { regex: /\b(exclusive global monopoly|best in china|中国第一|全网最低)\b/gi, suggestion: 'Direct Factory Export Supplier' },
  ];

  // Protected third-party trademarks
  private static PROTECTED_TRADEMARKS = [
    { regex: /\b(nike|apple|disney|sony|lego|barbie|louis vuitton|gucci)\b/gi, rule: 'Third-Party Trademark Infringement' },
  ];

  /**
   * Evaluates ad headline, description, and copy before external API deployment.
   */
  public static evaluateAdCopy(
    headline: string,
    description: string,
    _landingPageUrl: string
  ): PreFlightCheckResult {
    const violations: ComplianceViolation[] = [];
    let cleanedHeadline = headline;
    let cleanedDescription = description;

    // 1. Check Superlatives in Headline
    for (const sup of this.BANNED_SUPERLATIVES) {
      if (sup.regex.test(headline)) {
        violations.push({
          field: 'headline',
          severity: 'CRITICAL',
          ruleViolated: 'Prohibited Absolute Superlative (Advertising Compliance Law)',
          originalText: headline,
          suggestedReplacement: headline.replace(sup.regex, sup.suggestion),
          reason: 'Meta and Google reject ads claiming unverified "No. 1" or "World\'s Best" titles.',
        });
        cleanedHeadline = headline.replace(sup.regex, sup.suggestion);
      }

      if (sup.regex.test(description)) {
        violations.push({
          field: 'description',
          severity: 'WARNING',
          ruleViolated: 'Prohibited Superlative Claim',
          originalText: description,
          suggestedReplacement: description.replace(sup.regex, sup.suggestion),
          reason: 'Use verified manufacturing capabilities instead of superlatives.',
        });
        cleanedDescription = description.replace(sup.regex, sup.suggestion);
      }
    }

    // 2. Check Trademarks
    for (const tm of this.PROTECTED_TRADEMARKS) {
      if (tm.regex.test(headline) || tm.regex.test(description)) {
        violations.push({
          field: 'headline',
          severity: 'CRITICAL',
          ruleViolated: tm.rule,
          originalText: headline,
          suggestedReplacement: 'Custom OEM Private Label',
          reason: 'Using branded trademarks triggers immediate account suspension on Google & Meta.',
        });
      }
    }

    const score = Math.max(0, 100 - violations.length * 25);
    const isPassed = violations.filter((v) => v.severity === 'CRITICAL').length === 0;

    return {
      isPassed,
      score,
      violations,
      cleanedHeadlineEn: cleanedHeadline,
      cleanedDescriptionEn: cleanedDescription,
    };
  }
}
