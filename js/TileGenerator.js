var TileGenerator = function (scene, points, durationPerTile) {
    var TILE_SIZE = 0.2;

    var self = {};

    var _tiles = [];
    var _clock;
    var _spline,
        _splineLength,
        _numberOfTiles,
        _splineDeltaForTile // length from 0 to 1 that takes a tile
        ;

    var _progress; // from 0 to 1

    self.update = function () {
        for(var i = 0; i < _tiles.length; i++){
            var tile = _tiles[i];
            tile.material.updateLife(_clock.getElapsedTime());
        }

        var currentProgress = clamp(_clock.getElapsedTime()/self.getTotalDuration(), 0, 1);

        var t = _progress;
        for(; t < currentProgress; t+= _splineDeltaForTile){
            var position = _spline.getPointAt(t);
            var tangentToSpline = _spline.getTangentAt(t);
            addTile(position,tangentToSpline);
            addHead(position);
        }

        if(currentProgress == 1 && _progress != 1){
            var position = _spline.getPointAt(1);
            var tangentToSpline = _spline.getTangentAt(1);
            addTile(position,tangentToSpline);
            _progress = 1;
        } else {
            _progress = t;
        }


    };

    self.getEndPosition = function () {
        return _spline.getPointAt(1);
    };

    self.getTotalDuration = function () {
        return _numberOfTiles * durationPerTile;
    };

    var createSpline = function () {
        _spline = new SharpSpline(points);
        _splineLength = _spline.getLength();
        _numberOfTiles = _splineLength / TILE_SIZE ;
        _splineDeltaForTile = 1/_numberOfTiles;
    };

    var addTile = function(position, tangentToSpline) {
        var tile = Geometry.createTile(TILE_SIZE);

        tile.material = TileMaterial(position);
        tile.material.startTime = _clock.getElapsedTime();

        scene.add(tile);
        _tiles.push(tile);

        tile.position.set(position.x, position.y, position.z);

    };

    var addHead = function (position) {
        var tile = Geometry.createTile(TILE_SIZE*2);

        tile.material = HeadMaterial(position, durationPerTile*10);
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

