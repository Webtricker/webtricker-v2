import PusherClient from 'pusher-js';

// Prevent SSR errors by only instantiating Pusher in the browser environment
export const pusherClient = typeof window !== 'undefined' 
  ? new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    )
  : null as any;
