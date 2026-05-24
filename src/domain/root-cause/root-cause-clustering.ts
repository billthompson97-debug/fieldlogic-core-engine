export interface RootCauseEvent {
  eventId: string;
  category: string;
  subcategory?: string;
  installerId?: string;
  scopeType?: string;
  occurredAt: string;
}

export interface RootCauseCluster {
  category: string;
  frequency: number;
  relatedInstallers: string[];
  relatedScopeTypes: string[];
}

export function clusterRootCauseEvents(
  events: RootCauseEvent[]
): RootCauseCluster[] {
  const grouped = new Map<string, RootCauseEvent[]>();

  events.forEach(event => {
    const existing = grouped.get(event.category) ?? [];
    existing.push(event);
    grouped.set(event.category, existing);
  });

  return Array.from(grouped.entries()).map(([category, groupedEvents]) => ({
    category,
    frequency: groupedEvents.length,
    relatedInstallers: [
      ...new Set(groupedEvents.map(event => event.installerId).filter(Boolean))
    ] as string[],
    relatedScopeTypes: [
      ...new Set(groupedEvents.map(event => event.scopeType).filter(Boolean))
    ] as string[]
  }));
}
