import type { SocialPlatform } from '@/content/types';

export const socialPlatforms: SocialPlatform[] = ['google', 'facebook', 'yelp', 'apple'];

export const platformLabels: Record<SocialPlatform, string> = {
  google: 'Google',
  facebook: 'Facebook',
  yelp: 'Yelp',
  apple: 'Apple',
};
