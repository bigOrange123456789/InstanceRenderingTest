/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from '../../build/three.module.js';

import { TransformControls } from '../../examples/jsm/controls/TransformControls.js';

import { UIPanel } from './libs/ui.js';

import { EditorControls } from './EditorControls.js';

import { ViewportCamera } from './Viewport.Camera.js';
import { ViewportInfo } from './Viewport.Info.js';

import { SetPositionCommand } from './commands/SetPositionCommand.js';
import { SetRotationCommand } from './commands/SetRotationCommand.js';
import { SetScaleCommand } from './commands/SetScaleCommand.js';

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UIPanel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );

	container.add( new ViewportCamera( editor ) );
	container.add( new ViewportInfo( editor ) );

	//

	var renderer = null;
	var pmremGenerator = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	var objects = [];

	// helpers

	var grid = new THREE.GridHelper( 30, 30, 0x444444, 0x888888 );
	sceneHelpers.add( grid );

	var array = grid.geometry.attributes.color.array;

	for ( var i = 0; i < array.length; i += 60 ) {

		for ( var j = 0; j < 12; j ++ ) {

			array[ i + j ] = 0.26;

		}

	}

	//

	var box = new THREE.Box3();

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	var transformControls = new TransformControls( camera, container.dom );
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

			var helper = editor.helpers[ object.id ];

			if ( helper !== undefined && helper.isSkeletonHelper !== true ) {

				helper.update();

			}

			signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;

	} );
	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			switch ( transformControls.getMode() ) {

				case 'translate':

					if ( ! objectPositionOnDown.equals( object.position ) ) {

						editor.execute( new SetPositionCommand( editor, object, object.position, objectPositionOnDown ) );

					}

					break;

				case 'rotate':

					if ( ! objectRotationOnDown.equals( object.rotation ) ) {

						editor.execute( new SetRotationCommand( editor, object, object.rotation, objectRotationOnDown ) );

					}

					break;

				case 'scale':

					if ( ! objectScaleOnDown.equals( object.scale ) ) {

						editor.execute( new SetScaleCommand( editor, object, object.scale, objectScaleOnDown ) );

					}

					break;

			}

		}

		controls.enabled = true;

	} );

	sceneHelpers.add( transformControls );

	// object picking

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	function onMouseDown( event ) {
            return;
		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}

	function onDoubleClick( event ) {
		if(window["myObject"]["cameraMode"]!="free")window["myObject"]["cameraMode"]="free";
		else window["myObject"]["cameraMode"]="auto";
     return;
		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			signals.objectFocused.dispatch( intersect.object );

		}

	}

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'touchstart', onTouchStart, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );

	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new EditorControls( camera, container.dom );
	if(	!window["myObject"]){
		window["myObject"]={}
	}
 
	controls.addEventListener( 'change', function () {

		signals.cameraChanged.dispatch( camera );
		signals.refreshSidebarObject3D.dispatch( camera );

	} );

	// signals

	signals.editorCleared.add( function () {

		controls.center.set( 0, 0, 0 );
		currentBackgroundType = null;
		currentFogType = null;
		render();

	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererUpdated.add( function () {

		render();

	} );

	signals.rendererChanged.add( function ( newRenderer, newPmremGenerator ) {

		if ( renderer !== null ) {

			container.dom.removeChild( renderer.domElement );

		}

		renderer = newRenderer;
		pmremGenerator = newPmremGenerator;
		if( !window["myObject_render"]) window["myObject_render"]={};
   window["myObject_render"]["pmremGenerator"]=pmremGenerator;
		renderer.autoClear = false;
		renderer.autoUpdateScene = false;
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	signals.cameraChanged.add( function () {

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null && object !== scene && object !== camera ) {

			box.setFromObject( object );

			if ( box.isEmpty() === false ) {

				selectionBox.setFromObject( object );
				selectionBox.visible = true;

			}

			transformControls.attach( object );

		}

		render();

	} );

	signals.objectFocused.add( function ( object ) {

		controls.focus( object );

	} );

	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			selectionBox.setFromObject( object );

		}

		if ( object.isPerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		controls.enabled = true; // see #14180
		if ( object === transformControls.object ) {

			transformControls.detach();

		}

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	signals.helperAdded.add( function ( object ) {

		var picker = object.getObjectByName( 'picker' );

		if ( picker !== undefined ) {

			objects.push( picker );

		}

	} );

	signals.helperRemoved.add( function ( object ) {

		var picker = object.getObjectByName( 'picker' );

		if ( picker !== undefined ) {

			objects.splice( objects.indexOf( picker ), 1 );

		}

	} );

	signals.materialChanged.add( function () {

		render();

	} );

	// background

	var currentBackgroundType = null;

	signals.sceneBackgroundChanged.add( function ( backgroundType, backgroundColor, backgroundTexture, backgroundCubeTexture, backgroundEquirectTexture ) {

		if ( currentBackgroundType !== backgroundType ) {

			switch ( backgroundType ) {

				case 'None':
					scene.background = null;
					break;
				case 'Color':
					scene.background = new THREE.Color();
					break;

			}

		}

		if ( backgroundType === 'Color' ) {

			scene.background.set( backgroundColor );
			scene.environment = null;

		} else if ( backgroundType === 'Texture' ) {

			scene.background = backgroundTexture;
			scene.environment = null;

		} else if ( backgroundType === 'CubeTexture' ) {

			if ( backgroundCubeTexture && backgroundCubeTexture.isHDRTexture ) {

				var texture = pmremGenerator.fromCubemap( backgroundCubeTexture ).texture;
				texture.isPmremTexture = true;

				scene.background = texture;
				scene.environment = texture;

			} else {

				scene.background = backgroundCubeTexture;
				scene.environment = null;

			}

		} else if ( backgroundType === 'Equirect' ) {

			if ( backgroundEquirectTexture && backgroundEquirectTexture.isHDRTexture ) {

				var texture = pmremGenerator.fromEquirectangular( backgroundEquirectTexture ).texture;
				texture.isPmremTexture = true;

				scene.background = texture;
				//scene.environment = texture;

			} else {

				scene.background = null;
				scene.environment = null;

			}

		}

		render();

	} );

	// fog

	var currentFogType = null;

	signals.sceneFogChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		if ( currentFogType !== fogType ) {

			switch ( fogType ) {

				case 'None':
					scene.fog = null;
					break;
				case 'Fog':
					scene.fog = new THREE.Fog();
					break;
				case 'FogExp2':
					scene.fog = new THREE.FogExp2();
					break;

			}

			currentFogType = fogType;

		}

		if ( scene.fog ) {

			if ( scene.fog.isFog ) {

				scene.fog.color.setHex( fogColor );
				scene.fog.near = fogNear;
				scene.fog.far = fogFar;

			} else if ( scene.fog.isFogExp2 ) {

				scene.fog.color.setHex( fogColor );
				scene.fog.density = fogDensity;

			}

		}

		render();

	} );

	signals.viewportCameraChanged.add( function ( viewportCamera ) {

		if ( viewportCamera.isPerspectiveCamera ) {

			viewportCamera.aspect = editor.camera.aspect;
			viewportCamera.projectionMatrix.copy( editor.camera.projectionMatrix );

		} else if ( ! viewportCamera.isOrthographicCamera ) {

			throw "Invalid camera set as viewport";

		}

		camera = viewportCamera;

		render();

	} );

	//

	signals.windowResize.add( function () {

		// TODO: Move this out?

		editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		editor.DEFAULT_CAMERA.updateProjectionMatrix();

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		render();

	} );

	// animations

	var clock = new THREE.Clock(); // only used for animations

	function animate() {

		requestAnimationFrame( animate );

		var mixer = editor.mixer;

		if ( mixer.stats.actions.inUse > 0 ) {

			mixer.update( clock.getDelta() );
			render();

		}

	}

	requestAnimationFrame( animate );

	//

	var startTime = 0;
	var endTime = 0;

	function render(isDisposeRenderer) {

		startTime = performance.now();

		scene.updateMatrixWorld();
		renderer.render( scene, camera );

		if ( camera === editor.camera ) {

			sceneHelpers.updateMatrixWorld();
			renderer.render( sceneHelpers, camera );

		}

		endTime = performance.now();
		var frametime = endTime - startTime;
		editor.signals.sceneRendered.dispatch( frametime );
		if(isDisposeRenderer)renderer.dispose ();
	}
	
    editor.render=render;
	return container;

};

export { Viewport };