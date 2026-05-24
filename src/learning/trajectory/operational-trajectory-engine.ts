export interface OperationalStatePoint {
  timestamp: string;
  healthScore: number;
}

export interface OperationalTrajectoryResult {
  trajectory: 'stabilizing' | 'deteriorating' | 'recovering' | 'volatile';
  explanation: string;
}

export function analyzeOperationalTrajectory(
  states: OperationalStatePoint[]
): OperationalTrajectoryResult {
  const scores = states.map(state => state.healthScore);

  const first = scores[0];
  const last = scores[scores.length - 1];

  if (last > first + 10) {
    return {
      trajectory: 'recovering',
      explanation: 'Operational health improving over time'
    };
  }

  if (last < first - 10) {
    return {
      trajectory: 'deteriorating',
      explanation: 'Operational health declining over time'
    };
  }

  const volatility = Math.max(...scores) - Math.min(...scores);

  if (volatility > 20) {
    return {
      trajectory: 'volatile',
      explanation: 'Operational health fluctuating significantly'
    };
  }

  return {
    trajectory: 'stabilizing',
    explanation: 'Operational health remaining relatively stable'
  };
}
