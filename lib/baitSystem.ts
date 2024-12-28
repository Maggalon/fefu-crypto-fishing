import { BaitData, BaitSystemConfig } from "./types";

export class BaitSystem {
  
    private readonly maxBait: number;
    private readonly recoveryRate: number;
    private readonly recoveryInterval: number;
    private readonly storageKey: string;
  
    constructor({
      maxBait = 10,
      recoveryRate = 1, // 1 point per minute
      recoveryInterval = 5000, // 60 seconds = 1 minute
      storageKey = 'userBait'
    }: BaitSystemConfig = {}) {
      this.maxBait = maxBait;
      this.recoveryRate = recoveryRate;
      this.recoveryInterval = recoveryInterval;
      this.storageKey = storageKey;
    }
  
    private loadBaitData(): BaitData {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (!data) {
          return this.initializeBaitData();
        }
        return JSON.parse(data) as BaitData;
      } catch {
        return this.initializeBaitData();
      }
    }
  
    private initializeBaitData(): BaitData {
      const initialData: BaitData = {
        bait: this.maxBait,
        lastUpdate: Date.now()
      };
      this.saveBaitData(initialData);
      return initialData;
    }
  
    private saveBaitData(data: BaitData): void {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  
    getCurrentBait(): number {
      const data = this.loadBaitData();
      const now = Date.now();
      const timePassed = now - data.lastUpdate;
      
      // Calculate points recovered based on time passed
      const pointsRecovered = Math.floor((timePassed / this.recoveryInterval) * this.recoveryRate);
      
      // Calculate new bait value
      const newBait = Math.min(this.maxBait, data.bait + pointsRecovered);
      
      // Only update lastUpdate if points were actually recovered
      if (pointsRecovered > 0) {
        this.saveBaitData({
          bait: newBait,
          lastUpdate: now - (timePassed % this.recoveryInterval) // Keep track of partial recovery
        });
      }
      
      return newBait;
    }
  
    useBait(cost: number): boolean {
      const currentBait = this.getCurrentBait();
      if (currentBait < cost) {
        return false;
      }
  
      this.saveBaitData({
        bait: currentBait - cost,
        lastUpdate: Date.now()
      });
      return true;
    }
  
    getTimeUntilNextPoint(): number {
      const { bait, lastUpdate } = this.loadBaitData();
      if (bait >= this.maxBait) return 0;
      
      const now = Date.now();
      const timePassed = now - lastUpdate;
      const timeForOnePoint = this.recoveryInterval / this.recoveryRate;
      const remainingTime = timeForOnePoint - (timePassed % timeForOnePoint);
      
      return Math.ceil(remainingTime);
    }
}