import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import pdfLogo from '/pdf.svg'
import * as pdfjs from 'pdfjs-dist'
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
document.querySelector('#app').innerHTML = `
  <div style="display: flex">
    <div style="display: flex;align-items: center;">
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="${pdfLogo}" class="logo vanilla" alt="JavaScript logo" />
      </a>
      <div>
        <input id="upload" type="file">
      </div>
    </div>
    <div id='imgDiv'></div>
  </div>
`
// <canvas id="theCanvas"></canvas>
const file = document.querySelector('#upload')
file.addEventListener('change', function(){
  const fileEle = document.querySelector('#upload').files
  var reader = new FileReader();
  reader.readAsArrayBuffer(fileEle[0]);
  reader.onload = async function(e) {
    var myData = new Uint8Array(e.target.result)
    const pdfDocument = await pdfjsLib.getDocument(myData).promise;
    renderPage(pdfDocument)
  }
}, false)

async function renderPage (pdfDocument) {
  const num = pdfDocument.numPages
  for (let index = 1; index < num + 1; index++) {
    const canvas = document.createElement('canvas');
    canvas.id = "pageNum" + index;
    document.querySelector('#imgDiv').appendChild(canvas)
    const scale = 2 // 保证图片清晰
    const pdfPage = await pdfDocument.getPage(index);
    const viewport = pdfPage.getViewport({ scale: scale });
    canvas.width = viewport.width; 
    canvas.height = viewport.height;
    canvas.style.width  = (canvas.width / scale ) + 'px'
    canvas.style.height  = (canvas.height / scale) + 'px'
    const ctx = canvas.getContext("2d");
    const renderTask = pdfPage.render({
      canvasContext: ctx,
      viewport,
    });
    await renderTask.promise;
    const img = canvas.toDataURL("image/png", 1.0);
    const canvasImg = document.createElement('img')
    canvasImg.src = img
    // Style your image here
    canvasImg.style.width = canvas.style.width
    canvasImg.style.height = canvas.style.height
    document.querySelector('#imgDiv').appendChild(canvasImg)
    canvas.remove()
  }
}

