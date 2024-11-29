// "use client";

// // React
// import React, { useEffect, useState } from "react";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";

// // NextUI
// import { Select, SelectItem, Button } from "@nextui-org/react";

// // Zod
// import { zodResolver } from "@hookform/resolvers/zod";

// // Validations
// import { AdopterAdoptionPreferencesValidation } from "@/lib/validations/onboarding";

// //Components
// import {
//   preferredAnimalAgeOptions,
//   preferredAnimalCharacteristic,
//   preferredAnimalColorOptions,
//   preferredAnimalGenderOptions,
//   preferredAnimalPersonality,
//   preferredAnimalSizeOptions,
//   preferredAnimalSpeciesOptions,
//   preferredAnimalTrainingLevelOptions,
// } from "@/constants/onboarding";

// import { capitalizeFirstLetter } from "@/lib/utils";
// import { useSession } from "@clerk/nextjs";

// import { AdopterFormAdoptionPreferences } from "@/lib/types/onboarding/interfaces.types";
// import { useUserStore } from "@/store/shared/useUser.store";
// import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

// interface Props {
//   handleFormSubmission: (
//     data?: AdopterFormAdoptionPreferences
//   ) => Promise<void>;
// }

// export default function AdopterOnboardingAdoptionPreferencesTab({
//   handleFormSubmission,
// }: Props) {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isModified, setIsModified] = useState(false);

//   const { isLoaded: isUserSessionLoaded } = useSession();

//   // Zustand stores
//   const userData = useUserStore((state) => state.user);
//   const userProfileData = useUserProfileStore((state) => state.profile);

//   const { handleSubmit, control, watch, reset } =
//     useForm<AdopterFormAdoptionPreferences>({
//       resolver: zodResolver(AdopterAdoptionPreferencesValidation),
//       defaultValues: {
//         preferredAnimalSpecies: undefined,
//         preferredAnimalGender: undefined,
//         preferredAnimalAge: [],
//         preferredAnimalColor: undefined,
//         preferredAnimalSize: [],
//         preferredAnimalHealthCharacteristic: [],
//         preferredAnimalPersonality: [],
//         preferredAnimalTrainingLevel: [],
//       },
//     });

//   const onSubmit: SubmitHandler<AdopterFormAdoptionPreferences> = async (
//     data
//   ) => {
//     setLoading(true);
//     if (isModified) {
//       await handleFormSubmission(data);
//     } else {
//       await handleFormSubmission();
//     }
//     setLoading(false);
//   };

//   const watchedFields: any = watch();

//   useEffect(() => {
//     if (userProfileData) {
//       reset({
//         preferredAnimalSpecies:
//           userProfileData?.profileData?.preferredAnimalSpecies ?? "",
//         preferredAnimalGender:
//           userProfileData?.profileData?.preferredAnimalGender ?? "",
//         preferredAnimalAge:
//           userProfileData?.profileData?.preferredAnimalAge ?? "",
//         preferredAnimalColor:
//           userProfileData?.profileData?.preferredAnimalColor ?? "",
//         preferredAnimalSize:
//           userProfileData?.profileData?.preferredAnimalSize ?? "",
//         preferredAnimalHealthCharacteristic:
//           userProfileData?.profileData?.preferredAnimalHealthCharacteristic ??
//           "",
//         preferredAnimalPersonality:
//           userProfileData?.profileData?.preferredAnimalPersonality ?? "",
//         preferredAnimalTrainingLevel:
//           userProfileData?.profileData?.preferredAnimalTrainingLevel ?? "",
//       });
//     }
//   }, [userProfileData, reset]);

//   useEffect(() => {
//     const checkIfModified: any = () => {
//       return Object.keys(watchedFields).some((field) => {
//         const originalValue = userProfileData?.profileData?.[field] ?? "";
//         return watchedFields[field] !== originalValue;
//       });
//     };

//     if (userProfileData) {
//       setIsModified(checkIfModified());
//     }
//   }, [watchedFields, userProfileData]);

//   if (!isUserSessionLoaded) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="flex items-start justify-center w-full">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col items-center justify-center w-full"
//       >
//         <section className="flex flex-col items-center justify-center w-full gap-6 py-6">
//           <Controller
//             name="preferredAnimalSpecies"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 {...field}
//                 className="max-w-xs"
//                 label="Preferred animal specie"
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalSpeciesOptions.map((item) => (
//                   <SelectItem
//                     key={item.speciesName}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize placeholder:capitalize selection:capitalize"
//                   >
//                     {item.speciesName}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalGender"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal gender"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalGenderOptions.map((item) => (
//                   <SelectItem
//                     key={item.option}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.option}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalAge"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal age"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(e) => {
//                   // Trim the input to remove leading/trailing whitespaces, then split by spaces
//                   const splitWords = e.target.value.trim().split(/\s+/); // The \s+ regex matches any whitespace characters including spaces, tabs, etc.

//                   // Check if the resulting array has any words, then take the first one and convert it to lowercase
//                   const firstWord =
//                     splitWords.length > 0 ? splitWords[0].toLowerCase() : "";

//                   field.onChange(firstWord);
//                 }}
//               >
//                 {preferredAnimalAgeOptions.map((item) => (
//                   <SelectItem
//                     key={item.ageRange}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.ageRange}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalColor"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal color"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalColorOptions.map((item) => (
//                   <SelectItem
//                     key={item.option}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.option}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalSize"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal size"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalSizeOptions.map((item) => (
//                   <SelectItem
//                     key={item.sizeRange}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.sizeRange}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalPersonality"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal personality"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalPersonality.map((item) => (
//                   <SelectItem
//                     key={item.option}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.option}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalHealthCharacteristic"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal characteristic"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalCharacteristic.map((item) => (
//                   <SelectItem
//                     key={item.option}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.option}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />

//           <Controller
//             name="preferredAnimalTrainingLevel"
//             control={control}
//             rules={{ required: true }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 className="max-w-xs"
//                 label="preferred animal training level"
//                 {...field}
//                 variant="flat"
//                 isInvalid={error ? true : false}
//                 errorMessage={error?.message}
//                 selectedKeys={
//                   field.value
//                     ? [capitalizeFirstLetter(field.value.toLocaleString())]
//                     : []
//                 }
//                 onChange={(value) =>
//                   field.onChange(value.target.value.toLowerCase())
//                 }
//               >
//                 {preferredAnimalTrainingLevelOptions.map((item) => (
//                   <SelectItem
//                     key={item.option}
//                     // startContent={
//                     //   <Avatar
//                     //     alt={`${item.speciesName}_avatar_image`}
//                     //     className="w-6 h-6"
//                     //     src={item.avatar}
//                     //   />
//                     // }
//                     className="capitalize"
//                   >
//                     {item.option}
//                   </SelectItem>
//                 ))}
//               </Select>
//             )}
//           />
//         </section>

//         <section className="w-full pt-2 bg-white dark:bg-inherit">
//           <Button
//             type="submit"
//             fullWidth
//             color="primary"
//             disabled={loading}
//             isLoading={loading}
//           >
//             {!userData?.onboarded
//               ? "Submit"
//               : isModified
//               ? "Update"
//               : "Continue"}
//           </Button>
//         </section>
//       </form>
//     </div>
//   );
// }

"use client";

// React
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

// NextUI
import { Button } from "@nextui-org/react";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Validations
import { AdopterAdoptionPreferencesValidation } from "@/lib/validations/onboarding";

// Components
import {
  preferredAnimalAgeOptions,
  preferredAnimalCharacteristic,
  preferredAnimalColorOptions,
  preferredAnimalGenderOptions,
  preferredAnimalPersonality,
  preferredAnimalSizeOptions,
  preferredAnimalSpeciesOptions,
  preferredAnimalTrainingLevelOptions,
} from "@/constants/onboarding";

import { capitalizeFirstLetter } from "@/lib/utils";
import { useSession } from "@clerk/nextjs";

import { AdopterFormAdoptionPreferences } from "@/lib/types/onboarding/interfaces.types";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

interface Props {
  handleFormSubmission: (
    data?: AdopterFormAdoptionPreferences
  ) => Promise<void>;
}

export default function AdopterOnboardingAdoptionPreferencesTab({
  handleFormSubmission,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModified, setIsModified] = useState(false);

  const { isLoaded: isUserSessionLoaded } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const { handleSubmit, control, watch, reset, getFieldState } =
    useForm<AdopterFormAdoptionPreferences>({
      resolver: zodResolver(AdopterAdoptionPreferencesValidation),
      defaultValues: {
        preferredAnimalSpecies: undefined,
        preferredAnimalGender: undefined,
        preferredAnimalAge: [],
        preferredAnimalColor: undefined,
        preferredAnimalSize: [],
        preferredAnimalHealthCharacteristic: [],
        preferredAnimalPersonality: [],
        preferredAnimalTrainingLevel: [],
      },
    });

  const onSubmit: SubmitHandler<AdopterFormAdoptionPreferences> = async (
    data
  ) => {
    setLoading(true);
    if (isModified) {
      await handleFormSubmission(data);
    } else {
      await handleFormSubmission();
    }
    setLoading(false);
  };

  const watchedFields: any = watch();

  useEffect(() => {
    console.log(userProfileData);
    if (userProfileData) {
      reset({
        preferredAnimalSpecies:
          userProfileData?.profileData?.preferredAnimalSpecies ?? undefined,
        preferredAnimalGender:
          userProfileData?.profileData?.preferredAnimalGender ?? undefined,
        preferredAnimalAge:
          userProfileData?.profileData?.preferredAnimalAge ?? [],
        preferredAnimalColor:
          userProfileData?.profileData?.preferredAnimalColor ?? undefined,
        preferredAnimalSize:
          userProfileData?.profileData?.preferredAnimalSize ?? [],
        preferredAnimalHealthCharacteristic:
          userProfileData?.profileData?.preferredAnimalHealthCharacteristic ??
          [],
        preferredAnimalPersonality:
          userProfileData?.profileData?.preferredAnimalPersonality ?? [],
        preferredAnimalTrainingLevel:
          userProfileData?.profileData?.preferredAnimalTrainingLevel ?? [],
      });
    }
  }, [userProfileData, reset]);

  useEffect(() => {
    const checkIfModified: any = () => {
      return Object.keys(watchedFields).some((field) => {
        const originalValue = userProfileData?.profileData?.[field] ?? "";
        return watchedFields[field] !== originalValue;
      });
    };

    if (userProfileData) {
      setIsModified(checkIfModified());
    }
  }, [watchedFields, userProfileData]);

  if (!isUserSessionLoaded) {
    return <p>Loading...</p>;
  }

  const renderOptions = (
    options: any[],
    field: any,
    key: string /*, isMultiple: boolean = false */
  ) => {
    return options.map((option: any) => {
      const value = option[key].toLowerCase();
      const isSelected =
        /* isMultiple
        ? field.value?.includes(value)
        : */ field.value === value;

      return (
        <Button
          key={value}
          onClick={
            () => field.onChange(value) /* {
            if (isMultiple) {
              if (isSelected) {
                field.onChange(field.value.filter((v: string) => v !== value));
              } else {
                field.onChange([...(field.value || []), value]);
              }
            } else {
              field.onChange(value);
            }
          } */
          }
          variant={isSelected ? "shadow" : "ghost"}
          color={isSelected ? "secondary" : "default"}
        >
          {capitalizeFirstLetter(option[key])}
        </Button>
      );
    });
  };

  return (
    <div className="flex items-start justify-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full"
      >
        <section className="flex flex-col items-center justify-center w-full gap-6 py-6">
          <Controller
            name="preferredAnimalSpecies"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal species
                </label>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {renderOptions(
                    preferredAnimalSpeciesOptions,
                    field,
                    "speciesName"
                  )}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalGender"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal gender
                </label>
                <div className="flex flex-wrap gap-2">
                  {renderOptions(preferredAnimalGenderOptions, field, "option")}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalAge"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">Preferred animal age</label>
                <div className="flex flex-wrap gap-2">
                  {renderOptions(preferredAnimalAgeOptions, field, "ageRange")}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalColor"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal color
                </label>
                <div className="flex flex-wrap gap-2">
                  {renderOptions(preferredAnimalColorOptions, field, "option")}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalSize"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal size (multiple selection)
                </label>
                <div className="flex flex-wrap gap-2">
                  {renderOptions(
                    preferredAnimalSizeOptions,
                    field,
                    "sizeRange"
                  )}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalPersonality"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal personality (multiple selection)
                </label>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {renderOptions(preferredAnimalPersonality, field, "option")}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalHealthCharacteristic"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal characteristic (multiple selection)
                </label>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {renderOptions(
                    preferredAnimalCharacteristic,
                    field,
                    "option"
                  )}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="preferredAnimalTrainingLevel"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center">
                <label className="mb-2 text-center">
                  Preferred animal training level
                </label>
                <div className="flex flex-wrap gap-2">
                  {renderOptions(
                    preferredAnimalTrainingLevelOptions,
                    field,
                    "option"
                  )}
                </div>
                {error && <p className="text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </section>

        <section className="w-full pt-2 bg-white dark:bg-inherit">
          <Button
            type="submit"
            fullWidth
            color="primary"
            disabled={loading}
            isLoading={loading}
          >
            {!userData?.onboarded
              ? "Submit"
              : isModified
              ? "Update"
              : "Continue"}
          </Button>
        </section>
      </form>
    </div>
  );
}
