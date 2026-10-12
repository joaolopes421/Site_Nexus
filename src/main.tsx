const root = document.getElementById('root') ?? document.body.appendChild(document.createElement('div'))
root.id = 'root'

const mobileBreakpoint = window.matchMedia('(max-width: 767px)')
const reloadForLayoutChange = () => window.location.reload()
if (typeof mobileBreakpoint.addEventListener === 'function') {
  mobileBreakpoint.addEventListener('change', reloadForLayoutChange, { once: true })
} else {
  mobileBreakpoint.addListener(reloadForLayoutChange)
}

// O conteúdo mobile já está no HTML. Só a branch desktop importa React e a aplicação completa.
if (window.innerWidth >= 768) {
  root.replaceChildren()

  void Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./App'),
    import('./presentation/components/AppErrorBoundary'),
    import('./presentation/styles/index.css'),
  ])
    .then(([React, ReactDOM, appModule, boundaryModule]) => {
      ReactDOM.createRoot(root).render(
        React.createElement(
          React.StrictMode,
          null,
          React.createElement(
            boundaryModule.AppErrorBoundary,
            null,
            React.createElement(appModule.default),
          ),
        ),
      )
    })
    .catch((error: unknown) => {
      console.error('Falha ao carregar a aplicação desktop.', error)
      root.replaceChildren(
        Object.assign(document.createElement('p'), {
          textContent: 'Não foi possível carregar o site. Atualize a página para tentar novamente.',
        }),
      )
    })
}
