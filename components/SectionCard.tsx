import React from 'react';
import { AuditSection } from '../types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SectionCardProps {
  section: AuditSection;
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const getIcon = () => {
    switch (section.status) {
      case 'good': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'critical': return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getBorderColor = () => {
    switch (section.status) {
      case 'good': return 'border-green-100 hover:border-green-200';
      case 'warning': return 'border-yellow-100 hover:border-yellow-200';
      case 'critical': return 'border-red-100 hover:border-red-200';
    }
  };

  const getBgColor = () => {
    switch (section.status) {
      case 'good': return 'bg-green-50/50';
      case 'warning': return 'bg-yellow-50/50';
      case 'critical': return 'bg-red-50/50';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${getBorderColor()} ${getBgColor()} shadow-sm`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h3 className="font-semibold text-lg text-slate-800">{section.title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          section.score >= 80 ? 'bg-green-100 text-green-700' :
          section.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {section.score}/100
        </span>
      </div>
      
      <ul className="space-y-2">
        {section.details.map((detail, idx) => (
          <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionCard;
