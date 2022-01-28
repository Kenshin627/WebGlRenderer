import { BasicWebGLApplication } from './application/basicWebGLApplication'

console.log(`hello world!`);
let app: BasicWebGLApplication = new BasicWebGLApplication(document.querySelector(".webglContainer"));
app.run();