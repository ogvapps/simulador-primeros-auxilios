export async function generateCertificateHash(name, date) {
  try {
    const text = 'PAS_CERT_V1_' + (name || '').trim().toLowerCase() + '_' + (date || '').trim();
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  } catch (e) {
    console.warn('Crypto error:', e);
    return 'PAS-VALID-LOCAL';
  }
}

export async function verifyCertificateHash(name, date, providedHash) {
  if (!name || !date || !providedHash) return false;
  const expectedHash = await generateCertificateHash(name, date);
  return expectedHash === providedHash;
}
