'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import RoyaltyCalculator from "../components/RoyaltyCalculator";
import UserGreeting from "../components/UserGreeting";
import ErrorBoundary from '../components/ErrorBoundary';
import { toast } from 'react-hot-toast';
import { Miner } from '../types/settings';

export default function RoyaltyPage() {
  const [miners, setMiners] = useState([]);
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [miningStats, setMiningStats] = useState({
    explosiveQuantity: 0,
    blastedVolume: 0,
    totalRoyalty: 0,
    dueDate: '',
    lastCalculated: ''
  });

  // Fetch miners from the API
  useEffect(() => {
    const fetchMiners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/calculate-royalty');
        if (!response.ok) throw new Error('Failed to fetch miners');
        const data = await response.json();
        setMiners(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch miners');
        setIsLoading(false);
      }
    };

    fetchMiners();
  }, []);

  // Filter miners based on search term
  const filteredMiners = miners.filter((miner: Miner) =>
    (miner.first_name + ' ' + miner.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMinerSelect = (miner: Miner) => {
    setSelectedMiner(miner);
    setSearchTerm('');
  };

  const handleCalculated = (data: any) => {
    if (!selectedMiner) {
      toast.error('Please select a miner first');
      return;
    }
    
    // Just update UI with calculation results
    setMiningStats({
      explosiveQuantity: data.calculations.total_explosive_quantity,
      blastedVolume: data.calculations.blasted_rock_volume,
      totalRoyalty: data.calculations.total_amount_with_vat,
      dueDate: data.payment_due_date || new Date(Date.now() + 14*24*60*60*1000).toISOString(),
      lastCalculated: data.calculation_date
    });
    
    // Return the prepared data for RoyaltyCalculator to use
    return {
      ...data,
      selectedMiner
    };
  };

  const handleSaveCalculation = async (data: any) => {
    if (!selectedMiner) {
      toast.error('Please select a miner first');
      return false;
    }

    try {
      // Prepare the royalty data
      const royaltyData = {
        miner_id: selectedMiner.id,
        water_gel: data.inputs.water_gel_kg,
        nh4no3: data.inputs.nh4no3_kg,
        powder_factor: data.inputs.powder_factor,
        total_explosive_quantity: data.calculations.total_explosive_quantity,
        blasted_rock_volume: data.calculations.blasted_rock_volume,
        base_royalty: data.calculations.base_royalty,
        royalty_with_sscl: data.calculations.royalty_with_sscl,
        total_amount: data.calculations.total_amount_with_vat,
        calculation_date: data.calculation_date,
        payment_due_date: data.payment_due_date || new Date(Date.now() + 14*24*60*60*1000).toISOString()
      };

      // Save to database
      const response = await fetch('/api/calculate-royalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(royaltyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save royalty calculation');
      }

      toast.success('Royalty calculation saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving royalty:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save royalty calculation');
      return false;
    }
  };

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <UserGreeting />
        <div className="bg-[var(--card-background)] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
          
          {/* Miner Search Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-7 h-7 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Select Miner</h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
                <span className="ml-3 text-[var(--secondary)]">Loading miners...</span>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search miner by name..."
                    className="w-full px-4 py-3 rounded-lg bg-[var(--input-background)] border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] transition-all duration-200"
                  />
                  <svg className="w-5 h-5 text-[var(--secondary)] absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Dropdown for search results */}
                {searchTerm && filteredMiners.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-[var(--border)] max-h-60 overflow-auto">
                    {filteredMiners.map((miner: Miner) => (
                      <div
                        key={miner.id}
                        onClick={() => handleMinerSelect(miner)}
                        className="px-4 py-3 hover:bg-[var(--background)] cursor-pointer text-[var(--foreground)] transition-colors duration-200 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{miner.first_name + ' ' + miner.last_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Miner Info */}
          {selectedMiner && (
            <div className="mb-8 p-6 bg-[var(--background)] rounded-lg border border-[var(--border)] transition-all duration-300 hover:border-[var(--primary)]">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-[var(--primary)] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Selected Miner</h3>
              </div>
              <div className="space-y-2">
                <p className="text-[var(--foreground)] font-medium">{selectedMiner.first_name + ' ' + selectedMiner.last_name}</p>
                <p className="text-sm text-[var(--secondary)]">ID: {selectedMiner.id}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-8">
            <svg className="w-7 h-7 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Mining Royalty Calculator</h2>
          </div>

          <ErrorBoundary>
            <RoyaltyCalculator 
              onCalculated={handleCalculated}
              onSaveCalculation={handleSaveCalculation}
            />
          </ErrorBoundary>
        </div>
      </main>
    </Layout>
  );
}
