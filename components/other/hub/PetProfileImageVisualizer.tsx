"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaChevronRight as RightArrowIcon,
  FaChevronLeft as LeftArrowIcon,
} from "react-icons/fa6";
import { Button, Card, Image } from "@nextui-org/react";
import {
  ArrowLeftIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MediaData as PetMediaData } from "@/lib/types/pet/interfaces.types";
import { FileUploaderMinimal } from "@uploadcare/react-uploader";
import { deleteFileFromStorage } from "@/lib/actions/uploadCare.action";
import { toast } from "sonner";
import { useQueryClient } from "react-query";
import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";
import CustomNotificationToast from "@/components/customUI/CustomNotificationToast";

/**
 * PetMediaEditionSection component
 *
 * This component allows users to edit pet media by displaying existing images and providing
 * functionalities to upload new media or delete existing ones. It includes a "Save Changes" button
 * that appears when changes are detected, allowing users to save their updates.
 *
 * @param {Object} props - Component properties
 * @param {PetMediaData[]} props.petImagesArray - Initial array of pet media data
 * @param {Function} props.exitEditMode - Function to exit the edit mode
 *
 * @returns {JSX.Element} A React component for editing pet media
 */
const PetMediaEditionSection = ({
  petImagesArray,
  exitEditMode,
  petId,
}: {
  petImagesArray: PetMediaData[];
  exitEditMode: () => void;
  petId: string;
}) => {
  const [petImagesTracker, setPetImagesTracker] =
    useState<PetMediaData[]>(petImagesArray);
  const [imageDeletionLoading, setImageDeletionLoading] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  const {
    mutate: updatePet,
    isLoading: isPetUpdateLoading,
    isError: isPetUpdateError,
  } = useUpdatePet();

  const handleUploadThingFileRemoval = async (fileId: string) => {
    try {
      await deleteFileFromStorage(fileId);
    } catch (error) {
      console.error("Error removing file from storage:", error);
    }
  };

  const handleLocalFileRemoval = async (fileId: string) => {
    setImageDeletionLoading(true);
    const updatedPetImagesTracker = petImagesTracker.filter(
      (petImage: PetMediaData) => petImage.fileUploadCareId !== fileId
    );
    setPetImagesTracker(updatedPetImagesTracker);
    await handleUploadThingFileRemoval(fileId);
    setImageDeletionLoading(false);
  };

  const handleFileChangeEvent = (items: any) => {
    const successfulFiles = items.allEntries.filter(
      (file: any) => file.status === "success"
    );

    const newFiles = successfulFiles.map((file: any) => ({
      fileUrl: file.cdnUrl,
      fileType: file.mimeType,
      fileUploadCareId: file.uuid,
      label: "petMedia",
    }));

    setPetImagesTracker((prev: PetMediaData[]) => [...prev, ...newFiles]);
  };

  const handlePetMediaUpdate = () => {
    updatePet(
      {
        petId: petId, // Replace with actual pet ID
        data: {
          media: [...petImagesTracker],
        },
      },
      {
        onSuccess: () => {
          CustomNotificationToast({ title: "Preferences updated" });
          setChangesMade(false);
        },
        onError: (error) => {
          console.error("Error updating pet:", error);
        },
      }
    );
  };

  useEffect(() => {
    if (
      petImagesTracker.length !== petImagesArray.length ||
      petImagesTracker.some(
        (image, index) =>
          image.fileUploadCareId !== petImagesArray[index].fileUploadCareId
      )
    ) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [petImagesTracker]);

  useEffect(() => {
    setPetImagesTracker(petImagesArray);
  }, [petImagesArray]);

  return (
    <motion.div className="relative flex flex-col items-start justify-start w-full h-full gap-4 overflow-hidden">
      <div className="flex flex-row gap-4">
        <Button
          size="sm"
          color="primary"
          aria-label="Exit edit mode"
          variant="flat"
          isIconOnly
          className="text-white"
          onClick={exitEditMode}
        >
          <ArrowLeftIcon />
        </Button>
        {changesMade && (
          <Button
            size="sm"
            color="secondary"
            aria-label="Save changes"
            variant="shadow"
            className="text-white"
            onClick={handlePetMediaUpdate}
            isLoading={isPetUpdateLoading}
          >
            Save Changes
          </Button>
        )}
      </div>
      <div className="flex flex-row flex-wrap items-start justify-start gap-4 overflow-x-hidden overflow-y-auto">
        {petImagesTracker.map((image: PetMediaData, index: number) => (
          <div key={image.fileUploadCareId + index} className="relative">
            <Image
              src={image.fileUrl}
              className="object-cover w-[100px] h-[100px]"
              alt="Pet image"
            />
            <Button
              className="absolute z-20 top-1 right-1 hover:bg-opacity-100"
              size="sm"
              color="danger"
              isIconOnly
              aria-label="Delete pet image"
              onClick={() => handleLocalFileRemoval(image.fileUploadCareId)}
              isLoading={imageDeletionLoading}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <FileUploaderMinimal
          onChange={handleFileChangeEvent}
          onFileRemoved={(file: any) => handleLocalFileRemoval(file.uuid ?? "")}
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string}
        />
      </div>
    </motion.div>
  );
};

/**
 * PetProfileImageVisualizer component
 * @param {object} props - The props of the component
 * @param {any[]} props.petImagesArray - Array of pet images to be displayed
 * @returns {JSX.Element} The PetProfileImageVisualizer component
 */
const PetProfileImageVisualizer = ({
  petImagesArray,
  adminMode,
  petId,
}: {
  petImagesArray: PetMediaData[];
  adminMode?: boolean;
  petId: string;
}) => {
  const [petImages, setPetImages] = useState(petImagesArray);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [animationDirection, setAnimationDirection] = useState(0);
  const [petMediaEditModeActivated, setPetMediaEditModeActivated] =
    useState(false);
  const autoPlayInterval = 3000;
  const manualScrollDelay = 2000; // Delay before resuming auto-play after manual scroll
  const autoPlayTimeoutId = useRef<NodeJS.Timeout | null>(null);

  // Variants for image animation
  const imageVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      y: direction === 1 ? -100 : 100,
      scale: 0.8,
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      y: direction === 1 ? 100 : -100,
      scale: 0.8,
    }),
  };

  const handleExitEditMode = () => {
    setPetMediaEditModeActivated(false);
  };

  /**
   * Scrolls the image carousel to the next image
   */
  const scrollImageCarouselToNext = () => {
    setPetImages((prevItems) => [...prevItems.slice(1), prevItems[0]]);
    setCurrentImageIndex(0);
    setAnimationDirection(1);
  };

  /**
   * Scrolls the image carousel to the previous image
   */
  const scrollImageCarouselToPrev = () => {
    setPetImages((prevItems) => [
      prevItems[prevItems.length - 1],
      ...prevItems.slice(0, -1),
    ]);
    setCurrentImageIndex(0);
    setAnimationDirection(-1);
  };

  /**
   * Handles manual image selection from the mini-carousel
   * @param {number} imageIndex - Index of the selected image
   */
  const handleManualImageSelection = (imageIndex: number) => {
    setPetImages((prevItems) => [
      prevItems[imageIndex],
      ...prevItems.slice(0, imageIndex),
      ...prevItems.slice(imageIndex + 1),
    ]);
    setCurrentImageIndex(0);
    pauseAutoPlayWithDelay();
  };

  /**
   * Pauses auto-play and resumes it after a delay
   */
  const pauseAutoPlayWithDelay = () => {
    setIsAutoPlay(false);
    if (autoPlayTimeoutId.current) {
      clearTimeout(autoPlayTimeoutId.current);
    }
    autoPlayTimeoutId.current = setTimeout(() => {
      setIsAutoPlay(true);
    }, manualScrollDelay);
  };

  /**
   * Advances the carousel automatically
   */
  const advanceCarousel = () => {
    if (isAutoPlay) {
      scrollImageCarouselToNext();
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isAutoPlay) {
      intervalId = setInterval(advanceCarousel, autoPlayInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (autoPlayTimeoutId.current) {
        clearTimeout(autoPlayTimeoutId.current);
      }
    };
  }, [isAutoPlay]);

  useEffect(() => {
    setPetImages(petImagesArray);
  }, [petImagesArray]);

  return (
    <motion.div
      layoutId={`image-${currentImageIndex}`}
      variants={imageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={animationDirection}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 1,
      }}
      className="relative flex items-center justify-center w-full h-full px-2 overflow-hidden select-none"
    >
      {!petMediaEditModeActivated ? (
        <div
          className={`relative flex items-center justify-center w-full h-[50%] p-4 bg-transparent border-0 border-transparent border-none rounded-[30px]`}
        >
          <Button
            onClick={() => {
              scrollImageCarouselToPrev();
              pauseAutoPlayWithDelay();
            }}
            size="sm"
            radius="sm"
            aria-label="Previous Image"
            className="absolute z-20 p-2 text-white bg-black bg-opacity-50 left-1"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <LeftArrowIcon />
          </Button>

          {/* Cover Image */}
          <img
            src={petImages[0].fileUrl}
            alt={""}
            className="absolute object-cover w-full h-full scale-150 blur-lg"
            style={{ filter: "blur(10px)" }}
          />
          <Image
            src={`${petImages[0].fileUrl}`}
            isBlurred
            alt="mainPetImageVisualizer"
            radius="sm"
            className="object-scale-down object-center w-full  transition-all duration-200 ease-in-out lg:max-h-[500px] max-h-[400px] h-full"
          />
          <Button
            onClick={() => {
              scrollImageCarouselToNext();
              pauseAutoPlayWithDelay();
            }}
            size="sm"
            radius="sm"
            aria-label="Next Image"
            className="absolute z-20 p-2 text-white bg-black bg-opacity-50 right-1"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <RightArrowIcon />
          </Button>
          {adminMode && (
            <Button
              onClick={
                adminMode
                  ? () => setPetMediaEditModeActivated(true)
                  : () => {
                      return;
                    }
              }
              isIconOnly
              size="sm"
              radius="sm"
              variant="shadow"
              color="secondary"
              aria-label="Next Image"
              className={`absolute z-20 p-2 text-white right-0 top-[-50px]`}
            >
              <Pencil1Icon />
            </Button>
          )}
          {/* Uncomment this block if you need the mini-carousel */}
          {/* <CardFooter className="absolute z-10 p-0 py-1 overflow-hidden before:bg-white/10 border-white/20 border-1 before:rounded-xl rounded-large bottom-1 shadow-small">
          <div className="flex flex-row items-center w-full gap-4 p-4 overflow-x-hidden bg-transparent ">
            
            <motion.div className="flex flex-row gap-4 carousel">
              {petImages.map((image, index) => (
                <motion.div
                  layoutId={`image-${index}`}
                  className="h-[50px] w-[50px] gap-4 rounded-[10px] bg-cover bg-center carousel-item"
                  key={image.fileUrl}
                  style={{ backgroundImage: `url(${image.fileUrl})` }}
                  onClick={() => handleManualImageSelection(index)}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                ></motion.div>
              ))}
            </motion.div>
            
          </div>
        </CardFooter> */}
        </div>
      ) : (
        <PetMediaEditionSection
          petImagesArray={petImagesArray}
          exitEditMode={handleExitEditMode}
          petId={petId}
        />
      )}
    </motion.div>
  );
};

export default PetProfileImageVisualizer;
