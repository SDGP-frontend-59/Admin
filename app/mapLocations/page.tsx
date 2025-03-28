'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  short_description: string;
  image: File | null;
  long_description: string;
}

export default function MapLocationsPage() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [longDescription, setLongDescription] = useState('');
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
      formData.append('short_description', shortDescription);
      formData.append('long_description', longDescription);
      if (image) {
        formData.append('image', image);
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
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Map Locations</h1>
          <p className="text-lg text-[var(--foreground)] opacity-80">
            Add and manage map locations for the mining sites.
          </p>
        </div>

        <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Add Map Location</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--input-background)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--input-background)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--input-background)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
                className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--input-background)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--input-background)]"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded-md"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Long Description</label>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={4}
                className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--input-background)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--foreground)] text-white py-2 px-4 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Location'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}