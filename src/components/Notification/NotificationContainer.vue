<!-- NotificationContainer.vue -->
<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="[notification.type]"
      >
        <div class="notification-content">
          <h4>{{ notification.title }}</h4>
          <p v-if="notification.description">{{ notification.description }}</p>
          <button
            v-if="notification.isClosed !== undefined ? notification.isClosed : true"
            class="notification-close"
            @click="remove(notification.id)"
          >
            ×
          </button>
        </div>
        <div v-if="!notification.isClosed" class="notification-progress">
          <div
            class="progress-bar"
            :style="{ 
              animationDuration: `${notification.duration}ms`,
              animationPlayState: 'running'
            }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { NotificationService } from './NotificationService'
import { computed } from 'vue'

const notifications = computed(() => NotificationService.getNotifications().value)
const remove = (id: string) => NotificationService.remove(id)
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
}

.notification {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px;
  position: relative;
  overflow: hidden;
}

.notification.success {
  border-left: 4px solid #4caf50;
}

.notification.error {
  border-left: 4px solid #f44336;
}

.notification.warning {
  border-left: 4px solid #ff9800;
}

.notification.info {
  border-left: 4px solid #2196f3;
}

.notification-content {
  margin-right: 20px;
}

.notification h4 {
  margin: 0 0 5px;
  font-size: 16px;
}

.notification p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.notification-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.notification-close:hover {
  background: rgba(0, 0, 0, 0.05);
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  background: currentColor;
  width: 100%;
  transform-origin: left;
  animation: progress linear;
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
