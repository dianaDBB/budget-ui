export function downloadFile(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function generateFileName(bankName: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${bankName}_${timestamp}.xlsx`;
}
