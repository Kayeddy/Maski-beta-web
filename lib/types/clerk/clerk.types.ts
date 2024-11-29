// clerk.types.ts

/**
 * =====================================
 * Clerk User Data Type Definition
 * =====================================
 * This interface defines the structure
 * for the user data returned by Clerk.
 */
export interface clerkUserDataTypeDefinition {
  firstName: string | null;
  lastName: string | null;
  emailAddresses: [];
  externalAccounts: [];
}
