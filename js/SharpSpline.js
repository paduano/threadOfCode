SharpSpline = THREE.Curve.create(

    // define the constructor (args optional)
    function( points, s ) {

        this.points = points;

    },

    // define the getPoint() function
    function( t, pt0,pt1,pt2,pt3,weight ) {
        var v = new THREE.Vector3();
        var c = [];
        var points = this.points, point, intPoint, weight;
        point = ( points.length - 1 ) * t;

        intPoint = Math.floor( point );
        weight = point - intPoint;

        c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
        c[ 1 ] = intPoint;
        c[ 2 ] = intPoint  > points.length - 2 ? points.length - 1 : intPoint + 1;
        c[ 3 ] = intPoint  > points.length - 3 ? points.length - 1 : intPoint + 2;

        var pt0 = points[ c[0] ],
            pt1 = points[ c[1] ],
            pt2 = points[ c[2] ],
            pt3 = points[ c[3] ];

        v.copy( pt1 ).lerp( pt2, weight );

        return v;

    }

);