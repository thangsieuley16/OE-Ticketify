export class Mutex {
    private mutex = Promise.resolve();

    lock(): Promise<() => void> {
        let unlock: () => void;

        const nextLock = new Promise<void>(resolve => {
            unlock = resolve;
        });

        const prevMutex = this.mutex;
        this.mutex = this.mutex.then(() => nextLock);

        return prevMutex.then(() => unlock);
    }

    async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
        const release = await this.lock();
        try {
            return await callback();
        } finally {
            release();
        }
    }
}
