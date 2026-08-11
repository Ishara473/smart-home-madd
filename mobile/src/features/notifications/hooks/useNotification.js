import { useState, useEffect } from 'react';
import { NotificationRepository } from '../repository/NotificationRepository';

/**
 * Hook returning a single notification and a markAsRead callback
 * that delegates to the repository for Firebase-ready abstraction.
 */
export function useNotification(id) {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      try {
        const data = NotificationRepository.getNotificationById(id);
        if (data) {
          setNotification(data);
        } else {
          setError('Notification not found');
        }
      } catch (err) {
        setError('Failed to load notification details');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [id]);

  const markAsRead = () => {
    try {
      const updated = NotificationRepository.markAsRead(id);
      if (updated) {
        setNotification(updated);
      }
    } catch (err) {
      console.warn('Failed to mark notification as read', err);
    }
  };

  return {
    notification,
    loading,
    error,
    markAsRead,
  };
}

export default useNotification;
