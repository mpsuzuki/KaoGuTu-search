  var jsLoaded = {};
  var jsDataPromises = [];

  var enqueFileReader = function(varName, jsFile) {
    var promise = new Promise(function(fnResolve, fnReject) {
      var fr = new FileReader();
      fr.onload = function(evt) {
        var jsData = JSON.parse(evt.target.result);
        Object.keys(jsData)
              .forEach(function(k){
                varName[k] = jsData[k];
              });
        fnResolve(jsFile.name);
      };
      fr.onerror = fnReject;
      fr.readAsText(jsFile, "utf-8");
    });
    return promise;
  };

  document.getElementById("add-json-file")
          .addEventListener("change",function(){
      document.getElementById("query-string").disabled = true;
      var jsFiles = document.getElementById("add-json-file").files;
      for (var i = 0; i < jsFiles.length; i++) {
        jsDataPromises.push( enqueFileReader(jsLoaded, jsFiles[i]) ); 
      };
      Promise.all(jsDataPromises)
             .then(function(){
               document.getElementById("query-string").disabled = false;
               jsDataPromises.length = 0;
             });
    });

  document.getElementById("query-string")
          .addEventListener("change",function(){
            var elmOutData = document.getElementById("output-data");
            for (var i = elmOutData.childNodes.length; i > 0; i --) {
               elmOutData.removeChild(elmOutData.childNodes[i-1]);
            };

            var re = RegExp( document.getElementById("query-string").value  );
            Object.keys(jsLoaded)
                  .filter(function(k){ return re.test(k) || re.test(jsLoaded[k]) })
                  .forEach(function(k){
                    var elmDT = document.createElement("dt");
                    var elmDD = document.createElement("dd");
                    elmDT.appendChild( document.createTextNode(k) );
                    elmDD.appendChild( document.createTextNode(jsLoaded[k]) );
                    elmOutData.appendChild(elmDT);
                    elmOutData.appendChild(elmDD);
                  });
  });
