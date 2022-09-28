let inWorker = false;
let file_data = { count: 0, data: [] };
let x_off = 0;
function loadXML( url, next ) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function state_Change() {
		//console.log(xmlhttp.readyState);
		//console.log(xmlhttp.status);
		if ( xmlhttp.readyState == 4 ) { // 4 = "loaded"
			if ( xmlhttp.status == 200 ) { // 200 = OK
				// ...our code here...
				//console.log(xmlhttp.response);
				next( xmlhttp.response );
			} else {
				console.log( "Problem retrieving XML data" );
			}
		}
	};
	xmlhttp.open( "GET", url, true );
	xmlhttp.send( null );
}
function parseDataStr( count, str ) {
	let ans = new Float32Array( count );
	let strA = str.split( ' ' );
	for ( let i = 0; i < count; i ++ )ans[ i ] = Number( strA[ i ] );
	return ans;
}
function toVectorArray( vectors, count ) {
	let array = [];
	for ( let i = 0; i < count; i ++ ) {
		let now = new THREE.Vector3( vectors._X[ i ], vectors._Y[ i ], vectors._Z[ i ] );
		array.push( { pos: now, R: vectors._R[ i ] } );
	}
	return array;
}
function straightness( vectors ) {
	if ( vectors.length <= 2 ) return 1.0;
	let begin = vectors[ 0 ];
	let end = vectors[ vectors.length - 1 ];
	let pointDistanceToLine = function ( point ) {
		let v1 = new THREE.Vector3();
		v1.copy( end );
		let v2 = new THREE.Vector3();
		v2.copy( begin );
		v1.addScaledVector( begin, - 1.0 );
		v2.addScaledVector( point, - 1.0 );
		let v3 = new THREE.Vector3();
		v3.crossVectors( v1, v2 );
		return v3.length() / v1.length();
	};
	let D = 0; let d = 0;
	for ( let i = 1; i < vectors.length - 2; i ++ ) {
		let v1 = new THREE.Vector3();
		v1.copy( vectors[ i ] );
		v1.addScaledVector( begin, - 1.0 );
		D += v1.length();
	  d += pointDistanceToLine( vectors[ i ] );
	}
	return 1 - d / D;
}
function reduceCircleSeries( vectors, threshold, maxReducedDist ) {
	let array = [];
	let now = 0;
	while ( true ) {
		if ( now >= vectors.length ) break;
		array.push( vectors[ now ] );
		if ( now + 1 >= vectors.length ) break;
		let testSamples = [ vectors[ now ].pos ];
		let end = now + 1;
		for ( let i = 1; i <= maxReducedDist; i ++ ) {
			if ( now + i >= vectors.length - 1 ) {
				end = vectors.length - 1;
				array.push( vectors[ end ] );
				break;
			}
			testSamples.push( vectors[ now + i ].pos );
			if ( straightness( testSamples ) < threshold ) {
				end = now + i - 1; break;
			}
			if ( i == maxReducedDist ) {
				end = now + i;
				break;
			}
		}
		now = end + 1;
	}
	return array;
}
function addBranch( treeGroup, obj, isReduceCircle ) {
	let count = obj[ "Spine" ][ "_Count" ];
	let X = parseDataStr( count, obj[ "Spine" ][ "X" ] );
	let Y = parseDataStr( count, obj[ "Spine" ][ "Y" ] );
	let Z = parseDataStr( count, obj[ "Spine" ][ "Z" ] );
	let R = parseDataStr( count, obj[ "Spine" ][ "Radius" ] );
	let list = toVectorArray( { _X: X, _Y: Y, _Z: Z, _R: R }, count );
	if ( isReduceCircle ) {
        	list = reduceCircleSeries( list, 0.9, 4 );
	}
	let branchGroup = new THREE.Group();
	branchGroup.name = obj._Name;
	let branchGeo = new THREE.Geometry();
	let material = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } );
	let linePoint = [];
	for ( let i = 0; i < list.length; i ++ ) {
        let now_data = list[ i ];
        let circleGeo = new THREE.CircleGeometry( now_data.R, 32 );
		let now_pos = now_data.pos;
		if ( isReduceCircle ) {
			linePoint.push( now_pos );
		}
		if ( i != list.length - 1 ) {
           	let next_pos = list[ i + 1 ].pos;
			let x = next_pos.x - now_pos.x;
			let y = next_pos.y - now_pos.y;
			let z = next_pos.z - now_pos.z;
			circleGeo.lookAt( new THREE.Vector3( x, y, z ) );
		} else {
           	let pre_pos = list[ i - 1 ].pos;
           	let x = now_pos.x - pre_pos.x;
           	let y = now_pos.y - pre_pos.y;
           	let z = now_pos.z - pre_pos.z;

			circleGeo.lookAt( new THREE.Vector3( x, y, z ) );
		}
		circleGeo.translate( now_pos.x, now_pos.y, now_pos.z );
		branchGeo.merge( circleGeo );
	}
	let bufferBranch = new THREE.BufferGeometry().fromGeometry( branchGeo );
	let bufferMesh = new THREE.Mesh( bufferBranch, material );
	bufferMesh.name = "circle_mesh";
	branchGroup.add( bufferMesh );
	//line
	if ( isReduceCircle ) {
          	let geometry = new THREE.BufferGeometry().setFromPoints( linePoint );
          	let material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 0.5 } );
          	let line = new THREE.Line( geometry, material );
          	line.name = "line";
          	branchGroup.add( line );
	}
	branchGroup.translateX( obj[ "_AbsX" ] ); branchGroup.translateY( obj[ "_AbsY" ] ); branchGroup.translateZ( obj[ "_AbsZ" ] );
	treeGroup.add( branchGroup );
}
function hideBelow( group, level ) {
	let children = group[ "children" ];
	if ( group[ "treeLevel" ] != undefined ) {
	  	if ( group[ "treeLevel" ] >= level ) {
			group.visible = false;
			return;
		}
	  	if ( group[ "treeLevel" ] < level ) {
			group.visible = true;
			return;
		}
	}
	for ( let child of children )hideBelow( child, level );
}
function decodeColor( id ) {
	if ( id == "" ) return null;
	let data = id.split( "_" );
	let r = ( Number( data[ 0 ] ) + 1 ) * 25;
	let g = Math.floor( Number( data[ 1 ] ) * Number( data[ 1 ] ) / 256 );
	let b = Math.floor( Number( data[ 1 ] ) * Number( data[ 1 ] ) % 256 );
	r = Math.floor( r * 2 ) % 256; g = Math.floor( ( g + 1 ) * 10 ) % 256; b = Math.floor( ( ( b + 1 ) * 20 ) ) % 256;
	if ( isNaN( r ) || isNaN( g ) || isNaN( b ) ) return null;
	return "rgb(" + r + "," + g + "," + b + ")";
}
function buildTreeFromXML( xml, input_file_name, offset, species_name ) {
	let TreeData_1 = new TreeData( {
		data: xml,
		type: "xml",
		species_name: input_file_name.split( '.' )[ 0 ],
		branchMatID: "1",
		isLoadLODTexture: true
	} );
	window[ "myObject" ][ "sampleTree" ] = TreeData_1;

	//update sample window
	window[ "myObject" ][ "LODSamplers" ][ "1" ].updateTree( TreeData_1, "233", 1 );
	window[ "myObject" ][ "LODSamplers" ][ "2" ].updateTree( TreeData_1, "177", 2 );
	window[ "myObject" ][ "LODSamplers" ][ "3" ].updateTree( TreeData_1, "40", 3 );
	window[ "myObject" ][ "LODSamplers" ][ "4" ].updateTree( TreeData_1, "51", 4 );

	let treeGroup_1 = TreeData_1.produceTreeGeo( { style: "tubeOnly", level: 9, barkMaterialID: "1", lod: 9 } );
	let treeGroup_2 = TreeData_1.produceTreeGeo( { style: "tubeOnly", level: 9, barkMaterialID: "1", lod: 3 } );
	let treeGroup_3 = TreeData_1.produceTreeGeo( { style: "tubeOnly", level: 9, barkMaterialID: "1", lod: 2 } );
	let treeGroup_4 = TreeData_1.produceTreeGeo( { style: "tubeOnly", level: 9, barkMaterialID: "1", lod: 1 } );
	treeGroup_2.position.x = 30;
	treeGroup_3.position.x = 60;
	treeGroup_4.position.x = 90;
	window.editor.addObject( treeGroup_1 );
	window.editor.addObject( treeGroup_2 );
	window.editor.addObject( treeGroup_3 );
	window.editor.addObject( treeGroup_4 );
	forceRender();
	let output = document.querySelector( "#tree_output" );
	if ( ! output ) return { data: TreeData_1, group: treeGroup_1 };
	output.style.display = "block";
	let range_input = document.querySelector( "#spRaw-range-input" );
	range_input.max = TreeData_1.maxLevel + 1;
	range_input.value = TreeData_1.maxLevel + 1;
	range_input.addEventListener( "change", function ( e ) {
		hideBelow( treeGroup_1, Number( e.target.value ) );
		window.editor.render();
	} );
	//window.editor.addObject(treeGroup_2);
	let _name = "tree";
	if ( input_file_name )_name = input_file_name.substring( 0, input_file_name.length - 4 );
	document.getElementById( 'spRaw-file-output_txt' ).addEventListener( 'click',
	 function () {
			let text = TreeData_1.toTXTFormat( true );
			//let jsonStr=JSON.stringify(TreeData_1);
			downloadFile( _name + ".txt", text );
		}
	 , false );
	 document.getElementById( 'spRaw-file-output_json' ).addEventListener( 'click',
	 function () {
			let jsonStr = JSON.stringify( TreeData_1 );
			downloadFile( _name + ".json", jsonStr );
		}
	 , false );
	 return { data: TreeData_1, group: treeGroup_1 };
}
function checkBarkMaterial( _material ) {
	let materialBark = new THREE.MeshStandardMaterial();
	for ( let mat of Object.values( _material ) ) {
		if ( mat.name.includes( "bark" ) || mat.name.includes( "Bark" ) ) {
			materialBark = mat; 
			break;
		}
	}
	return materialBark;
}
function loadMaterialLib( materialsInfo, materials, species ) {
	let promise = new Promise( function ( res, rej ) {
		console.log( "Promise loadMaterialLib Begin" );
		let _loadTextureOnMaterial = function ( targetMap, name, material ) {
			let colorMapLoader = new THREE.TextureLoader();
			let path = "";
			if ( ! species ) {
				path = `../myImage/${name}`;
			} else {
				path = `../models/forest/${species}/${name}`;
			}
			   colorMapLoader.load( path,
			   function ( tex ) {
					material[ "LoadiingStatus" ][ targetMap ] = "loaded";
				   	tex.encoding = THREE.sRGBEncoding;
				   	material[ targetMap ] = tex;
				   	material[ targetMap ].wrapS = THREE.RepeatWrapping;
				   	material[ targetMap ].wrapT = THREE.RepeatWrapping;
				   	let ratio = material[ targetMap ].image.height / material[ targetMap ].image.width;
				   	material[ targetMap ].repeat.set( ratio, 1 );
				   	material[ targetMap ].updateMatrix();

				   	//check is all map loaded
					let flag = true;
				   	for ( let _material of Object.values( materials ) ) {
						for ( let item of Object.values( _material[ "LoadiingStatus" ] ) ) {
							if ( item == "Loading" ) {
								flag = false; break;
							}
						}
						if ( ! flag ) break;
					}
				   	if ( flag ) {
					   for ( let material of Object.values( materials ) )material.needsUpdate = true;
					   res( materials );
					}
				} );
	   };
	   let _generateMaterialFromJSON = function ( json, material ) {
			material[ "LoadiingStatus" ] = {};
			for ( let key of Object.keys( json ) ) {
				if ( key == "Color" || key == "Opacity" || key == "Normal" ) {
					let targetMap = "map";
					if ( key == "Color" ) {
						targetMap = "map";
					} else if ( key == "Opacity" ) {
						targetMap = "alphaMap";
					} else if ( key == "Normal" ) {
				 		targetMap = "normalMap";
					} else return;
					material[ "LoadiingStatus" ][ targetMap ] = "Loading";
					_loadTextureOnMaterial( targetMap, json[ key ], material );
				}
			}
		};
		for ( let obj of Object.values( materialsInfo ) ) {
			_generateMaterialFromJSON( obj, materials[ obj.id ] );
		}
	} );
	return promise;
}
function buildTreeFromTXT( txt, input_file_name, offset, hasHelper = false ) {
	let dataArray = txt.split( '\n' );
	for ( let i = 0; i < dataArray.length; i ++ )dataArray[ i ] = dataArray[ i ].replace( /[\x00-\x1F\x7F-\x9F]/g, "" );
	if ( dataArray[ 0 ][ 0 ] == 'b' ) {

		buildBranchLib( dataArray );
		return;

	}

	let now = 0; let state = "";
	let tree_group = new THREE.Group();
	let _name = "tree";
	if ( input_file_name )_name = input_file_name.substring( 0, input_file_name.length - 4 );
	tree_group.name = _name;
	let spinePointCount = 0; let spinePoints = [];
	let parentID = - 1; let parentSpinePointID = - 1;
	let now_level = - 1;
	let branches = [];
	let now_color = null;
	let now_IDInXML = - 1; let now_parentIDinXML = - 1;
	while ( now < dataArray.length ) {

		if ( dataArray[ now ].includes( "BranchesEnd" ) ) {

			break;

		}

		let line = dataArray[ now ].split( ' ' );

		if ( line.length == 2 || line.length == 3 ) {

			if ( ! isNaN( line[ 0 ] ) && ! isNaN( line[ 1 ] ) ) {

				parentID = Number( line[ 0 ] );
				parentSpinePointID = Number( line[ 1 ] );
				state = "2 before Read";
				if ( line.length == 3 ) {

					now_color = decodeColor( line[ 2 ] );

				}

			} else {

				now_level = Number( line[ 1 ] );
				state = "layer Read";
				branches.push( [] );

			}

			now ++;


		} else if ( line.length == 1 && state == "2 before Read" ) {

			now ++;
			state = "2-1 before Read";
			let str = line + ":";
			let data = str.split( ":", 3 );
			spinePointCount = data[ 0 ];
			if ( data.length == 3 ) {

				now_IDInXML = data[ 1 ];
				now_parentIDinXML = data[ 2 ];

			}

		} else if ( line.length == 4 && state == "2-1 before Read" ) {

		   for ( let i = 0; i < spinePointCount; i ++ ) {

			   let data = dataArray[ now ].split( ' ' );

				spinePoints.push( [ Number( data[ 0 ] ), Number( data[ 1 ] ), Number( data[ 2 ] ), Number( data[ 3 ] ) ] );
				now ++;

			}

		   let now_length = branches[ now_level ].length;
		   branches[ now_level ].push( {
			  level: now_level,
			  pID: parentID,
			  psID: parentSpinePointID,
			  sPoints: spinePoints,
			  children: {},
			  color: now_color
		   } );
		   if ( now_level != 0 ) {

				branches[ now_level - 1 ][ parentID - 1 ][ "children" ][ parentSpinePointID ] = branches[ now_level ].length;

			}

		   spinePoints = [];

		} else {

			now ++;

		}

	}
	//console.log(branches);

	//handle Leaves
	let leavesReference = null;
	let meshes = null;
	let materialsInfo = null;
	let materials = null;
	if ( dataArray[ now ].includes( "BranchesEnd" ) )now ++;
	if ( dataArray[ now ].includes( "LeavesBegin" ) ) {

		now ++;
		leavesReference = [];
		while ( true ) {

		   if ( dataArray[ now ].includes( "LeavesEnd" ) ) break;
		   let leafInfo = new LeafInfo();
		   leafInfo.setFromTXT( dataArray[ now ], dataArray[ now + 1 ] );
		   leavesReference.push( leafInfo );
		   now += 2;

		}

	}

	if ( dataArray[ now ].includes( "LeavesEnd" ) ) now ++;
	if ( dataArray[ now ].includes( "MeshesBegin" ) ) {

		meshes = [];
		now ++;
		while ( true ) {

			if ( dataArray[ now ].includes( "MeshesEnd" ) ) break;
			let id = dataArray[ now ].split( "|" )[ 0 ];
			meshes[ id ] = generateMeshFromTXT( dataArray[ now ], dataArray[ now + 1 ] );
			now += 2;

		}

	}
	if ( dataArray[ now ].includes( "MeshesEnd" ) ) now ++;
	//handle Materials
	let loadMaterialPromise = null;
	if ( dataArray[ now ].includes( "MaterialsInfo" ) ) {
		materialsInfo = JSON.parse( dataArray[ now + 1 ] );
		materials = {};
		for ( let obj of materialsInfo ) {
			materials[ obj.id ] = new THREE.MeshStandardMaterial();
			materials[ obj.id ].name = obj.name;
		}
		loadMaterialPromise	= loadMaterialLib( materialsInfo, materials );
		now += 2;
	}
 	loadMaterialPromise.then( function ( _material ) {
		let materialBark = new THREE.MeshStandardMaterial();
		for ( let mat of Object.values( _material ) ) {
			if ( mat.name.includes( "bark" ) || mat.name.includes( "Bark" ) ) {
				materialBark = mat; break;
			}
		}
		for ( let i = 0; i < branches.length; i ++ ) {
			for ( let j = 0; j < branches[ i ].length; j ++ ) {
				tree_group.add( buildBranch( branches[ i ][ j ], i, j, branches[ i ][ j ].color, hasHelper, materialBark ) );
			}
		}
		//adjust offset
		if ( offset ) {
			tree_group.position.x = offset.x;
			tree_group.position.y = offset.y;
			tree_group.position.z = offset.z;
		}
		let leaves = buildInstancedLeaves( leavesReference, meshes, _material );
		//let leaves_merged=mergeLeavesAndBuildMesh(leavesReference,meshes,_material);
		tree_group.add( leaves );
		//tree_group.add(leaves_merged);
		window[ "myObject" ][ "materialLib" ] = materials;
		window.editor.addObject( tree_group );
	} );
}
function buildReadSingleFileHandler( next ) {
	function readSingleFile( e ) {
		let file = e.target.files[ 0 ];
		if ( ! file ) return;
		let file_name = file.name;
		if ( ! file ) {
		  return;
		}
		let reader = new FileReader();
		reader.onload = function ( file ) {
			next( file, file_name );
		};
		reader.readAsText( file );
	}
	return readSingleFile;
}
function buildReadMultipleFilesHandler( next ) {
	function readMultipleFiles( e ) {
		if ( ! e.target.files ) return;
		file_data.count = e.target.files.length;
		for ( let file of e.target.files ) {
			let file_name = file.name;
			if ( ! file ) return;
			let reader = new FileReader();
			reader.onload = function ( _file ) {
				file_data.data.push( { file: _file.target.result, name: file_name } );
				if ( file_data.data.length == file_data.count )next( file_data.data );
			};
			reader.readAsText( file );
		}
	}
	return readMultipleFiles;
}
function downloadFile( filename, text ) {
	var element = document.createElement( 'a' );
	element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( text ) );
	element.setAttribute( 'download', filename );
	element.style.display = 'none';
	document.body.appendChild( element );
	element.click();
	document.body.removeChild( element );
}
function loadBranchLib( x, y, lib ) {

	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function state_Change() {

		//console.log(xmlhttp.readyState);
		//console.log(xmlhttp.status);
		if ( xmlhttp.readyState == 4 ) { // 4 = "loaded"

			if ( xmlhttp.status == 200 ) { // 200 = OK

				// ...our code here...
				//console.log(xmlhttp.response);
				let _meshLib = {}; let _materialLib = {};
				let _branchLib = buildBranchLib( xmlhttp.response, x * y, _meshLib, _materialLib );
				lib[ "branchLib" ] = _branchLib;
				lib[ "meshLib" ] = _meshLib;
				lib[ "materialInfo" ] = _materialLib[ "JSON" ];

				if ( lib[ "name" ] != undefined ) {

					console.log( "branchLib&&meshLib  loaded" );
					let materialLib = {};
					for ( let obj of lib.materialInfo ) {

	  materialLib[ obj.id ] = new THREE.MeshStandardMaterial();
	  materialLib[ obj.id ].name = obj.name;

					}

					if ( ! inWorker ) {

						loadMaterialLib( lib.materialInfo, materialLib, lib[ "name" ] ).then( function ( materils ) {

							lib[ "materialLib" ] = materils;
							for ( let tree of lib.treeLib ) {

								tree.generateMergedLeaves( lib.meshLib );

							}

							for ( let b of Object.values( lib.branchLib ) ) {

								b.InstancedMesh.material = lib.materialLib[ lib.barkMaterialID ];

							}

							console.log( "materialLib loaded" );

						} );

					} else {

						console.log( "in worker materialLib can't be loaded" );
						lib[ "materialLib" ] = {};

					}

				}

			} else {

				console.log( "Problem retrieving XML data" );

			}

		}

	};

	if ( lib[ "name" ] != undefined ) {

		xmlhttp.open( "GET", "../models/forest/" + lib[ "name" ] + "/branchLib.txt", true );

	} else {

		xmlhttp.open( "GET", "../models/forest/branchLib.txt", true );

	}

	xmlhttp.send( null );

}
function loadTreeLib( count, lib ) {

	if ( lib[ "name" ] != undefined ) {

		lib[ "treeLib_state" ] = "Loading";
		lib[ "treeLib" ] = [];

	}

	for ( let i = 0; i < count; i ++ ) {


		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function state_Change() {

			//console.log(xmlhttp.readyState);
			//console.log(xmlhttp.status);
			if ( xmlhttp.readyState == 4 ) { // 4 = "loaded"

				if ( xmlhttp.status == 200 ) { // 200 = OK

					// ...our code here...
					//console.log(xmlhttp.response);
					if ( lib[ "name" ] != undefined ) {

						lib[ "treeLib" ].push( new TreeReferring( xmlhttp.response ) );
						if ( lib[ "treeLib" ].length == count ) {

							lib[ "treeLib_state" ] = "Loaded";
							console.log( "treeLib loaded" );

						}

					} else {

						lib.push( new TreeReferring( xmlhttp.response ) );

					}

				} else {

					console.log( "Problem retrieving XML data" );

				}

			}

		};

		if ( lib[ "name" ] != undefined ) {

			xmlhttp.open( "GET", "../models/forest/" + lib[ "name" ] + "/tree" + i + ".txt", true );

		} else {

			xmlhttp.open( "GET", "../models/forest/tree" + i + ".txt", true );

		}

		xmlhttp.send( null );

	}

}
function loadForest( x, y, count ) {

	let output = {};

	let treeLib = [];

	loadTreeLib( count, treeLib );
	loadBranchLib( x, y, output );
	let timer = setInterval( function () {

		console.log( "Check Forest Resource Loading" );
		if ( Object.keys( output ).length == 0 ) return;
	   if ( treeLib.length != count ) return;
	   console.log( "Forest Resource Loading OK" );
	   clearInterval( timer );
	   //let tree=window["myObject"]["treeLib"][0].generateTree(window["myObject"]["branchLib"]);
	  //window.editor.addObject(tree);
	  //window["myObject"]["treeLib"][0].generateInstancedTree(new THREE.Matrix4(),window["myObject"]["branchLib"])
	  //let forest=window["myObject"]["branchLib"].generateInstancedBranches();
	  //window.editor.addObject(forest);
	  let forest_group = new THREE.Group();
	  forest_group.name = "forest";
		/* 	  let meshLib=output["meshLib"];
	  let mat_1=new THREE.MeshStandardMaterial({color:"blue"});
	  for(let mesh of Object.values(meshLib)){

		let geo=mesh.geo;
		let m=new THREE.Mesh(geo,mat_1);
		forest_group.add(m);
} */
	  let materialLib = {};
	  for ( let obj of output.materialInfo ) {

			materialLib[ obj.id ] = new THREE.MeshStandardMaterial();
			materialLib[ obj.id ].name = obj.name;

		}

	  loadMaterialLib( output.materialInfo, materialLib ).then( function ( materils ) {

			for ( let tree of treeLib ) {

				tree.generateMergedLeaves( output.meshLib );

			}

			  let forestObj = buildForest( x, y, count, output.branchLib, treeLib, output.meshLib, materialLib );

			 forestObj.generateInstancedBranches( forest_group );
			//forestObj.generateInstancedLeaves(forest_group);

			 forestObj.generateMergedInstancedLeaves( forest_group );

			 window.myObject[ "forest" ] = forestObj;

			 window.editor.addObject( forest_group );




	  } );

	 //window.myObject["forest"].updateLOD();

	}, 3000 );

}
function loadHeroTree( name ) {

	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function state_Change() {

		//console.log(xmlhttp.readyState);
		//console.log(xmlhttp.status);
		if ( xmlhttp.readyState == 4 ) { // 4 = "loaded"

			if ( xmlhttp.status == 200 ) { // 200 = OK

				// ...our code here...
				//console.log(xmlhttp.response);
				window.editor.loader._handleJSON( JSON.parse( xmlhttp.response ), function ( obj ) {

					for ( let mesh of obj.children ) {

						if ( mesh.name[ 0 ] == 'L' ) {

							mesh.customDepthMaterial = new THREE.MeshDepthMaterial( {
								depthPacking: THREE.RGBADepthPacking,
								alphaMap: mesh.material.alphaMap,
								alphaTest: 0.4
							} );

						}

					}

				} );

			} else {

				console.log( "Problem retrieving XML data" );

			}

		}

	};

	xmlhttp.open( "GET", `../models/forest/hero/${name}.json`, true );
	xmlhttp.send( null );



}
function loadForestWithMultiSpecies( x, y, Species, _inWorker ) {

	if ( _inWorker )inWorker = true;
	let speciesLib = [];
	for ( let sp of Species ) {

		   let _name = sp.name;
		   speciesLib.push( new TreeSpecies( sp ) );

	}

	let promise = new Promise( function ( res, rej ) {


		for ( let sp of speciesLib ) {

			loadTreeLib( sp.count, sp );
			loadBranchLib( x, y, sp );

		}


	 let timer = setInterval( function () {

			console.log( "Check Forest Resource MultiSpecies Loading" );

		   let flag = true;
		   for ( let sp of speciesLib ) {

			   for ( let item of Object.values( sp ) ) {

					if ( item == "Loading" ) {

						flag = false; break;

					}

				}

			   if ( ! flag ) break;

			}

			if ( ! flag ) return;
		   console.log( "Forest Resource MultiSpecies Loading OK" );
		   clearInterval( timer );
		   for ( let sp of speciesLib ) {

				for ( let tree of Object.values( sp.treeLib ) ) {

					tree.generateMergedBranches( sp.branchLib );

				}

			}

		  let forest_group = new THREE.Group();
		  forest_group.name = "forest";
		  buildForestMultiSpecies( x, y, speciesLib );
		 for ( let species of speciesLib ) {

				let species_group = new THREE.Group();
				species_group.name = species.name + "_species_group";
			 //species.generateInstancedBranches(species_group);
			 species.generateMergedInstancedBranches( species_group );
			 species.generateMergedInstancedLeaves( species_group );
			 forest_group.add( species_group );

			}

			if ( ! inWorker ) window.editor.addObject( forest_group );
			else {

				self.postMessage( { message: "loading finished", data: forest_group } );

			}

		 res( speciesLib );
		 //need edit
			/* 	 let LODAndFustumCulling=buildUpdateLODAndFustumCulliingFunc(speciesLib);
		 let LODAndFustumCulling_timer=setInterval(LODAndFustumCulling,1000/30); */
		 //window.myObject["forest"].updateLOD();

		}, 1500 );

	} );
	return promise;

}
function geoDataToBufferGeo( geoData ) {

	let geo = new THREE.BufferGeometry();
	geo.setAttribute(
	 'position',
	 new THREE.BufferAttribute( geoData[ "attributes" ][ "position" ][ "array" ], 3 ) );
	 geo.setAttribute(
	 'normal',
	 new THREE.BufferAttribute( geoData[ "attributes" ][ "normal" ][ "array" ], 3 ) );
	 geo.setAttribute(
	 'uv',
	 new THREE.BufferAttribute( geoData[ "attributes" ][ "uv" ][ "array" ], 2 ) );
	 if ( geoData[ "index" ] )geo.setIndex( new THREE.BufferAttribute( geoData[ "index" ][ "array" ], 1 ) );
	 return geo;

}
function loadGeometrySperated( speciesLib ) {

	window[ "loadingStatus" ][ "geometry" ] = {};
	let speciesLibArray = [ {}, {}, {} ];
	let speciesNameArray = Object.keys( speciesLib );
	let pFactor = speciesLibArray.length;
	for ( let i = 0; i < speciesNameArray.length; i ++ ) {

		let name = speciesNameArray[ i ];
		speciesLibArray[ i % pFactor ][ name ] = speciesLib[ name ];
	}
	for ( let i = 0; i < pFactor; i ++ ) {
		let forestLoader = new Worker( "../myJS1_1/forestLoaderWorker.js" );
		forestLoader.postMessage( { command: "loading", data: speciesLibArray[ i ] } );
		forestLoader.onmessage = function ( evt ) {

			if ( evt.data.command == "assemble" ) {

				assembleData( speciesLib, evt.data[ "data" ] );

			} else if ( evt.data.command == "finished" ) {

				for ( let sp of evt.data.species ) {

					window[ "loadingStatus" ][ "geometry" ][ sp ] = "finished";

				}

			}

		};


	}

}
function loadMaterialLibSperated( speciesLib ) {

	window[ "loadingStatus" ][ "material" ] = {};
	for ( let name of Object.keys( speciesLib ) ) {

				  let lib = speciesLib[ name ];

		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function state_Change() {

			//console.log(xmlhttp.readyState);
			//console.log(xmlhttp.status);
			if ( xmlhttp.readyState == 4 ) { // 4 = "loaded"

			  if ( xmlhttp.status == 200 ) { // 200 = OK

					// ...our code here...
					//console.log(xmlhttp.response);
					let info = xmlhttp.response.split( '\n' );
					let now = 0;
					while ( now < info.length ) {

						if ( info[ now ].includes( "materialnfo" ) ) {

							break;

						}

						now ++;

					}

					if ( now == info.length ) {

						console.log( "material lib loading fail!" );

					}


					let materialInfo = JSON.parse( info[ now + 1 ] );
					lib[ "materialInfo" ] = materialInfo;
					let materialLib = {};
	           for ( let obj of lib.materialInfo ) {

	              materialLib[ obj.id ] = new THREE.MeshStandardMaterial();
	              materialLib[ obj.id ].name = obj.name;

					}

					loadMaterialLib( lib.materialInfo, materialLib, lib[ "name" ] ).then( function ( materials ) {

						lib[ "materialLib" ] = materials;
						let flag = true;
              	    for ( let sp of Object.values( speciesLib ) ) {

							if ( sp[ "materialLib" ] == "loading" ) {

							 flag = false; break;

							}

						}

					  if ( flag ) {

							   console.log( lib[ "name" ] + " materials loading finished" );
							   window[ "loadingStatus" ][ "material" ][ lib[ "name" ] ] = "finished";
							console.log( speciesLib );

						}

					} );

				} else {

					console.log( "Problem retrieving XML data" );

				}

			}

		};

			  xmlhttp.open( "GET", "../models/forest/" + lib[ "name" ] + "/branchLib.txt", true );
			  xmlhttp.send( null );

	}

}
function loadForestWithMultiSpeciesProgressively( x, y, Species ) {
	window[ "loadingStatus" ] = {};
	let speciesLib = {};
	for ( let sp of Species ) {
		   let _name = sp.name;
		   speciesLib[ _name ] = new TreeSpecies( sp );
		   speciesLib[ _name ][ "treeLib" ] = {};
		   for ( let i = 0; i < sp.count; i ++ ) {
			speciesLib[ _name ][ "treeLib" ][ String( i ) ] = new TreeReferring();
		}
	}

	 loadGeometrySperated( speciesLib );
	 loadMaterialLibSperated( speciesLib );
	 buildForestMultiSpecies( x, y, speciesLib, true );
	let forest_group = new THREE.Group();
	forest_group.name = "forest_group_progressively_loaded";
	window.editor.addObject( forest_group );
	 let loadingStatusChecker = setInterval( function () {

		//checker loading status then assemble and add to scene
		let flag = true;
		for ( let species_name of Object.keys( speciesLib ) ) {

			for ( let treeID of Object.keys( speciesLib[ species_name ][ "treeLib" ] ) ) {

				for ( let info of Object.values( speciesLib[ species_name ][ "treeLib" ][ treeID ].branchesMergedLOD ) ) {

					if ( info.status == "unadded" ) {

						/* 			console.log("try add");
								console.log(info) */
						speciesLib[ species_name ][ "treeLib" ][ treeID ].generateMergedInstancedBranches( forest_group, info, speciesLib[ species_name ], treeID, species_name );

					}

					if ( info.status == "added_no_material" ) {

						/* 				console.log("try add material");
								console.log(info); */
						if ( window[ "loadingStatus" ][ "material" ][ species_name ] == "finished" ) {

							   let material = speciesLib[ species_name ].materialLib[ speciesLib[ species_name ].barkMaterialID ];
							   let mesh =	speciesLib[ species_name ][ "treeLib" ][ treeID ].branchesLibLOD[ info.level ];
							   mesh.material = material;
							   info.status = "material_added";

						}

					}

				}
				for ( let key of Object.keys( speciesLib[ species_name ][ "treeLib" ][ treeID ].leavesMergedLOD ) ) {

					let level = Number( key );
					for ( let info of Object.values( speciesLib[ species_name ][ "treeLib" ][ treeID ].leavesMergedLOD[ key ] ) ) {

						if ( info.status == "unadded" ) {

							speciesLib[ species_name ][ "treeLib" ][ treeID ].generateMergedInstancedLeavesLOD( forest_group, info, speciesLib[ species_name ], treeID, species_name, level );

						}

						if ( info.status == "added_no_material" ) {
							   if ( window[ "loadingStatus" ][ "material" ][ species_name ] == "finished" ) {
								   let material = speciesLib[ species_name ].materialLib[ info.materialID ];
								   let mesh =	speciesLib[ species_name ][ "treeLib" ][ treeID ].leavesLibLOD[ String( level ) ][ info.materialID ];
								   setUpLeavesMaterial( mesh, material, species_name );
								   info.status = "material_added";
							}

						}

					}

				}

			}

		}
	}, 333 );
	 return speciesLib;
}