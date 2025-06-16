import { useEffect } from "react";
import { createWorker } from "tesseract.js";

export default function Tes(){
    useEffect(() => {    
    (async () => {
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
        console.log(text);
        await worker.terminate();
        })();
    }, [])

    return <div> aaa </div>
}