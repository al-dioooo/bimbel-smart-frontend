import { unsafeAgent } from "./unsafe-agent"

// Wrap original fetch
const originalFetch = globalThis.fetch

// Override global fetch
globalThis.fetch = (input: any, init: any = {}) => {
    return originalFetch(input, {
        ...init,
        // ⚠️ Only works in Node runtime
        dispatcher: unsafeAgent,
    } as any)
}