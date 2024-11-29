import { IPet, PetCreation, PetUpdate } from "../types/pet/interfaces.types";

/**
 * Adds a new pet.
 *
 * @param {PetCreation} params - The parameters for pet creation.
 * @param {object} params.data - The pet data.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @returns {Promise<IPet>} The created pet data or an error message.
 */
export async function addPet({
  data,
  sessionToken,
}: PetCreation): Promise<IPet> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PET_SERVICE_BASE_URL}/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add pet");
    }

    const petData = await response.json();
    // console.log("Pet added successfully:", petData);
    return petData;
  } catch (error: any) {
    console.error("Add pet error:", error);
    return { message: error.message } as any;
  }
}

/**
 * Updates a pet's data.
 *
 * @param {PetUpdate} params - The parameters for updating a pet.
 * @param {string} params.petId - The ID of the pet to update.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @param {object} params.data - The data to update.
 * @returns {Promise<IPet>} The updated pet data or an error message.
 */
export async function updatePet({
  petId,
  sessionToken,
  data,
}: PetUpdate): Promise<IPet> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PET_SERVICE_BASE_URL}/update/${petId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update pet data");
    }

    const petData = await response.json();
    // console.log("Pet updated successfully:", petData);
    return petData;
  } catch (error: any) {
    console.error("Update pet error:", error);
    return { message: error.message } as any;
  }
}

/**
 * Deletes a pet by its ID.
 *
 * @param {string} petId - The ID of the pet to delete.
 * @param {string | null} sessionToken - The session token for authentication.
 * @param {string} userId - The ID of the user who owns the pet.
 * @returns {Promise<{ message: string }>} A success message or an error message.
 */
export async function deletePet(
  petId: string,
  sessionToken: string | null,
  userId: string
): Promise<{ message: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PET_SERVICE_BASE_URL}/delete/${petId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete pet");
    }

    return { message: "Pet deleted successfully" };
  } catch (error: any) {
    console.error("Delete pet error:", error);
    return { message: error.message };
  }
}

/**
 * Fetches a pet by its ID.
 *
 * @param {string} petId - The ID of the pet to fetch.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<IPet>} The pet data or an error message.
 */
export async function getPetById(
  petId: string,
  sessionToken: string | null
): Promise<IPet> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PET_SERVICE_BASE_URL}/${petId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Pet not found", pet: null } as any;
    }

    const pet = await response.json();
    // console.log("Pet data fetched successfully", pet);
    return pet;
  } catch (error: any) {
    return { error: error.message } as any;
  }
}

/**
 * Fetches pets by holder ID.
 *
 * @param {string} holderId - The ID of the holder to fetch pets for.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<IPet[]>} The pets data or an error message.
 */
export async function getPetsByHolderId(
  holderId: string,
  sessionToken: string | null
): Promise<IPet[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PET_SERVICE_BASE_URL}/by-holder/${holderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Pets not found", pets: null } as any;
    }

    const pets = await response.json();
    // console.log("Pets data fetched successfully", pets);
    return pets;
  } catch (error: any) {
    return { error: error.message } as any;
  }
}

/**
 * Fetches all pets.
 *
 * @param {string} sessionToken - The session token for authentication.
 * @returns {Promise<IPet[]>} The pets data or an error message.
 */
export async function getAllPets(sessionToken: string): Promise<IPet[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PET_SERVICE_BASE_URL}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Could not retrieve pets", pet: null } as any;
    }

    const pets = await response.json();
    // console.log("Pets fetched successfully", pets);
    return pets;
  } catch (error: any) {
    return { error: error.message } as any;
  }
}
