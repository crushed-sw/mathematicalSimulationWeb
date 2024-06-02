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

function setMesh(points: number[][]) {
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

    const material = new THREE.MeshPhongMaterial( {
        vertexColors: true,
        transparent: store.config.l == 0 && store.config.index === 0,
    } );
    const tempMesh = new THREE.Points( geometry, material );

    scene.add(tempMesh)
    mesh = tempMesh;
}

watch(() => store.config.points, () => {
    let pointArr: number[][] = [];
    let points = store.config.points.split("\n");
    console.log(points);

    points.forEach((line: any) => {
        let point = line.split("\t");
        // let p0 = isFinite(Number(point[0])) ? Number(point[0]) : 0;
        // let p1 = isFinite(Number(point[1])) ? Number(point[1]) : 0;
        // let p2 = isFinite(Number(point[2])) ? Number(point[2]) : 0;
        // let p3 = isFinite(Number(point[3])) ? Number(point[3]) : 0;
        pointArr.push([Number(point[0]), Number(point[1]),  Number(point[2]), Number(point[3])]);
    });

    console.log(pointArr);
    setMesh(pointArr);
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

