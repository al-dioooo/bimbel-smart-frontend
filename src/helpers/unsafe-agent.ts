import { Agent } from "undici"

export const unsafeAgent = new Agent({
    connect: {
        rejectUnauthorized: false,  // 🔥 ignore SSL validation
    },
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10,
})