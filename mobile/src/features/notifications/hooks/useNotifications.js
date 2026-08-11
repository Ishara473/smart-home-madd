import { useState, useEffect } from 'react';
import { NotificationRepository as MockNotificationRepository } from '../repository/NotificationRepository';
import { notificationRepository as firebaseNotificationRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';

/**
 * Hook returning notification list plus computed unreadCount.
 * Source: Firestore realtime (production, homeId from AuthContext) or MockData.
 */
export function useNotifications() {
  const { homeId, loading: homeLoading } = useHomeContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (homeLoading) return;

    if (shouldUseMockData()) {
      setLoading(true);
      const delay = setTimeout(() => {
        try {
          const data = MockNotificationRepository.getNotifications();
          const sorted = [...data].sort((a, b) => {
            if (a.read !== b.read) return a.read ? 1 : -1;
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          setNotifications(sorted);
          setUnreadCount(sorted.filter(n => !n.read).length);
        } catch (err) {
          setError('Failed to retrieve notifications');
        } finally {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    }

    if (!isFirebaseConfigured() || !homeId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firebaseNotificationRepository.subscribeToNotifications(homeId, async (data) => {
      const mapped = data.map(n => ({
        ...n,
        read: n.isRead,
        timestamp: n.createdAt?.toDate?.()?.toISOString() || n.timestamp,
      }));
      const sorted = [...mapped].sort((a, b) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setNotifications(sorted);
      setError(null);

      try {
        const count = await firebaseNotificationRepository.getUnreadCount(homeId);
        setUnreadCount(count);
      } catch (e) {
        console.error('[useNotifications] Failed to fetch unread count', e);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [homeId, homeLoading]);

  const refresh = () => {
    if (isFirebaseConfigured() && !shouldUseMockData() && homeId) {
      firebaseNotificationRepository.getUnreadCount(homeId).then(setUnreadCount).catch(console.error);
    }
  };

  const markRead = async (id) => {
    if (shouldUseMockData()) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      return;
    }
    try {
      await firebaseNotificationRepository.markNotificationRead(id);
    } catch (err) {
      console.error('[useNotifications] markRead failed', err);
    }
  };

  return { notifications, loading, error, unreadCount, refresh, markRead };
}

export default useNotifications;
