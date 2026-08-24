const ITERATIONS = 100_000;
const HASH_ALGO = "SHA-256";
const KEY_LENGTH = 32;

const toBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
};

const fromBase64 = (value: string) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
};

const deriveBits = async (password: string, salt: Uint8Array, iterations: number) => {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"],
    );
    return crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: HASH_ALGO },
        keyMaterial,
        KEY_LENGTH * 8,
    );
};

export const hashPassword = async (password: string) => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const bits = await deriveBits(password, salt, ITERATIONS);
    return `pbkdf2$${ITERATIONS}$${toBase64(salt.buffer)}$${toBase64(bits)}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
    const [scheme, iterationsRaw, saltB64, expectedB64] = storedHash.split("$");
    if (scheme !== "pbkdf2") return false;

    const iterations = Number(iterationsRaw);
    if (!Number.isInteger(iterations) || iterations < 1) return false;

    const bits = await deriveBits(password, fromBase64(saltB64), iterations);
    const expected = fromBase64(expectedB64);

    if (expected.length !== new Uint8Array(bits).length) return false;

    let diff = 0;
    const actual = new Uint8Array(bits);
    for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
    return diff === 0;
};
