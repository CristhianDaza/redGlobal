import { ref } from 'vue'

export interface Notification {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  isClosed?: boolean
}

const notifications = ref<Notification[]>([])

export const NotificationService = {
  push(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = {
      ...notification,
      id,
      type: notification.type || 'info',
      duration: notification.duration || 2000
    }

    notifications.value.push(newNotification)

    if (!notification.isClosed) {
      setTimeout(() => {
        this.remove(id)
      }, newNotification.duration)
    }
  },

  remove(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  },

  getNotifications() {
    return notifications
  }
}
