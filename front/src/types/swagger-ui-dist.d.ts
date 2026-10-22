declare module 'swagger-ui-dist/swagger-ui-bundle.js' {
  export interface SwaggerUIInstance {
    unmount(): void
  }

  export interface SwaggerUIOptions {
    url?: string
    domNode: HTMLElement | null
    deepLinking?: boolean
    layout?: string
    presets?: unknown[]
    plugins?: unknown[]
    docExpansion?: string
    defaultModelsExpandDepth?: number
    tryItOutEnabled?: boolean
  }

  export interface SwaggerUIBundleStatic {
    (options: SwaggerUIOptions): SwaggerUIInstance
    presets: { apis: unknown }
    plugins: Record<string, unknown>
  }

  const SwaggerUIBundle: SwaggerUIBundleStatic
  export default SwaggerUIBundle
}

declare module 'swagger-ui-dist/swagger-ui-standalone-preset.js' {
  const SwaggerUIStandalonePreset: unknown
  export default SwaggerUIStandalonePreset
}
