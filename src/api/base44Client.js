import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686b9c4395291d47ac10056d", 
  requiresAuth: true // Ensure authentication is required for all operations
});
