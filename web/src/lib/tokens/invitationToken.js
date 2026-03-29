function decodeBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const base64Value = `${normalized}${padding}`;

  if (typeof atob === "function") {
    const decoded = atob(base64Value);
    return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  }

  return Uint8Array.from(Buffer.from(base64Value, "base64"));
}

function parseJson(buffer, errorMessage) {
  try {
    return JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    throw new Error(errorMessage);
  }
}

async function importInvitationPublicKey(publicKeyJwk) {
  return crypto.subtle.importKey(
    "jwk",
    {
      ...publicKeyJwk,
      ext: true,
      key_ops: ["verify"],
    },
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    false,
    ["verify"]
  );
}

export async function verifyInvitationToken(token, publicKeyJwk) {
  if (typeof token !== "string" || token.trim() === "") {
    throw new Error("Invalid invitation token.");
  }

  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new Error("Invalid invitation token.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = tokenParts;
  const header = parseJson(decodeBase64Url(encodedHeader), "Invalid invitation token.");
  const payload = parseJson(decodeBase64Url(encodedPayload), "Invalid invitation token.");

  if (header.alg !== "ES256" || header.typ !== "CAIT") {
    throw new Error("Invalid invitation token.");
  }

  const publicKey = await importInvitationPublicKey(publicKeyJwk);
  const isValid = await crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    publicKey,
    decodeBase64Url(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );

  if (!isValid) {
    throw new Error("Invalid invitation token.");
  }

  if (
    typeof payload.blueprintId !== "string" ||
    typeof payload.invitationId !== "string" ||
    typeof payload.expiresAt !== "string"
  ) {
    throw new Error("Invalid invitation token.");
  }

  return payload;
}
