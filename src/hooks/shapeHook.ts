import { watch } from "vue";

const shapeBasicUtil: object = {
    index: {
        type: Number,
        default: 0,
    },
    isMask: {
        type: Boolean,
        default: false,
    },
    customId: {
        type: Number,
        default: -1,
    },
    isChecked: {
        type: Boolean,
        default: false,
    },
    dash: {
        type: Array<Number>,
        default: [],
    },
    draggable: {
        type: Boolean,
        default: false,
    },
    fill: {
        type: String,
        default: "black",
    },
    mask: {
        type: String,
        default: "red"
    },
    maskWidth: {
        type: Number,
        default: 2
    },
    stroke: {
        type: String,
        default: "black",
    },
    strokeWidth: {
        type: Number,
        default: 2
    },
    hitStrokeWidth: {
        type: Number,
        default: 6,
    },
    shadowColor: {
        type: String,
        default: ''
    },
    shadowOffset: {
        type: Object,
        default: {}
    },
    shadowBlur: {
        type: Number,
        default: 0
    },
    shadowOpacity: {
        type: Number,
        default: 1,
    },
    visible: {
        type: Boolean,
        default: true,
    },
    scale: {
        type: Object,
        default: {},
    },
    scaleX: {
        type: Number,
        default: 1,
    },
    scaleY: {
        type: Number,
        default: 1,
    },
    rotation: {
        type: Number,
        default: 0,
    },
    offset: {
        type: Object,
        default: {},
    },
    offsetX: {
        type: Number,
        default: 0,
    },
    offsetY: {
        type: Number,
        default: 0,
    },
};

const preConfigs: object = {
    mousePosition: [],
    groupPosition: [],
    preContainer: null,
}

function addDefaultEvent(groupNode: any, maskConfig: any, groupConfig: any, preConfig: any) {
    watch(() => groupConfig.isChecked, () => {
        maskConfig.visible = groupConfig.isChecked;
    });

    groupNode.on("click", () => {
        if(groupNode.choosable) {
            groupConfig.isChecked = !groupConfig.isChecked;
        }
    });

    groupNode.on("mouseenter", () => {
        document.documentElement.style.cursor = "pointer";
    });

    groupNode.on("mouseleave", () => {
        document.documentElement.style.cursor = "default";
    });

    groupNode.on("dragstart", (event: any) => {
        maskConfig.visible = true;

        preConfig.mousePosition = [event.evt.layerX, event.evt.layerY];
        preConfig.groupPosition = [groupConfig.x, groupConfig.y];
        preConfig.preContainer = event.evt.target;
    });

    groupNode.on("dragmove", (event: any) => {
        if(event.evt.target !== preConfig.preContainer) {
            groupConfig.draggable = false;
        } else {
            preConfig.mousePosition = [event.evt.layerX, event.evt.layerY];
        }
    });

    groupNode.on("dragend", (event: any) => {
        maskConfig.visible = false;

        if(groupConfig.draggable) {
            groupConfig.x = event.evt.layerX - preConfig.mousePosition[0] + preConfig.groupPosition[0];
            groupConfig.y = event.evt.layerY - preConfig.mousePosition[1] + preConfig.groupPosition[1];
            preConfig.mousePosition = [event.evt.layerX, event.evt.layerY];
            preConfig.groupPosition = [groupConfig.x, groupConfig.y];
        } else {
            groupConfig.draggable = true;
        }
    });
}

export { shapeBasicUtil, preConfigs, addDefaultEvent };
