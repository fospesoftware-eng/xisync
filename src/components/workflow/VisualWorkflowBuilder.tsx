import { useState } from 'react';
import {
  UserCheck,
  Bot,
  Factory,
  ShieldCheck,
  Ship,
  FileText,
  CheckCircle2,
  Play,
  Settings2,
  ToggleLeft,
  ToggleRight,
  Sliders,
  ArrowRight,
  X,
} from 'lucide-react';
import { useCurrency } from '../../lib/currency-context';

interface WorkflowStep {
  id: string;
  stage: string;
  title: string;
  actor: 'customer' | 'manufacturer' | 'ai';
  description: string;
  moduleLink: string;
  moduleName: string;
  icon: any;
  automated: boolean;
  status: 'completed' | 'in_progress' | 'pending';
  ruleCondition: string;
  valueUSD: number;
}

export function VisualWorkflowBuilder() {
  const { formatCurrency } = useCurrency();
  const [viewMode, setViewMode] = useState<'all' | 'customer' | 'manufacturer'>('all');
  const [activeStepId, setActiveStepId] = useState<string>('step-1');
  const [showDrawer, setShowDrawer] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'step-1',
      stage: '01. Inbound Lead & Onboarding',
      title: 'Customer Inquiry & Verification',
      actor: 'customer',
      description: 'Buyer submits RFQ from WhatsApp Direct Ad or Website Form. AI verifies business tax ID.',
      moduleLink: '/dashboard/inbox',
      moduleName: 'Omnichannel Inbox & CRM',
      icon: UserCheck,
      automated: true,
      status: 'completed',
      ruleCondition: 'Auto-verify buyer tax ID against global registry',
      valueUSD: 18500,
    },
    {
      id: 'step-2',
      stage: '02. Autonomous AI Negotiation',
      title: 'Dynamic Pricing & Contract Terms',
      actor: 'ai',
      description: 'AI Copilot calculates deal margin ($18.20/unit), drafts 30/70 T/T payment terms, and counters buyer.',
      moduleLink: '/dashboard/ai-copilot/negotiation',
      moduleName: 'AI Trade Copilot',
      icon: Bot,
      automated: true,
      status: 'completed',
      ruleCondition: 'Auto-counter within 25% profit margin floor',
      valueUSD: 91000,
    },
    {
      id: 'step-3',
      stage: '03. Credit & Fraud Shield',
      title: 'Importer Credit Scoring & OFAC Check',
      actor: 'ai',
      description: 'Automated creditworthiness rating (AAA 94/100) & wire sanction screening before sample dispatch.',
      moduleLink: '/dashboard/ai-copilot/credit-shield',
      moduleName: 'Credit & Fraud Shield',
      icon: ShieldCheck,
      automated: true,
      status: 'in_progress',
      ruleCondition: 'Block order if buyer credit score < 75',
      valueUSD: 91000,
    },
    {
      id: 'step-4',
      stage: '04. Factory Production Line',
      title: 'Idle Capacity Allocation & Sampling',
      actor: 'manufacturer',
      description: 'Factory Line #3 automatically locked for 5,000 unit batch. Golden sample dispatched via DHL.',
      moduleLink: '/dashboard/products',
      moduleName: 'Products & Factory Line',
      icon: Factory,
      automated: false,
      status: 'pending',
      ruleCondition: 'Require factory manager approval for batch > 10,000 units',
      valueUSD: 91000,
    },
    {
      id: 'step-5',
      stage: '05. Logistics & Booking',
      title: 'COSCO Ocean FCL Freight Spot Booking',
      actor: 'manufacturer',
      description: 'Guaranteed 40ft High Cube container booked ($2,450 rate). Direct Shanghai ➔ Los Angeles transit.',
      moduleLink: '/dashboard/logistics/rates',
      moduleName: 'Logistics Rate Finder',
      icon: Ship,
      automated: true,
      status: 'pending',
      ruleCondition: 'Auto-book COSCO spot rate if under $2,600',
      valueUSD: 2450,
    },
    {
      id: 'step-6',
      stage: '06. Customs & Fulfillment',
      title: 'Tariff Duty Saver & Closed Deal',
      actor: 'customer',
      description: 'Customs entry lodged under Section 301 exemption. Final 70% wire released & deal closed.',
      moduleLink: '/dashboard/logistics/customs',
      moduleName: 'Customs & Tariff Clearances',
      icon: FileText,
      automated: true,
      status: 'pending',
      ruleCondition: 'Auto-apply Section 301 tariff duty saver',
      valueUSD: 91000,
    },
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const toggleAutomation = (id: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, automated: !step.automated } : step))
    );
    triggerToast('Workflow automation rule toggle updated!');
  };

  const simulateWorkflowExecution = () => {
    setIsExecuting(true);
    triggerToast('Starting End-to-End Trade Workflow Simulation...');
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < steps.length) {
        const targetId = steps[currentIdx].id;
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < currentIdx ? 'completed' : idx === currentIdx ? 'in_progress' : 'pending',
          }))
        );
        setActiveStepId(targetId);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsExecuting(false);
        setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
        triggerToast('🎉 End-to-End Customer ➔ Factory ➔ Shipment Workflow Executed Successfully!');
      }
    }, 1200);
  };

  const filteredSteps = steps.filter((step) => {
    if (viewMode === 'customer') return step.actor === 'customer' || step.actor === 'ai';
    if (viewMode === 'manufacturer') return step.actor === 'manufacturer' || step.actor === 'ai';
    return true;
  });

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-md">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Visual Workflow Engine
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trade & Logistics Visual Workflow Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              Connect Customer Onboarding ➔ Autonomous AI Negotiation ➔ Factory ➔ Shipment ➔ Customs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Perspective Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All View
            </button>
            <button
              onClick={() => setViewMode('customer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'customer'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Customer View
            </button>
            <button
              onClick={() => setViewMode('manufacturer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'manufacturer'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Factory View
            </button>
          </div>

          <button
            onClick={simulateWorkflowExecution}
            disabled={isExecuting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Simulating...' : 'Test Run Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Canvas with Glowing Connectors */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Visual Node Sequence ({filteredSteps.length} Step Pipeline)
          </span>
          <span className="text-xs text-slate-400 font-mono font-bold">CLICK CARDS FOR DRAWER INSPECTOR</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {filteredSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = step.id === activeStepId;
            return (
              <div key={step.id} className="relative group">
                <div
                  onClick={() => {
                    setActiveStepId(step.id);
                    setShowDrawer(true);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 h-full relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-50 dark:bg-slate-800/90 border-xisync-cyan-500 shadow-lg ring-2 ring-xisync-cyan-500/20'
                      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                  }`}
                >
                  {/* Card Header & Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-2xl text-white shadow-xs ${
                        step.status === 'completed'
                          ? 'bg-emerald-500'
                          : step.status === 'in_progress'
                          ? 'bg-cyan-500 animate-pulse'
                          : 'bg-slate-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        step.actor === 'customer'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                          : step.actor === 'manufacturer'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                      }`}
                    >
                      {step.actor === 'customer'
                        ? 'Customer'
                        : step.actor === 'manufacturer'
                        ? 'Factory'
                        : 'AI Copilot'}
                    </span>
                  </div>

                  {/* Stage Title & Description */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
                      {step.stage}
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {step.title}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Value & Automation Badge Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(step.valueUSD)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAutomation(step.id);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                    >
                      {step.automated ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Auto AI</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400">Manual</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Node Connector Line Arrow (Except Last Item) */}
                {index < filteredSteps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-cyan-500">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-Over Workflow Node Inspector Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm p-2 md:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl h-full flex flex-col justify-between p-6 space-y-6 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Workflow Node Inspector</h3>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px]">{activeStep.stage}</div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">{activeStep.title}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs mt-1">
                    Value: {formatCurrency(activeStep.valueUSD)}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">Connected Module Route</label>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{activeStep.moduleName}</span>
                    <span className="text-[10px] text-cyan-500 font-mono">{activeStep.moduleLink}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">Automation Rule Condition</label>
                  <input
                    type="text"
                    defaultValue={activeStep.ruleCondition}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDrawer(false);
                  triggerToast(`Saved inspector rule settings for ${activeStep.title}!`);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-xs"
              >
                Save Drawer Rules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
