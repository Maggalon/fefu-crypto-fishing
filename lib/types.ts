export interface BaitData {
    bait: number;
    lastUpdate: number;
}

export interface BaitSystemConfig {
    maxBait?: number;
    recoveryRate?: number;
    recoveryInterval?: number;
    storageKey?: string;
}
  
export interface ChestCell {
    id: number;
    cell: number;
    fefu: number;
    created_at: string;
}

export interface CellContent {
    fish: number;
    squid: number;
    pearl: number;
    treasure: number;
}

export interface UserData {
    id: number;
    address: string;
    referral_code: string;
    balance: number;
    fish: number;
    squid: number;
    pearl: number;
    bonus_points: number;
    extraction_multiplier: number;
    recovery_multiplier: number;
}

export interface TMainContext {
    currentUser: UserData | undefined;
    handleSetCurrentUser: (address: string) => void;
    getCurrentUser: () => void;
}