import React from 'react';
import './Upload.css';
import frameImage from '../assets/Frame 1547767289.png';
import photo1 from '../assets/759ca5cc96a9f5074f901d1432756afd85c7b06e.png';
import photo2 from '../assets/94865a48eb81afda371b21d8b77d8886b893e37d.png';
import photo3 from '../assets/b3c5ec9936c0286306ff7c4b4ae4f05664917d28.jpg';

function Upload({ isOpen, onClose, onFileUpload }) {
  if (!isOpen) return null;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handlePhotoSelect = (photoSrc) => {
    // Create a mock file object for the selected photo
    // In a real app, you'd have actual file data associated with these photos
    fetch(photoSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        onFileUpload(file);
      })
      .catch(err => console.error('Error loading photo:', err));
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-component" onClick={(e) => e.stopPropagation()}>
        <div className='upload-content'>
          <div className='upload-text'>Upload</div>
          <div className='photo-section'>
            <div className='section-header'>
              <h3 className='section-title'>Photos</h3>
              <button className='tertiary-button' id="view-library">View library</button>
            </div>
                        <div className="photos-grid">
                <button className="photo-item" id="photo1" onClick={() => handlePhotoSelect(photo1)}>
                <img className='image' src={photo1} alt="Recent photo 1" />
                </button>
                <button className="photo-item" id="photo2" onClick={() => handlePhotoSelect(photo2)}>
                <img className='image' src={photo2} alt="Recent photo 2" />
                </button>
                <button className="photo-item" id="photo3" onClick={() => handlePhotoSelect(photo3)}>
                <img className='image' src={photo3} alt="Recent photo 3" />
                </button>
                <button className="photo-item" id="photo4" onClick={() => handlePhotoSelect(frameImage)}>
                <img className='image' src={frameImage} alt="Recent photo 4" />
                </button>
                <button className="photo-item" id="photo5" onClick={() => handlePhotoSelect(photo1)}>
                <img className='image' src={photo1} alt="Recent photo 5" />
                </button>
                <button className="photo-item" id="photo6" onClick={() => handlePhotoSelect(photo2)}>
                <img className='image'  src={photo2} alt="Recent photo 6" />
                </button>
                <button className="photo-item" id="photo7" onClick={() => handlePhotoSelect(photo3)}>
                <img className='image' src={photo3} alt="Recent photo 7" />
                </button>
            </div>
        </div>
        <div className='upload-input'><h3 className='upload-input-title'>Images & Documents</h3><input className='upload-input-field' type="file" id="file-input" accept="image/*,application/pdf,.doc,.docx,.txt,.rtf" onChange={handleFileSelect} /></div>
        </div>
        <div className='close-button'><div className='icon-button' style={{background: 'rgba(62, 59, 7, 0.07)'}} id="close-modal" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <mask id="mask0_161_4875" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                    <path d="M10.2061 11.1786L4.1287 17.256L2.9502 16.0775L9.02763 10.0001L2.95022 3.92266L4.12873 2.74414L10.2061 8.82157L16.2835 2.74414L17.462 3.92266L11.3846 10.0001L17.462 16.0775L16.2835 17.256L10.2061 11.1786Z" fill="#FF00FF"/>
                </mask>
                <g mask="url(#mask0_161_4875)">
                    <rect x="0.206055" width="20" height="20" fill="black"/>
                </g>
                </svg></div></div>
        </div>
    </div>
  );
}

export default Upload;
