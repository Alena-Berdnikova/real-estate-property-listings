export const apifyConfig = {
  maxResultsPerProvider: 20,
  providers: ['realtor'] as const,
  offerTypes: ['sale'] as const,
  deduplicateResults: true,
  units: 'imperial' as const,
};