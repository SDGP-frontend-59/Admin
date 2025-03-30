'use client'

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface Contact {
    id: string;
    name: string;
    email: string;
    message: string;
}

export default function ContactPage() {
    const [contactData, setContactData] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/contact');
            const data = await response.json();
            setContactData(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);
    
    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--foreground)]"></div>
                </div>  
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Contact Responses</h1>
                    <p className="text-lg text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
                        View all contact responses in one place.
                    </p>
                </div>

                <div className="bg-[var(--background)] rounded-xl shadow-lg p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--foreground)]">
                                    <th className="text-left py-4 px-6">Name</th>
                                    <th className="text-left py-4 px-6">Email</th>
                                    <th className="text-left py-4 px-6">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contactData.map((contact) => (
                                    <tr key={contact.id} className="border-b border-[var(--foreground)] opacity-70">
                                        <td className="py-4 px-6">{contact.name}</td>
                                        <td className="py-4 px-6">{contact.email}</td>
                                        <td className="py-4 px-6">{contact.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
