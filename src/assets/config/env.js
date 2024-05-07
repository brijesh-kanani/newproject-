(function(window) {
    window["env"] = window["env"] || {};
    // Environment variables
    window["env"]["receivingUrl"] = "http://192.168.1.154:9190" || "default";
    window["env"]["reUploadUrl"] = "http://192.168.1.154:9190" || "default";
    window["env"]["phUrl"] = "http://192.168.1.59:3001" || "default";  // importer url
    window["env"]["hUrl"] = "http://192.168.1.59:3002" || "default";   // fileprocesser url
    window["env"]["inProgressTime"] = 30 || "default";   // fileprocesser url
    window["env"]["refreshTimeForFilelog"] = 10 || "default";   // refresh Time For filelog
    // window["env"]["phUrl"] = "http://115.244.148.118:3001" || "default";  // importer url
    // window["env"]["hUrl"] = "http://115.244.148.118:3002" || "default";   // fileprocesser url
    // window["env"]["csurl"] = "http://192.168.1.146:5544" || "default";
    // window["env"]["apiUrl"] = "https://fbsgateway.greenmushroom-bbce887c.australiaeast.azurecontainerapps.io" || "default";
    window["env"]["reportingUrl"] = " http://192.168.1.51:8081" || "default";   // reporting url
  })(this);
    // http://192.168.1.51:8081/api/Account/GetEmail?accountId=1083