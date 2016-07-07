var db = null;
angular.module('starter.controllers', [])

tes.controller('DashCtrl', function($ionicLoading, $scope, $cordovaSQLite, $ionicModal, $timeout, $ionicPopup, $ionicPlatform, $ionicFilterBar) {
		$scope.post = {};
        $scope.put = {};
		$scope.put.a =0;
		 $scope.date = new Date();
		 
		 
		function getList(data) {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan ORDER BY jenis,nama ASC').then(function (res) {
                $scope.datas = [];
				$scope.put = data;
				
				
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
			 $cordovaSQLite.execute(db, 'SELECT * FROM orderan').then(function (res) {
                $scope.datas1 = [];
                for (var j = 0; j < res.rows.length; j++) {
                    $scope.datas1.push(res.rows.item(j));
                }
            }, function (err) {
                console.log(err.message);
            });
			

			$cordovaSQLite.execute(db, 'SELECT SUM(total_harga) AS jumlah1 FROM orderan').then(function (res) {
                $scope.datas2 = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas2.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
				 alert(message);
            });
			
			$cordovaSQLite.execute(db, 'SELECT COUNT(nama) AS totalitem FROM orderan;').then(function (res) {
                $scope.datas3 = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas3.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
				 alert(message);
            });
			
			$cordovaSQLite.execute(db, 'SELECT COUNT(invoice_number) AS totalinvoice FROM invoice;').then(function (res) {
                $scope.datas4 = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas4.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
				 alert(message);
            });
        };
		
		  $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.datas,
                update: function (filteredItems) {
                    $scope.datas = filteredItems;
                }
            });
        };
		
		$scope.insertinvoice = function(invoice_number, pendapatan) {
        var query = "INSERT INTO invoice (invoice_number, pendapatan) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, [invoice_number, pendapatan]).then(function(res) {
            var message = "INSERT ID -> " + res.insertId;
            console.log(message);
            alert(message);
        }, function (err) {
            console.error(err);
            alert(err);
        });
    };
		
		$scope.showorder = function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE counter>0 ORDER BY jenis,nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
		$scope.showmenu = function () {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan ORDER BY jenis,nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
		$scope.emptyorderan = function () {
            $cordovaSQLite.execute(db, 'DELETE FROM orderan').then(function (res) {
            }, function (err) {
                console.log(err.message);
            });
			
			$cordovaSQLite.execute(db, 'VACUUM').then(function (res) {
            }, function (err) {
                console.log(err.message);
            });
        };
		
		$scope.insert = function(nama, harga, jumlah, total_harga) {
        var query = "INSERT INTO orderan (nama, harga, jumlah, total_harga) VALUES (?,?,?,?)";
        $cordovaSQLite.execute(db, query, [nama, harga, jumlah, total_harga]).then(function(res) {
            var message = "INSERT ID -> " + res.insertId;
            console.log(message);
            alert(message);
        }, function (err) {
            console.error(err);
            alert(err);
        });
    };
	
	$scope.insert1 = function(counter, nama, harga, jenis) {
		
        var query = "INSERT INTO orderan (nama,harga,jumlah,total_harga)SELECT nama,harga,counter, harga * counter FROM menu_makanan WHERE counter>0;";
        $cordovaSQLite.execute(db, query).then(function(res) {
			if(res.insertId==undefined){
			$ionicPopup.alert({
                                    title: "Pesanan Gagal",
                                    template: "Silakan masukkan minimal 1 pesanan",
                                    okText: 'Ok',
                                    okType: 'button-assertive'
                                });
								
			}
			else{
				
			//var message = "INSERT ID -> " + res.insertId;
            //console.log(message);
            //alert(message);
			 $ionicPopup.show({
                title: 'Pesanan Berhasil',
                template: "Proses pemesanan makanan berhasil dilakukan",
                buttons: [
                    {
                        text: 'Ok',
                        type: 'button-balanced1',
                        onTap: function () {
							//$ionicModal.fromTemplateUrl('templates/cart.html', {
							//	scope: $scope
							//}).then(function (modal) {
							//	$scope.modalCart = modal;
							//});
								$scope.modalCart.show();
							
							
                        }
                    }
					]
            });
							
								
			}
            
        }, function (err) {
            console.error(err);
            alert(err);
        });
		getList();	
    };
	
	
	$scope.copyreport = function(nama, harga, jumlah, total_harga) {
		
        var query = "INSERT INTO penjualan (nama,harga,jumlah,total_harga)SELECT nama,harga,jumlah,total_harga FROM orderan;";
        $cordovaSQLite.execute(db, query).then(function(res) {
			// var message = "INSERT ID -> " + res.insertId;
           // console.log(message);
            //alert(message);
			$ionicPopup.alert({
                    title: "Keterangan",
                    template: "Pesanan telah dibayar",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
				getList();
			//$ionicPopup.alert({
            //                        title: "Orders Success",
            //                        template: "Your order has been successfully created",
            //                        okText: 'Ok',
            //                        okType: 'button-positive'
            //                    });
			//					getList();
        }, function (err) {
            console.error(err);
            //alert(err);
        });
    };
	
 $scope.edit1 = function () {
            var query = "update menu_makanan set counter = ? where id=?";
            $cordovaSQLite.execute(db, query, [$scope.put.counter, $scope.put.id]).then(function(res) {
            //var message = "INSERT ID -> " + res.insertId;
            //console.log(message);
            //alert(message);
			
			getList();
        }, function (err) {
            console.error(err);
            alert(err);
        });
        };
		
 $scope.edit2 = function () {
            var query = "update menu_makanan set counter = ? where counter>=0";
			$scope.a=0;
            $cordovaSQLite.execute(db, query, [$scope.a]).then(function(res) {
            //var message = "INSERT ID -> " + res.insertId;
            //console.log(message);
            //alert(message);
			
			getList();
        }, function (err) {
            console.error(err);
            alert(err);
        });
        };
		
	
	
	

	

		
		 $scope.minus = function (data) {
			 var min=0;
			 if(data.counter==min){return;}
			 data.counter = data.counter - 1;
			 
			 };
		
		
        $ionicLoading.show({
            template: 'Loading...'
        });
        $timeout(function () {
            $ionicLoading.hide();
            getList();
        }, 3000);
		
		 $scope.refreshItems = function () {
            $timeout(function () {
                getList();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
		
		
		$ionicModal.fromTemplateUrl('templates/cart.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalCart = modal;
        });
		
		$scope.closeCart = function () {
            $scope.modalCart.hide();
			
        };
        $scope.goCart = function () {
            $scope.modalCart.show();
        };
		
		
		
		
//$ionicPlatform.onHardwareBackButton(function() {
//     event.preventDefault();
//     event.stopPropagation();
//     alert('going back now y'all');
//  });


		
	
	 $scope.click = function (data) {
     $scope.put = data;         
        };	
		 $scope.minvalue = function () {
				var min=0;
				if($scope.data.counter===min){return;}        
        };	
		
})

tes.controller('ChatsCtrl', function($ionicLoading, $scope, $cordovaSQLite, $ionicModal, $timeout, $ionicPopup, $ionicTabsDelegate) {
$scope.post = {};
		$scope.post.counter=0;
        $scope.put = {};
        $ionicLoading.show({
            template: 'Loading...'
        });
        $timeout(function () {
            $ionicLoading.hide();
            getList();
			
        }, 3000); 
		
		
	 $scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    };

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
    };

 function getList() {
            $cordovaSQLite.execute(db, 'SELECT * FROM penjualan').then(function (res) {
                $scope.datas = [];
				$scope.number=0;
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
					$scope.number = $scope.number + 1;
                }
			
            }, function (err) {
                console.log(err.message);
            });
			
			  $cordovaSQLite.execute(db, 'SELECT SUM(total_harga) AS jumlah1 FROM penjualan').then(function (res) {
                $scope.datas2 = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas2.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
				 alert(message);
            });
			
        };
		
		
		   $scope.refreshItems = function () {
            $timeout(function () {
                getList();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
		
		

})

tes.controller('Chats1Ctrl', function($ionicLoading, $scope, $cordovaSQLite, $ionicModal, $timeout, $ionicPopup) {
		

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})



tes.controller('AccountCtrl', function($ionicLoading, $scope, $cordovaSQLite, $ionicModal, $timeout, $ionicPopup, $ionicFilterBar) {
		
		$scope.post = {};
		$scope.post.counter=0;
        $scope.put = {};
        $ionicLoading.show({
            template: 'Loading...'
        });
        $timeout(function () {
            $ionicLoading.hide();
            getList();
        }, 3000);
		
			  $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.datas,
                update: function (filteredItems) {
                    $scope.datas = filteredItems;
                }
            });
        };
		
		
			
        $scope.edit = function () {
            var query = "update menu_makanan set nama = ?,harga=?,jenis=? where id=?";
            $cordovaSQLite.execute(db, query, [
                $scope.put.nama,
                $scope.put.harga,
				$scope.put.jenis,
                $scope.put.id
            ]).then(function () {
                $ionicPopup.alert({
                    title: "Keterangan",
                    template: "Data berhasil diupdate",
                    okText: 'Ok',
                    okType: 'button-balanced2'
                });
                getList();
            }, function (err) {
                console.log(err.message);
            });
        };
        
        function getList() {
            $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan ORDER BY jenis,nama ASC').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
		
	//	$scope.tampilmakanan = function () {
    //        $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Makanan" ORDER BY nama ASC').then(function (res) {
    //            $scope.datas = [];
    //            for (var i = 0; i < res.rows.length; i++) {
    //                $scope.datas.push(res.rows.item(i));
    //            }
    //        }, function (err) {
    //            console.log(err.message);
	//SELECT SUM(Quantity) AS TotalItemsOrdered FROM OrderDetails;
    //        });
    //    };
	//	
	//	$scope.tampilminuman = function () {
    //        $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Minuman" ORDER BY nama ASC').then(function (res) {
    //            $scope.datas = [];
    //            for (var i = 0; i < res.rows.length; i++) {
    //                $scope.datas.push(res.rows.item(i));
    //            }
    //        }, function (err) {
    //            console.log(err.message);
    //        });
    //    };
	//	
	//	$scope.tampiltoping = function () {
    //        $cordovaSQLite.execute(db, 'SELECT * FROM menu_makanan WHERE jenis="Toping" ORDER BY nama ASC').then(function (res) {
    //            $scope.datas = [];
    //            for (var i = 0; i < res.rows.length; i++) {
    //                $scope.datas.push(res.rows.item(i));
    //            }
    //        }, function (err) {
    //            console.log(err.message);
    //        });
    //    };
		
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
	//	$ionicModal.fromTemplateUrl('templates/menu.html', {
    //        scope: $scope
    //    }).then(function (modal) {
    //        $scope.modalMenu = modal;
    //    });
        $scope.closeEdit = function () {
            $scope.modalEdit.hide();
        };
        $scope.closeAdd = function () {
            $scope.modalAdd.hide();
        };
        $scope.goAdd = function () {
            $scope.modalAdd.show();
        };
	//	$scope.goMenu = function () {
    //        $scope.modalMenu.show();
    //    };
	//	 $scope.closeMenu = function () {
    //        $scope.modalMenu.hide();
    //    };
      
        $scope.refreshItems = function () {
            $timeout(function () {
                getList();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        $scope.click = function (data) {
            $ionicPopup.show({
                title: 'Konfirmasi',
                template: "Apa yang akan Anda lakukan?",
                buttons: [
                    {
                        text: 'Hapus',
                        type: 'button-assertive',
                        onTap: function () {
                            var query = "delete from menu_makanan where id = ?";
                            $cordovaSQLite.execute(db, query, [data.id]).then(function () {
                                $ionicPopup.alert({
                                    title: "Keterangan",
                                    template: "Data berhasil dihapus",
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
                        type: 'button-balanced2',
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
            var query = "INSERT INTO menu_makanan(counter,nama,harga,jenis) VALUES (?,?,?,?)";
            $cordovaSQLite.execute(db, query, data).then(function () {
                $ionicPopup.alert({
                    title: "Keterangan",
                    template: "Data berhasil disimpan",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
                $scope.post = {};
				$scope.post.counter=0;
                getList();
            }, function (err) {
                console.log(err.message);
            });
        };		
		
});



