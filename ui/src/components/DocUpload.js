import React, {useMemo} from 'react'
import { useDropzone } from 'react-dropzone';
import { getDocument } from 'pdfjs-dist';

import './Landing.css';



const baseStyle = {
    //flex: 1,
    display: 'flex',
    justifyContent: 'center',
    width: '45vw',
    height: '40vh',
    fontFamily: 'StandardFont1-bold',
    fontSize: '20px',
    flexDirection: 'column',
    alignItems: 'center',
    //padding: '4vh',
    //borderWidth: '5px',
    borderColor: '#dbdbdb',
    backgroundColor: '#f0f0f0',
    color: '#919191',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer',
  };
  
  const activeStyle = {
    borderColor: '#2196f3',
  };
  
  const acceptStyle = {
    borderColor: '#00e676',
  };
  
  const rejectStyle = {
    borderColor: '#ff1744',
  };

export default function DocUpload({setUploadSuccessful, setPdfFile, setPdfLoading}) {
    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setPdfFile(URL.createObjectURL(file));
        // Read the file as an ArrayBuffer
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
    
        reader.onload = async (event) => {
          const pdfData = new Uint8Array(event.target.result);
    
          // Parse the PDF
          const pdfDocument = await getDocument(pdfData).promise;
    
          let combinedText = '';
    
          // Loop through each page and extract text
          for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const textItems = textContent.items.map(item => item.str);
            combinedText += textItems.join(' ');
          }
          setUploadSuccessful(true);

          try {
            setPdfLoading(true);
            const response = await fetch('http://127.0.0.1:5000/api/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain'
              },
              body: combinedText,
            });
            const responseText = await response.text();
            console.log('Testing mock pdf load...');
            setTimeout(() => {
              setPdfLoading(false);
            }, 3000);
            console.log(responseText);
          } catch(error){
            console.error("Error sending PDF:", error);
          }

        };
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
      } = useDropzone({onDrop: onDrop});

      const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }), [isDragActive, isDragAccept, isDragReject]);
      
      if (isDragAccept) console.log('drag accept');
      return (
        <div {...getRootProps({ style })}>
            <input {...getInputProps()}/>
            <p className="drag-text">Drag & drop a PDF here, or click to select one</p>
        </div>
      );
}