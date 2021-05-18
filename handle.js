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
            var funcOpenNewWindow = function(evt) {
              window.open(evt.target.href);
              evt.preventDefault();
            };
            var elmOutData = document.getElementById("output-data");
            for (var i = elmOutData.childNodes.length; i > 0; i --) {
               elmOutData.removeChild(elmOutData.childNodes[i-1]);
            };

            var re = RegExp( document.getElementById("query-string").value  );
            Object.keys(jsLoaded)
                  .forEach(function(k){
                    var v = jsLoaded[k];
                    var isString = ( typeof(v) == "string" );
                    var isObject = ( typeof(v) == "object" );
                    var isArray = ( typeof(v) == "array" );
                    var show = false;
                    if (re.test(k)) {
                      show = true;
                    } else
                    if (isString && re.test(v)) {
                      show = true;
                    } else
                    if (isObject && re.test(v["text"])) {
                      show = true;
                    };

                    if (show) {
                      var elmDT = document.createElement("dt");
                      var elmDD = document.createElement("dd");
                      elmDT.appendChild( document.createTextNode(k) );
                      if (isObject) {
                        var elmA = document.createElement("a");
                        elmA.appendChild( document.createTextNode(v["text"]) );
                        elmA.setAttribute("href", v["href"]);
                        elmA.addEventListener("click", funcOpenNewWindow);
                        elmDD.appendChild(elmA); 
                      } else
                      if (isString) {
                        elmDD.appendChild( document.createTextNode(v) );
                      };
                      elmOutData.appendChild(elmDT);
                      elmOutData.appendChild(elmDD);
                    };
                  });
  });
