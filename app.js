var app = angular.module('sortApp', ['ui.bootstrap']);
function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}
function getDistance(lon1, lat1, lon2, lat2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = toRad(lat2-lat1);  // Javascript functions in radians
	  var dLon = toRad(lon2-lon1); 
	  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
			  Math.sin(dLon/2) * Math.sin(dLon/2); 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}	

app.service('dataService', ["$http", "$q", function($http, $q) {
		var names = [];
		var coords;
		var deferred = $q.defer();
		window.navigator.geolocation
			.getCurrentPosition(function(pos) {
				coords = pos.coords;
				deferred.resolve();
		}); 
		
		deferred.promise.then(() => {
			if (names) {
				//calculate dist
				for(i = 0; i < names.length; i++) {
					names[i].distance = getDistance(coords.longitude, coords.latitude, names[i].address.geo.lng, names[i].address.geo.lat);
				}
			}
		});
		
		$http.get("https://jsonplaceholder.typicode.com/users")
			.success(function(response){
			names.push(...response);
			// calculate dist
			for(i = 0; i < names.length; i++) {
				if (coords) {
					names[i].distance = getDistance(coords.longitude, coords.latitude, names[i].address.geo.lng, names[i].address.geo.lat);
				}
			}
		});
		
		this.getAll = function () {
			return names;
		};
		
		this.add = function (user) {
			names.push(user);
			if(user.address&&user.address.geo&&user.address.geo.lng&&user.address.geo.lat){
			user.distance = getDistance(coords.longitude, coords.latitude, user.address.geo.lng, user.address.geo.lat);
			}
			else{
			user.distance = 0;
			}
		};
		
		this.getId = function (){
			return names.length;
		};
}]);

app.controller('mainController', [ '$scope','dataService' ,function($scope, dataService) {
  $scope.sortType     = 'name'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchItem   = '';     // set the default search/filter term
  $scope.searchName   = 'name';
  $scope.names = dataService.getAll();
}]);
app.controller("modalAccountFormController", [ 'dataService', '$scope', '$modal', '$log',

    function (dataService,$scope, $modal, $log) {

        $scope.showForm = function () {
            $scope.message = "Show Form Button Clicked";
            console.log($scope.message);

            var modalInstance = $modal.open({
                templateUrl: 'modal-form.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
            }]);

var ModalInstanceCtrl = function (dataService, $scope, $modalInstance, userForm) {
    $scope.form = {};
	$scope.user = {};
	
	$scope.verifyDuplicate = function(prop1, prop2) {
		var names = dataService.getAll();
        var  i;
		var isDuplicate = false;
		if(prop2 == ''){
			for(i = 0; i < names.length; i++) {
				isDuplicate = ($scope.user[prop1] === names[i][prop1]);
				if (isDuplicate) break;
			}
			$scope.form.userForm[prop1].$setValidity('duplicate',!isDuplicate);
		}
		else{
			for(i = 0; i < names.length; i++) {
				isDuplicate = ($scope.user[prop1][prop2] === names[i][prop1][prop2]);
				if (isDuplicate) break;
			}
			$scope.form.userForm[prop1].$setValidity('duplicate',!isDuplicate);
        }
    };
	
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
			$scope.user.id = dataService.getId() + 1;
			dataService.add($scope.user);
			console.log('user form is in scope');
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
