export interface OperationalAgent {
  name: string;
  category: string;
  evaluate(context: Record<string, unknown>): {
    status: string;
    actions: string[];
  };
}

export interface AgentRuntimeResult {
  executedAgents: string[];
  recommendedActions: string[];
}

export function runOperationalAgents(
  agents: OperationalAgent[],
  context: Record<string, unknown>
): AgentRuntimeResult {
  const executedAgents: string[] = [];
  const recommendedActions: string[] = [];

  agents.forEach(agent => {
    const result = agent.evaluate(context);

    executedAgents.push(agent.name);
    recommendedActions.push(...result.actions);
  });

  return {
    executedAgents,
    recommendedActions: [...new Set(recommendedActions)]
  };
}
