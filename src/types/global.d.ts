// Global type declarations for Node.js environment
declare global {
  namespace NodeJS {
    interface Process {
      argv: string[];
      env: { [key: string]: string | undefined };
      cwd(): string;
      memoryUsage(): {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
        arrayBuffers: number;
      };
      exit(code?: number): never;
    }

    interface Global {
    }
  }

  var process: NodeJS.Process;
  var global: NodeJS.Global;
  var console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  };

  function setTimeout(callback: (...args: any[]) => void, ms: number): any;
  function setInterval(callback: (...args: any[]) => void, ms: number): any;
  function clearInterval(id: any): void;
  function clearTimeout(id: any): void;

  interface ImportMeta {
    url: string;
  }
}

declare module "fs" {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding?: string): string | Buffer;
}

declare module "path" {
  export function join(...paths: string[]): string;
}

export {};