var TileMaterial = function (tilePosition, call) {

    var FADE_IN = 0.2;

    var color = Colors.tile;
    if(call)color = Colors.call;

        var self = new THREE.ShaderMaterial( {


        uniforms: {
            color: {type: 'v3', value: color},
            life: {type: 'f', value: 0.2}
        },

        vertexShader: document.getElementById( 'tileVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'tileFragmentShader' ).textContent,
        transparent: true,
        blending: 		THREE.NormalBlending,
        depthTest:		true,
        depthWrite: false
        //side : THREE.DoubleSide
    } );

    self.startTime = 0;




    self.updateLife = function (time) {


        var life = clamp((time-self.startTime) / FADE_IN,0,1);

        self.uniforms.life.value = life;
    };



    return self;
};