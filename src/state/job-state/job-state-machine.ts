export type JobLifecycleState =
  | 'lead_created'
  | 'demo_scheduled'
  | 'scope_finalized'
  | 'materials_ordered'
  | 'installation_active'
  | 'qa_review'
  | 'completed'
  | 'callback_opened';

export interface JobStateSnapshot {
  jobId: string;
  currentState: JobLifecycleState;
  updatedAt: string;
  healthScore?: number;
  activeRisks: string[];
  activeAlerts: string[];
}

export class JobStateMachine {
  private state: JobStateSnapshot;

  constructor(jobId: string) {
    this.state = {
      jobId,
      currentState: 'lead_created',
      updatedAt: new Date().toISOString(),
      activeRisks: [],
      activeAlerts: []
    };
  }

  transition(nextState: JobLifecycleState): JobStateSnapshot {
    this.state.currentState = nextState;
    this.state.updatedAt = new Date().toISOString();

    return this.state;
  }

  updateHealth(score: number): JobStateSnapshot {
    this.state.healthScore = score;
    this.state.updatedAt = new Date().toISOString();

    if (score < 70) {
      this.state.activeAlerts.push('Operational health below threshold');
    }

    return this.state;
  }

  addRisk(risk: string): JobStateSnapshot {
    if (!this.state.activeRisks.includes(risk)) {
      this.state.activeRisks.push(risk);
    }

    this.state.updatedAt = new Date().toISOString();

    return this.state;
  }

  snapshot(): JobStateSnapshot {
    return this.state;
  }
}
