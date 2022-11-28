import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ 
  
  log: true });

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }


  const convertToGif = async () => {
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');
    console.log("Show Data: ", data);

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    console.log("Show URL: ", url);
    setGif(url)
  }

  useEffect(() => {
    load();
  }, [])
 
  return ready ? (
    <div className="App">

        { video && <video
            controls
            width="550"
            src={URL.createObjectURL(video)}>

        </video>}
        <br/>

    <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

    <br/>

    <h3>Result</h3>

    <button onClick={convertToGif}>Convert</button>

    { gif && <img src={gif} width="250" />}
    
    </div>
  ):
  (<p> Loading .....</p>)
}

export default App;
