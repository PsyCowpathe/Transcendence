// import React, { useState } from 'react';
import React from "react";
// import { useState } from "react";
// interface Props {
//   onSubmit: (formData: FormData) => Promise<void>;
// }

// const ProfilePictureForm: React.FC<Props> = ({ onSubmit }) => {
//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files && event.target.files[0];
//     setFile(selectedFile || null);
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (file) {
//       const formData = new FormData();
//       formData.append('file', file);
//       onSubmit(formData);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//       </div>
//       <button type="submit">Upload</button>
//     </form>
//   );
// };

// export default ProfilePictureForm;