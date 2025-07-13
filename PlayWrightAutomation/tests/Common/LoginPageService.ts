export function extractDomainFromText(text: string): string {
  const arrayText = text.split('@');
  return arrayText[1].split(' ')[0];
}