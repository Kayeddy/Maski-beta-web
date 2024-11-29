// Base user interfaces

import { IConversation, IMessage } from "../hub/chat/interfaces.types";
import { AdopterFormAdoptionPreferences } from "../onboarding/interfaces.types";
import { ProfileType } from "./enums.types";

/**
 * =====================================
 * IUser Interface
 * =====================================
 * This interface defines the structure
 * for a user in the application.
 */
export interface IUser {
  _id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  bio: string;
  dateOfBirth: Date;
  location: string;
  email: string;
  password?: string;
  profilePicture?: string;
  profiles?: string[];
  currentProfile?: string;
  onboarded: boolean;
  currentOnboardingState: {
    form: string;
    tab: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * =====================================
 * IUserPreferences Interface
 * =====================================
 * This interface defines the structure
 * for user preferences.
 */
export interface IUserPreferences {
  theme: string;
}

// User server actions interfaces

/**
 * =====================================
 * UserRegistration Interface
 * =====================================
 * This interface defines the structure
 * for user registration payload.
 */
export interface UserRegistration {
  data: {
    email: string;
    profileType?: string;
    profileData?: any;
  };
  sessionToken: string | null;
}

/**
 * =====================================
 * UserUpdate Interface
 * =====================================
 * This interface defines the structure
 * for user update payload.
 */
export interface UserUpdate {
  userId: string | null | undefined;
  sessionToken: string | null;
  data:
    | {
        email?: string;
        firstName?: string;
        middleName?: string;
        lastName?: string;
        bio?: string;
        dateOfBirth?: Date | string | null;
        location?: string;
      }
    | {};
}

// User profile interfaces

/**
 * =====================================
 * IProfile Interface
 * =====================================
 * Base interface for all user profiles.
 */
export interface IProfile extends Document {
  userId: string;
  type: ProfileType;
  conversations?: IConversation[];
  messages?: IMessage[];
  profileData?: IAdopterProfile | IPetHolderProfile; // Reference to a detailed profile model depending on the type
}

// Adopter profile interfaces

/**
 * =====================================
 * IAdopterProfile Interface
 * =====================================
 * This interface defines the structure
 * for an adopter profile.
 */
export interface IAdopterProfile extends Document {
  userPreferences?: IUserPreferences;
  adoptionPreferences: AdopterFormAdoptionPreferences;
  likedPets?: string[];
  adoptionHistory?: string[];
}

// Pet holder interfaces

/**
 * =====================================
 * IIndividualDetails Interface
 * =====================================
 * This interface defines the structure
 * for individual pet holder details.
 */
interface IIndividualDetails {
  associatedPets: string[];
}

/**
 * =====================================
 * IOrganizationDetails Interface
 * =====================================
 * This interface defines the structure
 * for organization pet holder details.
 */
interface IOrganizationDetails {
  organizationImage?: string;
  organizationName: string;
  organizationDescription: string;
  associatedPets: string[];
  // Add other organization-specific fields here
}

/**
 * =====================================
 * IPetHolderProfile Interface
 * =====================================
 * This interface defines the structure
 * for a pet holder profile document.
 */
export interface IPetHolderProfile extends Document {
  holderType: "Individual" | "Organization";
  individualDetails?: IIndividualDetails;
  organizationDetails?: IOrganizationDetails;
}

// Profile server actions interfaces

/**
 * =====================================
 * ProfileCreationProps Interface
 * =====================================
 * This interface defines the structure
 * for the payload to create a user profile.
 */
export interface ProfileCreationProps {
  userId: string;
  type: string; // Selected profile type
  data: {}; // Data for the selected profile type
  sessionToken: string | null;
}

/**
 * =====================================
 * UpdateProfileData Interface
 * =====================================
 * This interface defines the structure
 * for the payload to update a user profile.
 */
export interface UpdateProfileData {
  userId: any;
  profileId: any;
  type?: string;
  data?: any | {};
  sessionToken: string | null;
}

/**
 * =====================================
 * GetProfileData Interface
 * =====================================
 * This interface defines the structure
 * for the payload to get user profile data.
 */
export interface GetProfileData {
  profileId: string;
  sessionToken: string | null;
}
