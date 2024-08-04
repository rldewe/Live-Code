import './App.css';
import {BrowserRouter,Route ,Routes} from 'react-router-dom';
import Home from './pages/Home.js';
import EditorPage from './pages/EditorPage.js';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
   <>
  <div>
    <Toaster  position="top-center"
    reverseOrder={true}>
    </Toaster>
  </div>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home/>}></Route>
          <Route path="/editor/:roomId" element={<EditorPage/>}></Route>


        </Routes>
      </BrowserRouter>
   </>
  );
}

export default App;
