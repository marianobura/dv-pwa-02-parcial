<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { StarIcon } from '@heroicons/vue/20/solid';
import router from '@/router';
import { addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { productfav } from '@/assets/firebase.js';

const route = useRoute();
const products = ref([]);
const isFavorite = ref(false);

const productsAPI = async () => {
    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        products.value = data.products;
    } catch (error) {
        console.error("Hubo un error:", error);
    }
};

const checkFavorite = async (productId) => {
    const querySnapshot = await getDocs(query(productfav, where('id', '==', productId)));
    isFavorite.value = !querySnapshot.empty;
};

onMounted(async () => {
    await productsAPI();
    if (product.value) {
        await checkFavorite(product.value.id);
    }
});

const product = computed(() => {
    return products.value.find((item) => item.sku == route.params.id);
});

const changeFavorite = async () => {
    if (!product.value) return;

    isFavorite.value = !isFavorite.value;
    
    try {
        if (isFavorite.value) {
            await addDoc(productfav, { id: product.value.id });
        } else {
            const querySnapshot = await getDocs(query(productfav, where('id', '==', product.value.id)));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }
    } catch (error) {
        console.error('Hubo un error:', error);
    }
};

const goBack = () => {
    router.back();
}
</script>


<template>
    <section v-if="product" class="text-gray-700 body-font overflow-hidden bg-white">
        <div class="container px-5 py-24 mx-auto">
            <div class="lg:w-4/5 mx-auto mb-5">
                <button type="button" @click="goBack()" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
                    <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>
                    <span>Volver atrás</span>
                </button>
            </div>
            <div class="lg:w-4/5 mx-auto flex flex-wrap">
                <img :alt="product.title" class="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200 max-h-500" :src="product.images[0]">
                <div class="flex flex-col justify-between lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                    <div>
                        <h2 class="text-sm title-font text-gray-500 tracking-widest">{{ product.brand }}</h2>
                        <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">{{ product.title }}</h1>
                        <div class="flex mb-4">
                            <span class="flex items-center">
                                <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[product.rating > rating ? 'text-gray-900' : 'text-gray-200', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                                <span class="text-gray-600 ml-3">{{ product.reviews.length }} Reviews</span>
                            </span>
                            <span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                                <p class="text-gray-600">{{ product.sku }}</p>
                            </span>
                        </div>
                        <p class="leading-relaxed">{{ product.description }}</p>
                    </div>
                    <div class="flex">
                        <span class="title-font font-medium text-2xl text-gray-900">${{ product.price }}</span>
                        <button @click="changeFavorite" :class="isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'" class="flex ml-auto rounded-full w-10 h-10 bg-gray-200 p-0 border-0 items-center justify-center text-gray-500">
                            <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                class="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
