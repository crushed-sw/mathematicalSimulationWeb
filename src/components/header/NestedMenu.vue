<template>
    <MegaMenu :model="items" class="h-full"></MegaMenu>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import MegaMenu from 'primevue/megamenu'
import { useRouter } from "vue-router"

const router = useRouter();
function clickRoute(event: any) {
    router.push(event.item.route);
}

const items = reactive([
        {
            label: "论坛",
            items: [
                [
                    {
                        items: [
                            {
                                label: '综合',
                                route: '/forum/forum',
                                command: clickRoute,
                            },
                            {
                                label: '数学',
                                route: '/forum/forum',
                                command: clickRoute,
                            },
                            {
                                label: '化学',
                                route: '/forum/forum',
                                command: clickRoute,
                            },
                            {
                                label: '物理',
                                route: '/forum/forum',
                                command: clickRoute,
                            },
                        ],
                    },
                ],
            ],
        },
        {
            label: "数学",
            items: [
                [
                    {
                        items: [
                            {
                                label: '几何',
                                route: '/math/geometry',
                                command: clickRoute,
                            },
                            {
                                label: '函数',
                                route: '/math/function',
                                command: clickRoute,
                            },
                            {
                                label: '三视图',
                                route: '/math/three_view',
                                command: clickRoute,
                            },
                            {
                                label: '计算',
                                route: '/math/calculate',
                                command: clickRoute,
                            }
                        ],
                    },
                ],
            ],
        },
        {
            label: "物理",
            items: [
                [
                    {
                        items: [
                            {
                                label: '力学',
                                route: '/physics/mechanics',
                                command: clickRoute,
                            },
                            {
                                label: '电学',
                                route: '/physics/electricity',
                                command: clickRoute,
                            },
                            {
                                label: '电磁学',
                                route: '/physics/electromagnetism',
                                command: clickRoute,
                            }
                        ],
                    },
                ],
            ],
        },
        {
            label: "化学",
            items: [
                [
                    {
                        items: [
                            {
                                label: '化学式配平',
                                route: '/chemical/chemical_formula_balance',
                                command: clickRoute,
                            },
                            {
                                label: '分子可视化',
                                route: '/chemical/material_visualization',
                                command: clickRoute,
                            },
                        ],
                    },
                ],
            ],
        },
        // {
        //     label: "论坛",
        //     item: [
        //         [
        //             {
        //                 items: [
        //                     {
        //                         label: '综合',
        //                         route: '/forum/forum',
        //                         command: clickRoute,
        //                     },
        //                     {
        //                         label: '数学',
        //                         route: '/forum/forum',
        //                         command: clickRoute,
        //                     }
        //                 ]
        //             }
        //         ]
        //     ],
        // }
]);
</script>

<style lang="scss" scoped>

</style>
