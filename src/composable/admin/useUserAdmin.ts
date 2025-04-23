import type { User, UserFormData } from '@/types/common.d';
import { ref, computed } from 'vue';
import { useUserStore, useAuthStore } from '@/store';
import { uploadImage } from '@/config';

export function useUserAdmin() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const showUserModal = ref(false);
  const editingUser = ref<User | null>(null);

  const users = computed(() => userStore.users);
  const activeUsers = computed(() => users.value.filter(u => u.active).length);
  const inactiveUsers = computed(() => users.value.filter(u => !u.active).length);
  const totalUsers = computed(() => users.value.length);

  const loadUsers = async () => {
    await userStore.getUsers();
  };

  const currentUser = computed(() => {
    return users.value.find(u => u.email === authStore.user?.email);
  });

  const handleSaveUser = async (formData: UserFormData) => {
    try {
      isLoading.value = true;
      let logoUrl = '';
      if (formData.logo instanceof File) {
        try {
          const uploadResult = await uploadImage(formData.logo);
          logoUrl = uploadResult.secure_url;
        } catch (error) {
          isLoading.value = false;
          console.error('Error uploading logo:', error);
        }
      }
      if (editingUser.value && currentUser.value?.role === 'admin') {
        const { password, logo, ...userData } = formData;
        await userStore.updateUser(editingUser.value.idDoc, {
          ...userData,
          logo: logoUrl || (typeof logo === 'string' ? logo : undefined)
        });
      } else {
        await userStore.createUser({
          ...formData,
          id: '',
          logo: logoUrl || undefined
        });
      }
      showUserModal.value = false;
      editingUser.value = null;
      await loadUsers();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleEditUser = (user: User) => {
    editingUser.value = { ...user };
    showUserModal.value = true;
  };

  const handleAddUser = () => {
    editingUser.value = null;
    showUserModal.value = true;
  };

  const deleteUser = async (id: string) => {
    try {
      isLoading.value = true;
      await userStore.deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      isLoading.value = true;
      await userStore.updateUser(user.idDoc, { active: !user.active });
      await loadUsers();
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    isLoading,
    showUserModal,
    editingUser,
    users,
    activeUsers,
    inactiveUsers,
    totalUsers,
    loadUsers,
    handleSaveUser,
    handleEditUser,
    handleAddUser,
    deleteUser,
    toggleUserStatus
  };
}
