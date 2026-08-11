import NotificationRepository from '../../features/notifications/repository/NotificationRepository';

export const MockNotificationRepository = {
  getAll: async () => NotificationRepository.getNotifications(),
  getById: async (id) => NotificationRepository.getNotificationById(id),
  create: async (data) => ({ id: `notif_${Date.now()}`, ...data }),
  update: async (id, data) => ({ id, ...data }),
  remove: async (id) => true,
};

export default MockNotificationRepository;
