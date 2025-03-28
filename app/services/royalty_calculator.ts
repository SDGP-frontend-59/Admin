import { getSettings } from './settings_service';

interface RoyaltyCalculationRequest {
  water_gel: number;
  nh4no3: number;
  powder_factor: number;
}

interface RoyaltyCalculationResponse {
  calculation_date: string;
  inputs: {
    water_gel_kg: number;
    nh4no3_kg: number;
    powder_factor: number;
  };
  calculations: {
    total_explosive_quantity: number;
    basic_volume: number;
    blasted_rock_volume: number;
    base_royalty: number;
    royalty_with_sscl: number;
    total_amount_with_vat: number;
  };
  rates_applied: {
    royalty_rate_per_cubic_meter: number;
    sscl_rate: string;
    vat_rate: string;
  };
  warning_message?: string;
}

export const calculateRoyalty = async (data: RoyaltyCalculationRequest): Promise<RoyaltyCalculationResponse> => {
  try {
    // Get the current settings
    const settings = getSettings();
    
    // Store warning message if applicable
    let warningMessage: string | undefined;
    
    // Handle division by zero for powder factor
    if (data.powder_factor === 0) {
      warningMessage = `Powder Factor cannot be zero. Using default value of ${settings.defaultPowderFactor} instead.`;
      data.powder_factor = settings.defaultPowderFactor;
    }
    
    // Step 1: Calculate Total Explosive Quantity (TEQ)
    const total_explosive_quantity = (data.water_gel * settings.waterGelMultiplier) + data.nh4no3;
    
    // Step 2: Calculate volumes
    const basic_volume = total_explosive_quantity / data.powder_factor;
    
    // Expanded Blasted Rock Volume calculation
    const blasted_rock_volume = (total_explosive_quantity * settings.expansionFactor) / 
                               (data.powder_factor * settings.powderFactorMultiplier);
    const rounded_blasted_volume = Math.round(blasted_rock_volume * 100) / 100; // Rounded to 2 decimal places
    
    // Step 3: Calculate Royalty Fee
    const base_royalty = rounded_blasted_volume * settings.royaltyRatePerM3;
    
    // Step 4: Apply Additional Charges
    // SSCL
    const sscl_rate = settings.ssclPercentage / 100;
    const royalty_with_sscl = base_royalty * (1 + sscl_rate);
    
    // VAT
    const vat_rate = settings.vatPercentage / 100;
    const total_amount_with_vat = royalty_with_sscl * (1 + vat_rate);

    // Create the calculation date
    const calculation_date = new Date().toISOString();
    
    // Return the response object
    return {
      calculation_date,
      inputs: {
        water_gel_kg: data.water_gel,
        nh4no3_kg: data.nh4no3,
        powder_factor: data.powder_factor
      },
      calculations: {
        total_explosive_quantity,
        basic_volume,
        blasted_rock_volume: rounded_blasted_volume,
        base_royalty,
        royalty_with_sscl,
        total_amount_with_vat
      },
      rates_applied: {
        royalty_rate_per_cubic_meter: settings.royaltyRatePerM3,
        sscl_rate: `${settings.ssclPercentage}%`,
        vat_rate: `${settings.vatPercentage}%`
      },
      ...(warningMessage && { warning_message: warningMessage })
    };
  } catch (error) {
    console.error('Calculation failed:', error);
    throw error;
  }
}; 