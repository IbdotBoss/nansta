declare module 'ogl' {
  export class Renderer {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    constructor(options?: { alpha?: boolean; antialias?: boolean; dpr?: number });
    setSize(w: number, h: number): void;
    render(options: { scene: Mesh }): void;
  }
  export class Triangle {
    constructor(gl: WebGLRenderingContext);
  }
  export class Program {
    uniforms: Record<string, { value: unknown }>;
    constructor(gl: WebGLRenderingContext, options: { vertex: string; fragment: string; uniforms?: Record<string, { value: unknown }> });
  }
  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: { geometry: Triangle; program: Program });
  }
  export class Color {
    r: number;
    g: number;
    b: number;
    constructor(r?: number, g?: number, b?: number);
  }
}
