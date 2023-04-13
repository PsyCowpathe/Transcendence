import React from "react";
import { useState } from "react";
import { TopBar } from "./TopBar";
import { VraimentIlSaoule } from '../Headers/VraimentIlEstCasseCouille';
import { UploadPicRequest } from "../Api/UploadPicRequest";
import { ToastContainer, toast, ToastOptions } from 'react-toastify';

function ProfilePictureUploader() {
  const [image, setImage] = useState<string | null>(null);


  const SendToBack = (data : any) => {
    UploadPicRequest(data)
    .then(response =>
      {
        toast.success(response.data , {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })
        const url = window.URL.createObjectURL(new Blob([data]));
        localStorage.setItem('ProfilPic', url)
        console.log("CA SEND")
        console.log(response)
      })
      .catch(error => {
        console.log("ERROR")
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          progressClassName: "my-progress-bar"
        })

        console.log(error.response.data.message)
      })
  }


  // Fonction pour gérer le glisser-déposer
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log("drop")
    event.preventDefault();
    let config = VraimentIlSaoule()
    const files = event.dataTransfer.files;
    const data = new FormData();
    data.append("file", files[0]);
    SendToBack(data)


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
  const [file, setFile] = useState(null);

  const handleFileChange = (event : any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event : any) => {
    event.preventDefault();

    const data = new FormData();
    if (file !== null)
      data.append("file", file);
      SendToBack(data)


  };



  return (
    <div className="App">
      <TopBar />
      <h1 className="textcol2">Drag and Drop Image</h1>
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >drag and drop your image here
        {/* {image ? (
          <img src={image} alt="profile" />
          ) : (
            <p className="textcol">Drag and drop your image here</p>
          )} */}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Uploader</button>
        </form>
      </div><ToastContainer />
    </div>
  );
}
export default ProfilePictureUploader;