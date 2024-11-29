// Operation payload interfaces

import { AdopterFormAdoptionPreferences } from "../onboarding/interfaces.types";
import { IUser } from "../user/interfaces.types";

/**
 * =====================================
 * Update User Payload Interface
 * =====================================
 * This interface defines the structure
 * for the payload to update user information.
 */
export interface UpdateUserPayload {
  userId: string;
  data: Partial<IUser>;
}

/**
 * =====================================
 * Update Profile Payload Interface
 * =====================================
 * This interface defines the structure
 * for the payload to update user profile information.
 */
export interface UpdateProfilePayload {
  userId: string;
  profileId: string;
  data: AdopterFormAdoptionPreferences;
}
