// "use client";
// {
//   /*
//  @ts-nocheck */
// }

import { usePetStore } from "@/store/shared/usePet.store";
import { useUserStore } from "@/store/shared/useUser.store";
import { Button, Image } from "@nextui-org/react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { GiBrokenHeart } from "react-icons/gi";

// import React, { useState, useEffect, useRef } from "react";

// import gsap from "gsap-trial";
// import MorphSVGPlugin from "gsap-trial/dist/MorphSVGPlugin";
// import MotionPathPlugin from "gsap-trial/dist/MotionPathPlugin";

// import styles from "@/lib/styles/likePetButton.module.scss";

// import { useSession } from "@clerk/nextjs";
// import { useLocale } from "next-intl";

// const LikePetButton = ({
//   handleLike,
//   isPetLiked,
//   isLoading,
// }: {
//   handleLike: () => void;
//   isPetLiked: boolean;
//   isLoading: boolean;
// }) => {
//   const [liked, setLiked] = useState(false);
//   const [motionReduced, setMotionReduced] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false); // Add a loading state

//   // Refs for SVG elements
//   const dogFront = useRef(null);
//   const dogBack = useRef(null);
//   const dogFace = useRef(null);
//   const dogEarL = useRef(null);
//   const dogEyebrowLeft = useRef(null);
//   const dogEyebrowRight = useRef(null);
//   const dogEarR = useRef(null);
//   const dogMouthBot = useRef(null);
//   const heartTop = useRef(null);
//   const heartBot = useRef(null);
//   const mainHeart = useRef(null);
//   const bone = useRef(null);

//   // paths for shape morphing
//   const earL2 =
//     "M25,8.89S21.17,5.37,17,10c-3.88,4.33-4.3,13.4-1.72,14.52,6.07,2.66,6.09-8.85,6.09-8.85";
//   const earR2 =
//     "M38.3,10.6c0,0,4.5,0.3,4.5,1.2c0,0.9-2.5,1.7-5.3,1.7c-2.7,0-6-1-6.2-2.2s1.9-1.9,1.9-1.9";
//   const earR3 =
//     "M37.3,9.6c1.9,1.7,3.9,4.1,5.1,6.2c2.3,4.2,1.9,13.9-2.7,14.2c-4.8,0.3-6.5-4.6-6.3-9.7c0.1-2.4,2.1-6.2-0.1-10.9";
//   const earR4 =
//     "M37.3,9.6c1.9,1.7,3.9,4.1,5.1,6.2c2.3,4.2,3.9,8.9-0.7,9.2c-4.8,0.3-8.5,0.4-8.3-4.7c0.1-2.4,2.1-6.2-0.1-10.9";
//   const earR5 =
//     "M37.3,9.6c1.9,1.7,3.9,4.1,5.1,6.2c2.3,4.2,1.9,10.9-2.7,11.2c-4.8,0.3-6.3-3.1-6.3-6.7c0-2.4,2.1-6.2-0.1-10.9";

//   useEffect(() => {
//     // Initialize GSAP plugins
//     gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin);

//     gsap.set(bone.current, { autoAlpha: 0 });

//     // Set up media query to detect motion
//     const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     // @ts-ignore
//     const motionMqChange = (e) => setMotionReduced(e.matches);
//     motionMqChange(motionMq); // Initial check
//     motionMq.addEventListener("change", motionMqChange);

//     return () => {
//       motionMq.removeEventListener("change", motionMqChange);
//     };
//   }, []);

//   useEffect(() => {
//     // Set the liked state based on the initial prop once it is loaded
//     if (isLoaded) {
//       if (isPetLiked) {
//         setLiked(true);
//         setIsAnimating(true);
//         makeBoneInTl().eventCallback("onComplete", () => {
//           setIsAnimating(false);
//         }); // Trigger animation to show liked state
//       } else {
//         setLiked(false);
//         setIsAnimating(true);
//         makeBoneOutTl().eventCallback("onComplete", () => {
//           setIsAnimating(false);
//         }); // Trigger animation to show unliked state
//       }
//     } else {
//       // Mark as loaded once the initial prop is received
//       setIsLoaded(true);
//     }
//   }, [isPetLiked, isLoaded]); // Add isLoaded as a dependency

//   const likeButtonClick = () => {
//     if (isAnimating) {
//       return;
//     }

//     setIsAnimating(true);
//     handleLike();

//     const timeline = liked ? makeBoneOutTl() : makeBoneInTl();
//     timeline.eventCallback("onComplete", () => {
//       setIsAnimating(false);
//     });

//     setLiked(!liked);
//   };

//   const makeBoneOutTl = () => {
//     const tl = gsap.timeline();

//     // Animate the dog and the bone moving out
//     tl.to(
//       [
//         dogFront.current,
//         dogBack.current,
//         bone.current,
//         heartBot.current,
//         heartTop.current,
//       ],
//       {
//         duration: 0.3,
//         autoAlpha: 0,
//         ease: "power1.in",
//       }
//     );

//     // Optionally, add a brief pause or delay before starting the heart animation
//     tl.to({}, { duration: 0.1 });

//     // Animate the heart fading in and scaling up
//     tl.to(mainHeart.current, {
//       duration: 0.4,
//       scale: 1,
//       autoAlpha: 1,
//       ease: "back.out(1.7)",
//     });

//     // Resetting dog ears to original position
//     // @ts-ignore
//     tl.set(dogEarL.current, { morphSVG: dogEarL.current });
//     // @ts-ignore
//     tl.set(dogEarR.current, { morphSVG: dogEarR.current });

//     // Return the timeline
//     return tl;
//   };

//   const makeBoneInTl = () => {
//     // Create a new timeline
//     const tl = gsap.timeline();

//     // Set pre-animation properties
//     gsap.set(bone.current, { scale: 0.8, autoAlpha: 0 });
//     gsap.set([dogFront.current, dogBack.current], { x: 50, autoAlpha: 1 });
//     gsap.set(dogFace.current, { transformOrigin: "19px 1.5px", rotation: 15 });
//     gsap.set(dogMouthBot.current, {
//       transformOrigin: "100% 0%",
//       rotation: -5,
//       x: 2,
//       y: 0,
//     });
//     gsap.set(heartTop.current, {
//       transformOrigin: "50% 50%",
//       scale: 0,
//       autoAlpha: 0,
//       x: 10,
//       y: 3,
//     });
//     gsap.set(heartBot.current, {
//       transformOrigin: "50% 50%",
//       scale: 0,
//       autoAlpha: 0,
//       x: 8,
//       y: -4,
//     });
//     gsap.set(mainHeart.current, {
//       transformOrigin: "50% 50%",
//       scale: 0,
//       autoAlpha: 0,
//       x: 8,
//       y: -4,
//     });
//     // @ts-ignore

//     gsap.set(dogEarL.current, { morphSVG: dogEarL.current });
//     // @ts-ignore

//     gsap.set(dogEarR.current, { morphSVG: dogEarR.current });

//     // Animation sequence

//     tl.to(mainHeart.current, {
//       duration: 0.1,
//       scale: 0.8,
//       autoAlpha: 0,
//       x: 0,
//       y: 0,
//       ease: "back.in(1.7)",
//     });

//     tl.to(
//       bone.current,
//       {
//         duration: 0.3,
//         scale: 1,
//         autoAlpha: 1,
//         ease: "back.out(1.7)",
//       },
//       "<0.01"
//     );

//     tl.to([dogFront.current, dogBack.current], {
//       duration: 0.36,
//       ease: "power1.out",
//       motionPath: [
//         { x: 50, y: 0 },
//         { x: 25, y: -7 },
//         { x: -2, y: 0 },
//       ],
//     })

//       .to(bone.current, { duration: 0.1, x: -3, ease: "power1.out" }, 0.45)
//       .to(
//         [dogFront.current, dogBack.current],
//         { duration: 0.2, x: 0, ease: "power2.out" },
//         0.35
//       )
//       .to(bone.current, { duration: 0.2, x: 0, ease: "power2.out" }, 0.55)
//       .to(
//         dogFace.current,
//         { duration: 0.25, rotation: 0, ease: "power3.out" },
//         0.3
//       )
//       .to(
//         dogMouthBot.current,
//         { duration: 0.2, rotation: 10, ease: "back.out(2)" },
//         0.3
//       )
//       .to(
//         dogEarL.current,
//         { duration: 0.3, morphSVG: earL2, ease: "none" },
//         0.3
//       )
//       .to(
//         dogEarR.current,
//         { duration: 0.15, morphSVG: earR2, ease: "none" },
//         0.3
//       )
//       .to(
//         dogEarR.current,
//         { duration: 0.2, morphSVG: earR3, ease: "power1.out" },
//         ">"
//       )
//       .to(
//         dogEarR.current,
//         { duration: 0.2, morphSVG: earR4, ease: "power1.inOut" },
//         ">"
//       )
//       .to(
//         dogEarR.current,
//         { duration: 0.2, morphSVG: earR5, ease: "power1.inOut" },
//         ">"
//       )
//       .to(
//         heartTop.current,
//         {
//           duration: 0.45,
//           scale: 1,
//           autoAlpha: 1,
//           x: 0,
//           y: 0,
//           ease: "back.out(1)",
//         },
//         0.3
//       )
//       .to(
//         heartBot.current,
//         {
//           duration: 0.375,
//           scale: 1,
//           autoAlpha: 1,
//           x: 0,
//           y: 0,
//           ease: "back.out(1)",
//         },
//         0.45
//       );

//     // Return the timeline
//     return tl;
//   };

//   return (
//     <div className="absolute left-1/2 right-0 top-[83%] z-[1001] w-fit -translate-x-[45px] cursor-pointer rounded-full">
//       <div className={`flex flex-row gap-8 ${styles.petLikedButtonContainer}`}>
//         <button
//           className={`${styles.heartButton} flex items-center justify-center`}
//           onClick={likeButtonClick}
//           disabled={isLoading} // Disable the button while loading
//         >
//           <svg
//             className={`${styles.empty}`}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             width="32"
//             height="32"
//             ref={mainHeart}
//           >
//             <path fill="none" d="M0 0H24V24H0z"></path>
//             <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path>
//           </svg>
//           {!liked && (
//             <svg
//               className={`${styles.filled}`}
//               height="32"
//               width="32"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M0 0H24V24H0z" fill="none"></path>
//               <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>
//             </svg>
//           )}

//           <section>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 48 48"
//               width="48"
//               height="48"
//               focusable="false"
//             >
//               <g id="dog--back" style={{ visibility: "hidden" }} ref={dogBack}>
//                 <path
//                   id="dog--earLeft"
//                   fill="#cfa67c"
//                   stroke="#57524d"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M23.82,7.57c-.33-1.23-.72-2.55-1.17-3.8-1.44-4-3.46-7.39-6.06-5.68-5,3.29-1.8,12,2.94,15.68"
//                   ref={dogEarL}
//                 />
//                 <path
//                   fill="#f5d1ab"
//                   stroke="#57524d"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M39.9,31.8c0-6.4,0.1-11.1-0.2-14.5c-0.6-6.6-3.3-9.5-7.5-11c-3-1-9.4-0.7-12.6,2.9c-2.3,2.6-1.9,6.1-1.9,6.1l4,0.5v15.9"
//                 />
//                 <path
//                   id="dog--mouthBot"
//                   fill="#f5d1ab"
//                   stroke="#57524d"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M27.4,21.1c0.8,9.9-4.6,12.7-7.5,11.9c-3.6-1-2.7-5.5-2.7-5.5l0.6-4.4"
//                   ref={dogMouthBot}
//                 />
//               </g>
//               <path
//                 id="bone"
//                 fill="#fff"
//                 stroke="#57524d"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M13 8a5.07 5.07 0 017.51 6.79l12.71 12.68a5.07 5.07 0 113.25 9 5.07 5.07 0 11-9-3.25L14.78 20.53a5.07 5.07 0 11-3.25-9A5.1 5.1 0 0113 8z"
//                 ref={bone}
//               />
//               <g
//                 id="dog--front"
//                 style={{ visibility: "hidden" }}
//                 ref={dogFront}
//               >
//                 <g id="dog--face">
//                   <path
//                     fill="#f5d1ab"
//                     stroke="#57524d"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M32.1,6.3c-3-1-9.4-0.7-12.6,2.9c-2.3,2.6-1.9,6.1-1.9,6.1c-2.2,3.7-4,6.1-3.6,9c0.2,2.4,1.8,4.7,4.8,4.1c7.8,5.6,12.1-3.7,9.9-7.1"
//                   />
//                   <path
//                     fill="#57524d"
//                     d="M15.82 21.23c-.2 2.57 2.64 5 5 3.48 1.09-.66 3.07-2.16 1.36-3.37-1.52-.97-6.18-1.62-6.36-.11z"
//                   />
//                   <path
//                     fill="#fff"
//                     stroke="#57524d"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M18.93 23.38a10.45 10.45 0 00-.13 5.1"
//                   />
//                   <path
//                     id="dog--eyebrowRight"
//                     fill="none"
//                     stroke="#57524d"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M25.29 15.3a2 2 0 013.81-.06"
//                     ref={dogEyebrowRight}
//                   />
//                   <path
//                     id="dog--eyebrowLeft"
//                     fill="none"
//                     stroke="#57524d"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M18.36 13.87a2 2 0 011.9 1.37"
//                     ref={dogEyebrowLeft}
//                   />
//                 </g>
//                 <path
//                   id="dog--earRight"
//                   fill="#f5d1ab"
//                   stroke="#57524d"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M37.25,10.58c1.15-.6,3.55-5,4.11-7.76s1.09-9.26-3.31-9.47c-4.58-.2-5.23,4.47-5.37,7.07a37,37,0,0,0,.54,9"
//                   ref={dogEarR}
//                 />
//               </g>
//               <path
//                 id="heartTop"
//                 style={{ visibility: "hidden" }}
//                 fill="#FF969A"
//                 stroke="#692829"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M7.67 20.11a3.24 3.24 0 00-1.86 2.35A3.28 3.28 0 002.86 22a3.2 3.2 0 00-1.65 4c1.43 3.69 6.8 5.2 7.84 4.8s4-5.13 2.57-8.83a3.2 3.2 0 00-3.95-1.86z"
//                 ref={heartTop}
//               />
//               <path
//                 id="heartBot"
//                 style={{ visibility: "hidden" }}
//                 fill="#FF969A"
//                 stroke="#692829"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M15.41 35a2.61 2.61 0 00-2.32.71 2.63 2.63 0 00-1.76-1.67 2.57 2.57 0 00-3 2c-.74 3.13 2.17 6.6 3 6.81s5-1.6 5.77-4.73A2.58 2.58 0 0015.41 35z"
//                 ref={heartBot}
//               />
//             </svg>
//           </section>

//           {/*
//             <section
//               className={`${styles.outerAnimationsSection} ${
//                 liked && "liked"
//               } relative`}
//             >
//             <div className={`${styles.dot} ${styles.dot1}`}></div>
//             <div className={`${styles.dot} ${styles.dot2}`}></div>
//             <div className={`${styles.dot} ${styles.dot3}`}></div>
//             <div className={`${styles.dot} ${styles.dot4}`}></div>
//             <div className={`${styles.dot} ${styles.dot5}`}></div>
//             <div className={`${styles.dot} ${styles.dot6}`}></div>
//             <div className={`${styles.dot} ${styles.dot7}`}></div>
//             <div className={`${styles.dot} ${styles.dot8}`}></div>

//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h1}`}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h2} `}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h3}`}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h4} `}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>

//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h5}`}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h6} `}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h7} `}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="40"
//               width="40"
//               viewBox="0 0 320 320"
//               className={`${styles.h} ${styles.h8} `}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>

//             <svg
//               height="110"
//               width="110"
//               viewBox="0 0 320 320"
//               className={`${styles.fly} ${styles.fly1} `}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//             <svg
//               height="110"
//               width="110"
//               viewBox="0 0 320 320"
//               className={`${styles.fly} ${styles.fly2}`}
//             >
//               <path
//                 className="path"
//                 d="M 160 145 c 15 -90 170 -20 0 90 m 0 -90 c -15 -90 -170 -20 0 90"
//               />
//             </svg>
//           </section>
//       */}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LikePetButton;

export default function LikePetButton({
  handleLike,
  isLoading,
  isPetLiked,
}: {
  handleLike: () => void;
  isPetLiked?: boolean;
  isLoading: boolean;
}) {
  return (
    <Button
      onClick={handleLike}
      isLoading={isLoading}
      size="lg"
      variant="flat"
      color="danger"
      radius="lg"
      endContent={
        isPetLiked ? (
          <Image
            src="https://em-content.zobj.net/source/microsoft-teams/363/broken-heart_1f494.png"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src="https://em-content.zobj.net/source/microsoft-teams/363/red-heart_2764-fe0f.png"
            width={24}
            height={24}
          />
        )
      }
      className="fixed z-50 flex items-center justify-center transform -translate-x-1/2 bg-opacity-50 bottom-24 left-1/2 hover:scale-125 text-[20px] hover:animate-pulse"
    >
      {isPetLiked ? "Dislike" : "Like"}
    </Button>
  );
}
