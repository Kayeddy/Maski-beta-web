// src/lib/types/pet/options.ts

import {
  Specie,
  Gender,
  HealthCharacteristic,
  Size,
  Age,
  Color,
  Personality,
  LivingWithAnimalsCompatibility,
  LivingWithKidsCompatibility,
  TrainingLevel,
} from "@/lib/types/pet/enums.types";

export const options = {
  "What is the specie of the pet?": Specie,
  "What is the gender of the pet?": Gender,
  "What is the health characteristic of the pet?": HealthCharacteristic,
  "What is the size of the pet?": Size,
  "What is the age of the pet?": Age,
  "What is the color of the pet?": Color,
  "What is the personality of the pet?": Personality,
  "Is the pet compatible with living with other animals?":
    LivingWithAnimalsCompatibility,
  "Is the pet compatible with living with kids?": LivingWithKidsCompatibility,
  "What is the training level of the pet?": TrainingLevel,
};

export type OptionsKeys = keyof typeof options;
