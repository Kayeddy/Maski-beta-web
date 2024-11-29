import {
  GetProfileData,
  ProfileCreationProps,
  UpdateProfileData,
} from "../types/user/interfaces.types";

/**
 * Fetches a user profile by its ID.
 *
 * @param {GetProfileData} params - The parameters for fetching a profile.
 * @param {string} params.profileId - The ID of the profile to fetch.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @returns {Promise<any | {}>} The user profile data or an error message.
 */
export async function getProfile({
  profileId,
  sessionToken,
}: GetProfileData): Promise<any | {}> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL
      }/profiles/${encodeURIComponent(profileId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}), // Include the authorization header if a session token is provided
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user profile");
    }

    const userProfileData = await response.json();
    console.log("User profile fetched successfully:", userProfileData);
    return userProfileData; // Returns the user profile data if the request is successful
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw error; // Rethrows the error to be handled by the caller
  }
}

/**
 * Creates a new user profile.
 *
 * @param {ProfileCreationProps} params - The parameters for creating a profile.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.type - The type of the profile.
 * @param {object} params.data - The data for the profile.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @returns {Promise<any | {}>} The created profile data or an error message.
 */
export async function createProfile({
  userId,
  type,
  data,
  sessionToken,
}: ProfileCreationProps): Promise<any | {}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL}/profiles/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}), // Include the authorization header if a session token is provided
        },
        body: JSON.stringify({ userId, type, data }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user profile");
    }

    const userProfileData = await response.json();
    console.log("User profile created successfully:", userProfileData);
    return userProfileData; // Returns the user data if the request is successful
  } catch (error: any) {
    console.error("Error creating user profile:", error);
    throw error; // Rethrows the error to be handled by the caller
  }
}

/**
 * Updates an existing user profile.
 *
 * @param {UpdateProfileData} params - The parameters for updating a profile.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.profileId - The ID of the profile to update.
 * @param {string} [params.type] - The type of the profile.
 * @param {object} [params.data] - The data for the profile.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @returns {Promise<any | {}>} The updated profile data or an error message.
 */
export async function updateProfile({
  userId,
  profileId,
  type = "",
  data = {},
  sessionToken,
}: UpdateProfileData): Promise<any | {}> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL
      }/profiles/update/${encodeURIComponent(profileId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}), // Include the authorization header if a session token is provided
        },
        body: JSON.stringify({ userId, type, data }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user profile");
    }

    const userProfileUpdatedData = await response.json();
    console.log("User profile updated successfully:", userProfileUpdatedData);
    return userProfileUpdatedData;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error; // Rethrows the error to be handled by the caller
  }
}
