import type { MatchStage, MatchWorkflow } from '../../../types/tradeIntelligence.ts';

export const MATCH_STAGES: MatchStage[] = [
  'suggested',
  'shortlisted',
  'contacted',
  'negotiating',
  'won',
  'lost',
];

export const ACTIVE_STAGES: MatchStage[] = [
  'suggested',
  'shortlisted',
  'contacted',
  'negotiating',
];

export const ALLOWED_TRANSITIONS: Record<MatchStage, MatchStage[]> = {
  suggested: ['shortlisted', 'lost'],
  shortlisted: ['contacted', 'suggested', 'lost'],
  contacted: ['negotiating', 'shortlisted', 'lost'],
  negotiating: ['won', 'lost', 'contacted'],
  won: [],
  lost: ['suggested'],
};

export function canTransition(from: MatchStage, to: MatchStage): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function createWorkflow(at = new Date().toISOString()): MatchWorkflow {
  return {
    stage: 'suggested',
    updatedAt: at,
    history: [{ stage: 'suggested', at }],
  };
}

/**
 * Returns a new workflow when the transition is legal, otherwise null.
 * Persisted state is always built from this pure function.
 */
export function transitionWorkflow(
  current: MatchWorkflow,
  next: MatchStage,
  at = new Date().toISOString(),
): MatchWorkflow | null {
  if (!canTransition(current.stage, next)) return null;
  return {
    stage: next,
    updatedAt: at,
    history: [...current.history, { stage: next, at }],
  };
}

export function workflowFor(
  workflows: Record<string, MatchWorkflow>,
  id: string,
): MatchWorkflow {
  return workflows[id] ?? createWorkflow();
}

export function isActiveStage(stage: MatchStage): boolean {
  return ACTIVE_STAGES.includes(stage);
}

export function nextStages(stage: MatchStage): MatchStage[] {
  return ALLOWED_TRANSITIONS[stage];
}
