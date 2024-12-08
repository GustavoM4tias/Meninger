<script setup>
import { deletarEmpreendimento } from '../../services/useDeleteEmpreendimento' // ajuste o caminho conforme necessário

import { useFetchEmpreendimentos } from '../../services/useFetchEmpreendimentos' // fetch
const { empreendimentos, fetchEmpreendimentos, erro } = useFetchEmpreendimentos()// fetch de empreendimentos

import { useToast } from 'vue-toastification' // notificacoes maneiras
const toast = useToast()

// Defina as propriedades esperadas para o componente
const props = defineProps({
    empreendimento: {
        type: Object,
        required: true,
    },
    fetchEmpreendimentos: Function, // Define a prop para receber a função
})

const emit = defineEmits(['fecharModal'])

const excluirEmpreendimento = async () => {
    // Acesse a propriedade 'empreendimento' do props
    const empreendimento = props.empreendimento // Garanta que a variável está acessível

    // console.log('Excluindo empreendimento com ID:', empreendimento.id)

    if (!empreendimento || !empreendimento.id) {
        toast.error('Estamos com problemas, contate o seu suporte.') //Empreendimento não encontrado ou ID não disponível
        return // Adicione esta linha para prevenir execução se ID não estiver disponível
    }

    const idEmpreendimento = empreendimento.id // Certifique-se de que o ID está acessível na sua propriedade

    const resultado = await deletarEmpreendimento(idEmpreendimento)
    if (resultado.success) {
        // console.log('Empreendimento excluído com sucesso!', resultado.dados)
        toast.success(`Empreendimento ${empreendimento.nome} Excluído!`)
        emit('fecharModal') // Fecha o modal após a exclusão
        props.fetchEmpreendimentos()
    } else {
        toast.error('Erro ao excluir empreendimento:', resultado.error)
    }
}
</script>


<template>
    <div v-if="empreendimento"
        class="fixed inset-0 bg-black p-6 sm:p-0 bg-opacity-50 flex items-center justify-center z-50">

        <div class="bg-white h-4/5 md:w-8/12 w-11/12 rounded-xl mx-auto relative">

            <div class="content h-full grid grid-cols-1 lg:grid-cols-3">

                <div
                    class="img col-span-1 sm:col-span-2 relative rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none h-100 w-full h-full overflow-hidden">

                    <img :src="empreendimento.foto || '/empreendimento.jpg'" class="max-h-48 h-full sm:max-h-full w-full object-cover" />

                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-75">
                    </div>

                    <div class="absolute w-full h-full cursor-pointer m-5 top-0 left-0 text-white hover:text-gray-50">
                        <h2 class="text-3xl truncate md:text-4xl font-bold w-8/12 sm:w-12/12">{{ empreendimento.nome }}
                        </h2>

                        <p class="font-bold text-md md:text-lg mx-3 mt-0 sm:mt-1">{{ empreendimento.cidade }}</p>

                        <div class="absolute top-0 right-10 links">
                            <a :href="empreendimento.link_site1" target="_blank"
                                class="text-2xl font-bold truncate mr-3">
                                <i class="fa-solid hover:text-gray-200 duration-200 fa-share-from-square"
                                    data-tippy-content="Site"></i>
                            </a>
                            <a :href="empreendimento.link_site2" target="_blank" class="text-2xl font-bold truncate">
                                <i class="fa-solid hover:text-gray-200 duration-200 fa-chart-column"
                                    data-tippy-content="CV CRM"></i>
                            </a>
                        </div>

                        <div class="absolute bottom-10 left-0 precos tracking-tighter">
                            <p class="font-bold text-xl md:text-4xl mt-1 tracking-tighter">R$ {{ empreendimento.preco_m2
                                }}<span>m²</span></p>
                            <h2 class="text-3xl md:text-7xl font-bold tracking-tighter">R$ {{ empreendimento.preco_medio
                                }}</h2>
                        </div>
                    </div>

                </div>

                <div class="text flex flex-col py-4 px-4 md:px-6 relative">

                    <div class="flex absolute top-0 right-0 h-16 w-14" @click="$emit('fecharModal')">
                        <i class="fas fa-xmark text-2xl cursor-pointer m-auto text-gray-800 hover:text-gray-700 duration-200"
                            @click="$emit('fecharModal')"></i> <!-- Ajustar close pointer -->
                    </div>


                    <div x-data="{ isActive: false }" class="relative">
                        <div class="inline-flex items-center overflow-hidden">
                            <i x-on:click="isActive = !isActive"
                                class="fas fa-ellipsis-vertical text-2xl m-1.5 cursor-pointer text-gray-800 hover:text-gray-700 duration-200"></i>
                        </div>

                        <div class="absolute end-0 z-10 w-auto rounded-md border border-gray-100 bg-white shadow-lg"
                            role="menu" x-cloak x-transition x-show="isActive" x-on:click.away="isActive = false"
                            x-on:keydown.escape.window="isActive = false">
                            <div class="p-2">
                                <a class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem">
                                    <i class="fas text-xl fa-clock-rotate-left mr-1"></i>
                                    Ver Histórico
                                </a>
                                <a class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem">
                                    <i class="fas text-xl fa-pencil mr-1"></i>
                                    Editar Empreendimento
                                </a>
                                <!-- <a href="#"
                                    class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem">
                                    Duplicate Product
                                </a>
                                <a href="#"
                                    class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    role="menuitem">
                                    Unpublish Product
                                </a>  -->
                                <button @click="excluirEmpreendimento"
                                    class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    role="menuitem">
                                    <i class="far text-red-700 text-xl fa-trash-can mr-1"></i>
                                    Excluir Empreendimento
                                </button>
                            </div>
                        </div>
                    </div>









                    <div class="my-3 text-gray-800 text-center">
                        <label class="col-span-2 text-xl md:text-2xl font-bold">Detalhes</label>
                        <div class="detalhes grid grid-cols-2 gap-1 border border border-gray-100 rounded-lg p-2">
                            <p class="text-md text-center leading-4 sm:leading-3"><strong>Responsável:</strong> <br>
                                <span class="text-lg md:text-xl">{{ empreendimento.responsavel }}</span>
                            </p>
                            <p class="text-md text-center leading-4 sm:leading-3"><strong>Modelo:</strong> <br> <span
                                    class="text-md md:text-lg">{{ empreendimento.modelo }}</span> </p>
                            <p class="text-md text-center leading-4 sm:leading-3"><strong>Comissão Atual:</strong> <br>
                                <span class="text-md md:text-lg">{{ empreendimento.comissao }}</span>
                            </p>
                            <p class="text-md text-center leading-4 sm:leading-3"><strong>Qtd Unidades:</strong> <br>
                                <span class="text-md md:text-lg">{{ empreendimento.unidades }}</span>
                            </p>
                            <p class="text-md text-center leading-4 sm:leading-3"><strong>Lançamento:</strong> <br>
                                <span class="text-md md:text-lg">{{ empreendimento.data_lancamento }}</span>
                            </p>
                            <p class="text-md text-center leading-4 sm:leading-3"><strong>Entrega:</strong> <br> <span
                                    class="text-md md:text-lg">{{ empreendimento.previsao_entrega }}</span> </p>
                        </div>
                    </div>

                    

                    <!-- <div v-if="empreendimento.campanhas.length" class="mb-3">
                        <label class="text-lg font-bold text-gray-800">Campanhas</label>
                        <div class="border border border-gray-100 rounded-lg px-2 max-h-48 overflow-auto">
                            <div v-for="(campanha, index) in empreendimento.campanhas.sort((a, b) => new Date(b.data_fim) - new Date(a.data_fim))"
                                :key="index"
                                :class="{ 'bg-green-50': new Date(campanha.data_fim) >= new Date(), 'bg-red-50': new Date(campanha.data_fim) < new Date() }"
                                class="rounded bg-gray-100 px-1 pt-2 pb-1 my-2 relative shadow-sm">
                                <p class="autor font-bold absolute text-gray-700 top-0 p-0.5">De: {{ campanha.autor }}
                                </p>
                                <p class="campanha pt-4 px-2 text-sm text-gray-700">{{ campanha.descricao }}</p>
                                <span class="text-xs font-light text-gray-400 px-2">De {{
                                    campanha.data_inicio }} até {{ campanha.data_fim }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="empreendimento.comentarios.length" class="comentarios">

                        <label class="text-lg font-bold text-gray-800">Comentários</label>
                        <div class="border border border-gray-100 rounded-lg px-2 max-h-48 overflow-auto">

                            <div v-for="(comentario, index) in empreendimento.comentarios" :key="index"
                                class="rounded bg-gray-100 px-1 py-2 my-2 relative shadow-sm">
                                <p class="autor font-bold absolute text-gray-700 top-0 p-0.5">{{ comentario.autor
                                    }}<span class="publicacao text-xs font-light text-gray-400 px-1">- {{
                                        comentario.data_publicacao }}</span></p>

                                <p class="comentario pt-4 px-2 text-sm text-gray-700">{{ comentario.texto }}</p>
                            </div>

                        </div>
                    </div> -->

                    <!-- Botão de exclusão -->


                    <div class="flex mt-2 flex-wrap">
                        <span v-for="(tag, index) in empreendimento.tags" :key="index"
                            class="bg-gray-100 text-black hover:bg-gray-200 cursor-pointer duration-200 shadow px-3 py-1 m-1 rounded-full">
                            {{ tag }}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>