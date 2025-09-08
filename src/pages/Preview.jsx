import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './Home.css';
import SegmentedControl from '../components/SegmentedControl.jsx';
import Upload from '../components/Upload.jsx';
import './Preview.css';

// PDF Preview Component with fallback
const PDFPreview = ({ fileUrl, fileName, fileSize }) => {
    const [pdfLoadError, setPdfLoadError] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(true);

    useEffect(() => {
        // Reset state when fileUrl changes
        setPdfLoadError(false);
        setShowPdfViewer(true);
    }, [fileUrl]);

    const handleIframeError = () => {
        console.log('PDF iframe failed to load');
        setPdfLoadError(true);
        setShowPdfViewer(false);
    };

    const handleDownloadPdf = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!showPdfViewer || pdfLoadError) {
        return (
            <div className="preview-document">
                <div className="document-info">
                    <div className="document-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="14,2 14,8 20,8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <text x="7" y="16" fontSize="6" fill="#dc2626" fontWeight="bold">PDF</text>
                        </svg>
                    </div>
                    <div className="document-details">
                        <h3 className="document-name">{fileName}</h3>
                        <p className="document-size">{(fileSize / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="document-type">PDF Document</p>
                        <p className="pdf-preview-note">PDF preview not available in this browser</p>
                        <button className="pdf-download-btn" onClick={handleDownloadPdf}>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="preview-document">
            <div className="pdf-preview-container">
                <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    className="preview-pdf"
                    frameBorder="0"
                    onError={handleIframeError}
                    onLoad={(e) => {
                        // Check if iframe actually loaded content
                        try {
                            const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
                            if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                                handleIframeError();
                            }
                        } catch (error) {
                            // Cross-origin restrictions or other issues
                            console.log('PDF preview may not be supported:', error);
                            setTimeout(() => {
                                setPdfLoadError(true);
                                setShowPdfViewer(false);
                            }, 2000); // Give it 2 seconds to load
                        }
                    }}
                />
                <div className="pdf-controls">
                    <button className="pdf-download-btn small" onClick={handleDownloadPdf}>
                        Download
                    </button>
                    <button 
                        className="pdf-fallback-btn small" 
                        onClick={() => {
                            setPdfLoadError(true);
                            setShowPdfViewer(false);
                        }}
                    >
                        Show Info
                    </button>
                </div>
            </div>
        </div>
    );
};

function Preview({ capturedImage, onRetake, uploadedFile, uploadedFileType, uploadedFileUrl }) {
    
    const renderPreview = () => {
        // If we have an uploaded file, show that; otherwise show captured image
        if (uploadedFile && uploadedFileUrl) {
            switch (uploadedFileType) {
                case 'image':
                    return (
                        <div className="preview-content-wrapper">
                            <img 
                                src={uploadedFileUrl} 
                                alt="Uploaded preview" 
                                className="preview-image uploaded-image" 
                            />
                        </div>
                    );
                case 'pdf':
                    return (
                        <PDFPreview 
                            fileUrl={uploadedFileUrl} 
                            fileName={uploadedFile.name} 
                            fileSize={uploadedFile.size} 
                        />
                    );
                case 'document':
                case 'other':
                    return (
                        <div className="preview-document">
                            <div className="document-info">
                                <div className="document-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="document-details">
                                    <h3 className="document-name">{uploadedFile.name}</h3>
                                    <p className="document-size">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <p className="document-type">
                                        {uploadedFile.type || 'Unknown type'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div className="preview-error">
                            <p>Unsupported file type</p>
                        </div>
                    );
            }
        } else if (capturedImage) {
            return (
                <div className="preview-image-container">
                    <img src={capturedImage} alt="Captured preview" className="preview-image captured-image" />
                </div>
            );
        } else {
            return (
                <div className="preview-error">
                    <p>No content to preview</p>
                </div>
            );
        }
    };
    return (
        <div>
       <div className="camera-container">
        <div className="navigation-bar-preview">
            <div className="icon-button" style={{background: 'rgba(62, 59, 7, 0.07)'}} id="back-button" onClick={onRetake}>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_161_3238" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="1" y="3" width="18" height="15">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.51189 9.66673L9.75596 4.42266L8.57746 3.24414L1.91668 9.9049C1.58799 10.2336 1.58799 10.7665 1.91668 11.0952L8.57746 17.756L9.75596 16.5775L4.51189 11.3334H18.3334V9.66673H4.51189Z" fill="#FF00FF"/>
                    </mask>
                    <g mask="url(#mask0_161_3238)">
                        <rect y="0.5" width="20" height="20" fill="black"/>
                    </g>
                </svg>
             </div>
        </div>
        <div className="preview-content">
          {renderPreview()}
        </div>
         <div className='footer-preview'>
            <div className='footer-controls preview-footer'>
          <button className='retake' id='retake' onClick={onRetake}>
            Retake
          </button>
          <button className="continue" id="continue">
            Continue
          </button>
          </div>
          </div>
       </div>
       </div>
    );
}

export default Preview;
