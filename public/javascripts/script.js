var app = angular.module('myApp', [])
.controller('myCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.books = [];
        
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
    
        $scope.addBook = function() {
            var bookObject = {"book" : $scope.book, "bookUrl" : $scope.bookUrl, "numRead" : $scope.numRead, "readDesire" : $scope.readDesire};
            $http({
                method: "POST",
                url: "/addBook",
                data: bookObject
            })
            .then(function(response) {
                console.log("made it back");
                console.log(response.data);
                $scope.books.push(response.data);
                console.log($scope.books[0]);
            });
            $scope.book = '';
            $scope.bookUrl = '';
            $scope.numRead = '';
            $scope.readDesire = '';
        };
        
        $scope.deleteBook = function(book) {
            console.log("Book: " + book.book);
            $http({
                method: "PUT",
                url: "/deleteBook",
                data: {"book" : book.book}
            })
            .then(function(response) {
                if (response.data == "success") {
                    console.log("made it!!!");
                    for (var i = 0; i < $scope.books.length; ++i) {
                        console.log("$scope.books[i]" + $scope.books[i].book)
                        console.log("book.book:" + book.book);
                        if ($scope.books[i].book == book.book) {
                            $scope.books.splice(i, 1);
                            return;
                        }
                    }
                }
                console.log("made it to the response.");
            })
        }
    }
]);