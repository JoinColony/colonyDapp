export function getEventMetadataVersion(response: string): number {
  const res = JSON.parse(response);
  console.log(`🚀 ~ METADATA version:`, res?.version);
  return (res?.version as number) || 1;
}
