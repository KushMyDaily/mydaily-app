import { Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = ({ onImageUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the uploaded image file (e.g., display preview, upload to server, etc.)
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataURL = reader.result;
          onImageUpload(imageDataURL);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text fontSize={"14px"} lineHeight={"20px"} color={"#4339F2"}>
          Drop the image here...
        </Text>
      ) : (
        <Text fontSize={"14px"} lineHeight={"20px"} color={"#4339F2"}>
          Upload Photo
        </Text>
      )}
    </div>
  );
};

export default ImageUpload;
