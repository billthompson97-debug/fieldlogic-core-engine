export interface OperationalNode {
  id: string;
  type:
    | 'job'
    | 'installer'
    | 'callback'
    | 'qa_event'
    | 'material_package'
    | 'scope'
    | 'risk_signal';
  label: string;
}

export interface OperationalEdge {
  from: string;
  to: string;
  relationship:
    | 'assigned_to'
    | 'triggered'
    | 'related_to'
    | 'caused'
    | 'depends_on'
    | 'resolved_by';
}

export interface OperationalGraph {
  nodes: OperationalNode[];
  edges: OperationalEdge[];
}

export function createOperationalGraph(): OperationalGraph {
  return {
    nodes: [],
    edges: []
  };
}

export function addNode(
  graph: OperationalGraph,
  node: OperationalNode
): OperationalGraph {
  graph.nodes.push(node);
  return graph;
}

export function addEdge(
  graph: OperationalGraph,
  edge: OperationalEdge
): OperationalGraph {
  graph.edges.push(edge);
  return graph;
}
