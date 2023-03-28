import React from "react";
import { useState } from "react";
import { TopBar } from "./TopBar";



function ProfilePictureUploader() {
  const [image, setImage] = useState<string | null>(null);

  // Fonction pour gérer le glisser-déposer
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  // Fonction pour empêcher le comportement par défaut du navigateur pour le glisser-déposer
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  return (
    <div className="App">
      <TopBar/>
      <h1 className="textcol2">Drag and Drop Image</h1>
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {image ? (
          <img src={image} alt="profile" />
        ) : (
          <p className="textcol">Drag and drop your image here</p>
        )}
      </div>
    </div>
  );
}
export default ProfilePictureUploader;