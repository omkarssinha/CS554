const addTrainer= (name) =>({
    type: 'ADD_TRAINER',
    payload: {
        name: name
    }
});

const deleteTrainer= (id) =>({
    type: 'DELETE_TRAINER',
    payload: {
        id: id
    }
});

const selectTrainer= (id) =>({
    type: 'SELECT_TRAINER',
    payload: {
        id: id
    }
});

const unselectTrainer= (id) =>({
    type: 'UNSELECT_TRAINER',
    payload: {
        id: id
    }
});

const addPokemon= (name,no) =>({
    type: 'ADD_POKEMON',
    payload: {
        name: name,
        no: no
    }
});

const releasePokemon= (name,no) =>({
    type: 'RELEASE_POKEMON',
    payload: {
        name: name,
        no: no
    }
});

module.exports = {
    addTrainer, deleteTrainer, selectTrainer, unselectTrainer, addPokemon, releasePokemon
};