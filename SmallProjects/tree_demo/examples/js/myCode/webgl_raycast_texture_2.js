import * as THREE from '../../../build/three.module.js';

function setUp(){

    var CanvasTexture = function ( parentTexture ) {

        this._canvas = document.createElement( "canvas" );
        this._canvas.width = this._canvas.height = 1024;
        this._context2D = this._canvas.getContext( "2d" );
    
        if ( parentTexture ) {
    
            this._parentTexture.push( parentTexture );
            parentTexture.image = this._canvas;
    
        }
    
        var that = this;
        this._background = document.createElement( "img" );
        this._background.addEventListener( "load", function () {
    
            that._canvas.width = that._background.naturalWidth;
            that._canvas.height = that._background.naturalHeight;
    
            that._crossRadius = Math.ceil( Math.min( that._canvas.width, that._canvas.height / 30 ) );
            that._crossMax = Math.ceil( 0.70710678 * that._crossRadius );
            that._crossMin = Math.ceil( that._crossMax / 10 );
            that._crossThickness = Math.ceil( that._crossMax / 10 );
    
            that._draw();
    
        }, false );
        this._background.crossOrigin = '';
        this._background.src = "textures/uv_grid_opengl.jpg";
    
        this._draw();
    
    };
    
    
    CanvasTexture.prototype = {
    
        constructor: CanvasTexture,
    
        _canvas: null,
        _context2D: null,
        _xCross: 0,
        _yCross: 0,
    
        _crossRadius: 57,
        _crossMax: 40,
        _crossMin: 4,
        _crossThickness: 4,
    
        _parentTexture: [],
    
        addParent: function ( parentTexture ) {
    
            if ( this._parentTexture.indexOf( parentTexture ) === - 1 ) {
    
                this._parentTexture.push( parentTexture );
                parentTexture.image = this._canvas;
    
            }
    
        },
    
        setCrossPosition: function ( x, y ) {
    
            this._xCross = x * this._canvas.width;
            this._yCross = y * this._canvas.height;
    
            this._draw();
    
        },
    
        _draw: function () {
    
            if ( ! this._context2D ) return;
    
            this._context2D.clearRect( 0, 0, this._canvas.width, this._canvas.height );
    
            // Background.
            this._context2D.drawImage( this._background, 0, 0 );
    
            // Yellow cross.
            this._context2D.lineWidth = this._crossThickness * 3;
            this._context2D.strokeStyle = "#FFFF00";
    
            this._context2D.beginPath();
            this._context2D.moveTo( this._xCross - this._crossMax - 2, this._yCross - this._crossMax - 2 );
            this._context2D.lineTo( this._xCross - this._crossMin, this._yCross - this._crossMin );
    
            this._context2D.moveTo( this._xCross + this._crossMin, this._yCross + this._crossMin );
            this._context2D.lineTo( this._xCross + this._crossMax + 2, this._yCross + this._crossMax + 2 );
    
            this._context2D.moveTo( this._xCross - this._crossMax - 2, this._yCross + this._crossMax + 2 );
            this._context2D.lineTo( this._xCross - this._crossMin, this._yCross + this._crossMin );
    
            this._context2D.moveTo( this._xCross + this._crossMin, this._yCross - this._crossMin );
            this._context2D.lineTo( this._xCross + this._crossMax + 2, this._yCross - this._crossMax - 2 );
    
            this._context2D.stroke();
    
            for ( var i = 0; i < this._parentTexture.length; i ++ ) {
    
                this._parentTexture[ i ].needsUpdate = true;
    
            }
    
        }
    
    };
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    var canvas;
    var planeTexture, cubeTexture, circleTexture;
    
    var container;
    
    var camera, scene, renderer;
    
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var onClickPosition = new THREE.Vector2();
    
    init();
    render();
    
    function init() {
    
        container = document.getElementById( "container" );
    
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xeeeeee );
    
        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
        camera.position.x = - 30;
        camera.position.y = 40;
        camera.position.z = 50;
        camera.lookAt( scene.position );
    
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );
        container.appendChild( renderer.domElement );
    
        // A cube, in the middle.
        cubeTexture = new THREE.Texture( undefined, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
        canvas = new CanvasTexture( cubeTexture );
        var cubeMaterial = new THREE.MeshBasicMaterial( { map: cubeTexture } );
        var cubeGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        var uvs = cubeGeometry.attributes.uv.array;
        // Set a specific texture mapping.
        for ( var i = 0; i < uvs.length; i ++ ) {
    
            uvs[ i ] *= 2;
    
        }
    
        var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
        cube.position.x = 4;
        cube.position.y = - 5;
        cube.position.z = 0;
        scene.add( cube );
    
        // A plane on the left.
        planeTexture = new THREE.Texture( undefined, THREE.UVMapping, THREE.MirroredRepeatWrapping, THREE.MirroredRepeatWrapping );
        canvas.addParent( planeTexture );
        var planeMaterial = new THREE.MeshBasicMaterial( { map: planeTexture } );
        var planeGeometry = new THREE.PlaneBufferGeometry( 25, 25, 1, 1 );
        var uvs = planeGeometry.attributes.uv.array;
        // Set a specific texture mapping.
        for ( var i = 0; i < uvs.length; i ++ ) {
    
            uvs[ i ] *= 2;
    
        }
        var plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.position.x = - 16;
        plane.position.y = - 5;
        plane.position.z = 0;
        scene.add( plane );
    
        // A circle on the right.
        circleTexture = new THREE.Texture( undefined, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
        canvas.addParent( circleTexture );
        var circleMaterial = new THREE.MeshBasicMaterial( { map: circleTexture } );
        var circleGeometry = new THREE.CircleBufferGeometry( 25, 40, 0, Math.PI * 2 );
        var uvs = circleGeometry.attributes.uv.array;
        // Set a specific texture mapping.
        for ( var i = 0; i < uvs.length; i ++ ) {
    
            uvs[ i ] = ( uvs[ i ] - 0.25 ) * 2;
    
        }
        var circle = new THREE.Mesh( circleGeometry, circleMaterial );
        circle.position.x = 24;
        circle.position.y = - 5;
        circle.position.z = 0;
        scene.add( circle );
    
        window.addEventListener( 'resize', onWindowResize, false );
        container.addEventListener( 'mousemove', onMouseMove, false );
    
        document.getElementById( 'setwrapS' ).addEventListener( 'change', setwrapS );
        document.getElementById( 'setwrapT' ).addEventListener( 'change', setwrapT );
        document.getElementById( 'setOffsetU' ).addEventListener( 'change', setOffsetU );
        document.getElementById( 'setOffsetV' ).addEventListener( 'change', setOffsetV );
        document.getElementById( 'setRepeatU' ).addEventListener( 'change', setRepeatU );
        document.getElementById( 'setRepeatV' ).addEventListener( 'change', setRepeatV );
        document.getElementById( 'setRotation' ).addEventListener( 'change', setRotation );
    
    }
    
    function onWindowResize() {
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
    
    function onMouseMove( evt ) {
    
        evt.preventDefault();
        //console.log("event cord "+evt.clientX+" "+ evt.clientY);
        var array = getMousePosition( container, evt.clientX, evt.clientY );
        
        onClickPosition.fromArray( array );
        //console.log("onClickPosition cord "+onClickPosition.x+" "+ onClickPosition.y);
        var intersects = getIntersects( onClickPosition, scene.children );
    
        if ( intersects.length > 0 && intersects[ 0 ].uv ) {
    
            var uv = intersects[ 0 ].uv;
            intersects[ 0 ].object.material.map.transformUv( uv );
            canvas.setCrossPosition( uv.x, uv.y );
    
        }
    
    }
    
    var getMousePosition = function ( dom, x, y ) {
    
        var rect = dom.getBoundingClientRect();
        return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
    
    };
    
    var getIntersects = function ( point, objects ) {
    
        mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
        //console.log("rayCast cord "+mouse.x+" "+ mouse.y);
        raycaster.setFromCamera( mouse, camera );
    
        return raycaster.intersectObjects( objects );
    
    };
    
    function render() {
    
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    
    }
    
    function setwrapS( event ) {
    
        circleTexture.wrapS = parseFloat( event.target.value );
        circleTexture.needsUpdate = true;
    
    }
    
    function setwrapT( event ) {
    
        circleTexture.wrapT = parseFloat( event.target.value );
        circleTexture.needsUpdate = true;
    
    }
    
    function setOffsetU( event ) {
    
        circleTexture.offset.x = parseFloat( event.target.value );
    
    }
    
    function setOffsetV( event ) {
    
        circleTexture.offset.y = parseFloat( event.target.value );
    
    }
    
    function setRepeatU( event ) {
    
        circleTexture.repeat.x = parseFloat( event.target.value );
    
    }
    
    function setRepeatV( event ) {
    
        circleTexture.repeat.y = parseFloat( event.target.value );
    
    }
    
    function setRotation( event ) {
    
        circleTexture.rotation = parseFloat( event.target.value );
    
    }


}

export  {setUp};