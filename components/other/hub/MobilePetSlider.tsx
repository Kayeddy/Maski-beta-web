"use client";

//@ts-nocheck

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import EffectTinder from "@/lib/scripts/effect-tinder.esm";

// CSS

// Next.js Image
import Image from "next/image";
import PetInformationModal from "@/components/modals/PetInformationModal";

import { testDb } from "@/constants/test";
import { IPet } from "@/lib/types/pet/interfaces.types";

export default function MobilePetSwiper({ pets }: { pets: IPet[] }) {
  const swiperParameters = {
    modules: [A11y, EffectTinder],
    effect: "tinder",
  };

  return (
    <>
      <Swiper {...swiperParameters}>
        {pets.map((pet) => (
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

        <SwiperSlide className="demo-empty-slide">
          There are no more recommendations
        </SwiperSlide>

        <button
          slot="container"
          className="swiper-tinder-button swiper-tinder-button-no"
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
          className="swiper-tinder-button swiper-tinder-button-yes"
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
      </Swiper>
    </>
  );
}
