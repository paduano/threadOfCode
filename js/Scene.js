var Scene = function () {
    var self = {};

    var _renderer,
        _scene,
        _camera;

    var _cameraZoom;
    var _lookAt;

    var DEV_CLOCK = new THREE.Clock();

    var _pathController;

    var renderLoop = function () {


        //fix distance
        var newPos = _camera.position.clone().normalize().multiplyScalar(_cameraZoom);
     //   _camera.position.set(newPos.x,newPos.y,newPos.z);

        //var x = _camera.position.x,
        //    y = _camera.position.y,
        //    z = _camera.position.z;
        //
        var x = newPos.x;
        var z = newPos.z;

        var rotSpeed = 0.05 * DEV_CLOCK.getDelta();

        _camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
        _camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

        _camera.position.y = newPos.y;

        _camera.lookAt(_lookAt);

        if(DEV_CLOCK.getElapsedTime() < 50){
            requestAnimationFrame( renderLoop );
            _pathController.update();
            _renderer.render(_scene, _camera);
        }
    };


    var generateSplinePoints = function () {
        var points = [];


        for(var i = 0; i < 50; i++){

            var x = -10 + 20*Math.random();
            var z = -10 + 20*Math.random();

            var y = 0;

            points.push(V3(x,y,z));
        }

        return points;
    };


    var setUpScene = function () {
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera( 25, window.innerWidth/window.innerHeight, 0.1, 400 );
        //var d = 400;
        //var aspect = window.innerWidth / window.innerHeight;
        //_camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 2000 );

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( _renderer.domElement );


        var grid = new THREE.GridHelper(25, 0.6);
        grid.position.set(10,-0.01,-6);
        grid.material.opacity = 0.3;
        grid.material.transparent = true;
        _scene.add(grid);

        _camera.position.set(20,15,0);

        _lookAt = new V3(0,0,0);
        _camera.lookAt(_lookAt);
        quickSort([10,9,8,7,6,5,4,3,2,1]);
        //quickSort([1,5,8,7,2,5,7,3,0,1,1,5,8,7,2,5,7,3,0,1,1,5,8,7,2,5,7,3,0,1]);
        //quickSort([1,2,3,4,5,6,7,8,9,10]);
        var commands = __.generate();


        _pathController = PathController(_scene, commands);

        _cameraZoom = 20;
        var cameraTween = new TWEEN.Tween({distance:20}).to({distance:60}, 12000)
            .easing( TWEEN.Easing.Cubic.InOut).onUpdate(function () {
            _cameraZoom = this.distance;
        }).start();

        var lookAtTween = new TWEEN.Tween(_lookAt).to(new V3(10,0,-3), 5000)
            .easing( TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                _lookAt = this;
            }).start();


        animation();
        renderLoop();
    };

    function animation(){
        requestAnimationFrame(animation);
        TWEEN.update();
    }

    var init = function () {
        setUpScene();
    }();
};