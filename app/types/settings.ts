export interface Miner {
    id: string;
    first_name: string;
    last_name: string;
    role?: string;
}

export interface RoyaltySettings {
    waterGelMultiplier: number;
    expansionFactor: number;
    powderFactorMultiplier: number;
    royaltyRatePerM3: number;
    ssclPercentage: number;
    vatPercentage: number;
    defaultPowderFactor: number;
  }
  
  export const defaultSettings: RoyaltySettings = {
    waterGelMultiplier: 1.2,
    expansionFactor: 1.6,
    powderFactorMultiplier: 2.83,
    royaltyRatePerM3: 240,
    ssclPercentage: 2.56,
    vatPercentage: 18,
    defaultPowderFactor: 0.5
  }; 