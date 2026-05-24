export interface InterventionSignal {
  category: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface InterventionPriority {
  category: string;
  operationalPriority: 'normal' | 'elevated' | 'critical';
  recommendedOwner: string;
}

export function prioritizeOperationalInterventions(
  signals: InterventionSignal[]
): InterventionPriority[] {
  return signals.map(signal => {
    const operationalPriority =
      signal.severity === 'high'
        ? 'critical'
        : signal.severity === 'moderate'
        ? 'elevated'
        : 'normal';

    const recommendedOwner =
      signal.category === 'qa'
        ? 'production_manager'
        : signal.category === 'callback'
        ? 'service_department'
        : signal.category === 'margin'
        ? 'operations'
        : 'leadership';

    return {
      category: signal.category,
      operationalPriority,
      recommendedOwner
    };
  });
}
