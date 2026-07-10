import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode; 
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('Error getDerivedStateFromError:', error);
    // Update state to indicate that an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error here if needed
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    // Now this.state.hasError will be recognized
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          <h2 className="font-bold">Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
