"use client";

import React, { useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { Image } from "@nextui-org/react";
import { deleteFileFromStorage } from "@/lib/actions/uploadCare.action";

interface PetMediaUploadProps {
  onFinish: (
    uploadedFiles: {
      fileUrl: string;
      fileType: string;
      label: string;
      fileUploadCareId: string;
    }[]
  ) => void;
}

const CustomPetMediaUploader: React.FC<PetMediaUploadProps> = ({
  onFinish,
}) => {
  const [files, setFiles] = useState<any[]>([]);

  const handleChangeEvent = (items: any) => {
    const successfulFiles = items.allEntries.filter(
      (file: any) => file.status === "success"
    );

    const fileData = successfulFiles.map((file: any) => ({
      fileUrl: file.cdnUrl,
      fileType: file.mimeType,
      fileUploadCareId: file.uuid,
      label: "petMedia", // default label
    }));

    // console.log("Processed file data with labels:", fileData); // Log the processed file data

    setFiles(successfulFiles);
    onFinish(fileData);
  };

  const handleFileRemoval = async (fileId: string) => {
    await deleteFileFromStorage(fileId);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <p>Next, let's see some pictures of this lovely pet!</p>
      <FileUploaderRegular
        onChange={handleChangeEvent}
        onFileRemoved={(file) => handleFileRemoval(file.uuid ?? "")}
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string}
      />
      {files.length > 0 && <p>Media you have uploaded</p>}
      <div className="flex flex-row flex-wrap w-full gap-4">
        {files.map((file) => (
          <div key={file.uuid} className="w-[150px] h-[150px]">
            <Image
              src={file.cdnUrl}
              alt={file.fileInfo.originalFilename}
              width="100%"
              height="100%"
              radius="sm"
              className="object-cover h-[150px] w-[150px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomPetMediaUploader;
