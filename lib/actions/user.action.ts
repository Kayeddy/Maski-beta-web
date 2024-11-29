import { UserRegistration, UserUpdate } from "../types/user/interfaces.types";

/**
 * Registers a new user.
 *
 * @param {UserRegistration} params - The parameters for user registration.
 * @param {object} params.data - The registration data.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @returns {Promise<object>} The registered user data or an error message.
 */
export async function registerUser({ data, sessionToken }: UserRegistration) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ ...data }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register user");
    }

    const userData = await response.json();
    // console.log("User registered successfully:", userData);
    return userData;
  } catch (error: any) {
    console.error("Registration error:", error);
    return { message: error.message };
  }
}

/**
 * Updates a user's data.
 *
 * @param {UserUpdate} params - The parameters for updating a user.
 * @param {string | null | undefined} params.userId - The ID of the user to update.
 * @param {string | null} params.sessionToken - The session token for authentication.
 * @param {object} params.data - The data to update.
 * @returns {Promise<object>} The updated user data or an error message.
 */
export async function updateUser({ userId, sessionToken, data }: UserUpdate) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL}/update/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ ...data }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user data");
    }

    const userData = await response.json();
    // console.log("User updated successfully:", userData);
    return userData;
  } catch (error: any) {
    console.error("Update error:", error);
    return { message: error.message };
  }
}

/**
 * Fetches a user by their email.
 *
 * @param {string} email - The email of the user to fetch.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<object>} The user data or an error message.
 */
export async function getUserByEmail(
  email: string,
  sessionToken: string | null
) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL
      }/by-email/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "User not found", user: null };
    }

    const users = await response.json();
    // console.log("User data fetched successfully", users);
    return users;
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches a user by their ID.
 *
 * @param {string} userId - The ID of the user to fetch.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<object>} The user data or an error message.
 */
export async function getUserById(userId: string, sessionToken: string | null) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL}/by-id/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "User not found", user: null };
    }

    const users = await response.json();
    // console.log("User data fetched successfully", users);
    return users;
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches all users.
 *
 * @param {string} sessionToken - The session token for authentication.
 * @returns {Promise<object>} The users data or an error message.
 */
export async function getAllUsers(sessionToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL}/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Could not retrieve users", user: null };
    }

    const users = await response.json();
    // console.log("Users fetched successfully", users);
    return users;
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches multiple users by their IDs.
 *
 * @param {string[]} userIds - The array of user IDs to fetch.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<object[]>} The users data or an error message.
 */
export async function getManyUsers(
  userIds: string[],
  sessionToken: string | null
) {
  try {
    if (!userIds || !Array.isArray(userIds)) {
      throw new Error("Invalid user IDs");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL}/many`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify([...userIds]),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }

    const users = await response.json();
    // console.log("Fetched users successfully:", users);
    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { message: error.message };
  }
}
