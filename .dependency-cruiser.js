/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Proíbe dependências circulares',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-components-accessing-app',
      severity: 'error',
      comment: 'Componentes não devem acessar arquivos raiz da aplicação',
      from: { path: '^src/components' },
      to: { path: '^src/(App|main)\\.tsx$' }
    },
    {
      name: 'no-components-accessing-pages',
      severity: 'error',
      comment: 'Componentes base não devem depender de páginas',
      from: { path: '^src/components' },
      to: { path: '^src/pages' }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    }
  }
};
