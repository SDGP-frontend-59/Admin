'use client';

import { useState, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface RoyaltyData {
  calculation_date: string;
  payment_due_date: string;
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

interface RoyaltyCalculatorProps {
  onCalculated: (data: RoyaltyData) => any;
  onSaveCalculation?: (data: RoyaltyData) => Promise<boolean>;
}

interface SavedCalculation {
  id: string;
  date: string;
  waterGel: number;
  nh4no3: number;
  powderFactor: number;
  totalAmount: number;
  explosiveQuantity: number;
  blastedVolume: number;
  dueDate: string;
}

// Add new interface for constant values
interface CalculationConstants {
  waterGelMultiplier: number;
  expansionFactor: number;
  powderFactorMultiplier: number;
  royaltyRatePerCubicMeter: number;
  ssclPercentage: number;
  vatPercentage: number;
}

export default function RoyaltyCalculator({ onCalculated, onSaveCalculation }: RoyaltyCalculatorProps) {
  const [waterGel, setWaterGel] = useState('');
  const [nh4no3, setNh4no3] = useState('');
  const [powderFactor, setPowderFactor] = useState('');
  
  // Replace payment due days with a specific date
  const [paymentDueDate, setPaymentDueDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [royaltyData, setRoyaltyData] = useState<RoyaltyData | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [showConstantsEditor, setShowConstantsEditor] = useState(false);
  
  // Default values for constants
  const defaultConstants: CalculationConstants = {
    waterGelMultiplier: 1.2,
    expansionFactor: 1.6,
    powderFactorMultiplier: 2.83,
    royaltyRatePerCubicMeter: 240,
    ssclPercentage: 2.56,
    vatPercentage: 18,
  };
  
  // State for editable constants
  const [constants, setConstants] = useState<CalculationConstants>(defaultConstants);

  // Load saved calculations and constants from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('royaltyCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
    
    // Load saved constants if available
    const savedConstants = localStorage.getItem('royaltyConstants');
    if (savedConstants) {
      setConstants(JSON.parse(savedConstants));
    }
    
    // Set default payment due date to 14 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    
    // Load saved payment due date if available, otherwise use default
    const savedDueDate = localStorage.getItem('paymentDueDate');
    if (savedDueDate) {
      setPaymentDueDate(savedDueDate);
    } else {
      setPaymentDueDate(defaultDueDate.toISOString().split('T')[0]);
    }
  }, []);
  
  // Handle constant value changes
  const handleConstantChange = (field: keyof CalculationConstants, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setConstants(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };
  
  // Save constants to localStorage
  const saveConstants = () => {
    localStorage.setItem('royaltyConstants', JSON.stringify(constants));
    setShowConstantsEditor(false);
    toast.success('Calculation constants saved successfully!');
  };
  
  // Reset constants to default values
  const resetConstants = () => {
    setConstants(defaultConstants);
    localStorage.setItem('royaltyConstants', JSON.stringify(defaultConstants));
    toast.success('Constants reset to default values');
  };

  // Now we'll use the actual selected date rather than calculating days
  const getPaymentDueDate = (): string => {
    return new Date(paymentDueDate).toISOString();
  };

  // Implement local royalty calculation function
  const calculateRoyaltyLocal = (inputs: {
    water_gel: number;
    nh4no3: number;
    powder_factor: number;
  }): RoyaltyData => {
    // Use constants from state
    const WATER_GEL_MULTIPLIER = constants.waterGelMultiplier;
    const EXPANSION_FACTOR = constants.expansionFactor;
    const POWDER_FACTOR_MULTIPLIER = constants.powderFactorMultiplier;
    const ROYALTY_RATE_PER_CUBIC_METER = constants.royaltyRatePerCubicMeter;
    const SSCL_RATE = `${constants.ssclPercentage}%`;
    const VAT_RATE = `${constants.vatPercentage}%`;
    const SSCL_MULTIPLIER = 1 + (constants.ssclPercentage / 100);
    const VAT_MULTIPLIER = 1 + (constants.vatPercentage / 100);

    // Step 1: Calculate Total Explosive Quantity with the correct formula
    const totalExplosiveQuantity = (inputs.water_gel * WATER_GEL_MULTIPLIER) + inputs.nh4no3;
    
    // Step 2: Calculate basic blasted rock volume using powder factor
    const basicVolume = totalExplosiveQuantity / inputs.powder_factor;
    
    // Step 2 (continued): Calculate expanded blasted rock volume
    const blastedRockVolume = (totalExplosiveQuantity * EXPANSION_FACTOR) / (inputs.powder_factor * POWDER_FACTOR_MULTIPLIER);
    
    // Step 3: Calculate base royalty
    const baseRoyalty = blastedRockVolume * ROYALTY_RATE_PER_CUBIC_METER;
    
    // Step 4: Apply SSCL rate
    const royaltyWithSscl = baseRoyalty * SSCL_MULTIPLIER;
    
    // Step 4 (continued): Apply VAT
    const totalAmountWithVat = royaltyWithSscl * VAT_MULTIPLIER;

    const calculationDate = new Date().toISOString();
    const dueDate = getPaymentDueDate();

    return {
      calculation_date: calculationDate,
      payment_due_date: dueDate,
      inputs: {
        water_gel_kg: inputs.water_gel,
        nh4no3_kg: inputs.nh4no3,
        powder_factor: inputs.powder_factor
      },
      calculations: {
        total_explosive_quantity: totalExplosiveQuantity,
        basic_volume: basicVolume,
        blasted_rock_volume: blastedRockVolume,
        base_royalty: baseRoyalty,
        royalty_with_sscl: royaltyWithSscl,
        total_amount_with_vat: totalAmountWithVat
      },
      rates_applied: {
        royalty_rate_per_cubic_meter: ROYALTY_RATE_PER_CUBIC_METER,
        sscl_rate: SSCL_RATE,
        vat_rate: VAT_RATE
      }
    };
  };

  const handleCalculateRoyalty = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace API call with local calculation
      const waterGelValue = parseFloat(waterGel);
      const nh4no3Value = parseFloat(nh4no3);
      const powderFactorValue = parseFloat(powderFactor);
      
      // Validate inputs
      if (isNaN(waterGelValue) || isNaN(nh4no3Value) || isNaN(powderFactorValue)) {
        throw new Error("Please enter valid numbers for all fields");
      }
      
      // Calculate royalty locally
      const data = calculateRoyaltyLocal({
        water_gel: waterGelValue,
        nh4no3: nh4no3Value,
        powder_factor: powderFactorValue
      });
      
      setRoyaltyData(data);
      onCalculated(data);
      
      toast.success('Royalty calculated successfully!');
    } catch (error) {
      console.error('Error calculating royalty:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to calculate royalty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCalculation = async () => {
    if (!royaltyData) return;

    // If parent component provided a save function, use it
    if (onSaveCalculation) {
      const success = await onSaveCalculation(royaltyData);
      if (success) {
        // Reset form after successful save
        handleReset();
        return;
      }
    } else {
      // Use original save logic if no parent handler
      // Check if this calculation has already been saved
      const existingSaved = localStorage.getItem('royaltyCalculations');
      const savedCalculations = existingSaved ? JSON.parse(existingSaved) : [];
      
      // Create new calculation object
      const newCalculation: SavedCalculation = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        waterGel: parseFloat(waterGel),
        nh4no3: parseFloat(nh4no3),
        powderFactor: parseFloat(powderFactor),
        totalAmount: royaltyData.calculations.total_amount_with_vat,
        explosiveQuantity: royaltyData.calculations.total_explosive_quantity,
        blastedVolume: royaltyData.calculations.blasted_rock_volume,
        dueDate: royaltyData.payment_due_date
      };

      // Check if this exact calculation already exists
      const isDuplicate = savedCalculations.some((calc: SavedCalculation) => 
        calc.waterGel === newCalculation.waterGel &&
        calc.nh4no3 === newCalculation.nh4no3 &&
        calc.powderFactor === newCalculation.powderFactor &&
        calc.totalAmount === newCalculation.totalAmount
      );

      if (isDuplicate) {
        toast.error('This calculation has already been saved');
        return;
      }

      // Add only the new calculation
      const updatedCalculations = [...savedCalculations, newCalculation];
      localStorage.setItem('royaltyCalculations', JSON.stringify(updatedCalculations));
      
      // Update the mining stats - make sure payment_due_date is preserved
      const currentDate = new Date().toISOString();
      onCalculated({
        ...royaltyData,
        calculation_date: currentDate,
        payment_due_date: royaltyData.payment_due_date // Ensure payment due date is passed
      });
      
      toast.success('Calculation saved successfully!');

      // Reset form after successful save
      handleReset();
    }
  };

  const handleReset = () => {
    setWaterGel('');
    setNh4no3('');
    setPowderFactor('');
    setRoyaltyData(null);
    toast.success('Calculator reset');
  };

  // Handle saving of payment due date
  const handleSavePaymentDate = () => {
    localStorage.setItem('paymentDueDate', paymentDueDate);
    toast.success('Payment due date saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Royalty Calculator</h2>
        <button
          onClick={() => setShowConstantsEditor(!showConstantsEditor)}
          className="px-6 py-3 bg-purple-300 hover:bg-purple-500 rounded-md text-base font-medium transition-colors flex items-center space-x-2 text-gray-800"
        >
          <span>{showConstantsEditor ? 'Hide Constants' : 'Edit Constant Royalty Values'}</span>
          {!showConstantsEditor && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>}
        </button>
      </div>
      
      {showConstantsEditor && (
        <div className="p-6 bg-gray-800 rounded-lg text-white">
          <h3 className="text-lg font-medium mb-4">Edit Calculation Constants</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Water Gel Multiplier
              </label>
              <input
                type="number"
                step="0.01"
                value={constants.waterGelMultiplier}
                onChange={(e) => handleConstantChange('waterGelMultiplier', e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Expansion Factor
              </label>
              <input
                type="number"
                step="0.01"
                value={constants.expansionFactor}
                onChange={(e) => handleConstantChange('expansionFactor', e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Powder Factor Multiplier
              </label>
              <input
                type="number"
                step="0.01"
                value={constants.powderFactorMultiplier}
                onChange={(e) => handleConstantChange('powderFactorMultiplier', e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Royalty Rate per m³ (LKR)
              </label>
              <input
                type="number"
                step="1"
                value={constants.royaltyRatePerCubicMeter}
                onChange={(e) => handleConstantChange('royaltyRatePerCubicMeter', e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                SSCL Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={constants.ssclPercentage}
                onChange={(e) => handleConstantChange('ssclPercentage', e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                VAT Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={constants.vatPercentage}
                onChange={(e) => handleConstantChange('vatPercentage', e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={saveConstants}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
            >
              Save Constants
            </button>
            <button
              onClick={resetConstants}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleCalculateRoyalty} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label htmlFor="waterGel" className="block text-sm font-medium mb-2">
              Water Gel (kg)
            </label>
            <input
              id="waterGel"
              type="number"
              step="0.01"
              value={waterGel}
              onChange={(e) => setWaterGel(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="nh4no3" className="block text-sm font-medium mb-2">
              NH4NO3 (kg)
            </label>
            <input
              id="nh4no3"
              type="number"
              step="0.01"
              value={nh4no3}
              onChange={(e) => setNh4no3(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="powderFactor" className="block text-sm font-medium mb-2">
              Powder Factor
            </label>
            <input
              id="powderFactor"
              type="number"
              step="0.001"
              value={powderFactor}
              onChange={(e) => setPowderFactor(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="paymentDueDate" className="block text-sm font-medium mb-2">
              Payment Due Date
            </label>
            <div className="flex">
              <input
                id="paymentDueDate"
                type="date"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                min={new Date().toISOString().split('T')[0]} // Can't select dates in the past
              />
              <button
                type="button"
                onClick={handleSavePaymentDate}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-r-md text-sm font-medium transition-colors"
                title="Save payment due date"
              >
                ✓
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-blue-300 hover:bg-blue-500 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
        >
          {loading ? 'Calculating...' : 'Calculate Royalty'}
        </button>
      </form>

      {royaltyData && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Royalty Calculation Results</h2>
            <div className="space-x-4">
              <button
                onClick={handleSaveCalculation}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
              >
                Save Calculation
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Explosive Quantities</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span>Total Explosive Quantity:</span>
                    <span>{royaltyData.calculations.total_explosive_quantity.toFixed(2)} kg</span>
                  </p>
                  <div className="border-t border-gray-600 my-2" />
                  <p className="flex justify-between text-sm">
                    <span>Water Gel:</span>
                    <span>{royaltyData.inputs.water_gel_kg.toFixed(2)} kg</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span>NH4NO3:</span>
                    <span>{royaltyData.inputs.nh4no3_kg.toFixed(2)} kg</span>
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Rock Volume</h3>
                <p className="flex justify-between">
                  <span>Blasted Rock Volume:</span>
                  <span>{royaltyData.calculations.blasted_rock_volume.toFixed(2)} m³</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Details</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Base Royalty:</span>
                  <span>LKR {royaltyData.calculations.base_royalty.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>With SSCL ({royaltyData.rates_applied.sscl_rate}):</span>
                  <span>LKR {royaltyData.calculations.royalty_with_sscl.toFixed(2)}</span>
                </p>
                <div className="border-t border-gray-600 my-2" />
                <p className="flex justify-between text-lg font-semibold">
                  <span>Total Amount (with {royaltyData.rates_applied.vat_rate} VAT):</span>
                  <span>LKR {royaltyData.calculations.total_amount_with_vat.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Information</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Calculation Date:</span>
                  <span>{new Date(royaltyData.calculation_date).toLocaleDateString()}</span>
                </p>
                <p className="flex justify-between text-amber-400">
                  <span>Payment Due Date:</span>
                  <span>{new Date(royaltyData.payment_due_date).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 