var db = null;
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})



tes.controller('AccountCtrl', function($ionicLoading, $scope, $cordovaSQLite, $ionicModal, $timeout, $ionicPopup) {
		
		$scope.post = {};
        $scope.put = {};
        $ionicLoading.show({
            template: 'Loading...'
        });
        $timeout(function () {
            $ionicLoading.hide();
            getList();
        }, 3000);
		
		
			
        $scope.edit = function () {
            var query = "update menu_makanan set nama = ?,harga=?,jenis=? where id=?";
            $cordovaSQLite.execute(db, query, [
                $scope.put.nama,
                $scope.put.harga,
				$scope.put.jenis,
                $scope.put.id
            ]).then(function () {
                $ionicPopup.alert({
                    title: "Information",
                    template: "Update data success",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
                getList();
            }, function (err) {
                console.log(err.message);
            });
        };
        
        function getList() {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Makanan" ORDER BY nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
		$scope.tampilmakanan = function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Makanan" ORDER BY nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
		$scope.tampilminuman = function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Minuman" ORDER BY nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
		$scope.tampiltoping = function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Toping" ORDER BY nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
        $ionicModal.fromTemplateUrl('templates/add.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalAdd = modal;
        });
        $ionicModal.fromTemplateUrl('templates/edit.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalEdit = modal;
        });
		$ionicModal.fromTemplateUrl('templates/menu.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalMenu = modal;
        });
        $scope.closeEdit = function () {
            $scope.modalEdit.hide();
        };
        $scope.closeAdd = function () {
            $scope.modalAdd.hide();
        };
        $scope.goAdd = function () {
            $scope.modalAdd.show();
        };
		$scope.goMenu = function () {
            $scope.modalMenu.show();
        };
		 $scope.closeMenu = function () {
            $scope.modalMenu.hide();
        };
      
        $scope.refreshItems = function () {
            $timeout(function () {
                getList();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        $scope.click = function (data) {
            $ionicPopup.show({
                title: 'Confirm',
                template: "what is your choice ?",
                buttons: [
                    {
                        text: 'Delete',
                        type: 'button-assertive',
                        onTap: function () {
                            var query = "delete from menu_makanan where id = ?";
                            $cordovaSQLite.execute(db, query, [data.id]).then(function () {
                                $ionicPopup.alert({
                                    title: "Information",
                                    template: "Delete data success",
                                    okText: 'Ok',
                                    okType: 'button-positive'
                                });
                                getList();
                            }, function (err) {
                                console.log(err.message);
                            });
                        }
                    },
                    {
                        text: 'Edit',
                        type: 'button-positive',
                        onTap: function () {
                            $scope.put = data;
                            $scope.modalEdit.show();
                        }
                    }
                ]
            });
        };	

			$scope.add = function () {
            var data = [];
            angular.forEach($scope.post, function (element) {
                data.push(element);
            });
            var query = "INSERT INTO menu_makanan(nama,harga,jenis) VALUES (?,?,?)";
            $cordovaSQLite.execute(db, query, data).then(function () {
                $ionicPopup.alert({
                    title: "Information",
                    template: "Saving data success",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
                $scope.post = {};
                getList();
            }, function (err) {
                console.log(err.message);
            });
        };		
		
});



