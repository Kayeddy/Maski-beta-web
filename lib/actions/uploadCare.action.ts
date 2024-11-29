"use server";
import {
  deleteFile,
  deleteFiles,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";

const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string,
  secretKey: process.env.UPLOADCARE_SECRET_KEY as string, // Ensure this runs only server-side
});

export const deleteFileFromStorage = async (fileId: string) => {
  try {
    const response = await deleteFile(
      {
        uuid: fileId,
      },
      { authSchema: uploadcareSimpleAuthSchema }
    );
    return response;
  } catch (error: any) {
    console.error("Failed to delete file from storage => ", error);
  }
};

export const deleteMultipleFilesFromStorage = async (fileList: string[]) => {
  try {
    const response = await deleteFiles(
      {
        uuids: [...fileList],
      },
      { authSchema: uploadcareSimpleAuthSchema }
    );
    return response;
  } catch (error: any) {
    console.error("Failed to delete files from storage => ", error);
  }
};
