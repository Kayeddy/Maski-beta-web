// Onboarding types

import {
  Age,
  Color,
  Gender,
  HealthCharacteristic,
  Personality,
  Size,
  Specie,
  TrainingLevel,
} from "../pet/enums.types";

/**
 * =====================================
 * Adopter Form Data Interface
 * =====================================
 * This interface defines the structure
 * for the data collected in the adopter form.
 */
export interface AdopterFormData {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  bio: string;
  dateOfBirth: Date | string | null;
  location: string;
  adoptionPreferences: AdopterFormAdoptionPreferences | null;
}

/**
 * =====================================
 * Holder Form Data Interface
 * =====================================
 * This interface defines the structure
 * for the data collected in the holder form.
 */
export interface HolderFormData {
  email: string;
  name: string;
}

/**
 * =====================================
 * User Profile Interface
 * =====================================
 * This interface defines the structure
 * for the user profile.
 */
export interface UserProfile {
  profileType: "adopter" | "holder" | "explorer" | string;
  adopterFormTabsCompleted: string[];
  holderFormTabsCompleted: string[];
  currentForm:
    | "profileTypeSelection"
    | "adopterForm"
    | "holderForm"
    | "explorerForm";
  currentTab: string | null;
}

/**
 * =====================================
 * User Onboarding State Interface
 * =====================================
 * This interface defines the structure
 * for the state of user onboarding, extending the user profile.
 */
export interface UserOnboardingState extends UserProfile {
  adopterFormData: AdopterFormData;
  holderFormData: HolderFormData;
}

/**
 * =====================================
 * Adopter Form Adoption Preferences Interface
 * =====================================
 * This interface defines the structure
 * for the adoption preferences in the adopter form.
 */
export interface AdopterFormAdoptionPreferences {
  preferredAnimalSpecies: Specie;
  preferredAnimalGender: Gender;
  preferredAnimalAge: Age[];
  preferredAnimalColor: Color;
  preferredAnimalSize: Size[];
  preferredAnimalPersonality: Personality[];
  preferredAnimalHealthCharacteristic: HealthCharacteristic[];
  preferredAnimalTrainingLevel: TrainingLevel[];
}
