export default [
    {
        path: '/',
        redirect: '/math/function'
    },
    {
        path: '/math',
        children: [
            {
                path: '',
                redirect: '/math/function',
            },
            {
                path: 'geometry',
                component: () => import('../components/content/math/Geometry.vue'),
            },
            {
                path: 'function',
                component: () => import('../components/content/math/Function.vue'),
            },
            {
                path: 'three_view',
                component: () => import('../components/content/math/ThreeView.vue'),
            },
            {
                path: 'calculate',
                component: () => import('../components/content/math/Calculate.vue'),
            }
        ]
    },
    {
        path: '/physics',
        children: [
            {
                path: '',
                redirect: '/physics/mechanics',
            },
            {
                path: "mechanics",
                component: () => import("../components/content/physics/Mechanics.vue"),
            },
            {
                path: "electricity",
                component: () => import("../components/content/physics/Electricity.vue"),
            },
            {
                path: "electromagnetism",
                component: () => import("../components/content/physics/Electromagnetism.vue"),
            },
        ]
    },
    {
        path: '/chemical',
        children: [
            {
                path: '',
                redirect: '/chemical/material_visualization',
            },
            {
                path: "chemical_formula_balance",
                component: () => import("../components/content/chemical/ChemicalFormulaBalance.vue"),
            },
            {
                path: "material_visualization",
                component: () => import("../components/content/chemical/MaterialVisualization.vue"),
            },
        ]
    },
];

