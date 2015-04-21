var CurveGenerator = function (scene, points, duration, color) {
    var TILE_SIZE = 0.2;

    var self = {};

    var _tiles = [];
    var _clock;
    var _spline,
        _splineLength,
        _splineDeltaForTile // length from 0 to 1 that takes a tile
        ;

    var _progress; // from 0 to 1

    self.update = function () {
        for(var i = 0; i < _tiles.length; i++){
            var tile = _tiles[i];
            tile.material.updateLife(_clock.getElapsedTime());
        }

        var currentProgress = clamp(_clock.getElapsedTime()/duration, 0, 1);

        var t = _progress;
        for(; t < currentProgress; t+= _splineDeltaForTile){
            var position = _spline.getPointAt(t);
            var tangentToSpline = _spline.getTangentAt(t);
            addTile(position,tangentToSpline);

            //if(_tiles.length == 1)
            //    addMarginTile(position);
        }
        _progress = t;

    };

    var createSpline = function () {
        _spline = new THREE.SplineCurve3(points);
        _splineLength = _spline.getLength();
        var numberOfTiles = _splineLength / TILE_SIZE * 1 ;
        _splineDeltaForTile = 1/numberOfTiles;
    };

    var addTile = function(position, tangentToSpline) {
        var tile = Geometry.createTileForCurve(TILE_SIZE);

        tile.material = CurveMaterial(position, tangentToSpline, color);
        tile.material.startTime = _clock.getElapsedTime();

        scene.add(tile);
        _tiles.push(tile);

        tile.position.set(position.x, position.y, position.z);

    };

    var addMarginTile = function(position){
        var tile = Geometry.createTileForCurve(TILE_SIZE);

        tile.material = TileMaterial(position, true);
        tile.material.startTime = _clock.getElapsedTime();

        scene.add(tile);
        _tiles.push(tile);

        tile.position.set(position.x, position.y, position.z);
    };

    var init = function () {
        _progress = 0;
        _clock = new THREE.Clock();

        createSpline();

    }();

    return self;

};
