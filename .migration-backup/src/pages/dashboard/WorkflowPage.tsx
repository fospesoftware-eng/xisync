import { VisualWorkflowBuilder } from '../../components/workflow/VisualWorkflowBuilder';

export function WorkflowPage() {
  return (
    <div className="space-y-6 text-slate-900 dark:text-white bg-slate-50/60 dark:bg-transparent p-2 md:p-4 rounded-3xl min-h-screen">
      <VisualWorkflowBuilder />
    </div>
  );
}
