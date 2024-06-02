<template>
    <div :style="{width: `${width}px`, height: `${height}px`}" ref="container">
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useElectronCloudStore } from "@/stores/electronCloudStore.ts"

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
});

const store = useElectronCloudStore();
const container = ref();

let mesh: any = undefined;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, props.width / props.height, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias:true });
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window );
controls.enableDamping = true;

renderer.setSize( props.width, props.height );
renderer.setClearColor(0xffffff, 1);
// scene.add( new THREE.AxesHelper( 20 ) );

onMounted(() => {
    container.value.appendChild(renderer.domElement);

    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 )
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0x888888, 3 );
    dirLight2.position.set( -1, -1, -1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0x777777 );
    scene.add( ambientLight );

    camera.position.z = 20;

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
    }

    animate();
});

function setMesh(points: number[][], triangleFace: number[][]) {
    if(mesh) {
        scene.remove(mesh);
    }

    const geometry = new THREE.BufferGeometry()
    const vertices: THREE.Vector3[] = [];
    const colorArr: number[] = [];
    points.forEach((point: any) => {
        vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
        colorArr.push(point[3]);
    });

    const vertexCount = vertices.length;
    const positions = new Float32Array(vertexCount * 3);
    const color = new Float32Array(vertexCount * 3);
    const _color = new THREE.Color();

    console.log(store.config.index);

    const indices = new Uint32Array(triangleFace.flat());
    for (let i = 0; i < vertexCount; i++) {
        const vertex = vertices[i];
        positions[i * 3] = vertex.x;
        positions[i * 3 + 1] = vertex.y;
        positions[i * 3 + 2] = vertex.z;

        if(store.config.index === 0 || store.config.index === 2) {
            if(colorArr[i] > 0) {
                _color.setRGB( 76 / 255, 110 / 255, 245 / 255, THREE.SRGBColorSpace );
                color[i * 3] = _color.r;
                color[i * 3 + 1] = _color.g;
                color[i * 3 + 2] = _color.b;
            } else {
                _color.setRGB( 240 / 255, 32 / 255, 32 / 255, THREE.SRGBColorSpace );
                color[i * 3] = _color.r;
                color[i * 3 + 1] = _color.g;
                color[i * 3 + 2] = _color.b;
            }
        } else if(store.config.index === 1) {
            if(store.config.m === 0) {
                if(colorArr[i] > 0) {
                    _color.setRGB( 218 / 255, 119 / 255, 242 / 255, THREE.SRGBColorSpace );
                    color[i * 3] = _color.r;
                    color[i * 3 + 1] = _color.g;
                    color[i * 3 + 2] = _color.b;
                } else {
                    _color.setRGB( 255 / 255, 167 / 255, 77 / 255, THREE.SRGBColorSpace );
                    color[i * 3] = _color.r;
                    color[i * 3 + 1] = _color.g;
                    color[i * 3 + 2] = _color.b;
                }
            } else {
                _color.setRGB( Math.abs(colorArr[i]), 1 - Math.abs(colorArr[i]), 1, THREE.SRGBColorSpace );
                color[i * 3] = _color.r;
                color[i * 3 + 1] = _color.g;
                color[i * 3 + 2] = _color.b;
            }
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(color, 3));

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    geometry.computeVertexNormals();
    const material = new THREE.MeshPhongMaterial( {
        color: 0xaaaaaa,
        vertexColors: true,
        flatShading: true,
        side: THREE.DoubleSide,
        transparent: store.config.l == 0 && store.config.index === 0,
        opacity: 0.4,
    } );
    const tempMesh = new THREE.Mesh( geometry, material );

    scene.add(tempMesh)
    mesh = tempMesh;
}

watch(() => store.config.surface, () => {
    let vertex = [];
    let face = [];
    let lines = store.config.surface.split("\n");
    vertex.push([0, 0, 0]);
    let max = 0;
    let index = 0;
    lines.forEach((line: any) => {
        if(line[0] == "v") {
            let v = line.split(" ");
            let v1 = Number(v[1]);
            let v2 = Number(v[2]);
            let v3 = Number(v[3]);
            let v4 = Number(v[4]);
            if(!isFinite(v1) || !isFinite(v2) || !isFinite(v3)) {
                vertex.push([0, 0, 0, 1]);
            } else {
                vertex.push([v1, v2, v3, v4]);
                max = Math.max(Math.max(max, v1), Math.max(v2, v3));
            }
        } else if(line[0] == "f") {
            let f = line.split(" ");
            face.push([Number(f[1]), Number(f[2]), Number(f[3])]);
        }
        index++;
    });

    camera.position.z = max + 10;
    setMesh(vertex, face);
});

watch(() => props, () => {
    camera.aspect = props.width / props.height;
    camera.updateProjectionMatrix();

    renderer.setSize( props.width, props.height );
    renderer.render( scene, camera );
}, {deep: true});
</script>

<style lang="scss" scoped>

</style>

