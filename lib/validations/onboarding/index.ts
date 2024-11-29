import dayjs from "dayjs";
import * as z from "zod";

// Validations for profile type selection
export const ProfileSelectionValidation = z.object({
  profileType: z.enum(["adopter", "holder", "explorer"], {
    errorMap: () => {
      return {
        message: "Invalid selection. Please choose a valid role.",
      };
    },
  }),
  holderType: z.enum(["individual", "organization", ""]).optional(),
});

// Validations for adopter personal details form fields
export const AdopterPersonalDetailsFormValidation = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(15, "First name too long"),

  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(15, "Last name too long"),
  bio: z
    .string()
    .min(10, { message: "Your bio needs to be at least 10 characters long." })
    .max(500, { message: "Your bio cannot exceed 500 characters." }),
  // dateOfBirth: z.date({
  //   errorMap: () => {
  //     return { message: "Invalid date format. Please provide a valid date." };
  //   },
  // }),

  dateOfBirth: z.preprocess(
    (arg: any) => {
      // Attempt to parse the input as a date using dayjs or a similar library
      const parsedDate = dayjs(arg);
      return parsedDate.isValid()
        ? parsedDate.toDate()
        : new Date("Invalid Date");
    },
    z.date({
      errorMap: () => {
        return { message: "Invalid date format. Please provide a valid date." };
      },
    })
  ),

  location: z.string().min(10, { message: "Location not valid" }),
});

//Validations for adopter adoption preferences form fields
export const AdopterAdoptionPreferencesValidation = z.object({
  preferredAnimalSpecies: z.enum(
    [
      "all",
      "dog",
      "cat",
      "bird",
      "rabbit",
      "rodent",
      "fish",
      "turtle",
      "horse",
      "pig",
    ],
    {
      errorMap: () => {
        return {
          message: "Invalid selection. Please choose a valid specie.",
        };
      },
    }
  ),
  preferredAnimalGender: z.enum(["male", "female", "both"], {
    errorMap: () => {
      return {
        message: "Invalid selection. Please choose a valid gender.",
      };
    },
  }),
  preferredAnimalAge: z.enum(["any", "baby", "young", "adult", "senior"], {
    errorMap: () => {
      return {
        message: "Invalid selection. Please choose a valid age.",
      };
    },
  }),
  preferredAnimalColor: z.enum(["unicolor", "multicolor", "both"], {
    errorMap: () => {
      return {
        message: "Invalid selection. Please choose a valid color.",
      };
    },
  }),
  preferredAnimalSize: z.enum(["any", "small", "medium", "large"], {
    errorMap: () => {
      return {
        message: "Invalid selection. Please choose a valid size.",
      };
    },
  }),
  preferredAnimalPersonality: z.enum(
    ["any", "shy", "quiet", "friendly", "protector", "brisk", "playful"],
    {
      errorMap: () => {
        return {
          message: "Invalid selection. Please choose a valid personality.",
        };
      },
    }
  ),
  preferredAnimalHealthCharacteristic: z.enum(
    ["any", "healthy", "disabled", "hypoallergenic", "furry", "furless"],
    {
      errorMap: () => {
        return {
          message: "Invalid selection. Please choose a valid characteristic.",
        };
      },
    }
  ),
  preferredAnimalTrainingLevel: z.enum(["any", "trained", "untrained"], {
    errorMap: () => {
      return {
        message: "Invalid selection. Please choose a valid training level.",
      };
    },
  }),
});

// export const AdopterAdoptionPreferencesValidation = z.object({
//   preferredAnimalSpecies: z.enum(
//     [
//       "all",
//       "dog",
//       "cat",
//       "bird",
//       "rabbit",
//       "rodent",
//       "fish",
//       "turtle",
//       "horse",
//       "pig",
//     ],
//     {
//       errorMap: () => {
//         return {
//           message: "Invalid selection. Please choose a valid specie.",
//         };
//       },
//     }
//   ),
//   preferredAnimalGender: z.enum(["male", "female", "both"], {
//     errorMap: () => {
//       return {
//         message: "Invalid selection. Please choose a valid gender.",
//       };
//     },
//   }),
//   preferredAnimalAge: z.array(
//     z.enum(["any", "baby", "young", "adult", "senior"], {
//       errorMap: () => {
//         return {
//           message: "Invalid selection. Please choose a valid age.",
//         };
//       },
//     })
//   ),
//   preferredAnimalColor: z.enum(["unicolor", "multicolor", "both"], {
//     errorMap: () => {
//       return {
//         message: "Invalid selection. Please choose a valid color.",
//       };
//     },
//   }),
//   preferredAnimalSize: z.array(
//     z.enum(["any", "small", "medium", "large"], {
//       errorMap: () => {
//         return {
//           message: "Invalid selection. Please choose a valid size.",
//         };
//       },
//     })
//   ),
//   preferredAnimalPersonality: z.array(
//     z.enum(
//       ["any", "shy", "quiet", "friendly", "protector", "brisk", "playful"],
//       {
//         errorMap: () => {
//           return {
//             message: "Invalid selection. Please choose a valid personality.",
//           };
//         },
//       }
//     )
//   ),
//   preferredAnimalHealthCharacteristic: z.array(
//     z.enum(
//       ["any", "healthy", "disabled", "hypoallergenic", "furry", "furless"],
//       {
//         errorMap: () => {
//           return {
//             message: "Invalid selection. Please choose a valid characteristic.",
//           };
//         },
//       }
//     )
//   ),
//   preferredAnimalTrainingLevel: z.enum(["any", "trained", "untrained"], {
//     errorMap: () => {
//       return {
//         message: "Invalid selection. Please choose a valid training level.",
//       };
//     },
//   }),
// });

// Validations for holder form fields =>

// Validations for holder personal details form fields
export const HolderPersonalDetailsFormValidation = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(15, "First name too long"),

  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(15, "Last name too long"),
  bio: z
    .string()
    .min(10, { message: "Your bio needs to be at least 10 characters long." })
    .max(500, { message: "Your bio cannot exceed 500 characters." }),
  // dateOfBirth: z.date({
  //   errorMap: () => {
  //     return { message: "Invalid date format. Please provide a valid date." };
  //   },
  // }),

  dateOfBirth: z.preprocess(
    (arg: any) => {
      // Attempt to parse the input as a date using dayjs or a similar library
      const parsedDate = dayjs(arg);
      return parsedDate.isValid()
        ? parsedDate.toDate()
        : new Date("Invalid Date");
    },
    z.date({
      errorMap: () => {
        return { message: "Invalid date format. Please provide a valid date." };
      },
    })
  ),

  location: z.string().min(10, { message: "Location not valid" }),
});

// Validations for holder orgaization details form fields
export const HolderOrganizationDetails = z.object({
  organizationImage: z.string().min(1, "First name is required.").optional(),
  organizationName: z
    .string()
    .min(1, "First name is required.")
    .max(15, "First name too long"),
  organizationDescription: z
    .string()
    .min(1, "First name is required.")
    .max(15, "First name too long"),
});

// Validations for explorer form fields =>

// Validations for explorer personal details form fields
export const ExplorerPersonalDetailsValidation = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(15, "First name too long"),

  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(15, "Last name too long"),
  bio: z
    .string()
    .min(10, { message: "Your bio needs to be at least 10 characters long." })
    .max(500, { message: "Your bio cannot exceed 500 characters." }),
  // dateOfBirth: z.date({
  //   errorMap: () => {
  //     return { message: "Invalid date format. Please provide a valid date." };
  //   },
  // }),

  dateOfBirth: z.preprocess(
    (arg: any) => {
      // Attempt to parse the input as a date using dayjs or a similar library
      const parsedDate = dayjs(arg);
      return parsedDate.isValid()
        ? parsedDate.toDate()
        : new Date("Invalid Date");
    },
    z.date({
      errorMap: () => {
        return { message: "Invalid date format. Please provide a valid date." };
      },
    })
  ),

  location: z.string().min(10, { message: "Location not valid" }),
});
