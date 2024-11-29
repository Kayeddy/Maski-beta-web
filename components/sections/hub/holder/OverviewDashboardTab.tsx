import React, { useMemo } from "react";

import PetDeletionConfirmationModal from "@/components/modals/PetDeletionConfirmationModal";
import PetInformationModal from "@/components/modals/PetInformationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPet } from "@/lib/types/pet/interfaces.types";
import { IUser } from "@/lib/types/user/interfaces.types";
import { Button, Card, CardFooter, Divider, Image } from "@nextui-org/react";
import {
  EyeOpenIcon,
  HeartFilledIcon,
  HeartIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { BsDoorOpenFill, BsHouseAddFill } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa6";
import { GiPawHeart } from "react-icons/gi";
import { useManyUsers } from "@/lib/hooks/user/useManyUsers";
import UserInformationModal from "@/components/modals/UserInformationModal";
import { useMatchStore } from "@/store/shared/useMatchStore";

const CustomDashboardMetricCard = ({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string | number;
  Icon: React.ComponentType;
}) => {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const CustomPetLikesRow = ({
  user,
  pet,
}: {
  user: IUser | any;
  pet: IPet | any;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 my-4 lg:justify-between">
      <div className="flex flex-row flex-wrap gap-2">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.profilePicture} alt={`${user._id}_avatar`} />
          {/* <AvatarFallback>OM</AvatarFallback> */}
        </Avatar>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">{user.firstName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <UserInformationModal
        ModalTrigger={
          <Button className="font-medium" color="primary" variant="shadow">
            View
          </Button>
        }
        userData={user}
        petData={pet}
      />
    </div>
  );
};

export default function OverviewDashboardTab({
  pets,
  data,
}: {
  pets: IPet[] | any;
  data: any;
}) {
  const dashboardMetricsData = [
    {
      id: 0,
      label: "Number of pets",
      value: data.totalPets,
      Icon: GiPawHeart,
    },
    {
      id: 1,
      label: "Number of matches",
      value: data.totalMatches,
      Icon: FaHandshake,
    },
    {
      id: 2,
      label: "Completed adoptions",
      value: data.completedAdoptions,
      Icon: BsHouseAddFill,
    },
    {
      id: 3,
      label: "Ongoing adoptions",
      value: data.ongoingAdoptions,
      Icon: BsDoorOpenFill,
    },
  ];

  const renderPetLikes = (pet: IPet) => {
    const {
      data: likedUsers,
      isLoading,
      error,
    } = useManyUsers(pet.likes ?? []);

    if (isLoading) {
      return <p>Loading liked users...</p>;
    }

    if (error) {
      return <p>Error loading liked users</p>;
    }

    // console.log("Liked users", likedUsers);

    if (likedUsers) {
      return likedUsers?.map((user) => (
        <CustomPetLikesRow key={user._id} user={user} pet={pet} />
      ));
    }

    return [];
  };

  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {dashboardMetricsData.map((item) => (
            <CustomDashboardMetricCard
              key={item.id}
              title={item.label}
              value={item.value}
              Icon={item.Icon}
            />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Pets</CardTitle>
                <CardDescription>
                  All pets you have mounted so far
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {pets.length === 0 ? (
                <p className="text-center text-gray-500 text-body-medium">
                  Add your first pet to see it here! :)
                </p>
              ) : (
                <div className="flex flex-wrap items-center justify-start gap-4 p-1">
                  {pets.map((pet, idx) => (
                    <Card
                      key={pet.name + idx.toLocaleString()}
                      isFooterBlurred
                      radius="md"
                      className="flex flex-col items-center lg:items-start w-[200px] h-[200px]"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={pet.media[0]?.fileUrl}
                        className="rounded-md"
                      />

                      <div className="absolute z-10 flex flex-row gap-2 text-black top-2 right-2">
                        <span className="bg-white hover:cursor-pointer rounded-[10px] p-1">
                          <PetInformationModal
                            ModalTrigger={
                              <EyeOpenIcon className="w-5 h-5 text-primary-400" />
                            }
                            petData={pet}
                            adminMode
                          />
                        </span>

                        <span className="bg-white hover:cursor-pointer rounded-[10px] p-1">
                          <PetDeletionConfirmationModal
                            ModalTrigger={
                              <TrashIcon className="w-5 h-5 text-danger-400" />
                            }
                            trackedPetList={pets}
                            petData={pet}
                          />
                        </span>
                      </div>

                      <CardFooter className="absolute bottom-0 z-10 flex flex-col items-start justify-start gap-4 bg-black/40 border-t-1 border-default-600 dark:border-default-100 lg:flex-row">
                        <div className="flex flex-col gap-2">
                          <p className="text-white text-medium">{pet.name}</p>
                          <span className="flex flex-row items-center justify-start gap-4 text-white hover:cursor-pointer">
                            {pet?.likes && pet.likes.length > 0 ? (
                              <HeartFilledIcon className="w-5 h-5" />
                            ) : (
                              <HeartIcon className="w-5 h-5 " />
                            )}
                            <p>{pet.likes ? pet.likes.length : 0}</p>
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <div className="grid gap-2">
                <CardTitle>Likes</CardTitle>
                <CardDescription>
                  Users that have liked your pets
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="grid w-full gap-8">
              {pets.map((pet) =>
                pet.likes && pet.likes?.length > 0 ? (
                  <div key={pet._id} className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">{pet.name}</h3>
                    <div className="flex flex-col gap-4">
                      {renderPetLikes(pet)}
                    </div>
                    <Divider />
                  </div>
                ) : (
                  <div key={pet._id}></div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
