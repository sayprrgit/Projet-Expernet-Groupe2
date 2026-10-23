import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services/api';
import type { User } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  let pending: Promise<void> | null = null;

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isFormateur = computed(() => user.value?.role === 'FORMATEUR');
  const isEtudiant = computed(() => user.value?.role === 'ETUDIANT');
  const homePath = computed(() => '/galia');

  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const res = await apiService.login(email, password);
      token.value = res.token;
      user.value = res.user;
      localStorage.setItem('token', res.token);
      return { success: true as const };
    } catch (err: any) {
      return {
        success: false as const,
        message:
          err?.response?.data?.message ||
          'Connexion impossible. Vérifiez vos identifiants.',
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function ensureSession(): Promise<void> {
    if (user.value) return;
    if (!token.value) return;
    if (pending) return pending;

    pending = (async () => {
      try {
        user.value = await apiService.getMe();
      } catch {
        setToken(null);
      } finally {
        pending = null;
      }
    })();

    return pending;
  }

  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
      user.value = null;
    }
  }

  function logout() {
    setToken(null);
  }

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isFormateur,
    isEtudiant,
    homePath,
    login,
    ensureSession,
    setToken,
    logout,
  };
});
