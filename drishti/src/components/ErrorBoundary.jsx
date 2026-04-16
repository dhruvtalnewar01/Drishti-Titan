import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#3b0711', color: '#ffaaaa', borderRadius: '12px', border: '1px solid #ef4444', fontFamily: 'monospace' }}>
          <h3 style={{ marginTop: 0, color: '#ef4444' }}>Component Crash Detected</h3>
          <p style={{ fontSize: '13px' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ fontSize: '10px', overflowX: 'auto', background: '#1c0308', padding: '10px', borderRadius: '6px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
