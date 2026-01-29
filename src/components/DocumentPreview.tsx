/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';
import { BiFile } from 'react-icons/bi';

interface DocumentPreviewProps {
  url: string;
  filename: string;
  fileType?: string;
}

export default function DocumentPreview({ url, filename, fileType }: DocumentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Detect file type from filename or provided type
  const getFileType = () => {
    if (fileType) return fileType.toLowerCase();
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  const type = getFileType();
  const isPDF = type === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(type);
  const isPreviewable = isPDF || isImage;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Preview Button */}
      <div className="flex gap-2 items-center">
        {isPreviewable && (
          <button
            onClick={() => setShowPreview(true)}
            className="btn btn-sm btn-primary gap-2"
            title="Preview Document"
          >
            <AiOutlineEye className="w-4 h-4" />
            Preview
          </button>
        )}
        <button
          onClick={handleDownload}
          className="btn btn-sm btn-outline gap-2"
          title="Download Document"
        >
          <AiOutlineDownload className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <BiFile className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800 truncate max-w-md">
                  {filename}
                </h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-sm btn-circle btn-ghost"
                title="Close Preview"
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4">
              {isPDF && (
                <div className="flex items-center justify-center h-full">
                  <iframe
                    src={`${url}#toolbar=0`}
                    className="w-full h-full border-0 rounded-lg"
                    title={filename}
                  />
                </div>
              )}

              {isImage && (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={url}
                    alt={filename}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}

              {!isPreviewable && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <BiFile className="w-16 h-16 mb-4" />
                  <p className="text-lg font-semibold">Preview not available</p>
                  <p className="text-sm">This file type cannot be previewed</p>
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary mt-4 gap-2"
                  >
                    <AiOutlineDownload className="w-4 h-4" />
                    Download to view
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
              <button
                onClick={handleDownload}
                className="btn btn-sm btn-outline gap-2"
              >
                <AiOutlineDownload className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-sm btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
