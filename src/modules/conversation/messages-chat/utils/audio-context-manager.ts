class AudioContextManager {
  private contexts: Set<AudioContext> = new Set();
  private static instance: AudioContextManager;

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  register(context: AudioContext): void {
    this.contexts.add(context);
  }

  unregister(context: AudioContext): void {
    this.contexts.delete(context);
  }

  async closeAll(): Promise<void> {
    const promises = Array.from(this.contexts).map((context) => {
      // Проверяем состояние перед закрытием
      if (context.state !== 'closed') {
        return context.close().catch((e) => {
          // Игнорируем ошибку закрытия уже закрытого контекста
          if (e.name !== 'InvalidStateError') {
            console.warn('Error closing AudioContext:', e);
          }
        });
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
    this.contexts.clear();
  }

  getActiveCount(): number {
    return this.contexts.size;
  }
}

export const audioContextManager = AudioContextManager.getInstance();

// Инициализируем патч только на клиенте
if (typeof window !== 'undefined') {
  type WindowWithWebkitAudio = Window & {
    webkitAudioContext?: typeof AudioContext;
  };

  const getOriginalAudioContext = (): typeof AudioContext | undefined => {
    const win = window as WindowWithWebkitAudio;
    // @ts-expect-error - webkitAudioContext существует в браузерах на базе WebKit
    return win.AudioContext || win.webkitAudioContext;
  };

  const OriginalAudioContext = getOriginalAudioContext();

  if (OriginalAudioContext) {
    const PatchedAudioContext = class extends OriginalAudioContext {
      constructor() {
        super();
        audioContextManager.register(this);

        const originalClose = this.close;

        this.close = async (): Promise<void> => {
          // Проверяем, не закрыт ли уже контекст
          if (this.state === 'closed') {
            audioContextManager.unregister(this);
            return;
          }
          await originalClose.call(this);
          audioContextManager.unregister(this);
        };
      }
    };

    window.AudioContext = PatchedAudioContext;

    const win = window as WindowWithWebkitAudio;
    if (win.webkitAudioContext) {
      win.webkitAudioContext = PatchedAudioContext;
    }
  }
}
