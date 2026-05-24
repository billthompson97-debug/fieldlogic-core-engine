export interface AgentSignal {
  sourceAgent: string;
  category: string;
  severity: 'low' | 'moderate' | 'high';
  message: string;
}

export interface CoordinatedAction {
  responsibleAgent: string;
  action: string;
  priority: 'normal' | 'elevated' | 'critical';
}

export interface CollaborationRuntimeResult {
  sharedSignals: AgentSignal[];
  coordinatedActions: CoordinatedAction[];
}

export function coordinateOperationalAgents(
  signals: AgentSignal[]
): CollaborationRuntimeResult {
  const coordinatedActions: CoordinatedAction[] = [];

  signals.forEach(signal => {
    if (signal.category === 'qa') {
      coordinatedActions.push({
        responsibleAgent: 'production_agent',
        action: 'Review QA remediation workflow',
        priority: signal.severity === 'high' ? 'critical' : 'elevated'
      });
    }

    if (signal.category === 'callback') {
      coordinatedActions.push({
        responsibleAgent: 'coaching_agent',
        action: 'Review installer callback patterns',
        priority: signal.severity === 'high' ? 'critical' : 'elevated'
      });
    }

    if (signal.category === 'margin') {
      coordinatedActions.push({
        responsibleAgent: 'operations_agent',
        action: 'Review labor and material variance drivers',
        priority: signal.severity === 'high' ? 'critical' : 'normal'
      });
    }
  });

  return {
    sharedSignals: signals,
    coordinatedActions
  };
}
