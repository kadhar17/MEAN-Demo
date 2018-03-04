var app = angular.module("myapp", []);

app.controller("mycontroller", function ($scope, $http,$filter) {
    $scope.serverUrl = "http://localhost:8030";
    $scope.currState = "";
    $scope.userlist = false;

    $scope.name = '';
    $scope.age = '';
    $scope.phone = '';
    $scope.designation = "";
    $scope.company="";
    $scope.email=""

    $scope.reset = function () {
        $scope.name = '';
        $scope.age = '';
        $scope.phone = '';
        $scope.company = "";
        $scope.designation = "";
        $scope.email = "";
    }

    $scope.add = function () {
        console.log("add")
        $http({
            method: "Get",
            params: {
                "name": $scope.name,
                "age": $scope.age,
                "phone": $scope.phone,
                "company": $scope.company,
                "designation": $scope.designation,
                "email": $scope.email
            },
            accepts: "application/json",
            dataType: 'json',
            url: $scope.serverUrl + "/add"
        })
            .then(function (response) {
                console.log("success")
                $scope.reset()
                $scope.list();
                alert("added Successfully");
            },
                function (response) {
                    // failure call back
                    console.log("error in data")
                });
    }

    $scope.fetch = function () {
       
        $http({
            method: "Get",
            params: {
                "name": $scope.name
            },
            accepts: "application/json",
            dataType: 'json',
            url: $scope.serverUrl + "/fetch"
        })
            .then(function (response) {
                console.log("fetch")
                console.log(response.data)
                $scope.phone = response.data[0].phone;
                $scope.name = response.data[0].name;
                $scope.age = response.data[0].age;
                $scope.company = response.data[0].company;
                $scope.designation = response.data[0].designation;
                $scope.email = response.data[0].email;
                $scope.currState = "fetch";
                alert("fetch Successfully");
            },
                function (response) {
                    // failure call back
                    console.log("error in fetch")
                });
    }

    $scope.update = function () {
        console.log("update")
        $http({
            method: "Get",
            params: {
                "name": $scope.name,
                "age": $scope.age,
                "phone": $scope.phone,
                "company": $scope.company,
                "designation": $scope.designation,
                "email":$scope.email
            },
            accepts: "application/json",
            dataType: 'json',
            url: $scope.serverUrl + "/update"
        })
            .then(function (response) {
                console.log("updated")
                $scope.reset()
                $scope.currState = "";
                $scope.list();
                alert("updated Successfully");
            },
                function (response) {
                    // failure call back
                    console.log("error in update")
                });
    }

    $scope.delete = function () {
        $http({
            method: "Get",
            params: {
                "name": $scope.name
            },
            accepts: "application/json",
            dataType: 'json',
            url: $scope.serverUrl + "/delete"
        })
            .then(function (response) {
                console.log("deleted")
                $scope.currState = "";
                $scope.reset()
                $scope.list();
                alert("removed Successfully");
            },
                function (response) {
                    // failure call back
                    console.log("error in data")
                });
    }

    $scope.list = function () {
        $http({
            method: "Get",
            accepts: "application/json",
            dataType: 'json',
            url: $scope.serverUrl + "/list"
        })
            .then(function (response) {
                console.log("success")
                $scope.userlist = true;
                $scope.userdata = response.data.data;
                console.log($scope.userdata)
               // alert("list ready");
            },
                function (response) {
                    // failure call back
                    console.log("error in list")
                });
    }

    $scope.hidelist = function () {
        $scope.userlist = false;
    }

    $scope.checkid = function () {
        return
    }
});