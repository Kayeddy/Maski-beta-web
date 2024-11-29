// src/lib/validations/petValidations.ts

import * as z from "zod";
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

export const PetUploadValidations = z.object({
  name: z.string().min(1, "Pet name is required."),
  bio: z.string().min(10, "Pet bio needs to be at least 10 characters."),
  species: z.nativeEnum(Specie, {
    errorMap: () => ({ message: "Please select a valid species." }),
  }),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "Please select a valid gender." }),
  }),
  health: z
    .array(
      z.nativeEnum(HealthCharacteristic, {
        errorMap: () => ({
          message: "Please select a valid health characteristic.",
        }),
      })
    )
    .nonempty({ message: "Please select at least one health characteristic." }),
  size: z.nativeEnum(Size, {
    errorMap: () => ({ message: "Please select a valid size." }),
  }),
  age: z.nativeEnum(Age, {
    errorMap: () => ({ message: "Please select a valid age." }),
  }),
  color: z.nativeEnum(Color, {
    errorMap: () => ({ message: "Please select a valid color." }),
  }),
  personality: z
    .array(
      z.nativeEnum(Personality, {
        errorMap: () => ({ message: "Please select a valid personality." }),
      })
    )
    .nonempty({ message: "Please select at least one personality." }),
  livingWithAnimalsCompatibility: z.nativeEnum(LivingWithAnimalsCompatibility, {
    errorMap: () => ({
      message: "Please select a valid compatibility with other animals.",
    }),
  }),
  livingWithKidsCompatibility: z.nativeEnum(LivingWithKidsCompatibility, {
    errorMap: () => ({
      message: "Please select a valid compatibility with kids.",
    }),
  }),
  trainingLevel: z.nativeEnum(TrainingLevel, {
    errorMap: () => ({ message: "Please select a valid training level." }),
  }),
  mediaFiles: z
    .array(
      z.object({
        fileUrl: z.string().url(),
        fileType: z.string(),
        fileUploadCareId: z.string(),
      })
    )
    .min(1, "At least one media file is required."),
});

export const PetGeneralDetailsEditionValidations = z.object({
  name: z.string().min(1, "Pet name is required."),
  bio: z.string().min(10, "Pet bio needs to be at least 10 characters."),
  species: z.nativeEnum(Specie, {
    errorMap: () => ({ message: "Please select a valid species." }),
  }),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "Please select a valid gender." }),
  }),

  size: z.nativeEnum(Size, {
    errorMap: () => ({ message: "Please select a valid size." }),
  }),
  age: z.nativeEnum(Age, {
    errorMap: () => ({ message: "Please select a valid age." }),
  }),
  color: z.nativeEnum(Color, {
    errorMap: () => ({ message: "Please select a valid color." }),
  }),
});

export const PetHealthDetailsEditionValidations = z.object({
  health: z
    .array(
      z.nativeEnum(HealthCharacteristic, {
        errorMap: () => ({
          message: "Please select a valid health characteristic.",
        }),
      })
    )
    .nonempty({ message: "Please select at least one health characteristic." }),
});

export const PetAdditionalDetailsEditionValidations = z.object({
  personality: z
    .array(
      z.nativeEnum(Personality, {
        errorMap: () => ({ message: "Please select a valid personality." }),
      })
    )
    .nonempty({ message: "Please select at least one personality." }),
  livingWithAnimalsCompatibility: z.nativeEnum(LivingWithAnimalsCompatibility, {
    errorMap: () => ({
      message: "Please select a valid compatibility with other animals.",
    }),
  }),
  livingWithKidsCompatibility: z.nativeEnum(LivingWithKidsCompatibility, {
    errorMap: () => ({
      message: "Please select a valid compatibility with kids.",
    }),
  }),
  trainingLevel: z.nativeEnum(TrainingLevel, {
    errorMap: () => ({ message: "Please select a valid training level." }),
  }),
});
