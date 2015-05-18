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

    var Runner = function(){    
        var Runner2 = function(paralell){
            // How many instances of pdf.js do we want to run simultainiously? 
            // When you create a runner, use the constructor to set this number. 
            // 1 is prefered for smartphones. Leave empty to process all pdfs 
            // side by side. 
            this.parallel = paralell;
            this.k = [];
            this.running = false;
            // The queue contains promisePacks, with data and promise. 
            // Once you have completed the processing of the data, the promise is resolved accordingly. 
            this.queue = this.k;
            this.run = function(){
                this.running = true;
                var r = this;
                var promise = new Promise(function(resolve, reject){
                    // Work through the queue
                    
                    var available = [];
                    for(var i = 0; i<r.queue.length;i++) available[i] = r.queue[i];
                    
                    var doNext = function(){
                    
                    }
                    
                    var thenFunction = function(e){
                        r.queue.splice(r.queue.indexOf(e.promisePack),1);
                        console.log(e);
                        if(available.length > 0) startNew();
                        else if(r.queue.length == 0) resolve(),r.running=false;
                    }
                    
                    var startNew = function(){
                        var pack = available[0];
                        var promise = available[0].promise;
                        var data = available[0].input.data;
                        promise.then(thenFunction);
                        
                        //Remove item from queue
                        available.splice(0,1);
                        
                        r.analyse(data, promise, pack);
                    }
                    
                    
                    // If the number of simultainous scripts has not been set, 
                    // let it be the same number as the numbers of pdfs. 
                    if(!paralell) paralell = r.queue.length;
                    
                    for(var i = 0; i<r.parallel; i++){
                        startNew();
                    }
                    
                    //resolve();
                });
                this.promise = promise;
            }
            this.analyse = function(data, promise, promisePack){
                //Analyze data
                
                setTimeout(function(){promise.resolve({promisePack:promisePack, promise:promise, message:"success! ;)"})}, 2000);
                
                return "sweet";
            }
        }
        return Runner2;
    }();
    // Build storer
    
    var runner = new Runner(1);
    var q = function(a){
        for(var i = 0; i<a.length;i++){
            var promiseResolve;
            var promiseReject;
            var p = new Promise(function(resolve,reject){
                promiseResolve = resolve;
                promiseReject = reject;
            });
            p.resolve = promiseResolve;
            p.reject = promiseReject;
            var promisePack = {promise:p, input:a[i]}
            
            runner.k[runner.k.length] = promisePack; 
        }
        if(!runner.running){
            runner.run();
        }
        return runner.promise;
    }
    var c = function(){
        console.log(runner)
    }
    
    
    var storer = {};
    var queue = function(arrayQueue){
        var paralell = 2;
        var arrayQueue = arrayQueue;
        
        
        var promise = new Promise(
            function(resolve, reject){
                for(var i = 0; i<2;i++){
                    // Store functions to analyse
                    var wait;
                    var p2 = new Promise(function(resolve, reject){
                        var waitFunction = function(){
                            // Do the stuff
                            console.log("running...")
                            var delay = 1000;
                            if(i == 1) delay = 2000;
                            setTimeout(resolve, delay);
                        } 
                        wait = waitFunction;
                    }); 
                    storer[i] = {promise:p2, run:wait};
                }
                
                var goThroughThemAll = function(s,p){
                    // Start p ex of runners
                    var i = 0;
                    var numberToGoThrough = Object.keys(s).length;
                    var numberCompleted = 0;
                    var startNext = function(){
                        console.log("completed promise " + i + "... Starting " + (i+1))
                        numberCompleted = 2;
                        if(i < numberToGoThrough){
                            s[numberCompleted].promise.then(startNext);
                            s[i].run();
                        } else {
                            s[i].promise.then(resolve);
                            s[i].run();
                        }
                    }
                    for(; i<p; i++){
                        s[i].promise.then(startNext);
                        s[i].run();
                    }
                };
                goThroughThemAll(storer, paralell);
        });
        return promise;
    }
    
    return {queue:queue, storer: storer, Runner:Runner, c:c, q:q, k:runner.k, runner:runner}
}();

