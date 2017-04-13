angular.module('app.controllers', [])


.controller('sINGUPCtrl', ['$scope', '$stateParams', 'UserFactory', '$state', '$ionicHistory', 'TTSService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope, $stateParams, UserFactory, $state, $ionicHistory, TTSService) {
 var lang = null; 
 var appData = {
                name: 'bqs-money',
                version: '1.0.0',
                user: { id: '0',
                     locale: lang,
                     name: null,
                     symbol: '$'
                    },
                messages: {
                       singUp : 'START',
                       welcome : 'HELLO!',
                       title : 'YOUR NAME IS...'
                },
                allMessages: {}
 };

 $scope.init = function(){
    //var appData = JSON.parse( window.localStorage.getItem( 'appData' ));
    if (typeof navigator.userLanguage !== 'undefined'){
        lang = navigator.userLanguage;
    } else if (typeof navigator.language !== 'undefined'){
      lang = navigator.language ;
    } else { 
        lang = 'en_US';
    }

    //lang = 'en_US'; // BORRAR ESTO ANTES DE PASAR

    $scope.data = {"messages" : null};
    //Llamar a un servicio para obtener mensajes en el idioma que necesito.
    console.log("lenguaje:" + lang);
    UserFactory.getDataConfiguration(lang)
                    .then(function(matches) { 
                            //La respuesta la asigno a mi factory de datos para poder mostrar en pantalla.
                              //Setear los datos que necesito.
                            $scope.messages ={"singUp": matches.data[12].message, "welcome": matches.data[0].message, "title": matches.data[11].message}; 
                            appData['allMessages'] = matches.data;
                            appData['user']['locale'] = matches.data[0].locale_id;
                            appData['user']['symbol'] = matches.data[0].symbol;
                            //Leer Texto
                            TTSService.read( $scope.messages.welcome + " " + $scope.messages.title , appData.user.locale);
                      }).catch(function(e){
                            //Setear los datos que necesito.
                            UserFactory.getDataConfiguration('en_US').then(function(matches) { 
                                      $scope.messages ={"singUp": matches.data[12].message, "welcome": matches.data[0].message, "title": matches.data[11].message}; 
                                      appData['allMessages'] = matches.data;
                                      appData['user']['locale'] = matches.data[0].locale_id;
                                      appData['user']['symbol'] = matches.data[0].symbol;
                                      //Leer Texto
                                      TTSService.read( $scope.messages.welcome + " " + $scope.messages.title , appData.user.locale);
                             }).catch(function(e){  
                                      $scope.messages = {"singUp": 'EXIT', "welcome": 'HELLO !', "title": 'HAVE AN ERROR'};
                                      console.log('error' + e);
                            });
                  });
    
     window.localStorage.setItem( 'appData', JSON.stringify(appData));
     console.log($scope);
     $scope.formData = {};

 }

 $scope.start = function(){
  //Dar de alta el usuario
  appData['user']['name'] = $scope.formData.name; 
  UserFactory.newUser(appData['user']['name'],appData['user']['locale'])
                     .then(function(matches){
                        appData['user']['id'] = matches.data.id;
                        window.localStorage.setItem( 'appData', JSON.stringify(appData));
                        // console.log(JSON.parse( window.localStorage.getItem( 'appData' )));
                        $ionicHistory.clearCache()
                              .then( function(){
                                  $state.go("hOME");});
                     }).catch(function(e){
              console.log('error' + e);
                     });

 }

 $scope.init();
  
}])
  
.controller('hOMECtrl', ['$scope', '$stateParams', '$ionicHistory', '$state', 'PurchaseFactory', '$ionicHistory', 'TTSService',// PANTALLA DE ENTRADA AL SISTEMA
function ($scope, $stateParams, $ionicHistory, $state, PurchaseFactory, $ionicHistory, TTSService) {
  //Limpio el storage
  /*  window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  */

  //Bajar al scope los mensajes
  if (typeof window.localStorage.getItem( 'appData' ) == 'undefined' || window.localStorage.getItem( 'appData' ) == null ){
  	//Primera vez que ingreso
	  $state.go("sINGUP");
  }else{
    var appData = JSON.parse( window.localStorage.getItem( 'appData' ));
    console.log(appData);
    $scope.formData = {"welcome": appData.allMessages[0].message, "user": appData.user.name, "buttonLbl": appData.allMessages[1].message, "symbol": appData.user.symbol };
    TTSService.read( appData.allMessages[0].message + " " + appData.user.name + ", " + appData.allMessages[1].message + " " + appData.allMessages[14].message, appData.user.locale);
  }

  $scope.close = function(){
    navigator.app.exitApp();
  }

  $scope.confirm = function(){
 	//Dar de alta la compra
 	var purData = { id: null,
 		            price: $scope.formData.price,
 		            balance: 0,
 		            change: 0
                  };

 	PurchaseFactory.newPurchase(appData['user']['id'],$scope.formData.price)
 	                   .then(function(matches){
 	                   		purData['id'] = matches.data.id;
						 	window.localStorage.setItem( 'purData', JSON.stringify(purData));
						 	$ionicHistory.clearCache()
                  								.then( function(){
                      						   				         $state.go("cOMPRA");
                                                     TTSService.read( appData.allMessages[13].message + " " + $scope.formData.price + ", " + appData.allMessages[14].message + " " + appData.allMessages[2].message, appData.user.locale);
                                                   });  
                   	                   }).catch(function(e){
                              							console.log('error' + e);
                   	                   });             
 	       
  }

  $scope.disableService = function(){
    alert('PENDIENTE');
  }

}])

     
.controller('cOMPRACtrl', ['$scope', '$state', '$stateParams', '$cordovaCamera','$cordovaFile', 'PurchaseFactory', '$ionicHistory', '$ionicPopup', '$ionicLoading' ,'TTSService', 
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $stateParams, $cordovaCamera, $cordovaFile, PurchaseFactory, $ionicHistory, $ionicPopup, $ionicLoading, TTSService) {
  // vuelco datos en pantalla. console.log(JSON.parse( window.localStorage.getItem( 'appData' )));
  var appData = JSON.parse( window.localStorage.getItem( 'appData' ));
  var purData = JSON.parse( window.localStorage.getItem( 'purData' ));
  $scope.formData = {
  	           title : appData.allMessages[13].message,
  	           total : purData['price'],
  	           buttonLbl: appData.allMessages[2].message,
               symbol: appData.user.symbol
  };

  $scope.styleBackground = {
      background: '#3EC1D3' //CEleste
  };

  $scope.styleButton = {
      background: '#007E35' //verde oscuro
  };

  console.log(appData);
  console.log(purData);

  // OPCION 2 para la captura de imagenes. Creo que la mas recomendada para evitar overflows de memoria por imagenes grandes.
    $scope.getPhotoNew = function() { 
      var pictureSource;   // picture source
      var destinationType; // sets the format of returned value

      document.addEventListener("deviceready", onDeviceReady, false);
      
      //console.log('pase deviceready');  
      function onDeviceReady() {
          pictureSource = navigator.camera.PictureSourceType;
          destinationType = navigator.camera.DestinationType;
          //alert('Dispositivo listo para tomar foto');  
      }
       
      function clearCache() {
          navigator.camera.cleanup();
      }
       
      var retries = 0;

      function onCapturePhoto(fileURI) {
          var win = function (r) {
              //alert('Captura de foto listo!');
              var a = JSON.parse(r.response);
              //console.log(a['response']);
              //console.log(a['value']);
              var msgRsta = a['response'];
              var value = a['value'];
              //console.log('Valor');
              console.log(a);
              $ionicLoading.hide();
              if (msgRsta !== 'ERROR'){ 
                if (msgRsta !== 'NOMONEY'){
                  console.log(value);
                  $scope.addBill(value);
                }else{
                  alert('PERDON NO RECONOCI EL BILLETE');
                }
              } else {
                alert('ERROR:' + value);
              }
              clearCache();
              retries = 0;
             
          }
          var fail = function (error) {
              if (retries == 0) {
                  retries ++
                  setTimeout(function() {
                    console.log('reitero' + fileURI);
                      onCapturePhoto(fileURI)
                  }, 1000)
              } else {
                  retries = 0;
                  console.log(error);
                  clearCache();
                  alert('Upss. HUBO UN ERROR!');
                  $ionicLoading.hide();
              }
          }
       
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
          options.chunkedMode = false;
          options.mimeType = "image/jpeg";
          options.params = {}; // if we need to send parameters to the server request
          options.headers = {
                Connection: "close"
            };
          console.log(options);

          var ft = new FileTransfer();
          ft.upload(fileURI, encodeURI("http://pablorodriguez.esy.es/organizerSD/api/public/addImage"), win, fail, options);

          //$scope.addBill(20);
      }
       
      function capturePhoto() {
        try{
          //Pongo al usuario en espera mientras hago la consulta.
          $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 10
          });

          navigator.camera.getPicture(onCapturePhoto, onFail, {
              quality: 20,
              destinationType: destinationType.FILE_URI
          });
        }catch(e){
          // Si no puede abrir la camara.
          $ionicLoading.hide();
          $scope.showPopUpPrice();
        }
      }
       
      function onFail(message) {
          $ionicLoading.hide();
          alert('Fallo: ' + message);
      }    

      capturePhoto();
    };

   // Agrego un nuevo billete a entregar.
    $scope.addBill = function(pValue){

      var action = (parseInt(purData['change']) == 0 && (parseInt(purData['price'])-parseInt(purData['balance'])) > 0? 'P':
                     parseInt(purData['change']) > 0 && parseInt(purData['balance']) == 0? 'R': 'E');
      console.log('accion:' + action);
      console.log(parseInt(purData['price'])-parseInt(purData['balance'])) ;

      if (action !== 'E'){
        // CARGO UN BILLETE.
          PurchaseFactory.addBill(appData['user']['id'],pValue,purData['id'],action)
                         .then(function(matches){
                            purData['balance'] = matches.data.balance;
                            purData['change']  = matches.data.change;
                            window.localStorage.setItem( 'purData', JSON.stringify(purData));

                            if (purData['balance'] > 0){
                                //cambia valores en pantalla actual.
                                $scope.formData.title = appData.allMessages[4].message;
                                $scope.formData.total = purData['balance'];
                                $scope.formData.buttonLbl = appData.allMessages[3].message;
                            }else if (purData['change'] > 0){
                                //ya ingreso todos los billetes necesarios, hay sobrante
                                $scope.formData.title = appData.allMessages[8].message;
                                $scope.formData.total = purData['change'];
                                $scope.formData.buttonLbl = appData.allMessages[2].message;
                                $scope.styleBackground = {
                                    background: '#FB993D' //Naranja
                                };
                                $scope.styleButton = {
                                    background: '#007E35' //
                                };
                            } else{
                                $state.go("fINDELACOMPRA");
                            }
                         }).catch(function(e){
                            console.log('error' + e);
                         });
      }else{
        // MUESTRO PANTALLA DE FIN.
        $state.go("fINDELACOMPRA");
      }
    }; 

    $scope.close = function(){
        $ionicHistory.clearCache()
                .then( function(){
                      $state.go("hOME");});  
    }

    // En caso que no funcione la camara ingresa valor 
    $scope.showPopUpPrice = function() {
      $scope.formDataPopUp = {};
      var myPopup = $ionicPopup.show({
        template: '<div class="spacer" style="width: auto; height: 13px;"></div>' +
                  '<input type="number" min="1" max="99999" ng-model="formDataPopUp.bill" style="font-size: 50px;font-weight: bold;text-align: right;display: inline-table; height:auto;  padding-bottom:5px; padding-top:5px;" focus-me></input>' +
                  '<div class="spacer" style="width: auto; height: 13px;"></div>',
        title: 'VALOR?',
        cssClass: 'callingPopup',
        scope: $scope,
        buttons: [  { text: 'CANCEL' ,
                      onTap: function(e) {
                         return 0;
                      }  
                    },
                    {
                      text: '<b>SAVE</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                        if (!$scope.formDataPopUp.bill) {
                          e.preventDefault();
                        } else {
                          console.log($scope.formDataPopUp.bill);
                          return $scope.formDataPopUp.bill;
                        }
                      }
                    }
                  ]
      });

      myPopup.then(function(res) {
         if (res>0){
                  $scope.addBill(res);
         }
      });
    };

    //Leer Texto
    //TTSService.read( appData.allMessages[13].message + " " + $scope.formData.price , appData.user.locale);
}])
   
   
.controller('fINDELACOMPRACtrl', ['$scope', '$stateParams','$ionicHistory', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicHistory,$state) {
    var appData = JSON.parse( window.localStorage.getItem( 'appData' ));

    $scope.formData = {
                  ending : appData.allMessages[9].message,
                  buttonLbl: appData.allMessages[10].message
    };

    $scope.newPurchase = function(){
    $ionicHistory.clearCache()
                .then( function(){
                      $state.go("hOME");}); 
    };

    $scope.close = function(){
      navigator.app.exitApp();
    }

}])
 