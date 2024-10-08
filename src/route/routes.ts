export default [
    {
        path: '/',
        redirect: '/forum/forum'
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
            {
                path: "digit_circuit",
                component: () => import("../components/content/physics/DigitCircuit.vue")
            },
            {
                path: "artificial_circuit",
                component: () => import("../components/content/physics/ArtificialCircuit.vue")
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
                path: "electron_cloud",
                component: () => import("../components/content/chemical/ElectronCloud.vue"),
            },
            {
                path: "material_visualization",
                component: () => import("../components/content/chemical/MaterialVisualization.vue"),
            },
        ]
    },
    {
        path: '/forum',
        children: [
            {
                path: '',
                redirect: '/forum/forum',
            },
            {
                path: "forum",
                component: () => import("../components/content/forum/Forum.vue"),
            },
            {
                path: "user",
                component: () => import("../components/content/forum/User.vue"),
            },
        ]
    },
    {
        path: "/article/:articleId",
        component: () => import("../components/content/forum/Article.vue"),
    },
    {
        path: "/user/:userId",
        component: () => import("../components/content/forum/OtherUser.vue"),
    }
];

