import type { LineageRecord } from './lineage-record';

export interface LineageAnalysis {
  rootEventId: string;
  affectedEventCount: number;
  probableImpactAreas: string[];
}

export class LineageEngine {
  analyze(records: LineageRecord[], rootEventId: string): LineageAnalysis {
    const related = records.filter(
      record =>
        record.eventId === rootEventId ||
        record.upstreamEventIds.includes(rootEventId)
    );

    const probableImpactAreas = new Set<string>();

    related.forEach(record => {
      if (record.eventType.includes('callback')) {
        probableImpactAreas.add('warranty');
      }

      if (record.eventType.includes('labor')) {
        probableImpactAreas.add('productivity');
      }

      if (record.eventType.includes('qa')) {
        probableImpactAreas.add('quality');
      }

      if (record.eventType.includes('scope')) {
        probableImpactAreas.add('scope_accuracy');
      }
    });

    return {
      rootEventId,
      affectedEventCount: related.length,
      probableImpactAreas: Array.from(probableImpactAreas)
    };
  }
}
