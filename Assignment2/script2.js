import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
**SET UP **
***********/

// Sizes

const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerHeight / 2.5,
    aspectRatio: (window.innerWidth / 2.5) / (window.innerHeight / 2.5)
}

/***********
 ** SCENE **
 ***********/

// Canvas

const canvas = document.querySelector('.webgl2')

// Scene

const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

// Camera

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, 20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
 })

renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** LIGHTS **
************/
// Directional Lights
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/************
** MESHES **
*************/

// Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// Cube Materials 
const redMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('orange')
})
const greenMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('pink')
})
const blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('aqua')
})

const drawCube = (i, material) =>
{
    const cube = new THREE.Mesh(cubeGeometry, material)
    cube.position.x = i - 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = (Math.random() - 0.5) * 10
    
    cube.rotation.x = Math.random() * 2 * Math.PI 
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.x = Math.random() * 2 * Math.PI 
    scene.add(cube)
}

/***********************
 ** TEXT PARSERS & UI **
***********************/
let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'hatter',
    term2: 'cheshire',
    term3: 'queen',
    rotateCamera: false,
    animateBoxes: false
}

// Text Parsers

// Parse Text and Terms
const parseTextandTerms = () =>
{
    // Strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    //console.log(parsedText)

    // Tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)
    //console.log(uiobj.textArray)

    // Find term 1
    findTermInParsedText(uiobj.term1, redMaterial)

    // Find term 2
    findTermInParsedText(uiobj.term2, greenMaterial)
    
    // Find term 3
    findTermInParsedText(uiobj.term3, blueMaterial)
}

const findTermInParsedText = (term, material) => 
{
    for (let i=0; i < uiobj.textArray.length; i++)
    {
        //console.log(i, uiobj.textArray[i])
        if(uiobj.textArray[i] === term)
        {
         //console.log(i, term)
         // convery i into n, which is a value between 0 and 20
         const n = (100 / uiobj.textArray.length) * i * 0.2

         // call drawCube function 5 times using converted n value
         for (let a=0; a < 5; a++)
         {
            drawCube(n, material)
         }
        }
    }
}

// Load source text
fetch("https://gist.githubusercontent.com/phillipj/4944029/raw/75ba2243dd5ec2875f629bf5d79f6c1e4b5a8b46/alice_in_wonderland.txt")
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data 
        parseTextandTerms()

    }
    )


// UI
const ui = new dat.GUI({
    container: document.querySelector('#parent2')
})

// Interaction Folder
    // Cubes Folder
    const cubesFolder = ui.addFolder('Filter Terms')

    cubesFolder
    .add(redMaterial, 'visible')
    .name(`${uiobj.term1}`)

    cubesFolder
    .add(greenMaterial, 'visible')
    .name(`${uiobj.term2}`)

    cubesFolder
    .add(blueMaterial, 'visible')
    .name(`${uiobj.term3}`)

    cubesFolder
    .add(uiobj, 'animateBoxes')
    .name('Animate Boxes')

    // Camera Folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')


/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Orbit Controls
    controls.update()

    // Camera
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }

    // Animate Boxes
    if(uiobj.animateBoxes){
        for(let i=0; i < scene.children.length; i++)
        {
            if(scene.children[i].type === "Mesh")
            {
                scene.children[i].scale.x = Math.sin(elapsedTime)
                scene.children[i].scale.y = Math.sin(elapsedTime)
                scene.children[i].scale.z = Math.sin(elapsedTime)
            }
        }
    }

    // Renderer 
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame (animation)
}

animation()
