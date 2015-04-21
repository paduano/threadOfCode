var HeadMaterial = function (tilePosition, fadeTime) {

    var FADE_OUT = fadeTime;

    var self = new THREE.ShaderMaterial( {

        uniforms: {
            color: {type: 'v3', value: Colors.head},
            life: {type: 'f', value: 0.1}
        },

        vertexShader: document.getElementById( 'tileVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'tileFragmentShader' ).textContent,
        transparent: true,
        blending: 		THREE.AdditiveBlending,
        depthTest:		true,
        depthWrite: false
        //side : THREE.DoubleSide
    } );

    self.startTime = 0;




    self.updateLife = function (time) {


        var life = clamp(1-((time-self.startTime) / FADE_OUT),0,1);

        self.uniforms.life.value = life;
    };



    return self;
};