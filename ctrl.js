    var app = angular.module('myApp', []);
    app.controller('myCtrl', function($scope) {

        var diamondArr = random8();
        $scope.cb = checkerboard();
        $scope.currentEl = undefined;

        function random8() { //creting random 8 diamond location 
            var temp = new Set();
            while (temp.size !== 8) {
                temp.add(Math.ceil(Math.random() * 64));
            }
            return (Array.from(temp));
        }

        function checkerboard() { //making game board with tile obj conatining touch, count diamond
            var temp = [];
            var dTile = diamondArr;
            for (var step = 0; step < 64; step++) {
                var obj = {};
                obj.touch = false;
                obj.count = step;
                if (dTile.indexOf(step) != -1) {
                    obj.diamond = true;
                } else {
                    obj.diamond = false;
                }
                temp.push(obj);
            }
            return temp;
        }

        function gameover() {
            if (diamondArr && diamondArr.length == 0) { //if all diamond reveled and array is empty
                $scope.gameover = true;
                $scope.score = 0;
                for (x in $scope.cb) { // finding score with untouched tiles
                    if ($scope.cb[x].touch != true) {
                        $scope.score++;
                    }
                }
                return true;
            } else {
                return false
            }
        }

        function findNear(eleNum) {
            if (gameover()) return;
            for (x in diamondArr) { //  reveled diamond removing it from diamond array so arrow wont point it again
                if ($scope.cb[diamondArr[x]].touch == true) {
                    diamondArr.splice(x, 1);
                }
            }
            smallestDiff = Math.abs(eleNum - diamondArr[0]); //finding diff with positive numbers
            closest = 0; //index of the current closest number
            for (i = 1; i < diamondArr.length; i++) {
                currentDiff = Math.abs(eleNum - diamondArr[i]);
                if (currentDiff < smallestDiff) {
                    smallestDiff = currentDiff;
                    closest = i;
                }
            }
            return diamondArr[closest];
        }

        function getOffset(a) {
            if (gameover()) return;
            var rect = a.getBoundingClientRect(); //gives an object with left and top offset height related to dom.
            return {
                left: rect.left + window.scrollX, //returing a object with coridinates
                top: rect.top + window.scrollY
            };
        }

        function roatateArr(clickedTile, diamondTile, el) {
            if (gameover()) return;
            var center_x = (clickedTile.left) + (el.offsetWidth / 2); //keep in center for arrow
            var center_y = (clickedTile.top) + (el.offsetHeight / 2); //keep in center for arrow
            var dia_x = diamondTile.left; //near diamond postion x
            var dia_y = diamondTile.top; //near diamond postion y
            var radians = Math.atan2(dia_x - center_x, dia_y - center_y); //cal for rotation
            var degree = (radians * (180 / Math.PI) * -1) + 180; //cal for roatation to deg
            el.style.transform = 'rotate(' + degree + 'deg)'; //pointing arrow to the diamond
        }

        $scope.tileClick = function(x) {
            if (gameover()) return;
            x.touch = true; // tile is opened
            var clickedTile = document.querySelector(".num" + x.count); //current tile
            var cTileXY = getOffset(clickedTile); // curreent tile offsetes
            var nearDiamond = findNear(x.count); // finding near diamond num
            var nearDiamondTile = document.querySelector(".num" + nearDiamond); // finding near diamond tile
            var nDiamondTileXY = getOffset(nearDiamondTile); // finding near diamond offests
            var curArrow = document.querySelector(".num" + x.count + " .arr"); // selecting current arrow
            roatateArr(cTileXY, nDiamondTileXY, curArrow); // rotatet arrow
        }

    });
