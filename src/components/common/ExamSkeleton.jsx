import { HelpCircle } from 'lucide-react';

const ExamSkeleton = ({ type = 'exam' }) => {
  if (type === 'practice') {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded-lg w-3/4 mx-auto" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="flex justify-between mt-8">
          <div className="h-12 w-28 bg-slate-200 rounded-xl" />
          <div className="h-12 w-28 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-12 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-20 bg-slate-200 rounded-lg" />
        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-200 rounded-lg w-full mb-8" />
      <div className="space-y-3 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="flex justify-between">
        <div className="h-12 w-28 bg-slate-200 rounded-xl" />
        <div className="h-12 w-28 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export default ExamSkeleton;
