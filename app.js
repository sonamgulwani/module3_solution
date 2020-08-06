(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundList', FoundListDirective);

function FoundListDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    },
    controller: FoundListDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function FoundListDirectiveController() {
  var list = this;

  // list.cookiesInList = function () {
  //   for (var i = 0; i < list.items.length; i++) {
  //     var name = list.items[i].name;
  //     if (name.toLowerCase().indexOf("cookie") !== -1) {
  //       return true;
  //     }
  //   }
  //
  //   return false;
  // };
}


NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
function NarrowItDownController($scope, MenuSearchService) {
  var menu = this;
  menu.found = [];
  $scope.filterText = "";

  menu.narrowIt = function (shortName) {
    console.log("narrowIt clicked");
    var promise = MenuSearchService.getMatchedMenuItems($scope.filterText);

    promise.then(function (response) {
      menu.found = response;
      console.log("Found data: ", menu.found);
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  menu.removeItem = function (index) {
    console.log("onRemove, index " + index);
    menu.found.splice(index, 1);
  }

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenuForCategory = function (shortName) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      params: {
        category: shortName
      }
    });

    return response;
  };

  service.getMatchedMenuItems = function (searchTerm) {
    console.log("getMatchedMenuItems called, searchTerm: ", searchTerm);
    if (!searchTerm)
      return;

    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (response) {
      console.log("promise result: ", response.data);
      var filteredItems = [];
      if (!response || !response.data || !response.data.menu_items)
        return filteredItems;

      var menu_items = response.data.menu_items;
      for (var i = 0; i < menu_items.length; i++)
      {
        if (menu_items[i].description.indexOf(searchTerm) >= 0)
          filteredItems.push(menu_items[i]);
      }

      console.log("filtered data: ", filteredItems);

      return filteredItems;
    })
    .catch(function (error) {
      console.log(error);
    })
  };

}

})();
