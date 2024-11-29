// Pet interface

import {
  AdoptionStatus,
  Age,
  Color,
  Gender,
  HealthCharacteristic,
  LivingWithAnimalsCompatibility,
  LivingWithKidsCompatibility,
  Personality,
  Size,
  Specie,
  TrainingLevel,
} from "./enums.types";

/**
 * =====================================
 * Pet Data Interface
 * =====================================
 * This interface defines the structure
 * for the data related to a pet.
 */
export interface IPet {
  // General Details
  _id?: string; // Pet ID
  holder: string;
  name: string;
  species: Specie;
  gender: Gender;
  age: Age;
  color: Color;
  size: Size;
  personality: Personality[];
  trainingLevel: TrainingLevel;
  bio: string;
  media: MediaData[];

  // Health Details
  health: HealthCharacteristic[];

  // Additional Details
  livingWithAnimalsCompatibility: LivingWithAnimalsCompatibility;
  livingWithKidsCompatibility: LivingWithKidsCompatibility;
  adoptionStatus: AdoptionStatus;
  likes?: string[];
}

// src/types/pet/interfaces.types.ts

/**
 * =====================================
 * Media Data Interface
 * =====================================
 * This interface defines the structure
 * for the media data related to a pet.
 */
export interface MediaData {
  fileUrl: string;
  fileType: string;
  label: string;
  fileUploadCareId: string;
}

// Pet actions interfaces

/**
 * =====================================
 * Pet Creation Interface
 * =====================================
 * This interface defines the structure
 * for the data required to create a pet.
 */
export interface PetCreation {
  data: {
    name: string;
    species: string;
    gender: string;
    age: string;
    color: string;
    size: string;
    personality: string[];
    health: string[];
    trainingLevel: string;
    livingWithAnimalsCompatibility: string;
    livingWithKidsCompatibility: string;
    adoptionStatus: string;
    media: MediaData[];
    bio: string;
  };
  sessionToken: string | null;
}

/**
 * =====================================
 * Pet Update Interface
 * =====================================
 * This interface defines the structure
 * for the data required to update a pet.
 */
export interface PetUpdate {
  petId: string;
  data: Partial<{
    name: string;
    species: string;
    gender: string;
    age: string;
    color: string;
    size: string;
    personality: string[];
    health: string[];
    trainingLevel: string;
    livingWithAnimalsCompatibility: string;
    livingWithKidsCompatibility: string;
    adoptionStatus: string;
    media: MediaData[];
    bio: string;
    likes: string[];
  }>;
  sessionToken: string | null;
}
