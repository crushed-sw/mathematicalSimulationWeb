import { defineStore } from "pinia";
import Konva from "konva"

const useKonvaStore = defineStore("konvaStore", () => {
    let stage: Konva.Stage;
    const layer = new Konva.Layer();

    function init(container: any) {
        stage = new Konva.Stage({
            container: container,
            width: window.innerWidth,
            height: window.innerHeight
        });
        stage.add(layer);
    }

    function getStage() {
        return stage;
    }

    function add(shape: Konva.Shape, id: string) {
        remove(id);
        shape.attrs.id = id;

        layer.add(shape);
    }

    function remove(id: string) {
        const objects = layer.find(`#${id}`);
        objects.forEach((object: Konva.Node) => {
            object.remove();
        });
    }

    function resize(width: number, height: number) {
        stage.width(width);
        stage.height(height);
    }

    return {
        layer,

        init,
        add,
        remove,
        getStage,
        resize,
    }

    // const scene = new Scene();

    // const camera = new OrthographicCamera(-width, width, height, -height, 1, 1000);
    // camera.position.z = 100;

    // const renderer = new WebGLRenderer({
    //     antialias: true
    // });
    // renderer.setClearColor(0xffffff);
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);

    // function add(object: Object3D, id: string, dx: number = 0, dy: number = 0, dz: number = 0) {
    //     remove(id);

    //     object.position.x = dx;
    //     object.position.y = dy;
    //     object.position.z = dz;
    //     objectMap.set(id, object);
    //     scene.add(object);
    // }

    // function remove(id: string, isdelete: boolean = true) {
    //     if(objectMap.has(id)) {
    //         const object = objectMap.get(id);
    //         scene.remove(object);

    //         if(isdelete) {
    //             objectMap.delete(id);
    //         }
    //     }
    // }

    // function resize(width: number, height: number) {
    //     camera.left = width / -2;
    //     camera.right = width / 2;
    //     camera.top = height / -2;
    //     camera.bottom = height / 2;

    //     camera.aspect = width / height;
    //     camera.updateProjectionMatrix();

    //     renderer.setSize(width, height);
    // }

    // function update() {
    //     renderer.render(scene, camera);
    // }

    // function getDom() {
    //     return renderer.domElement;
    // }

    // function getObject(id: string) {
    //     return objectMap.get(id);
    // }

    // return {
    //     scene,
    //     camera,
    //     renderer,
    //     objectMap,

    //     update,
    //     getDom,
    //     add,
    //     remove,
    //     resize,
    //     getObject,
    // }
});

export { useKonvaStore };
