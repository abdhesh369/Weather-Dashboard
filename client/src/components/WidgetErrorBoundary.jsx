import React from 'react';
import { AlertCircle } from 'lucide-react';

export default class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass p-8 rounded-[32px] flex flex-col items-center justify-center gap-3 text-center min-h-[140px]">
          <AlertCircle size={24} className="text-white/20" />
          <p className="text-[12px] font-medium text-white/40">Widget crashed</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="text-[11px] font-bold text-brand-primary hover:underline bg-transparent border-none cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
