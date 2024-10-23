import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


const beeUrl = new URL('demon_bee_full_texture.glb', import.meta.url);

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

// Buat scene
const scene = new THREE.Scene();
let pinix;
const loader = new GLTFLoader();
let mixer;
loader.load(
    'demon_bee_full_texture.glb', 
    function (gltf) {
        pinix = gltf.scene;
        scene.add(pinix);
        pinix.position.y = -1;
        mixer = new THREE.AnimationMixer(pinix);
        mixer.clipAction(gltf.animations[0]).play();

        modelMove();
        

    },
    function (xhr) {
    },
    function (error) {
    }
);


// Tambahkan cahaya
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// Buat renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Render loop
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
};
reRender3D();

let arrPositionModel = [
    {
        id:'banner',
        position: {x: 0, y: -1, z: 0},
        rotation: {x: 0, y: 0, z: 0},
    },
    {
        id: 'about',
        position: {x: -2, y: -2, z: -10},
        rotation: {x: 0, y: 1, z: 0},
    },
    {
        id: 'contact',
        position: {x: 2.5, y: -1, z: -9},
        rotation: {x: 0, y: -1, z: 0},
    }
];
const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });
    let position_active = arrPositionModel.findIndex(
        (val) => val.id === currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(pinix.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 3,
            ease: 'power1.out',
        });
        gsap.to(pinix.rotation,{
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 3,
            ease: 'power1.out',
        })

    }

};
window.addEventListener('scroll', () => {
    if (pinix) {
        modelMove();
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
