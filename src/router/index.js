import { createRouter, createWebHistory } from 'vue-router';
import ProductDetail from '../components/ProductDetail.vue';
import OrderList from '../components/OrderList.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'ProductDetail',
            component: ProductDetail,
        },
        {
            path: '/order-list',
            name: 'OrderList',
            component: OrderList,
        },
    ],
});

export default router;
