'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  image_name: File | null;
  longDes: string;
}

export default function MapLocationsPage() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setShortDescription] = useState('');
  const [image_name, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [longDes, setLongDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('description', description);
      formData.append('longDes', longDes);
      if (image_name) {
        formData.append('image', image_name);
      }

      const response = await fetch('/api/mapLocations', {
        method: 'POST',
        body: formData, // Send as FormData instead of JSON
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save location');
      }

      // Reset form
      setName('');
      setLatitude('');
      setLongitude('');
      setShortDescription('');
      setImage(null);
      setImagePreview('');
      setLongDescription('');

      Swal.fire({
        title: 'Success!',
        text: 'Location saved successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error saving location:', error);
      Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to save location',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-10 h-10 text-[var(--primary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-4xl font-bold text-[var(--foreground)]">Map Locations</h1>
          </div>
          <p className="text-lg text-[var(--secondary)] max-w-2xl mx-auto">
            Add and manage map locations for the mining sites with detailed information and visual documentation.
          </p>
        </div>

        <div className="bg-[var(--card-background)] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-7 h-7 text-[var(--primary)] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Add Map Location</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-[var(--background)] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <label className="text-sm font-semibold text-[var(--foreground)]">Location Name</label>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter location name"
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[var(--background)] p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <label className="text-sm font-semibold text-[var(--foreground)]">Latitude</label>
                </div>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  placeholder="Enter latitude"
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="bg-[var(--background)] p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <label className="text-sm font-semibold text-[var(--foreground)]">Longitude</label>
                </div>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  placeholder="Enter longitude"
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="bg-[var(--background)] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <label className="text-sm font-semibold text-[var(--foreground)]">Short Description</label>
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setShortDescription(e.target.value)}
                required
                placeholder="Enter a brief description"
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="bg-[var(--background)] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <label className="text-sm font-semibold text-[var(--foreground)]">Location Image</label>
              </div>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
                />
                {imagePreview && (
                  <div className="mt-4 relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-lg"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[var(--background)] p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <label className="text-sm font-semibold text-[var(--foreground)]">Long Description</label>
              </div>
              <textarea
                value={longDes}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={4}
                placeholder="Enter detailed description"
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--primary)]/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving Location...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Location</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}