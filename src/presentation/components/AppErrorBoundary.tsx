import { Component, type ErrorInfo, type ReactNode } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('A interface encontrou um erro inesperado.', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeContent: 'center',
            gap: '1rem',
            padding: '2rem',
            background: '#090d16',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0 }}>Não foi possível carregar esta página.</h1>
          <p style={{ margin: 0, color: '#9ca3af' }}>Atualize a página para tentar novamente.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ justifySelf: 'center', padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer' }}
          >
            Atualizar página
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
