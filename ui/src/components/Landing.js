import React, { useState, useEffect } from 'react';
import DocUpload from './DocUpload';
import Chatbox from './Chatbox';
import './Landing.css';
import {Circles} from 'react-loader-spinner'

export default function Landing() {
    const [uploadSuccessful, setUploadSuccessful] = useState(false);
    const [pdfFile, setPdfFile] = useState();
    const [pdfLoading, setPdfLoading] = useState(false);


    return (
      <div className="outer-wrapper">
       {!pdfLoading && <div className={`main-ctr ${(uploadSuccessful && !pdfLoading)?  'slide-off-left' : 'slide-center'}`} id="doc-upload">
             <DocUpload
                setUploadSuccessful={setUploadSuccessful}
                setPdfFile={setPdfFile}
                setPdfLoading={setPdfLoading}
            />
        </div>}
        {pdfLoading && 
        <div className="loading-pdf">
            <Circles
                height="80"
                width="80"
                color="white"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={pdfLoading}
            />
        </div>}
        <div className={`main-ctr ${(uploadSuccessful && !pdfLoading)?  'slide-center' : 'slide-in-right'}`} id="chat-box">
            <Chatbox
                uploadSuccessful={uploadSuccessful}
                pdfFile={pdfFile}
                pdfLoading={pdfLoading}
            />
        </div> 
      </div>
    )
}