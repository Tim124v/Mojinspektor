import { Component } from 'react'

export default class ErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-base font-medium text-gray-900">Щось пішло не так. Оновіть сторінку.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Оновити
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
