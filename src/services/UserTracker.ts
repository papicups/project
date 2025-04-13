export class UserTracker {
    private static instance: UserTracker;
    private dailyVisits: Set<string>;
    private lastResetDate: Date;

    private constructor() {
        this.dailyVisits = new Set();
        this.lastResetDate = new Date();
    }

    static getInstance(): UserTracker {
        if (!UserTracker.instance) {
            UserTracker.instance = new UserTracker();
        }
        return UserTracker.instance;
    }

    trackVisit(identifier: string): void {
        this.checkAndResetDaily();
        this.dailyVisits.add(identifier);
    }

    getDailyVisitCount(): number {
        this.checkAndResetDaily();
        return this.dailyVisits.size;
    }

    private checkAndResetDaily(): void {
        const now = new Date();
        if (now.getDate() !== this.lastResetDate.getDate() ||
            now.getMonth() !== this.lastResetDate.getMonth() ||
            now.getFullYear() !== this.lastResetDate.getFullYear()) {
            this.dailyVisits.clear();
            this.lastResetDate = now;
        }
    }
}