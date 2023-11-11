import { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import QueryInput from './QueryInput';
import './Landing.css';
import './Chatbox.css';



export default function Chatbox({ uploadSuccessful, pdfFile, pdfLoading }) {
    const [numPages, setNumPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    if (!uploadSuccessful || !pdfFile) {
        return null;
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    
    const PdfView = () => {
        return (
            <Document className="pdf-window" file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(
                new Array(numPages),
                (el, index) => (
                    <Page
                        className="pdf-page"
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                ),
            )}
            </Document>
        )
    }

    return (
        <>
            <div className="header">
                <h1>KnowYourLease</h1>
            </div>
            <div className="chatbox-ctr">
                <div className="chat-section">
                    <QueryInput
                        pdfLoading={pdfLoading}
                    />
                </div>
                <PdfView/>
            </div>
        </>
    )
}