// Decodes a JWT's payload without verifying the signature.
// This is safe here because we only use it to read non-secret display
// data (tuitionClassId, name) already visible to the logged-in user -
// the backend still verifies the token's signature on every real request.
export function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
