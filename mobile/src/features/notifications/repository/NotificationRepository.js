import { notificationMockData } from '../data/notificationMockData';

// Local mutable in-memory store
let notifications = [...notificationMockData];

export const NotificationRepository = {
  getNotifications: () => {
    return [...notifications];
  },

  getNotificationById: (id) => {
    return notifications.find(n => n.id === id);
  },

  markAsRead: (id) => {
    notifications = notifications.map(n => {
      if (n.id !== id) return n;
      return { ...n, read: true };
    });
    return notifications.find(n => n.id === id);
  }
};

export default NotificationRepository;
