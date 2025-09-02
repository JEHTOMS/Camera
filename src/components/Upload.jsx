import React from 'react';
import './Upload.css';

function Upload({ isOpen, onClose }) {
  if (!isOpen) return null;

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
                <button className="photo-item" id="photo1">
                <img src="photo1.jpg" alt="Recent photo 1" />
                </button>
                <button className="photo-item" id="photo2">
                <img src="photo2.jpg" alt="Recent photo 2" />
                </button>
                <button className="photo-item" id="photo3">
                <img src="photo3.jpg" alt="Recent photo 3" />
                </button>
                <button className="photo-item" id="photo4">
                <img src="photo4.jpg" alt="Recent photo 4" />
                </button>
                <button className="photo-item" id="photo5">
                <img src="photo5.jpg" alt="Recent photo 5" />
                </button>
                <button className="photo-item" id="photo6">
                <img src="photo6.jpg" alt="Recent photo 6" />
                </button>
                <button className="photo-item" id="photo7">
                <img src="photo7.jpg" alt="Recent photo 7" />
                </button>
            </div>
        </div>
        <div className='upload-input'><h3 className='upload-input-title'>Document</h3><input className='upload-input-field' type="file" id="file-input" accept="document/*" /></div>
        </div>
        <div className='close-button'><div className='icon-button' id="close-modal" onClick={onClose}>
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
