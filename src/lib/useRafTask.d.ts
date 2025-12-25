export type RafTaskOptions = {
  id: string;
  cb: (now: number, dt: number) => void;
  enabled?: boolean | (() => boolean);
  maxFps?: number;
};

export function useRafTask(opts: RafTaskOptions): void;
