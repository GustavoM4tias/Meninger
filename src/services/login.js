import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '../store/userStore';
import { fetchComCarregamento } from '../utils/fetchComCarregamento';

const email = ref('');
const senha = ref('');
const errorMessage = ref('');
const userStore = useUserStore();
const router = useRouter();

const login = async () => {
  try {
    const response = await fetchComCarregamento('https://meninger-back.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value,
      }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      userStore.setUser(data);
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      errorMessage.value = data.message || 'Email ou senha incorretos.';
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    errorMessage.value = 'Erro ao fazer login. Tente novamente mais tarde.';
  }
};
