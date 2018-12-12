/* script.js */
var app = angular.module('myApp', [])
.controller('myCtrl', ['$scope', '$http',
    function($scope, $http) {
        
        $scope.books = [];
        
        /*Get the current books for the user. */
        $scope.getBooks = function() {
            $http({
                method: "GET",
                url: "/getBooks",
            })
            .then(function(response) {
               angular.copy(response.data, $scope.books), function errorResponse(err) {
                    console.log("There was an error copying the data to the books array.");
                };   
            })
        }
        $scope.getBooks();
        
        /*Add a book for a specific user into the database and display on the page. */
        $scope.addBook = function() {
            var bookObject = {"book" : $scope.book, "bookUrl" : $scope.bookUrl, "numRead" : $scope.numRead, "readDesire" : $scope.readDesire};
            $http({
                method: "POST",
                url: "/addBook",
                data: bookObject
            })
            .then(function(response) {
                $scope.books.push(response.data);
            });
            $scope.book = '';
            $scope.bookUrl = '';
            $scope.numRead = '';
            $scope.readDesire = '';
        };
        
        /* Delete a book from the database. */
        $scope.deleteBook = function(book) {
            $http({
                method: "PUT",
                url: "/deleteBook",
                data: {"book" : book.book}
            })
            .then(function(response) {
                if (response.data == "success") {
                    for (var i = 0; i < $scope.books.length; ++i) {
                        if ($scope.books[i].book == book.book) {
                            $scope.books.splice(i, 1);
                            return;
                        }
                    }
                }
            });
        };
        
        /*Delete a user from the database. */
        $scope.deleteAccount = function() {
            alert("Clicking this button will delete your account and all the books you have collected. Click ok to continue.");
            $http({
                method: "DELETE", 
                url: "/deleteAccount",
            })
            .then(function(response) {
                window.location.href = 'http://18.216.163.75:8083/login';
            });
        };
        
        /* Returns a value for alphabetical filtering (default). */
        $scope.alphOrder = function(bookString) {
            $scope.orderValue = bookString;
        };
        $scope.alphOrder('book');
        
        /* Returns a value for ordering based on the number of times a user has read a book. */
        $scope.numTimesRead = function(numReadString) {
            $scope.orderValue = numReadString;
        };
        
        /* Same as above filters except for the user's desire to currently read a book. */
        $scope.desireToRead = function(readDesireString) {
            $scope.orderValue = readDesireString;
        };
    }
]);