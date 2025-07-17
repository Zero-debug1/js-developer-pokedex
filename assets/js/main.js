const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('pokemonModal')
const modalContent = document.getElementById('modalContent')
const closeModal = document.getElementById('closeModal')

const maxRecords = 151
const limit = 10
let offset = 0

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        // Adiciona evento de clique aos pokémons carregados
        document.querySelectorAll('.pokemon').forEach(poke => {
            poke.addEventListener('click', () => {
                const id = poke.getAttribute('data-id')
                const pokemon = pokemons.find(p => p.number == id)
                if (pokemon) {
                    showPokemonModal(pokemon)
                }
            })
        })
    })
}

function showPokemonModal(pokemon) {
    modalContent.innerHTML = `
        <span class="close" id="closeModal">&times;</span>
        <h2>#${pokemon.number} - ${pokemon.name}</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}" style="width:120px">
        <p>Tipo: ${pokemon.types.join(', ')}</p>
    `
    modal.style.display = 'block'

    // Re-atribuir evento ao novo botão fechar (porque o modalContent foi reescrito)
    const closeBtn = modalContent.querySelector('.close')
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'
    })
}

// Fecha modal ao clicar fora da área do conteúdo
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none'
    }
})

loadPokemonItems(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItems(offset, limit)
    }
})
