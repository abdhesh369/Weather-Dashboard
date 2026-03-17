import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[Widget]', error.message, info?.componentStack?.split('\n')[1] ?? '');
  }

  retry = () => {
    this.setState(s => ({ hasError: false, error: null, retryCount: s.retryCount + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="glass p-8 rounded-[32px] flex flex-col items-center justify-center gap-3 text-center"
          style={{ minHeight: 120, border: '1px solid rgba(248,113,113,0.12)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.08)' }}>
            <AlertCircle size={18} style={{ color: 'rgba(248,113,113,0.5)' }} />
          </div>
          <p className="text-[12px] font-semibold text-white/35">Widget unavailable</p>
          {this.state.retryCount < 3 && (
            <button
              onClick={this.retry}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-transparent border-none cursor-pointer transition-colors hover:bg-white/5"
              style={{ color: 'var(--brand-primary)' }}
            >
              <RefreshCw size={10} /> Retry
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
