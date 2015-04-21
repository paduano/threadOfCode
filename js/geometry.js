var Geometry = Geometry || {};

Geometry.createTileForCurve = function (size) {
    var geom = new THREE.BufferGeometry();


    var vertexPositions = [
        [-size/2, 0 ,-size/2],
        [-size/2, 0,  size/2],
        [size/2,  0,  size/2],

        [-size/2, 0 ,-size/2],
        [size/2, 0 ,size/2],
        [size/2, 0 ,-size/2]
    ];
    var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

    var corners = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

    corners[0] = -1;
    corners[1] = -1;
    corners[2] = -1;
    corners[3] = 1;
    corners[4] = 1;
    corners[5] = 1;

    corners[6] = -1;
    corners[7] = -1;
    corners[8] = 1;
    corners[9] = 1;
    corners[10] = 1;
    corners[11] = -1;

// components of the position vector for each vertex are stored
// contiguously in the buffer.
    for ( var i = 0; i < vertexPositions.length; i++ )
    {
        vertices[ i*3 + 0 ] = vertexPositions[i][0];
        vertices[ i*3 + 1 ] = vertexPositions[i][1];
        vertices[ i*3 + 2 ] = vertexPositions[i][2];
    }

// itemSize = 3 because there are 3 values (components) per vertex
    geom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geom.addAttribute( 'corner', new THREE.BufferAttribute( corners, 2 ) );
    //var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var mesh = new THREE.Mesh( geom );

    //var object = new THREE.Mesh( geom );

    return mesh;
};





Geometry.createTile = function (size) {
    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(-size/2,0,-size/2);
    var v2 = new THREE.Vector3(-size/2,0,size/2);
    var v3 = new THREE.Vector3(size/2,0,size/2);
    var v4 = new THREE.Vector3(size/2,0,-size/2);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    geom.vertices.push(v4);

    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 0, 2, 3 ) );


    var mesh = new THREE.Mesh( geom );


    return mesh;
};

