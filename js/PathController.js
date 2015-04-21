PathController = function (scene, commands) {
    var self = {};

    var _boostSpeed = 0;

    var _currentCommandIndex,
        _currentCommand;

    var _clock,
        _nextUpdateTime;

    var _currentGenerator;

    var _previousGenerators = [];
    //callback
    self.onPathEnd = function(){};

    self.update = function () {
        _currentGenerator.update();


        _boostSpeed = clamp(_clock.getElapsedTime()/15,0,1);

        ///xxx
        for(var i = Math.max(0,_previousGenerators.length-5); i < _previousGenerators.length; i++){
            _previousGenerators[i].update();
        }



        if(_clock.getElapsedTime() >= _nextUpdateTime){
            _previousGenerators.push(_currentGenerator);
            nextCommand();
        }


    };


    var getCommandStartPosition = function(command){
        if(command.type == 'code'){
            return V3(command.points[0][0],command.y,command.points[0][1])
        } else {
            console.error('next command should be code');
        }
    };

    var drawCode = function (code) {

        var tileDuration = 0.1 - _boostSpeed*0.095;

        var points = [];
        for(var i = 0; i < code.points.length; i++){
            var p = code.points[i];
            points.push(V3(p[0],code.y,p[1]));
        }

        _currentGenerator = TileGenerator(scene, points, tileDuration);

        _nextUpdateTime = _clock.getElapsedTime() + _currentGenerator.getTotalDuration();

    };

    var drawLink = function (link) {
        var duration = 1 - _boostSpeed*0.99;

        var color, rotationAngle;
        if(link.linkType == 'call'){
            color = Colors.call;
            rotationAngle = Math.PI/2;
        } else if(link.linkType == 'jump') {
            color = Colors.jump;
            rotationAngle = Math.PI/2;//
        }

        var points = [];
        var v1 = _previousGenerators[_previousGenerators.length - 1].getEndPosition(),
            v3 = getCommandStartPosition(commands[_currentCommandIndex + 1]);

        var diff = v3.clone().sub(v1);




        var v2 = v1.clone().add(diff.clone().multiplyScalar(0.5))
            .add(diff.applyAxisAngle(V3(0,1,0),rotationAngle).multiplyScalar(0.3));

        points.push(v1);
        points.push(v2);
        points.push(v3);




        _currentGenerator = CurveGenerator(scene, points, duration, color);

        _nextUpdateTime = _clock.getElapsedTime() + duration;

    };

    var nextCommand = function () {
        _currentCommandIndex++;

        //end
        if(_currentCommandIndex >= commands.length){
            self.onPathEnd();
            return;
        }

        _currentCommand = commands[_currentCommandIndex];


        if(_currentCommand.type == 'link'){
            drawLink(_currentCommand);
        } else if(_currentCommand.type == 'code'){
            drawCode(_currentCommand);
        }


    };


    var init = function () {
        _currentCommandIndex = -1;
        _clock = new THREE.Clock();
        nextCommand();
    }();

    return self;
};