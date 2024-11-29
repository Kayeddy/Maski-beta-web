import { Button, Image } from "@nextui-org/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-screen h-screen">
      <div className="dog-wrapper">
        <div className="dog-wrap">
          <div className="stars">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
          </div>
          <div className="shooting-star">
            <div className="shooting"></div>
            <div className="shooting2"></div>
            <div className="shooting3"></div>
            <div className="shooting4"></div>
            <div className="shooting5"></div>
          </div>
          <div className="moon-container">
            <div className="moon-glow">
              <div className="glow1"></div>
              <div className="glow2"></div>
            </div>
            <div className="moon-center">
              <div className="scars1"></div>
              <div className="scars2"></div>
              <div className="scars3"></div>
            </div>
          </div>
          <div className="dog-container">
            <div className="front-left-leg">
              <div className="front-left-foot"></div>
            </div>
            <div className="dog-back-torso"></div>
            <div className="dog-head-front">
              <div className="ears">
                <div className="left-ear ear"></div>
                <div className="right-ear ear"></div>
              </div>

              <div className="eyes">
                <div className="left-eye eye"></div>
                <div className="right-eye eye"></div>
              </div>

              <div className="dog-mouth">
                <div className="dog-mouth-base">
                  <div className="dog-nose-black"></div>
                </div>
              </div>
              <div className="dog-collar"></div>
            </div>

            <div className="dog-back-tail">
              <div className="curve1"></div>
              <div className="curve2"></div>
              <div className="curve3"></div>
              <div className="end"></div>
            </div>

            <div className="back-leg">
              <div className="back-leg-foot"></div>
            </div>

            <div className="front-right-leg">
              <div className="front-right-foot"></div>
            </div>
          </div>
          <div className="hill">
            <div className="hill1"></div>
            <div className="hill2"></div>
            <div className="hill3"></div>
          </div>
          <div className="back-hill"></div>
          <div className="dog-kennel">
            <div className="roof-right">
              <div className="wall"></div>
            </div>
            <div className="wall-left"></div>
            <div className="wall-right">
              <div className="door"></div>
            </div>
            <div className="roof-left"></div>
          </div>
          <div className="ground"></div>
        </div>
      </div>
      <div className="absolute inset-0 -translate-y-[50px] z-50 flex flex-col items-center justify-center gap-4 p-4 w-full">
        <div className="flex flex-row items-center justify-center gap-2 bg-white bg-opacity-50 rounded-[10px] backdrop-blur-sm lg:bg-none lg:bg-transparent w-full">
          <h2 className="p-2 text-center text-white lg:text-heading1-bold text-heading3-bold ">
            OOPS! Looks like someone got lost
          </h2>
          <Image
            alt="Card background"
            width={60}
            height={60}
            className="object-cover max-w-md max-h-md"
            src="https://em-content.zobj.net/source/microsoft-teams/363/anxious-face-with-sweat_1f630.png"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 z-50 flex items-center justify-center lg:bottom-24 bottom-14">
        <Link href="/">
          <Button
            size="lg"
            color="primary"
            variant="shadow"
            className="bg-opacity-50"
            endContent={
              <Image
                src="https://em-content.zobj.net/source/microsoft-teams/363/paw-prints_1f43e.png"
                width={30}
                height={30}
                className="object-cover"
              />
            }
          >
            Get back on track
          </Button>
        </Link>
      </div>
    </div>
  );
}
