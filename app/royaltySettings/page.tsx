'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getSettings, updateSettings, resetSettings } from '../services/settings_service';
import { RoyaltySettings } from '../types/settings';

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<RoyaltySettings>({
    waterGelMultiplier: 1.2,
    expansionFactor: 1.6,
    powderFactorMultiplier: 2.83,
    royaltyRatePerM3: 240,
    ssclPercentage: 2.56,
    vatPercentage: 18,
    defaultPowderFactor: 0.5
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current settings
    const currentSettings = getSettings();
    setSettings(currentSettings);
  }, []);

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input values
      const validatedSettings = { ...settings };
      
      // Ensure values are valid numbers
      for (const [key, value] of Object.entries(validatedSettings)) {
        if (typeof value !== 'number' || isNaN(value) || value <= 0) {
          toast.error(`Invalid value for ${key}. Must be a positive number.`);
          setLoading(false);
          return;
        }
      }
      
      const success = updateSettings(validatedSettings);
      if (success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const success = resetSettings();
      if (success) {
        // Reload settings
        const defaultSettings = getSettings();
        setSettings(defaultSettings);
        toast.success('Settings reset to default values');
      } else {
        toast.error('Failed to reset settings');
      }
    }
  };

  return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Royalty Calculation Constants</h2>
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="waterGelMultiplier" className="block text-sm font-medium mb-2">
                    Water Gel Multiplier
                  </label>
                  <input
                    id="waterGelMultiplier"
                    type="number"
                    step="0.01"
                    value={settings.waterGelMultiplier}
                    onChange={(e) => setSettings({...settings, waterGelMultiplier: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Current: {settings.waterGelMultiplier}</p>
                </div>
                
                <div>
                  <label htmlFor="expansionFactor" className="block text-sm font-medium mb-2">
                    Expansion Factor
                  </label>
                  <input
                    id="expansionFactor"
                    type="number"
                    step="0.01"
                    value={settings.expansionFactor}
                    onChange={(e) => setSettings({...settings, expansionFactor: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Current: {settings.expansionFactor}</p>
                </div>
                
                <div>
                  <label htmlFor="powderFactorMultiplier" className="block text-sm font-medium mb-2">
                    Powder Factor Multiplier
                  </label>
                  <input
                    id="powderFactorMultiplier"
                    type="number"
                    step="0.01"
                    value={settings.powderFactorMultiplier}
                    onChange={(e) => setSettings({...settings, powderFactorMultiplier: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Current: {settings.powderFactorMultiplier}</p>
                </div>
                
                <div>
                  <label htmlFor="royaltyRatePerM3" className="block text-sm font-medium mb-2">
                    Royalty Rate per m³ (LKR)
                  </label>
                  <input
                    id="royaltyRatePerM3"
                    type="number"
                    step="0.01"
                    value={settings.royaltyRatePerM3}
                    onChange={(e) => setSettings({...settings, royaltyRatePerM3: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Current: {settings.royaltyRatePerM3}</p>
                </div>
                
                <div>
                  <label htmlFor="ssclPercentage" className="block text-sm font-medium mb-2">
                    SSCL Percentage (%)
                  </label>
                  <input
                    id="ssclPercentage"
                    type="number"
                    step="0.01"
                    value={settings.ssclPercentage}
                    onChange={(e) => setSettings({...settings, ssclPercentage: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Current: {settings.ssclPercentage}%</p>
                </div>
                
                <div>
                  <label htmlFor="vatPercentage" className="block text-sm font-medium mb-2">
                    VAT Percentage (%)
                  </label>
                  <input
                    id="vatPercentage"
                    type="number"
                    step="0.01"
                    value={settings.vatPercentage}
                    onChange={(e) => setSettings({...settings, vatPercentage: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Current: {settings.vatPercentage}%</p>
                </div>
                
                <div>
                  <label htmlFor="defaultPowderFactor" className="block text-sm font-medium mb-2">
                    Default Powder Factor
                  </label>
                  <input
                    id="defaultPowderFactor"
                    type="number"
                    step="0.01"
                    value={settings.defaultPowderFactor}
                    onChange={(e) => setSettings({...settings, defaultPowderFactor: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-400">Used when powder factor is zero</p>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                >
                  Reset to Defaults
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Royalty Calculation Formula</h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold">Step 1: Calculate Total Explosive Quantity (TEQ)</h3>
                <pre className="mt-2 p-3 bg-gray-800 rounded-md overflow-x-auto">
                  TEQ = (Water Gel × {settings.waterGelMultiplier}) + NH4NO3
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Step 2: Calculate Blasted Rock Volume</h3>
                <pre className="mt-2 p-3 bg-gray-800 rounded-md overflow-x-auto">
                  Expanded Blasted Rock Volume = (TEQ × {settings.expansionFactor}) / (Powder Factor × {settings.powderFactorMultiplier})
                  {'\n'}Default Powder Factor when zero: {settings.defaultPowderFactor}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Step 3: Calculate Royalty Fee</h3>
                <pre className="mt-2 p-3 bg-gray-800 rounded-md overflow-x-auto">
                  Royalty = Blasted Rock Volume × {settings.royaltyRatePerM3}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Step 4: Apply Additional Charges</h3>
                <pre className="mt-2 p-3 bg-gray-800 rounded-md overflow-x-auto">
                  SSCL ({settings.ssclPercentage}%): Royalty with SSCL = Royalty × {1 + settings.ssclPercentage/100}
                  VAT ({settings.vatPercentage}%): Total Amount Due = Royalty with SSCL × {1 + settings.vatPercentage/100}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
} 