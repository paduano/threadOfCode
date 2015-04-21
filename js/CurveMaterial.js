var CurveMaterial = function (tilePosition, tangentToSpline, color) {

    var FADE_IN = 0.1;

    var self = new THREE.ShaderMaterial( {

        uniforms: {
                color: {type: 'v3', value: color},
            tilePosition: {type: 'v3', value: tilePosition},
            tangentToSpline: {type: 'v3', value: tangentToSpline},
            life: {type: 'f', value: 0.1}
        },
        attributes: {corner: {	type: 'vec2', value: null }},

        vertexShader: document.getElementById( 'curveVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'curveFragmentShader' ).textContent,
        transparent: true,
        blending: 		THREE.AdditiveBlending,
        depthTest:		false,
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