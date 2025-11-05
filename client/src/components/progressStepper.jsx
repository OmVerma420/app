import React from 'react';

export default function ProgressStepper({ currentStepIndex = 0, steps = ['Certificate Information','Payment','Application Print'], onStepClick }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex rounded-md overflow-hidden shadow-sm border border-gray-200">
        {steps.map((s,i)=> {
          const active = i === currentStepIndex;
          const completed = i < currentStepIndex;
          return (
            <button key={s} type="button" onClick={()=>onStepClick?.(i)} className={`flex-1 text-center py-3 font-semibold text-sm ${active ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${active ? 'bg-white text-blue-700' : completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{i+1}</div>
                <div className="truncate">{s}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
