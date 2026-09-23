import { site } from '@/site.config';

/** Years in flooring, derived so it never goes stale (spec CH2 / N68). */
export function yearsOfExperience(now: Date = new Date(), startYear: number = site.startYear): number {
  return now.getFullYear() - startYear;
}
