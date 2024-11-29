// "use client";

// // Swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import { A11y } from "swiper/modules";
// import EffectTinder from "@/lib/scripts/effect-tinder.esm";

// // CSS

// // Next.js Image
// import Image from "next/image";
// import PetInformationModal from "@/components/modals/PetInformationModal";

// import { testDb } from "@/constants/test";
// import { IPet } from "@/lib/types/pet/interfaces.types";

// import { useEffect, useMemo } from "react";

// import { IAdopterProfile, IUser } from "@/lib/types/user/interfaces.types";
// import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
// import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";
// import CustomPetSliderNoSuggestionsCard from "@/components/customUI/CustomPetSliderNoSuggestionsCard";

// interface DesktopSliderProps {
//   pets: IPet[];
//   userData: IUser;
//   userProfileData: IAdopterProfile;
// }

// export default function TestMobilePetSlider({
//   pets,
//   userData,
//   userProfileData,
// }: DesktopSliderProps) {
//   const swiperParameters = {
//     modules: [A11y, EffectTinder], // Include necessary Swiper modules
//     effect: "tinder", // Example effect, adjust as needed
//   };

//   const { mutate: mutateUserProfile, isLoading: userProfileUpdateLoading } =
//     useUpdateUserProfile();
//   const { mutate: mutatePet, isLoading: petUpdateLoading } = useUpdatePet();

//   const handlePetLike = (e: Event) => {
//     if (
//       userProfileData.type !== "explorer" ||
//       userProfileData.type !== "holder"
//     ) {
//       //@ts-ignore
//       const { likedPetIndex } = e.detail;
//       const userId = userData._id?.toString();
//       const profileId = userData.currentProfile?.toString();

//       const currentUserLikedPetsList =
//         //@ts-ignore
//         userProfileData.profileData.likedPets || [];
//       const currentPetsLikeList = pets[likedPetIndex].likes || [];
//       const petId = pets[likedPetIndex]._id?.toString();

//       if (!petId) {
//         console.error("Pet ID is not defined.");
//         return;
//       }

//       // Check if the pet has already been liked by the user
//       if (
//         currentUserLikedPetsList.includes(petId) ||
//         //@ts-ignore
//         currentPetsLikeList.includes(userId)
//       ) {
//         console.log("Pet already liked by the user");
//         return;
//       }

//       let updatedUserLikedPetsList = currentUserLikedPetsList;
//       let updatedPetsLikeList = currentPetsLikeList;

//       updatedUserLikedPetsList = [...currentUserLikedPetsList, petId];
//       //@ts-ignore
//       updatedPetsLikeList = [...currentPetsLikeList, userId];

//       mutateUserProfile(
//         {
//           userId: userId,
//           profileId: profileId,
//           data: { likedPets: updatedUserLikedPetsList },
//         },
//         {
//           onSuccess: () => {
//             // Update pet data (if needed) after user profile update succeeds
//             mutatePet(
//               {
//                 // Construct the pet update data here
//                 // For example:
//                 petId: petId,
//                 data: {
//                   likes: updatedPetsLikeList, // Example of pet update data
//                 },
//               },
//               {
//                 onError: (error) => {
//                   console.error("Error updating pet:", error);
//                 },
//                 onSettled: () => {
//                   // Optional: Handle any post-mutation logic
//                 },
//               }
//             );
//           },
//           onError: (error) => {
//             console.error("Error updating profile:", error);
//           },
//           onSettled: () => {
//             // Re-enable the like button after the mutation completes
//           },
//         }
//       );
//     } else {
//       return;
//     }
//   };

//   const filteredPets = useMemo(() => {
//     //@ts-ignore
//     const likedPetIds = new Set(userProfileData.profileData.likedPets || []);
//     const dislikedPetIds = new Set(
//       //@ts-ignore
//       userProfileData.profileData.dislikedPets || []
//     ); // Assuming you have a similar list for dislikes
//     const userId = userData._id?.toString();

//     return pets.filter(
//       (pet) =>
//         //@ts-ignore
//         !likedPetIds.has(pet._id.toString()) &&
//         //@ts-ignore
//         !dislikedPetIds.has(pet._id.toString()) &&
//         !pet.likes?.includes(userId?.toString() || "")
//     );
//   }, [pets, userProfileData, userData]);

//   useEffect(() => {
//     // const handleSlideChangeEvent = () => {
//     //   // Update pets or perform related actions
//     //   // Example: updatePets(); // Uncomment and adjust as needed
//     //   console.log("Slide changed! Update pets here");
//     // };

//     // Listen for custom events
//     document.addEventListener("petLiked", handlePetLike);
//     // document.addEventListener("slideChanged", handleSlideChangeEvent);

//     // Clean up listeners on component unmount
//     return () => {
//       document.removeEventListener("petLiked", handlePetLike);
//       //   document.removeEventListener("slideChanged", handleSlideChangeEvent);
//     };
//   }, []);

//   return (
//     <>
//       <Swiper {...swiperParameters}>
//         {filteredPets.map((pet) => (
//           <SwiperSlide key={pet._id}>
//             <Image
//               alt="Just a test"
//               fill
//               priority={true}
//               className="object-cover swiper-slide-bg-image swiper-slide-bg-image-c61b"
//               src={pet.media[0].fileUrl}
//             />

//             <div className="swiper-tinder-label swiper-tinder-label-yes">
//               Like
//             </div>
//             <div className="swiper-tinder-label swiper-tinder-label-no">
//               Next
//             </div>
//             <div className="demo-slide-name">
//               <PetInformationModal
//                 ModalTrigger={
//                   <div className="flex flex-row gap-2">
//                     <b>{pet.name}</b>, {pet.age}
//                     <span className="w-[20px] h-[20px] bg-light-2 text-dark-4 p-0.5 rounded-[20px] ripple -translate-y-[80px] flex items-center justify-center text-body-normal">
//                       <p className="p-0 -translate-y-[2px]">¡</p>
//                     </span>
//                   </div>
//                 }
//                 petData={pet}
//               />
//             </div>
//           </SwiperSlide>
//         ))}

//         <SwiperSlide className="demo-empty-slide">
//           <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-white dark:bg-black dark:text-white/60 text-black/80">
//             <h1 className="text-center text-heading1-semibold">
//               Uh-oh, you've swiped through all the cuties!
//             </h1>
//             <span className="mt-4">
//               <CustomPetSliderNoSuggestionsCard />
//             </span>

//             <p className="text-center text-body-normal -translate-y-[100px]">
//               But hang tight, more furry friends are on their way. Take a break,
//               grab a coffee, and check back soon!
//             </p>
//           </div>
//         </SwiperSlide>

//         <button
//           slot="container"
//           className="swiper-tinder-button swiper-tinder-button-no"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             height="48"
//             viewBox="0 -960 960 960"
//             width="48"
//           >
//             <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
//           </svg>
//         </button>
//         <button
//           slot="container"
//           className="swiper-tinder-button swiper-tinder-button-yes"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             height="48"
//             viewBox="0 -960 960 960"
//             width="48"
//           >
//             <path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" />
//           </svg>
//         </button>
//       </Swiper>
//     </>
//   );
// }

"use client";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import EffectTinder from "@/lib/scripts/effect-tinder.esm";

// Next.js Image
import Image from "next/image";
import PetInformationModal from "@/components/modals/PetInformationModal";

import { useEffect, useMemo } from "react";

import { IAdopterProfile, IUser } from "@/lib/types/user/interfaces.types";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";
import CustomPetSliderNoSuggestionsCard from "@/components/customUI/CustomPetSliderNoSuggestionsCard";
import { IPet } from "@/lib/types/pet/interfaces.types";

interface DesktopSliderProps {
  pets: IPet[];
  userData: IUser;
  userProfileData: IAdopterProfile;
}

export default function TestMobilePetSlider({
  pets,
  userData,
  userProfileData,
}: DesktopSliderProps) {
  const swiperParameters = {
    modules: [A11y, EffectTinder], // Include necessary Swiper modules
    effect: "tinder", // Example effect, adjust as needed
  };

  const { mutate: mutateUserProfile, isLoading: userProfileUpdateLoading } =
    useUpdateUserProfile();
  const { mutate: mutatePet, isLoading: petUpdateLoading } = useUpdatePet();

  const handlePetLike = (e: Event) => {
    if (userProfileData.type === "adopter") {
      //@ts-ignore
      const { likedPetIndex } = e.detail;
      const userId = userData._id?.toString();
      const profileId = userData.currentProfile?.toString();

      const currentUserLikedPetsList =
        //@ts-ignore
        userProfileData.profileData.likedPets || [];
      const currentPetsLikeList = pets[likedPetIndex].likes || [];
      const petId = pets[likedPetIndex]._id?.toString();

      if (!petId) {
        console.error("Pet ID is not defined.");
        return;
      }

      // Check if the pet has already been liked by the user
      if (
        currentUserLikedPetsList.includes(petId) ||
        //@ts-ignore
        currentPetsLikeList.includes(userId)
      ) {
        // console.log("Pet already liked by the user");
        return;
      }

      const updatedUserLikedPetsList = [...currentUserLikedPetsList, petId];
      const updatedPetsLikeList = [...currentPetsLikeList, userId];

      mutateUserProfile(
        {
          userId: userId,
          profileId: profileId,
          data: { likedPets: updatedUserLikedPetsList },
        },
        {
          onSuccess: () => {
            // Update pet data (if needed) after user profile update succeeds
            mutatePet(
              {
                petId: petId,
                data: {
                  likes: updatedPetsLikeList, // Example of pet update data
                },
              },
              {
                onError: (error) => {
                  console.error("Error updating pet:", error);
                },
              }
            );
          },
          onError: (error) => {
            console.error("Error updating profile:", error);
          },
        }
      );
    }
  };

  const filteredPets = useMemo(() => {
    if (!userProfileData.profileData) return [];
    //@ts-ignore
    const likedPetIds = new Set(userProfileData.profileData.likedPets || []);
    //@ts-ignore
    const dislikedPetIds = new Set(
      userProfileData.profileData.dislikedPets || []
    );
    const userId = userData._id?.toString();

    return pets.filter(
      (pet) =>
        !likedPetIds.has(pet._id?.toString()) &&
        !dislikedPetIds.has(pet._id?.toString()) &&
        !pet.likes?.includes(userId || "")
    );
  }, [pets, userProfileData, userData]);

  useEffect(() => {
    document.addEventListener("petLiked", handlePetLike);

    return () => {
      document.removeEventListener("petLiked", handlePetLike);
    };
  }, []);

  if (filteredPets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-white dark:bg-black dark:text-white/60 text-black/80">
        <h1 className="text-center text-heading1-semibold">
          Uh-oh, you've swiped through all the cuties!
        </h1>
        <span className="mt-4">
          <CustomPetSliderNoSuggestionsCard />
        </span>
        <p className="text-center text-body-normal -translate-y-[100px]">
          But hang tight, more furry friends are on their way. Take a break,
          grab a coffee, and check back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <Swiper {...swiperParameters}>
        {filteredPets.map((pet) => (
          <SwiperSlide key={pet._id}>
            <Image
              alt="Just a test"
              fill
              priority={true}
              className="object-cover swiper-slide-bg-image swiper-slide-bg-image-c61b"
              src={pet.media[0].fileUrl}
            />
            <div className="swiper-tinder-label swiper-tinder-label-yes">
              Like
            </div>
            <div className="swiper-tinder-label swiper-tinder-label-no">
              Next
            </div>
            <div className="demo-slide-name">
              <PetInformationModal
                ModalTrigger={
                  <div className="flex flex-row gap-2">
                    <b>{pet.name}</b>, {pet.age}
                    <span className="w-[20px] h-[20px] bg-light-2 text-dark-4 p-0.5 rounded-[20px] ripple -translate-y-[80px] flex items-center justify-center text-body-normal">
                      <p className="p-0 -translate-y-[2px]">¡</p>
                    </span>
                  </div>
                }
                petData={pet}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        slot="container"
        className=" swiper-tinder-button swiper-tinder-button-no -translate-y-[5vh]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
        >
          <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
        </svg>
      </button>
      <button
        slot="container"
        className=" swiper-tinder-button swiper-tinder-button-yes -translate-y-[5vh]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
        >
          <path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" />
        </svg>
      </button>
    </>
  );
}
