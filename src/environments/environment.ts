// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url_api: 'http://esiea-spotymike.eu-4.evennode.com/v1',
  firebaseConfig: {
    apiKey: 'AIzaSyCJn339-mNkDcrGaV3TyWxpvkFgBBCpt9w',
    authDomain: 'spotytest-e89c6.firebaseapp.com',
    projectId: 'spotytest-e89c6',
    storageBucket: 'spotytest-e89c6.appspot.com',
    messagingSenderId: '823395277840',
    appId: '1:823395277840:web:f00d18cce48035e8e2fe95',
    measurementId: 'G-B282MWR17L',
    webClientId:
      '823395277840-be9l5id933b1rk6e12dnoj9p9n92v2n4.apps.googleusercontent.com',
  },

  collection: {
    users: 'Users',
    albums: 'Albums',
  },
  version: '0.0.1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
