import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is an extension-related error
    const isExtensionError = error.message.includes('createContext') || 
                           error.message.includes('useLayoutEffect') ||
                           error.message.includes('Cannot read properties') ||
                           error.message.includes('Cannot destructure') ||
                           error.message.includes('content.js') ||
                           error.message.includes('selection.js') ||
                           error.message.includes('knowee');

    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // If it's an extension error, try to recover automatically
    if (isExtensionError) {
      console.warn('Extension conflict detected, attempting recovery...');
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }, 2000);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isExtensionError = this.state.error?.message.includes('createContext') || 
                             this.state.error?.message.includes('useLayoutEffect') ||
                             this.state.error?.message.includes('Cannot read properties') ||
                             this.state.error?.message.includes('Cannot destructure');

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                {isExtensionError ? 'Extension Conflict Detected' : 'Something went wrong'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isExtensionError 
                  ? 'A browser extension is interfering with the application. This will be resolved automatically.'
                  : 'An unexpected error occurred. Please try refreshing the page.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isExtensionError && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                  <strong>Error:</strong> {this.state.error?.message}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {isExtensionError && (
                <div className="text-xs text-gray-500 text-center">
                  <p>💡 <strong>Tip:</strong> Try disabling browser extensions temporarily if the issue persists.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
