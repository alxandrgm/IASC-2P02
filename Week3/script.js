import * as THREE from "three"

/***********
 ** SCENE **
 ***********/

 // Canvas
 const canvas = document.querySelector('.webgl')

 // Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

 // Camera 
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)

camera.position.set(0, 0, 5)
scene.add(camera)

 // Renderer
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas
 })

 renderer.setSize(window.innerWidth, window.innerHeight)

 /************
  ** MESHES **
  ************/

 // testsphere
 const boxGeometry = new THREE.BoxGeometry(1)
 const boxMaterial = new THREE.MeshNormalMaterial()
 const testBox = new THREE.Mesh(boxGeometry, boxMaterial)

 const torusGeometry = new THREE.TorusGeometry(2, 0.2, 16, 100)
 const torusMaterial = new THREE.MeshNormalMaterial()
 const testTorus = new THREE.Mesh(torusGeometry, torusMaterial)

 scene.add(testBox)
 scene.add(testTorus)
 /*******************
 ** ANIMATION LOOP **
 ********************/

 const clock = new THREE.Clock()

 // Animate

 

 const animation = () => 
 {
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate testSphere
    testBox.position.z = Math.sin(elapsedTime)
    testBox.rotation.x = Math.sin(elapsedTime)
    testBox.rotation.y = Math.sin(elapsedTime * 2)
    testBox.scale.x = Math.sin(elapsedTime)
    testBox.scale.y = Math.sin(elapsedTime)
    testBox.scale.z = Math.sin(elapsedTime)

    testTorus.rotation.y = elapsedTime

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

 animation()