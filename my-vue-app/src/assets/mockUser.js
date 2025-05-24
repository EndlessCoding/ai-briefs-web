// Mock user data
export const mockUser = {
  id: 'user001',
  email: 'testuser@example.com',
  nickname: '测试用户', // Default nickname from MainLayout
  avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', // Default Element Plus avatar
  isSubscribedToBriefings: true,
  preferences: {
    // other preferences can go here
  }
};

// Function to update mock user data (simulates backend update)
export const updateUserEmail = (newEmail) => {
  if (typeof newEmail === 'string') {
    mockUser.email = newEmail;
    console.log(`Mock user email updated to: ${newEmail}`);
    return true;
  }
  return false;
};

export const updateUserSubscription = (subscribed) => {
  if (typeof subscribed === 'boolean') {
    mockUser.isSubscribedToBriefings = subscribed;
    console.log(`Mock user subscription updated to: ${subscribed}`);
    return true;
  }
  return false;
};
