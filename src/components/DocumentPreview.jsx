import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { MedContext } from '../context/MedContext';

const DocumentPreview = () => {
  const { previewDoc, isPreviewVisible, closeDocumentPreview } = useContext(MedContext);

  if (!isPreviewVisible || !previewDoc) {
    return null;
  }

  // Determine how to render the document based on its type
  const renderDocument = () => {
    if (!previewDoc.url) return <div>No document to preview</div>;

    if (previewDoc.type?.includes('image/')) {
      return (
        <img 
          src={previewDoc.url} 
          alt={previewDoc.title || 'Document preview'} 
          className="max-w-full max-h-[90vh] object-contain"
        />
      );
    }
    
    if (previewDoc.type?.includes('application/pdf')) {
      // Use embed instead of iframe for cleaner PDF viewing
      return (
        <embed 
          src={`${previewDoc.url}#toolbar=0&navpanes=0&scrollbar=0`} 
          type="application/pdf"
          className="w-full h-[90vh]"
        />
      );
    }
    
    // For other file types, provide a download link
    return (
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <p className="mb-4">Preview not available for this file type</p>
        <a 
          href={previewDoc.url} 
          download={previewDoc.title}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Download {previewDoc.title}
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#000000c0] bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-5xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={closeDocumentPreview}
            className="p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
        <div className="p-0">
          {renderDocument()}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;