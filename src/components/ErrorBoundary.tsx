import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console (in production, send to error tracking service)
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render custom fallback UI or default error message
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
                    <div className="max-w-md w-full bg-neutral-800 rounded-3xl p-8 border border-gray-700 shadow-xl">
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-2xl font-bold text-white mb-3">
                                Oops! Terjadi Kesalahan
                            </h1>
                            <p className="text-gray-300 mb-6">
                                Aplikasi mengalami masalah. Silakan refresh halaman atau hubungi administrator.
                            </p>
                            {this.state.error && (
                                <details className="text-left bg-neutral-700 p-4 rounded-lg mb-4">
                                    <summary className="cursor-pointer font-semibold text-gray-300 mb-2">
                                        Detail Error
                                    </summary>
                                    <code className="text-xs text-red-400 block overflow-auto">
                                        {this.state.error.toString()}
                                    </code>
                                </details>
                            )}
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                Refresh Halaman
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
