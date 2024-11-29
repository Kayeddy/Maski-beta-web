import { IMatch } from "../types/match/interfaces";

interface FetchMatchesParams {
  sessionToken: string | null;
}

interface FetchMatchesByHolderIdParams {
  holderId: string;
  sessionToken: string | null;
}

interface FetchMatchesByAdopterIdParams {
  adopterId: string;
  sessionToken: string | null;
}

interface MatchCreation {
  data: IMatch;
  sessionToken: string | null;
}

interface MatchUpdate {
  matchId: string;
  data: Partial<IMatch>;
  sessionToken: string | null;
}

interface MatchDeletion {
  matchId: string;
  sessionToken: string | null;
}

export async function fetchMatches({
  sessionToken,
}: FetchMatchesParams): Promise<IMatch[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MATCH_SERVICE_BASE_URL}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch matches");
    }

    const matches = await response.json();
    // console.log("Matches fetched successfully:", matches);
    return matches;
  } catch (error: any) {
    console.error("Fetch error:", error);
    throw new Error(error.message);
  }
}

export async function fetchMatchesByHolderId({
  holderId,
  sessionToken,
}: FetchMatchesByHolderIdParams): Promise<IMatch[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MATCH_SERVICE_BASE_URL}/holder/${holderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch matches by holder ID"
      );
    }

    const matches = await response.json();
    // console.log("Matches fetched successfully by holder ID:", matches);
    return matches;
  } catch (error: any) {
    console.error("Fetch by holder ID error:", error);
    throw new Error(error.message);
  }
}

export async function fetchMatchesByAdopterId({
  adopterId,
  sessionToken,
}: FetchMatchesByAdopterIdParams): Promise<IMatch[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MATCH_SERVICE_BASE_URL}/adopter/${adopterId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch matches by adopter ID"
      );
    }

    const matches = await response.json();
    // console.log("Matches fetched successfully by holder ID:", matches);
    return matches;
  } catch (error: any) {
    console.error("Fetch by holder ID error:", error);
    throw new Error(error.message);
  }
}

export async function createMatch({ data, sessionToken }: MatchCreation) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MATCH_SERVICE_BASE_URL}/create`,
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
      throw new Error(errorData.message || "Failed to create match");
    }

    const matchData = await response.json();
    console.log("Match created successfully:", matchData);
    return matchData;
  } catch (error: any) {
    console.error("Creation error:", error);
    return { message: error.message };
  }
}

export async function updateMatch({
  matchId,
  data,
  sessionToken,
}: MatchUpdate) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MATCH_SERVICE_BASE_URL}/update/${matchId}`,
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
      throw new Error(errorData.message || "Failed to update match");
    }

    const matchData = await response.json();
    console.log("Match updated successfully:", matchData);
    return matchData;
  } catch (error: any) {
    console.error("Update error:", error);
    return { message: error.message };
  }
}

export async function deleteMatch({ matchId, sessionToken }: MatchDeletion) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MATCH_SERVICE_BASE_URL}/delete/${matchId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete match");
    }

    const matchData = await response.json();
    console.log("Match deleted successfully:", matchData);
    return matchData;
  } catch (error: any) {
    console.error("Deletion error:", error);
    return { message: error.message };
  }
}
