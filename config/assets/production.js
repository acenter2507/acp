'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/angular-toastr/dist/angular-toastr.min.css',
        'public/lib/angular-loading-bar/build/loading-bar.min.css',
        'public/lib/ng-img-crop/compile/minified/ng-img-crop.css',
        'public/lib/ng-dialog/css/ngDialog.min.css',
        'public/lib/ng-dialog/css/ngDialog-theme-default.min.css',
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.3.20/angular-locale_ja-jp.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/underscore/underscore-min.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/moment/min/locales.min.js',
        'public/lib/moment-timezone/builds/moment-timezone.min.js',
        'public/lib/angular-moment/angular-moment.min.js',
        'public/lib/angular-toastr/dist/angular-toastr.tpls.min.js',
        'public/lib/ng-dialog/js/ngDialog.min.js',
        'public/lib/angular-loading-bar/build/loading-bar.min.js',
        'public/lib/ng-img-crop/compile/minified/ng-img-crop.js',
        'public/lib/angular-socket-io/socket.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
