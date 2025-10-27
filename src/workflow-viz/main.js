import WorkflowViz from './WorkflowViz.svelte';

if (typeof window !== 'undefined' && !customElements.get('workflow-viz')) {
    customElements.define('workflow-viz', WorkflowViz);
}

export default WorkflowViz;
