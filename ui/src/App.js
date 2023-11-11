import Landing from './components/Landing';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
function App() {
  return (
    <div className="App">
      <Landing/>
    </div>
  );
}

export default App;
