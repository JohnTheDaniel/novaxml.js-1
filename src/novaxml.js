/*
 * NOVAXML.js -- analyzing noveschem pdfs through the use of PDF.js and phpProxy
 *
 * Copyright (C) 2014 akaProxy
 *                    Author: Erik Nygren <erik@nygrens.eu>
 *                            John Daniel Bossér <daniel@bosser.com>
 *
 * This file may be used under the terms of the MIT Licence
 * which can be found in the project root
 */
var NOVA = function(){
    PDFJS.workerSrc = "../pdf.js/build/pdf.worker.js";
    
    /* 
     * Returns a function to load data into analyzer. 
     * 
     */
    var loadPdf = function(){
        var queue = [];
        var isRunning = false;
        var promise;
        
        var run = function(obj){
            switch (obj.type){
                case "base64":
                    // Gör om till Uint8Array
                    function base64ToUint8Array(base64) {
                        var raw = atob(base64); //This is a native function that decodes a base64-encoded string.
                        var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
                        for (var i = 0; i < raw.length; i++) {
                            uint8Array[i] = raw.charCodeAt(i);
                        }

                        return uint8Array;
                    }
                    obj.data = base64ToUint8Array(obj.data);
                case "uri":
                case "Uint8Array":
                    promise = PDFJS.getDocument(obj.data);
                    break;
            }
            promise.then(function(pdf){
                pdf.getPage(1).then(function(page){
                    var scale = 1.5;
                    var viewport = page.getViewport(scale);


                    var canvas = document.getElementById('the-canvas');
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    //
                    // Render PDF page into canvas context
                    //
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    
                    if(queue){}
                });
                
            });
        }
        
        return function(obj){
            if(isRunning) queue.push(obj);
            else {
                isRunning = true;
                run(obj).then();
            }
        };
    }();
    
    return loadPdf;
}();

