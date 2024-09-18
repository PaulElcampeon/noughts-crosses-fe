import React, { useState } from 'react';

export default function ImageUploader() {
  // const [image, setImage] = useState(null); // to store the uploaded image
  const [imagePreview, setImagePreview] = useState(null); // to preview the uploaded image

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file (image)
    if (file) {
      // setImage(file); // Store the image in state

      const img = new Image();

      // Convert file to Base64 and save to localStorage
      const reader = new FileReader();
      
      reader.onloadend = (e) => {
        const base64Image = e.target.result;
        localStorage.setItem('symbol', base64Image); // Save to localStorage
      };

      reader.readAsDataURL(file); // Read the file as a data URL (Base64)

      // Optionally, create a preview URL to display the selected image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div className='symbolUploaderContainer'>
      <div>
        <p className='specialFont imageUploaderTextSize'>Upload Your Board <br/>Symbol & Play</p>

        {/* File Input */}
        <input type="file" onChange={handleImageChange} accept="image/*" />

        {/* Display the uploaded image preview */}
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  );
}