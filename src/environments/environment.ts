// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr: false,
    staging: false,
    // url: 'http://192.168.1.165:81',
    // url: 'http://115.244.148.118:8186',
    // murl: 'http://192.168.1.165:88',
    // url: 'http://115.244.148.118:8186',
    // url: 'http://192.168.1.146:5566',
    receivingUrl: window['env']['receivingUrl'],
    url: window['env']['apiUrl'],
    hUrl: window['env']['hUrl'],
    phUrl: window['env']['phUrl'],
    csurl: window['env']['csurl'],
    inProgressTime: window['env']['inProgressTime'],
    reUploadUrl: window['env']['reUploadUrl'],
    refreshTimeForFilelog: window['env']['refreshTimeForFilelog'],
    reportingUrl: window['env']['reportingUrl'],
    // url: 'https://fbsgateway.greenmushroom-bbce887c.australiaeast.azurecontainerapps.io',
    // mrl: 'http://192.168.1.165:8001',
    // url: 'https://fbsgateway.greenmushroom-bbce887c.australiaeast.azurecontainerapps.io/gateway',
    // murl: 'http://115.244.148.118:8187',
    tokenKey: 'accessToken',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
