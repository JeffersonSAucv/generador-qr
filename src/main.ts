import "./style.css";
import QR from "qrcode";

const $ = (selector: string) => document.getElementById(selector);

const max = 400;
const min = 50;

let size = 200;
let values = "";
let data: any[] = [];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>

    <div class="header">
      <h1>Generador de QRs</h1>
    </div>

    <textarea class="input" id="input" placeholder="Escribe algo"></textarea>

    <div class="card" id="output" >
    </div>

    <div class="footer">
    <button id="print"> imprimir </button>
    <input id="size" value="${size}" placeholder="Tamaño" type="number" max="${max}" min="${min}"> <p>❤ por <a href="https://github.com/maxterjunior">Mj.asm</a></p>
    </div>
      
  </div>
`;

const renderQrs = () => {
  // regular expression for spaces and line breaks
  const v = values.split(/\s/g).filter((v: string) => v);
  data = v;
  $("output")!.innerHTML = "";
  v.forEach((value: string) => {
    const canvas = document.createElement("canvas");
    QR.toCanvas(canvas, value, { width: size });
    $("output")!.appendChild(canvas);
  });
};

$("size")!.addEventListener("input", (e) => {
  const v = parseInt((e.target as HTMLInputElement).value);
  if (v > max) {
    size = max;
    ($("size") as HTMLInputElement)!.value = size.toString();
  } else if (v < min) size = min;
  else size = v;

  renderQrs();
});

$("input")!.addEventListener("input", (e: any) => {
  if (e.target && e.target.value) {
    values = e.target.value;
    try {
      localStorage.setItem("values", values);
    } catch (error) {
      console.error("Error al guardar valores", error);
    }
    renderQrs();
  } else {
    $("output")!.innerHTML = "";
  }
});

$("print")!.addEventListener("click", () => {
  const popupWin = window.open(
    "",
    "_blank",
    "top=0,left=0,height=100%,width=auto"
  );
  popupWin?.document.open();
  popupWin?.document.write(`
  <html>
  <head>
    <title>Impresión de fotochecks</title>
    <meta charset="utf-8">
  </head>
   <body onload="window.print()">
   </body>
   <script>
    const data = JSON.parse('${JSON.stringify(data)}')
    const html = data.map(v=>'<img src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=\${v}&choe=UTF-8" ></img>').join(' ')
    document.body.innerHTML = html
    </script>
  </html>
`);
});

try {
  const cache = localStorage.getItem("values");
  if (cache) {
    values = cache;
    ($("input") as HTMLInputElement).value = values;
    renderQrs();
  }
} catch (error) {
  console.error("Error al obtener valores anteriores", error);
}
