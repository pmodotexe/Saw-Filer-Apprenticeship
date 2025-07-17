import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "686eb0d681a2d54ea8671c25", 
  requiresAuth: true // Ensure authentication is required for all operations
});
