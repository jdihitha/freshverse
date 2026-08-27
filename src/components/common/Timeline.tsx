import React from 'react';
import { Check, Clock, Truck, ShieldCheck, Home } from 'lucide-react';
import { OrderStatus, DeliveryStatus } from '../../types';

export interface TimelineStep {
  id?: string;
  title: string;
  description?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
}

interface TimelineProps {
  status?: OrderStatus | DeliveryStatus;
  steps?: TimelineStep[];
  deliveryDate?: string;
  estimatedArrival?: string;
  packedBy?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  status = 'confirmed',
  steps: customSteps,
  deliveryDate,
  estimatedArrival,
  packedBy
}) => {
  if (customSteps && customSteps.length > 0) {
    return (
      <div className="space-y-6 text-left">
        {customSteps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isLast = idx === customSteps.length - 1;

          return (
            <div key={step.id || idx} className="relative flex items-start gap-4">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute left-4 top-8 -bottom-2 w-0.5 ${
                    isCompleted ? 'bg-[#1F3D2B]' : 'bg-[#E2DCD2]'
                  }`}
                />
              )}

              {/* Step indicator circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-[#C6A969] text-[#1F3D2B] ring-4 ring-[#C6A969]/30 ring-offset-2 scale-105'
                    : isCompleted
                    ? 'bg-[#1F3D2B] text-white'
                    : 'bg-[#EAE5DC] text-[#7A756D]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>

              {/* Step text */}
              <div className="space-y-0.5 flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[#1F3D2B]'
                        : isCompleted
                        ? 'text-[#2E2E2E]'
                        : 'text-[#8A847A]'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.timestamp && (
                    <span className="text-[10px] text-[#8A847A] shrink-0 font-medium">
                      {step.timestamp}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[11px] text-[#6E695F] leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default Fallback
  const isCancelled = status === 'cancelled';
  const step1Done = true;
  const step1Current = status === 'confirmed';

  const step2Done = ['packed', 'out_for_delivery', 'in_transit', 'reached_gate', 'delivered'].includes(status);
  const step2Current = status === 'packing' || status === 'harvested';

  const step3Done = ['out_for_delivery', 'in_transit', 'reached_gate', 'delivered'].includes(status);
  const step3Current = ['out_for_delivery', 'in_transit', 'reached_gate'].includes(status);

  const step4Done = status === 'delivered';
  const step4Current = status === 'delivered';

  const defaultSteps = [
    {
      title: 'Order Confirmed',
      sublabel: 'Customized & scheduled',
      isCompleted: step1Done,
      isCurrent: step1Current,
      icon: <Check className="w-4 h-4" />
    },
    {
      title: 'Harvested & Packed',
      sublabel: packedBy ? `Inspected by ${packedBy}` : 'Farm harvest sorted',
      isCompleted: step2Done,
      isCurrent: step2Current,
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      title: 'Out for Gated Delivery',
      sublabel: estimatedArrival || 'En route via quiet EV van',
      isCompleted: step3Done,
      isCurrent: step3Current,
      icon: <Truck className="w-4 h-4" />
    },
    {
      title: 'Delivered to Doorstep',
      sublabel: step4Done ? 'Left safely at residence' : (deliveryDate ? `Scheduled for ${deliveryDate}` : 'Morning slot'),
      isCompleted: step4Done,
      isCurrent: step4Current,
      icon: <Home className="w-4 h-4" />
    }
  ];

  if (isCancelled) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2">
        <Clock className="w-4 h-4 shrink-0" />
        <span>This order or delivery cycle was cancelled/skipped by customer preference.</span>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-[#E2DCD2] z-0" />
        
        {defaultSteps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex md:flex-col items-center gap-3.5 md:gap-2 text-left md:text-center md:flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 shadow-xs shrink-0 ${
                step.isCurrent
                  ? 'bg-[#C6A969] text-[#1F3D2B] ring-4 ring-[#C6A969]/30 ring-offset-2 scale-105'
                  : step.isCompleted
                  ? 'bg-[#1F3D2B] text-white'
                  : 'bg-[#EAE5DC] text-[#7A756D]'
              }`}
            >
              {step.icon}
            </div>

            <div>
              <p
                className={`text-sm font-semibold leading-tight ${
                  step.isCurrent
                    ? 'text-[#1F3D2B] font-bold'
                    : step.isCompleted
                    ? 'text-[#2E2E2E]'
                    : 'text-[#8A847A]'
                }`}
              >
                {step.title}
              </p>
              {step.sublabel && (
                <p className="text-xs text-[#6E695F] mt-0.5 max-w-[140px] md:mx-auto">
                  {step.sublabel}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
