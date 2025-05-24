import { reactive } from 'vue';

export const authStore = reactive({
  isLoggedIn: false,
  username: '游客', // Default guest username
  avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // Default guest avatar

  login(newUsername = '测试用户', newAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png') {
    this.isLoggedIn = true;
    this.username = newUsername;
    this.avatarUrl = newAvatar; // Could be fetched or based on user
    console.log('User logged in:', this.username);
  },

  logout() {
    this.isLoggedIn = false;
    this.username = '游客';
    this.avatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
    console.log('User logged out');
  }
});
