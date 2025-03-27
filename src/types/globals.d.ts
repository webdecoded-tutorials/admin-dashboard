export {}

export type Roles = "admin" | "user" | "guest" | "member";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        }
    }
}