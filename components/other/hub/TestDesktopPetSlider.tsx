"use client";
//@ts-nocheck

import React, { useEffect, useRef, useState } from "react";

// Swiper Imports
import Swiper from "swiper";
import { Parallax } from "swiper/modules";

// Local imports
import { testDb } from "@/constants/test";
import PetInformationModal from "@/components/modals/PetInformationModal";

import { useTheme } from "next-themes";
import LikePetButton from "./likePetButton";
import { IPet } from "@/lib/types/pet/interfaces.types";
import { Image } from "@nextui-org/react";
import {
  IAdopterProfile,
  IProfile,
  IUser,
} from "@/lib/types/user/interfaces.types";

import { useQueryClient } from "react-query";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";

interface DesktopSliderProps {
  pets: IPet[];
  userData: IUser;
  userProfileData: IAdopterProfile;
}

const LeftNavigationButton = () => {
  return (
    <div className="pet-slider-button-prev pet-slider-button ml-[30%]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
        <g className="pet-slider-svg-wrap">
          <g className="pet-slider-svg-circle-wrap">
            <circle cx="42" cy="42" r="40"></circle>
          </g>
          <path
            className="pet-slider-svg-arrow"
            d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z"
          ></path>
          <path className="pet-slider-svg-line" d="M80,0H0"></path>
        </g>
      </svg>
    </div>
  );
};

const RightNavigationButton = () => {
  return (
    <div className="pet-slider-button-next pet-slider-button mr-[30%]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
        <g className="pet-slider-svg-wrap">
          <g className="pet-slider-svg-circle-wrap">
            <circle cx="42" cy="42" r="40"></circle>
          </g>
          <path
            className="pet-slider-svg-arrow"
            d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z"
          ></path>
          <path className="pet-slider-svg-line" d="M80,0H0"></path>
        </g>
      </svg>
    </div>
  );
};

export default function TestDesktopPetSlider({
  pets,
  userData,
  userProfileData,
}: DesktopSliderProps) {
  const swiperRef = useRef<any>(null);
  const petSliderRef = useRef<any>(null);
  const swiperWrapperRef = useRef<any>(null);
  const swiperSlideRef = useRef<any>(null);
  const petSliderTitleRef = useRef<any>(null);
  const petSliderScaleRef = useRef<any>(null);

  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  // TODO: Disable like button whenever the transition is in progress
  const [transitionInProgress, setTransitionInProgress] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { mutate: mutateUserProfile, isLoading: userProfileUpdateLoading } =
    useUpdateUserProfile();

  const { mutate: mutatePet, isLoading: petUpdateLoading } = useUpdatePet();

  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("");

  // Updated handlePetLike function to use the previous state
  const handlePetLike = () => {
    const userId = userData._id?.toString();
    const profileId = userData.currentProfile?.toString();
    const currentUserLikedPetsList =
      userProfileData.profileData?.likedPets || [];
    const currentPetsLikeList = pets[currentPetIndex].likes || [];
    const petId = pets[currentPetIndex]._id?.toString();

    if (!petId) {
      console.error("Pet ID is not defined.");
      return;
    }

    let updatedUserLikedPetsList = [...currentUserLikedPetsList];
    let updatedPetsLikeList = [...currentPetsLikeList];

    if (isLiked) {
      updatedUserLikedPetsList = updatedUserLikedPetsList.filter(
        (id) => id !== petId
      );
      updatedPetsLikeList = updatedPetsLikeList.filter((id) => id !== userId);
      setIsLiked(false);
    } else {
      updatedUserLikedPetsList.push(petId);
      updatedPetsLikeList.push(userId ?? "");
      setIsLiked(true);
    }

    mutateUserProfile(
      {
        userId: userId,
        profileId: profileId,
        data: { likedPets: updatedUserLikedPetsList },
      },
      {
        onSuccess: () => {
          mutatePet(
            {
              petId: petId,
              data: {
                likes: updatedPetsLikeList,
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
  };

  useEffect(() => {
    if (theme === "dark") {
      setCurrentTheme("#020617");
    } else {
      setCurrentTheme("#fff");
    }
  }, [theme, currentTheme]);

  // Updated useEffect dependencies
  useEffect(() => {
    if (!petUpdateLoading) {
      if (
        pets[currentPetIndex].likes?.includes(userData._id?.toString() ?? "")
      ) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [pets, userData._id, currentPetIndex, petUpdateLoading]);

  useEffect(() => {
    function createPetSlider() {
      const swiperEl = swiperRef.current;
      const petSliderEl = petSliderRef.current;
      const petSliderScaleEl = petSliderScaleRef.current;

      let navigationLocked = false;
      let transitionDisabled = false;
      let frameId: any;

      // eslint-disable-next-line
      const disableTransitions = (el: any) => {
        el.classList.add("pet-slider-no-transition");
        transitionDisabled = true;
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          el.classList.remove("pet-slider-no-transition");
          transitionDisabled = false;
          navigationLocked = false;
        });
      };

      let petSlider: any;

      const onNextClick = () => {
        if (!navigationLocked) {
          petSlider.slideNext();
        }
      };
      const onPrevClick = () => {
        if (!navigationLocked) {
          petSlider.slidePrev();
        }
      };

      const initNavigation = (swiper: any) => {
        // Use lock to control the button locking time without using the button component that comes with it
        swiper.el
          .querySelector(".pet-slider-button-next")
          .addEventListener("click", onNextClick);
        swiper.el
          .querySelector(".pet-slider-button-prev")
          .addEventListener("click", onPrevClick);
      };

      const destroyNavigation = (swiper: any) => {
        swiper.el
          .querySelector(".pet-slider-button-next")
          .removeEventListener("click", onNextClick);
        swiper.el
          .querySelector(".pet-slider-button-prev")
          .removeEventListener("click", onPrevClick);
      };

      petSlider = new Swiper(swiperEl, {
        modules: [Parallax],
        speed: 700,
        allowTouchMove: false, // no touch swiping
        parallax: true, // text parallax
        on: {
          transitionStart(swiper) {
            setTransitionInProgress(true);
            // eslint-disable-next-line
            const { slides, previousIndex, activeIndex } = swiper;
            if (!transitionDisabled) navigationLocked = true; // lock navigation buttons
            const activeSlide: any = slides[activeIndex];
            const previousSlide: any = slides[previousIndex];
            const previousImageScale: any =
              previousSlide.querySelector(".pet-slider-scale"); // image wrapper
            const previousImage: any = previousSlide.querySelector("img"); // current image
            const activeImage: any = activeSlide.querySelector("img"); // next image
            const direction: any = activeIndex - previousIndex;
            const bgColor: any = activeSlide.getAttribute(
              "data-slide-bg-color"
            );
            petSliderEl.style["background-color"] = currentTheme; // background color animation value: bgColor

            previousImageScale.style.transform = "scale(0.6)";
            previousImage.style.transitionDuration = "500ms";
            previousImage.style.transform = "scale(1.2)"; // image scaling parallax
            const previousSlideTitle = previousSlide.querySelector(
              ".pet-slider-title-text"
            );
            previousSlideTitle.style.transition = "800ms";
            previousSlideTitle.style.color = currentTheme; // text transparency animation value: ""

            const onTransitionEnd = (e: any) => {
              if (e.target !== previousImage) return;
              previousImage.removeEventListener(
                "transitionend",
                onTransitionEnd
              );
              activeImage.style.transitionDuration = "800ms";
              activeImage.style.transform = "translate3d(0, 0, 0) scale(1.2)"; // image shift parallax
              previousImage.style.transitionDuration = "800ms";
              previousImage.style.transform = `translate3d(${
                60 * direction
              }%, 0, 0)  scale(1.2)`;
            };
            previousImage.addEventListener("transitionend", onTransitionEnd);
          },
          transitionEnd(swiper) {
            // eslint-disable-next-line
            const { slides, activeIndex, el: any } = swiper;
            const activeSlide: any = slides[activeIndex];
            const activeImage: any = activeSlide.querySelector("img");
            setTransitionInProgress(false);
            setCurrentPetIndex(activeIndex);

            activeSlide.querySelector(".pet-slider-scale").style.transform =
              "scale(1)";
            activeImage.style.transitionDuration = "500ms";
            activeImage.style.transform = "scale(1)";

            const activeSlideTitle = activeSlide.querySelector(
              ".pet-slider-title-text"
            );
            activeSlideTitle.style.transition = "500ms";
            activeSlideTitle.style.color = "rgba(255,255,255,1)"; // text transparency animation

            const onTransitionEnd = (e: any) => {
              if (e.target !== activeImage) return;
              activeImage.removeEventListener("transitionend", onTransitionEnd);
              navigationLocked = false;
            };
            activeImage.addEventListener("transitionend", onTransitionEnd);
            // First and last, disable button
            if (activeIndex === 0) {
              petSliderEl
                .querySelector(".pet-slider-button-prev")
                .classList.add("pet-slider-button-disabled");
            } else {
              petSliderEl
                .querySelector(".pet-slider-button-prev")
                .classList.remove("pet-slider-button-disabled");
            }

            if (activeIndex === slides.length - 1) {
              petSliderEl
                .querySelector(".pet-slider-button-next")
                .classList.add("pet-slider-button-disabled");
            } else {
              petSliderEl
                .querySelector(".pet-slider-button-next")
                .classList.remove("pet-slider-button-disabled");
            }
          },
          init(swiper) {
            // Set initial slide bg color
            // eslint-disable-next-line
            const { slides, activeIndex } = swiper;
            // disable initial transition
            disableTransitions(petSliderEl);
            // set current bg color
            const bgColor = slides[activeIndex].getAttribute(
              "data-slide-bg-color"
            );
            petSliderEl.style["background-color"] = currentTheme; // background color animation value: bgColor
            // trigger the transitionEnd event once during initialization
            swiper.emit("transitionEnd");
            // init navigation
            initNavigation(swiper);
          },
          resize(swiper) {
            disableTransitions(swiper.el);
          },
          destroy(swiper) {
            destroyNavigation(swiper);
          },
        },
      });

      return petSlider;
    }

    /**
     * Init Pet Slider
     *
     * argument: pass .pet-slider element
     */
    createPetSlider();
  }, []);

  return (
    <>
      {pets && pets.length > 0 ? (
        <div id="app" className="h-full">
          {/* Pet slider container */}
          <div ref={petSliderRef} className="pet-slider">
            <div ref={swiperRef} className="swiper">
              <div ref={swiperWrapperRef} className="swiper-wrapper">
                {/* configure slide color with "data-slide-bg-color" attribute */}
                {pets.map((pet) => (
                  // Configure color with data-slide-bg-color attribute
                  <div
                    key={pet.name}
                    ref={swiperSlideRef}
                    className="swiper-slide"
                    data-slide-bg-color={currentTheme}
                  >
                    {/* slide title wrap */}
                    <div
                      ref={petSliderTitleRef}
                      className="pet-slider-title"
                      data-swiper-parallax="-130%"
                    >
                      {/* slide title text */}
                      <PetInformationModal
                        ModalTrigger={
                          <div className="relative flex flex-row items-start justify-start cursor-pointer ">
                            <h1 className="pet-slider-title-text">
                              {pet.name}
                            </h1>
                            <span className="w-[20px] h-[20px] bg-light-2 dark:bg-dark-4  text-dark-4 dark:text-light-2 p-0.5 rounded-[20px] ripple -translate-y-[60px] flex items-center justify-center text-body-normal">
                              <p className="p-0 -translate-y-[2px]">¡</p>
                            </span>
                          </div>
                        }
                        petData={pet}
                      />
                    </div>
                    {/* slide image wrap */}
                    <div
                      ref={petSliderScaleRef}
                      className="bg-transparent pet-slider-scale"
                    >
                      {/* slide image */}
                      <div className="relative flex items-start justify-center w-screen h-full">
                        <img
                          src={pet.media[0].fileUrl}
                          alt={""}
                          className="absolute object-cover w-full h-full scale-150 blur-lg"
                          style={{ filter: "blur(10px)" }}
                        />
                        <div className="w-[70%] h-[90%] my-auto flex flex-col flex-wrap items-end justify-start gap-4">
                          {pet.media.slice(0, 3).map((mediaFile) => (
                            <div
                              key={mediaFile.fileUploadCareId}
                              className="transition-all duration-300 ease-in-out hover:cursor-pointer hover:animate-wiggle"
                            >
                              <PetInformationModal
                                ModalTrigger={
                                  <Image
                                    src={mediaFile.fileUrl}
                                    className={
                                      "object-cover min-w-[100px] min-h-[50px] h-screen w-full max-w-[200px] max-h-[150px] my-8"
                                    }
                                    alt={`${pet.name}_desktop_slider_pet_image`}
                                  />
                                }
                                petData={pet}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* right/next navigation button */}
              <RightNavigationButton />
              //@ts-ignore
              {userProfileData?.type !== "explorer" &&
              userProfileData.type !== "holder" ? (
                <LikePetButton
                  handleLike={handlePetLike}
                  isPetLiked={isLiked}
                  isLoading={userProfileUpdateLoading || petUpdateLoading}
                />
              ) : (
                <></>
              )}
              {/* left/previous navigation button */}
              <LeftNavigationButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-screen h-screen text-white bg-white ">
          <p className="fixed inset-0 top-0 right-0  flex items-center justify-center text-heading1-semibold z-[100]">
            No pets available to show
          </p>
        </div>
      )}
    </>
  );
}
