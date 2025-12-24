import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Booking {
    id: string; // booking_code
    name: string; // decrypted from name_encrypted
    unit: string; // unit_type
    time: string; // time_slot
    status: string;
    phone: string;
}

interface BookingRow {
    booking_code: string;
    name_encrypted: string;
    unit_type: string;
    time_slot: string;
    status: string;
    phone: string;
}

export const useBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (data) {
                // Create a typed reference to the data
                const rows = data as unknown as BookingRow[];
                const decryptedBookings: Booking[] = rows.map((item) => ({
                    id: item.booking_code,
                    name: item.name_encrypted, // Keep encrypted
                    unit: item.unit_type,
                    time: item.time_slot,
                    status: item.status,
                    phone: item.phone, // Keep encrypted (assuming it is stored encrypted in phone column or passing raw if that's what's in DB)
                }));
                setBookings(decryptedBookings);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // Optional: Realtime subscription could go here
    }, []);

    const updateBookingStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('booking_code', id);

            if (error) throw error;

            // Optimistic update
            setBookings(prev => prev.map(b =>
                b.id === id ? { ...b, status } : b
            ));

            return { success: true };
        } catch (err) {
            console.error('Error updating status:', err);
            return { success: false, error: err };
        }
    };

    const deleteBooking = async (id: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('booking_code', id);

            if (error) throw error;

            // Optimistic update
            setBookings(prev => prev.filter(b => b.id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting booking:', err);
            return { success: false, error: err };
        }
    };

    return { bookings, loading, error, refetch: fetchBookings, updateBookingStatus, deleteBooking };
};
