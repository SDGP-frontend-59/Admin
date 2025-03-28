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
    setSearchTerm(miner.first_name + ' ' + miner.last_name);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-gray-800">
        <UserGreeting />
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          
          
          {/* Miner Search Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Miner</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading miners...</span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search miner by name..."
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                />
                
                {/* Dropdown for search results */}
                {searchTerm && filteredMiners.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredMiners.map((miner: Miner) => (
                      <div
                        key={miner.id}
                        onClick={() => handleMinerSelect(miner)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      >
                        {miner.first_name + ' ' + miner.last_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Miner Info */}
          {selectedMiner && (
            <div className="mb-8 p-4 bg-blue-50 rounded-md text-gray-800 border border-blue-200">
              <h3 className="font-medium text-blue-800">Selected Miner:</h3>
              <p>{selectedMiner.first_name + ' ' + selectedMiner.last_name}</p>
              <p className="text-xs text-gray-500">ID: {selectedMiner.id}</p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-8 text-gray-900">Mining Royalty Calculator</h2>
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
