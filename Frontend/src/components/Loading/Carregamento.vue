<script setup>
import { useCarregamentoStore } from '../../stores/Config/carregamento'; 

const carregamentoStore = useCarregamentoStore(); 

</script>

<template>
<!-- src/components/Loading/Carregamento.vue -->
    <div v-if="carregamentoStore.carregando" class="fixed top-0 left-0 h-screen w-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <img class="animate-bounce w-28" src="/logo.png"></img>
    </div>

</template>
