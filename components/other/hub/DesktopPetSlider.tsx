// "use client";
// // @ts-nocheck

// import React, { useEffect, useState } from "react";

// // Swiper Imports
// import Swiper from "swiper";
// import { Parallax } from "swiper/modules";

// // Local imports
// import { testDb } from "@/constants/test";
// import PetInformationModal from "@/components/modals/PetInformationModal";

// import { useTheme } from "next-themes";
// import LikePetButton from "./likePetButton";
// import { IPet } from "@/lib/types/pet/interfaces.types";

// export default function DesktopPetSlider({ pets }: { pets: IPet[] }) {
//   const { theme } = useTheme();
//   const [currentTheme, setCurrentTheme] = useState(
//     theme === "dark" ? "#020617" : "#fff"
//   );

//   useEffect(() => {
//     if (theme === "dark") {
//       setCurrentTheme("#020617");
//     } else {
//       setCurrentTheme("#fff");
//     }
//   }, [theme, currentTheme]);

//   useEffect(() => {
//     function createPetSlider(el: any) {
//       const swiperEl = el.querySelector(".swiper");
//       let navigationLocked = false;
//       let transitionDisabled = false;
//       let frameId: any;

//       // eslint-disable-next-line
//       const disableTransitions = (el: any) => {
//         el.classList.add("pet-slider-no-transition");
//         transitionDisabled = true;
//         cancelAnimationFrame(frameId);
//         frameId = requestAnimationFrame(() => {
//           el.classList.remove("pet-slider-no-transition");
//           transitionDisabled = false;
//           navigationLocked = false;
//         });
//       };

//       let petSlider: any;

//       const onNextClick = () => {
//         if (!navigationLocked) {
//           petSlider.slideNext();
//         }
//       };
//       const onPrevClick = () => {
//         if (!navigationLocked) {
//           petSlider.slidePrev();
//         }
//       };

//       const initNavigation = (swiper: any) => {
//         // Use lock to control the button locking time without using the button component that comes with it
//         swiper.el
//           .querySelector(".pet-slider-button-next")
//           .addEventListener("click", onNextClick);
//         swiper.el
//           .querySelector(".pet-slider-button-prev")
//           .addEventListener("click", onPrevClick);
//       };

//       const destroyNavigation = (swiper: any) => {
//         swiper.el
//           .querySelector(".pet-slider-button-next")
//           .removeEventListener("click", onNextClick);
//         swiper.el
//           .querySelector(".pet-slider-button-prev")
//           .removeEventListener("click", onPrevClick);
//       };

//       petSlider = new Swiper(swiperEl, {
//         modules: [Parallax],
//         speed: 700,
//         allowTouchMove: false, // no touch swiping
//         parallax: true, // text parallax
//         on: {
//           transitionStart(swiper) {
//             // eslint-disable-next-line
//             const { slides, previousIndex, activeIndex, el: any } = swiper;
//             if (!transitionDisabled) navigationLocked = true; // lock navigation buttons
//             const activeSlide: any = slides[activeIndex];
//             const previousSlide: any = slides[previousIndex];
//             const previousImageScale: any =
//               previousSlide.querySelector(".pet-slider-scale"); // image wrapper
//             const previousImage: any = previousSlide.querySelector("img"); // current image
//             const activeImage: any = activeSlide.querySelector("img"); // next image
//             const direction: any = activeIndex - previousIndex;
//             const bgColor: any = activeSlide.getAttribute(
//               "data-slide-bg-color"
//             );
//             el.style["background-color"] = bgColor; // background color animation

//             previousImageScale.style.transform = "scale(0.6)";
//             previousImage.style.transitionDuration = "500ms";
//             previousImage.style.transform = "scale(1.2)"; // image scaling parallax
//             const previousSlideTitle = previousSlide.querySelector(
//               ".pet-slider-title-text"
//             );
//             previousSlideTitle.style.transition = "800ms";
//             previousSlideTitle.style.color = ""; // text transparency animation

//             const onTransitionEnd = (e: any) => {
//               if (e.target !== previousImage) return;
//               previousImage.removeEventListener(
//                 "transitionend",
//                 onTransitionEnd
//               );
//               activeImage.style.transitionDuration = "800ms";
//               activeImage.style.transform = "translate3d(0, 0, 0) scale(1.2)"; // image shift parallax
//               previousImage.style.transitionDuration = "800ms";
//               previousImage.style.transform = `translate3d(${
//                 60 * direction
//               }%, 0, 0)  scale(1.2)`;
//             };
//             previousImage.addEventListener("transitionend", onTransitionEnd);
//           },
//           transitionEnd(swiper) {
//             // eslint-disable-next-line
//             const { slides, activeIndex, el: any } = swiper;
//             const activeSlide: any = slides[activeIndex];
//             const activeImage: any = activeSlide.querySelector("img");

//             activeSlide.querySelector(".pet-slider-scale").style.transform =
//               "scale(1)";
//             activeImage.style.transitionDuration = "500ms";
//             activeImage.style.transform = "scale(1)";

//             const activeSlideTitle = activeSlide.querySelector(
//               ".pet-slider-title-text"
//             );
//             activeSlideTitle.style.transition = "500ms";
//             activeSlideTitle.style.color = "rgba(255,255,255,1)"; // text transparency animation

//             const onTransitionEnd = (e: any) => {
//               if (e.target !== activeImage) return;
//               activeImage.removeEventListener("transitionend", onTransitionEnd);
//               navigationLocked = false;
//             };
//             activeImage.addEventListener("transitionend", onTransitionEnd);
//             // First and last, disable button
//             if (activeIndex === 0) {
//               el.querySelector(".pet-slider-button-prev").classList.add(
//                 "pet-slider-button-disabled"
//               );
//             } else {
//               el.querySelector(".pet-slider-button-prev").classList.remove(
//                 "pet-slider-button-disabled"
//               );
//             }

//             if (activeIndex === slides.length - 1) {
//               el.querySelector(".pet-slider-button-next").classList.add(
//                 "pet-slider-button-disabled"
//               );
//             } else {
//               el.querySelector(".pet-slider-button-next").classList.remove(
//                 "pet-slider-button-disabled"
//               );
//             }
//           },
//           init(swiper) {
//             // Set initial slide bg color
//             // eslint-disable-next-line
//             const { slides, activeIndex, el: any } = swiper;
//             // disable initial transition
//             disableTransitions(el);
//             // set current bg color
//             const bgColor = slides[activeIndex].getAttribute(
//               "data-slide-bg-color"
//             );
//             el.style["background-color"] = bgColor; // background color animation
//             // trigger the transitionEnd event once during initialization
//             swiper.emit("transitionEnd");
//             // init navigation
//             initNavigation(swiper);
//           },
//           resize(swiper) {
//             disableTransitions(swiper.el);
//           },
//           destroy(swiper) {
//             destroyNavigation(swiper);
//           },
//         },
//       });

//       return petSlider;
//     }
//     const sliderEl = document.querySelector(".pet-slider");

//     /**
//      * Init Pet Slider
//      *
//      * argument: pass .pet-slider element
//      */
//     createPetSlider(sliderEl);
//   }, []);

//   return (
//     <>
//       {/* Your Next.js page content */}
//       <div id="app" className="h-full">
//         {/* Pet slider container */}
//         <div className="pet-slider">
//           <div className="swiper">
//             <div className="swiper-wrapper">
//               {/* configure slide color with "data-slide-bg-color" attribute */}
//               {pets.map((pet) => (
//                 // Configure color with data-slide-bg-color attribute
//                 <div
//                   key={pet.name}
//                   className="swiper-slide"
//                   data-slide-bg-color={currentTheme}
//                 >
//                   {/* slide title wrap */}
//                   <div
//                     className="pet-slider-title"
//                     data-swiper-parallax="-130%"
//                   >
//                     {/* slide title text */}
//                     <PetInformationModal
//                       ModalTrigger={
//                         <div className="relative flex flex-row items-start justify-start cursor-pointer ">
//                           <h1 className="pet-slider-title-text">{pet.name}</h1>
//                           <span className="w-[20px] h-[20px] bg-light-2 dark:bg-dark-4  text-dark-4 dark:text-light-2 p-0.5 rounded-[20px] ripple -translate-y-[60px] flex items-center justify-center text-body-normal">
//                             <p className="p-0 -translate-y-[2px]">¡</p>
//                           </span>
//                         </div>
//                       }
//                       petData={pet}
//                     />
//                   </div>
//                   {/* slide image wrap */}
//                   <div className="pet-slider-scale">
//                     {/* slide image */}
//                     <img
//                       src={pet.media[0].fileUrl}
//                       className={"object-cover"}
//                       alt={`${pet.name}_desktop_slider_pet_image`}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* right/next navigation button */}
//             <div className="pet-slider-button-prev pet-slider-button ml-[30%]">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
//                 <g className="pet-slider-svg-wrap">
//                   <g className="pet-slider-svg-circle-wrap">
//                     <circle cx="42" cy="42" r="40"></circle>
//                   </g>
//                   <path
//                     className="pet-slider-svg-arrow"
//                     d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z"
//                   ></path>
//                   <path className="pet-slider-svg-line" d="M80,0H0"></path>
//                 </g>
//               </svg>
//             </div>

//             {/* <LikePetButton /> */}

//             {/* left/previous navigation button */}
//             <div className="pet-slider-button-next pet-slider-button mr-[30%]">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
//                 <g className="pet-slider-svg-wrap">
//                   <g className="pet-slider-svg-circle-wrap">
//                     <circle cx="42" cy="42" r="40"></circle>
//                   </g>
//                   <path
//                     className="pet-slider-svg-arrow"
//                     d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z"
//                   ></path>
//                   <path className="pet-slider-svg-line" d="M80,0H0"></path>
//                 </g>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
