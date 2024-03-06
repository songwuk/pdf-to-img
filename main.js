import './style.css'
import pdfLogo from '/pdf.svg'
import * as pdfjs from 'pdfjs-dist'
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
document.querySelector('#app').innerHTML = `
  <div class="bodyClass">
    <div style="display: flex;align-items: center;">
      <a href="/" target="_blank">
        <img src="${pdfLogo}" class="logo vanilla" alt="JavaScript logo" />
      </a>
      <div>
        <button id="fileButton">choose </button>
        <input style="display:none" id="upload" type="file">
      </div>
    </div>
    <div>
      <div>大小: <span class='mline'></span></div>
      <div id='imgDiv'></div>
    </div>
  </div>
`
document.querySelector('#fileButton').addEventListener('click', function(){
  const fileId = document.querySelector('#upload')
  if(fileId) {
    fileId.click()
  }
},true)
/**
 * 初始化水印元素
 */
function initWatermark() {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  ctx.rotate((45 * Math.PI) / 180);
  ctx.font = '15px Verdana';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillText('我是水印', 30, 30);
  return canvas;
}
/**
 * 在画布上添加水印
 * @param num 画布索引
 */
function addWatermark(num, width, height) {
  const canvas =  document.getElementById(num);
  const ctx = canvas.getContext('2d');
  const pattern = ctx.createPattern(initWatermark(), 'repeat');
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = pattern;
  ctx.fill();
}
const file = document.querySelector('#upload')
file.addEventListener('change', function(){
  const fileEle = document.querySelector('#upload').files
  const lastNum = fileEle[0].size * Math.pow(10, -6)
  document.querySelector('.mline').textContent = lastNum.toFixed(2) +'MB'
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
    await addWatermark( "pageNum" + index, canvas.width, canvas.height)
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

