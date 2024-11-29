import React, { useState, useEffect } from "react";

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CustomDesktopPetSliderImageVisualizer: React.FC<CustomImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [isSmall, setIsSmall] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const { width, height } = e.currentTarget;
    setDimensions({ width, height });

    // Define your own criteria for what constitutes "too small"
    const isTooSmall = width < 500 || height < 500;
    setIsSmall(isTooSmall);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isSmall && (
        <div className="absolute top-0 left-0 w-full h-full z-50">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover blur-md scale-150"
            style={{ filter: "blur(20px)" }}
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={`relative z-10 ${className}`}
        style={
          isSmall
            ? {
                width: "auto",
                height: "65vh",
                maxWidth: "65vw",
                objectFit: "contain",
              }
            : {}
        }
      />
    </div>
  );
};

export default CustomDesktopPetSliderImageVisualizer;
