import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import BookingList from './BookingList';
import BookingForm from './BookingForm';

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('clocation_bookings');
    if (savedBookings) {
      const parsed = JSON.parse(savedBookings);
      setBookings(parsed.map((booking: any) => ({
        ...booking,
        scheduledDate: new Date(booking.scheduledDate),
        createdAt: new Date(booking.createdAt)
      })));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('clocation_bookings', JSON.stringify(newBookings));
  };

  const handleSave = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    if (editingBooking) {
      // Update existing booking
      const updatedBookings = bookings.map(booking =>
        booking.id === editingBooking.id
          ? { ...bookingData, id: editingBooking.id, createdAt: editingBooking.createdAt }
          : booking
      );
      saveBookings(updatedBookings);
    } else {
      // Create new booking
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      saveBookings([...bookings, newBooking]);
    }

    setEditingBooking(null);
    setShowForm(false);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingBooking(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingBooking(null);
    setShowForm(false);
  };

  const handleDelete = (bookingId: string) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    saveBookings(updatedBookings);
  };

  if (showForm) {
    return (
      <BookingForm
        booking={editingBooking}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <BookingList
      bookings={bookings}
      onEdit={handleEdit}
      onNew={handleNew}
      onDelete={handleDelete}
    />
  );
};

export default BookingManager;