'use strict';
// First let's define the usual configuration variables for our index
var applicationId = 'latency';
var apiKey = '249078a3d4337a8231f1665ec5a44966';
var index = 'bestbuy';
var client = algoliasearch(applicationId, apiKey);

const customSearchClient = { //callback version using helper version 2.58.1
  search(requests,cb) {
    return fetch('https://algolia-backend-search.herokuapp.com/search', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }).then(res => res.json()).then(cb);
  }
};

// Define the `AgoliaSearchHelper` module
var alSH = angular.module('AlgoliaSearchHelper', ['ngSanitize']);

// Expose the helper
alSH.factory('helper', function() {
  return algoliasearchHelper(customSearchClient, index, {
    disjunctiveFacets: ['category'],
    hitsPerPage: 7,
    maxValuesPerFacet: 3
  });
});

// Define the search-box
alSH.directive('searchBox',[function(){
      return {
        restrict: 'E',
          template: `
    <input 
      placeholder="Search.." 
      class="search-box"
      ng-keyup=search($evt) 
      ng-model="query"
    />`,
        controller: function SearchBoxController($scope, helper) {
          $scope.query = '';
    $scope.search = function() {
      helper.setQuery($scope.query).search();
      console.log(helper.setQuery($scope.query).search())
    };
    
    helper.setQuery('').search();
  }
    };
}]);

// Define the search-facets
alSH.directive('searchFacets',[function(){
      return {
        restrict: 'E',
          template: `<ul class="facet-list">
              <span ng-repeat="facet in facets">
                <li 
                   ng-click="toggleFacet(facet.name)"
                   ng-class="{active: facet.isRefined}">
                  <label><input 
                    type="checkbox" 
                    data-val="facet.name"/> 
                  <span ng-bind-html="facet.name"></span> 
                  <span class="badge" ng-bind-html="facet.count"></span>
                  </label>
                </li>
              </span>
            </ul>`,
        controller: function SearchFacetsController($scope, helper) {
    $scope.toggleFacet = function (name) { 
      helper.toggleRefinement('category', name).search()
    };
    helper.on('result', results => {
      $scope.$apply($scope.facets = results.getFacetValues('category'));
    });
  }
    };
}]);

// Define the search-results
alSH.directive('searchResult',[function(){
      return {
        restrict: 'E',
          template: `
    <div class="hit results">
      <span ng-repeat="hit in hits">
        <div ng-bind-html="hit._highlightResult.name.value"></div>
      </span>
      <span ng-if="hits.length === 0">
        No results found 😓
      </span>
    </div>`,
        controller: function SearchResultController($scope, helper) {
    $scope.hits = [];

    helper.on('result', results => {
      $scope.$apply($scope.hits = results.hits);
    });
  }
    };
}]);

// Define the search-pagination
alSH.directive('searchPagination',[function(){
      return {
        restrict: 'E',
          template: `<div class="pager">
      <button class="previous" ng-click="previousPage()">Previous</button>
      <span class="current-page"><span ng-bind-html="page"></span></span>
      <button class="next" ng-click="nextPage()">Next</button>
    </div>`,
        controller: function SearchPaginationController($scope, helper) {
 
    helper.on('result', results => {
         $scope.$apply($scope.page = "" + (results.page + 1) );
    });
    
    $scope.nextPage = function() {
      helper.nextPage().search();
    };
    
    $scope.previousPage = function() {
      helper.previousPage().search();
    };
  }
    };
}]);

