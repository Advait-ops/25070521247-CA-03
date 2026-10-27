import React from 'react';
import { 
  HeartPulse, 
  Brain, 
  Baby, 
  Activity, 
  ShieldPlus, 
  Ambulance, 
  Stethoscope 
} from 'lucide-react';

interface DepartmentIconProps {
  name: string;
  className?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Baby':
      return <Baby className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'ShieldPlus':
      return <ShieldPlus className={className} />;
    case 'Ambulance':
      return <Ambulance className={className} />;
    default:
      return <Stethoscope className={className} />;
  }
};
