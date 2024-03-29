import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
**SET UP **
***********/

// Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/***********
 ** SCENE **
 ***********/

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Camera 

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set (9.9, 3.5, 10.5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
 })

renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

 /************
  ** MESHES **
  ************/
 const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
 })

//caveWall
const caveWallGeometry = new THREE.PlaneGeometry(10, 5)
const caveWall = new THREE.Mesh(caveWallGeometry, caveMaterial)
caveWall.rotation.y = Math.PI * 0.5
caveWall.position.set(-5, 0, 0)
caveWall.receiveShadow = true
scene.add(caveWall)

//barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(10, 2)
const barrierWall = new THREE.Mesh(barrierWallGeometry, caveMaterial)
barrierWall.rotation.y = Math.PI * 0.5
barrierWall.position.set(5, -1.5, 0)
scene.add(barrierWall)

//caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10, 10)
const caveFloor = new THREE.Mesh(caveFloorGeometry, caveMaterial)
caveFloor.rotation.x = Math.PI * 0.5
caveFloor.position.set(0, -2.5, 0)
//caveFloor.receiveShadow = true
scene.add(caveFloor)

// OBJECTS
/* torusKnot

const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.2)
const torusKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
torusKnot.position.set(6, 1.5, 0)
torusKnot.castShadow = true
scene.add(torusKnot)
*/

// tube
class CustomSinCurve extends THREE.Curve {

	constructor( scale = 2 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin( 3 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

const path = new CustomSinCurve( 0.75 );
const tubeGeometry = new THREE.TubeGeometry( path, 20, 1, 4, false );
const tubeMaterial = new THREE.MeshBasicMaterial( { color: 0x800000 } );
const tube = new THREE.Mesh( tubeGeometry, tubeMaterial );
tube.position.set(8, 0.5, 0)
tube.rotation.y = 190;
tube.castShadow = true
scene.add( tube );

// sphere

const sphereGeometry = new THREE.SphereGeometry( 0.75, 16, 8 ); 
const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffd699 } ); 
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial ); 
scene.add( sphere );
sphere.position.set(8, 2.5, 0)
sphere.castShadow = true
scene.add( sphere );

// SUN
const sunGeometry = new THREE.SphereGeometry()
const sunMaterial = new THREE.MeshLambertMaterial({
    emissive: new THREE.Color('orange'),
    emissiveIntensity: 20
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)


/************
 ** LIGHTS **
*************/

/*
// AmbientLight

const ambientLight = new THREE.AmbientLight( 
    new THREE.Color('white')
 )
scene.add(ambientLight)
*/

// DirectionalLight
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
directionalLight.target = caveWall
directionalLight.position.set(11, 1.7, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)

// Directional Light Helper
//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)

/*********
 ** UI **
*********/

// UI 
/*
const ui = new dat.GUI()

const uiObject = {}

uiObject.reset = () => 
{
    directionalLight.position.set(8.6, 1.7, 0)
}

// Directional Light

const lightPositionFolder = ui.addFolder('Directional Light Position')

lightPositionFolder
    .add(directionalLight.position, 'x')
    .min(-10)
    .max(20)
    .step(0.1)

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)

lightPositionFolder
    .add(uiObject, 'reset')
    .name('Reset position')
    
lightPositionFolder
    .add(torusKnot.position, 'x')
    .min(-5)
    .max(5)
    .step(0.1)
*/

/**********************
 ** DOM INTERACTIONS **
 **********************/

// domObject
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false,
}
// continue-reading 
document.querySelector('#continue-reading').onclick = function () {
    document.querySelector('#part-two').classList.remove('hidden')
    document.querySelector('#part-one').classList.add('hidden')
    domObject.part = 2
}

// restart 
document.querySelector('#restart').onclick = function () {
    document.querySelector('#part-two').classList.add('hidden')
    document.querySelector('#part-one').classList.remove('hidden')
    domObject.part = 1

    // reset domObject changes
    domObject.firstChange = false 
    domObject.secondChange = false 
    domObject.thirdChange = false 
    domObject.fourthChange = false 
    tube.position.set(8, 0.5, 0)
    tube.rotation.y = 190;
    sphere.position.set(8, 2.5, 0)

    // reset directionLight
    directionalLight.position.set(11, 1.7, 0)
}


// first change
document.querySelector('#first-change').onclick = function () {
    domObject.firstChange = true
}
// second change
document.querySelector('#second-change').onclick = function () {
    domObject.secondChange = true
}

// third change 
document.querySelector('#third-change').onclick = function () {
    domObject.thirdChange = true
}

// fourth change
document.querySelector('#fourth-change').onclick = function () {
    domObject.fourthChange = true
}

 /*******************
 ** ANIMATION LOOP **
 ********************/

 const clock = new THREE.Clock()

 // Animate

 const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()



    // Animate Objects
    //torusKnot.rotation.y = elapsedTime
    //torusKnot.position.z = Math.sin(elapsedTime * 0.5) * 2

    // Update sun position to match directionalLight position
    sun.position.copy(directionalLight.position)

    //Update directionalLightHelper
    //directionalLightHelper.update()

    // Controls 
    controls.update()

    // DOM INTERACTIONS

    // part 1 
    if (domObject.part === 1){
        camera.position.set(1.0, 0.2, 1.5)
        camera.lookAt(-5, 0, 1.5)
    }

    // part 2
    if (domObject.part === 2){
        camera.position.set(10, 3.5, 10.5)
        camera.lookAt(1.5, 1, 3)
    }

    // first-change
    if(domObject.firstChange){
        
        /*torusKnot.rotation.y = elapsedTime
        torusKnot.rotation.z = elapsedTime
        */

        tube.position.z = Math.sin(elapsedTime * 0.25) * 10
        sphere.position.z = Math.sin(elapsedTime * 0.25) * 10
        // speed is slow to give the feeling of the people in the cave believing that a large amount of time have past and that the giant would never return
    }
    
    // second-change
    if(domObject.secondChange){
        /*torusKnot.position.y = Math.sin(elapsedTime  * 0.5) * 6
        */
        tube.position.y = Math.sin(elapsedTime * 1) * 3
        tube.position.z = 0.5
        sphere.position.y = (Math.sin(elapsedTime * 1) + 0.66) * 3
        sphere.position.z = 0.5
    
    }

    // third-change
    if(domObject.thirdChange){
        tube.rotation.y = elapsedTime
        sphere.rotation.y = elapsedTime
    }

    //fourth-change
    if(domObject.fourthChange){
        directionalLight.position.y -= 0.05
    }

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame (animation)
}

animation()