<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { productfav } from '@/assets/firebase.js';

const router = useRouter();

const goToProductPage = (id) => {
    router.push({ name: 'Product', params: { id } });
};

const products = ref([]);

const productsAPI = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        products.value = data.products.map((product) => ({
            ...product,
            isFavorite: false,
        }));
    } catch (error) {
        console.error('Hubo un error:', error);
    }
};

onMounted(async () => {
    await productsAPI();
    try {
        const querySnapshot = await getDocs(productfav);
        const favID = querySnapshot.docs.map((doc) => doc.data().id);

        products.value.forEach(product => {
            product.isFavorite = favID.includes(product.id);
        });
    } catch (error) {
        console.error('Hubo un error:', error);
    }
});

const changeFavorite = async (product) => {
    product.isFavorite = !product.isFavorite;
    try {
        if (product.isFavorite) {
            await addDoc(productfav, {id: product.id});
        } else {
            const querySnapshot = await getDocs(query(productfav, where('id', '==', product.id)));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }
    } catch (error) {
        console.error('Hubo un error:', error);
    }
};
</script>

<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900">Catálogo de productos</h2>
            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                <div v-for="product in products" :key="product.id" class="group relative flex flex-col justify-between">
                    <div>
                        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                            <img @click="goToProductPage(product.sku)" :src="product.thumbnail" :alt="product.title" class="h-full w-full object-cover object-center lg:h-full lg:w-full hover:scale-105 transition-all hover:opacity-50 hover:cursor-pointer" />
                        </div>
                        <div class="mt-4 flex justify-between">
                            <div>
                                <h3 class="text-sm text-gray-700">{{ product.title }}</h3>
                                <p class="mt-1 text-sm text-gray-500">{{ product.brand || "Food" }} • {{ product.category }}</p>
                            </div>
                            <p class="text-sm font-medium text-gray-900">${{ product.price }}</p>
                        </div>
                    </div>
                    <div>
                        <button @click="changeFavorite(product)" :class="product.isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'" type="button" class="mt-2 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center me-2">
                            <svg v-if="!product.isFavorite" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star me-2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-star me-2">
                                <polygon fill="#FFF" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>{{ product.isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos" }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
