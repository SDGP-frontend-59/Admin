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
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Settings</h1>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
          </div>
        </div>
        
        <div className="bg-[var(--card-background)] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-7 h-7 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Royalty Calculation Constants</h2>
          </div>
          
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'waterGelMultiplier', label: 'Water Gel Multiplier', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
                { id: 'expansionFactor', label: 'Expansion Factor', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                { id: 'powderFactorMultiplier', label: 'Powder Factor Multiplier', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
                { id: 'royaltyRatePerM3', label: 'Royalty Rate per m³ (LKR)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'ssclPercentage', label: 'SSCL Percentage (%)', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                { id: 'vatPercentage', label: 'VAT Percentage (%)', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                { id: 'defaultPowderFactor', label: 'Default Powder Factor', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' }
              ].map(({ id, label, icon }) => (
                <div key={id} className="bg-[var(--background)] p-6 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                    <label htmlFor={id} className="text-sm font-semibold text-[var(--foreground)]">
                      {label}
                    </label>
                  </div>
                  <input
                    id={id}
                    type="number"
                    step="0.01"
                    value={settings[id as keyof RoyaltySettings]}
                    onChange={(e) => setSettings({...settings, [id]: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--input-background)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] transition-all duration-200"
                    required
                  />
                  <p className="mt-2 text-sm text-[var(--secondary)]">
                    Current: {settings[id as keyof RoyaltySettings]}{id.includes('Percentage') ? '%' : ''}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleResetSettings}
                className="px-6 py-3 bg-[var(--background)] hover:bg-[var(--background)]/80 text-[var(--foreground)] rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset to Defaults
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-[var(--card-background)] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 mt-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-7 h-7 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Royalty Calculation Formula</h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                title: 'Step 1: Calculate Total Explosive Quantity (TEQ)',
                formula: `TEQ = (Water Gel × ${settings.waterGelMultiplier}) + NH4NO3`,
                icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
              },
              {
                title: 'Step 2: Calculate Blasted Rock Volume',
                formula: `Expanded Blasted Rock Volume = (TEQ × ${settings.expansionFactor}) / (Powder Factor × ${settings.powderFactorMultiplier})\nDefault Powder Factor when zero: ${settings.defaultPowderFactor}`,
                icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              },
              {
                title: 'Step 3: Calculate Royalty Fee',
                formula: `Royalty = Blasted Rock Volume × ${settings.royaltyRatePerM3}`,
                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              },
              {
                title: 'Step 4: Apply Additional Charges',
                formula: `SSCL (${settings.ssclPercentage}%): Royalty with SSCL = Royalty × ${1 + settings.ssclPercentage/100}\nVAT (${settings.vatPercentage}%): Total Amount Due = Royalty with SSCL × ${1 + settings.vatPercentage/100}`,
                icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
              }
            ].map((step, index) => (
              <div key={index} className="bg-[var(--background)] p-6 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{step.title}</h3>
                </div>
                <pre className="mt-2 p-4 bg-[var(--card-background)] rounded-lg text-[var(--foreground)] font-mono text-sm overflow-x-auto">
                  {step.formula}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 