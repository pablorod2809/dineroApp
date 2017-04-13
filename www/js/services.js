angular.module('app.services', [])

.factory('DataFactory', function(){
   return {
    data: {},

    dateFormat : function(pDate){
      var dateFormated;
      dateFormated = pDate.getUTCFullYear() +
      ('00' + (pDate.getUTCMonth()+1)).slice(-2) +
      ('00' + pDate.getUTCDate()).slice(-2) +
      ('00' + pDate.getUTCHours()).slice(-2) +
      ('00' + pDate.getUTCMinutes()).slice(-2) +
      ('00' + pDate.getUTCSeconds()).slice(-2);
      return dateFormated;
    },

   };
})

.factory('Camera', ['$q', function($q) {
    return {
        getPhoto: function(options) {
            var q = $q.defer();
            navigator.camera.getPicture(function(result) {
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);
            return q.promise;
        }
    }
}])


.factory('UserFactory', function($q, $timeout, $http, server){
  
  return {

    getDataConfiguration : function(pLang){
      var defered = $q.defer();  
      var promise = defered.promise;
      var urlBase =  server.path + 'user/messages/' + server.appName + '/' + pLang ;
      console.log(urlBase);
      $http.get(urlBase)
          .then(function(result){
              return defered.resolve(result);
          })
          .catch(function(e){
              console.log(e);
        })
          .finally(function(){
          	  console.log('termino consulta configuracion');
        });
      return promise;         
    },


    newUser : function(pUser,pLang){
      var defered = $q.defer();  
      var promise = defered.promise;
      var urlBase =  server.path + 'user/new/' + pUser + '/' + pLang ;
      console.log(urlBase);
      $http.get(urlBase)
          .then(function(result){
              return defered.resolve(result);
          })
          .catch(function(e){
              console.log(e);
        })
          .finally(function(){
          	  console.log('termino consulta configuracion');
        });
      return promise;         
    }

  };

})

.factory('PurchaseFactory', function($q, $timeout, $http, server){
  return {
    newPurchase : function(pUser, pPrice){
      var defered = $q.defer();  
      var promise = defered.promise;
      var urlBase =  server.path + 'purchase/new/' + pUser + '/' + pPrice ;
      console.log(urlBase);
      $http.get(urlBase)
          .then(function(result){
              return defered.resolve(result);
          })
          .catch(function(e){
              console.log(e);
        })
          .finally(function(){
          	  console.log('termino insertar compra nueva');
        });
      return promise;         
    },

    addBill : function(pUser, pBill, pPurchase, pPayOrChange){
        var defered = $q.defer();  
        var promise = defered.promise;
        var urlBase =  server.path + 'purchase/bill/' +(pPayOrChange == 'P'? 'pay/' : 'change/') + pUser + '/' + pPurchase + '/' + pBill ;
        console.log(urlBase);
        $http.get(urlBase)
            .then(function(result){
                return defered.resolve(result);
            })
            .catch(function(e){
                console.log(e);
          })
            .finally(function(){
                console.log('termino insertar entrega de billete');
          });
        return promise;         
    }
  }
})


.service('TTSService', function($state){
    return {
      read : function(pText, pLang){
                            console.log('pText:' + pText + ' , pLang:' + pLang.replace("_","-"));

                            try{
                                 TTS.speak({
                                    text: pText,
                                    locale: pLang.replace("_","-"),
                                    rate: 0.75
                                    }, function () {
                                        console.log('Lectura correcta' + pText);
                                    }, function (reason) {
                                        console.log('Lectura fallida' + reason);
                                    });
                            }catch(e){
                                  console.log('error lectura: (' + pText + ') ' + e); 
                            }
      }
    }
})


.service('BlankService', function(){

})

.value('server', {
    path: 'http://pablorodriguez.esy.es/organizerSD/api/public/',
    //path: 'http://localhost/prueba/organizerSD/api/public/',
    appName: 'bqs-money',
    appVersion: '1.0.0'
});