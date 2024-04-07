<template>
    <div ref="container">
    </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted } from "vue"
import { useThreeViewStore, pointConfig } from "@/stores/threeViewStore.ts"
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Worker from '@/worker/threeView.ts?worker'

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

const store = useThreeViewStore()
let mesh: any = undefined;

watch([
    () => store.fontPointList,
    () => store.leftPointList,
    () => store.topPointList,
    () => store.fontLineList,
    () => store.leftLineList,
    () => store.topLineList,
    () => store.fontDashList,
    () => store.leftDashList,
    () => store.topDashList,
], (value: any) => {
    const work = new Worker();
    work.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        const points = solvePoints(data[0]);
        setMesh(points, data[1], data[2]);
        console.log(data);
    };
    work.postMessage(JSON.stringify(value));
}, {deep: true});

function solvePoints(pointList: any[]) {
    const len = props.width / 2;

    const points: any[] = [];
    pointList.forEach((point: any) => {
        points.push({
            x: point.x - len,
            y: point.y - len,
            z: len - point.z,
        });
    });

    return points;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, props.width / props.height, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias:true });
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window );
controls.enableDamping = true;

renderer.setSize( props.width, props.height );
renderer.setClearColor(0xffffff, 1);

function setMesh(points: any[], lines: number[][], triangleFace: number[][]) {
    if(mesh) {
        scene.remove(mesh);
    }

    const geometry = new THREE.BufferGeometry()
    const vertices: THREE.Vector3[] = [];
    points.forEach((point: any) => {
        vertices.push(new THREE.Vector3(point.x, point.y, point.z));
    });
    const vertexCount = vertices.length;
    const positions = new Float32Array(vertexCount * 3);

    const indices = new Uint32Array(triangleFace.flat());
    for (let i = 0; i < vertexCount; i++) {
        const vertex = vertices[i];
        positions[i * 3] = vertex.x;
        positions[i * 3 + 1] = vertex.y;
        positions[i * 3 + 2] = vertex.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    geometry.computeVertexNormals();
    const material = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, flatShading: true, side: THREE.DoubleSide } );
    const tempMesh = new THREE.Mesh( geometry, material );

    scene.add(tempMesh);
    mesh = tempMesh;
}

const container = ref();
onMounted(() => {
    container.value.appendChild(renderer.domElement);

    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 )
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0x888888, 3 );
    dirLight2.position.set( -1, -1, -1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0x555555 );
    scene.add( ambientLight );

    camera.position.z = 700;

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
    }

    animate();
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
