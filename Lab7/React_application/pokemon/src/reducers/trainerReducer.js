import {v4 as uuid} from 'uuid';

//const initialState = [{}];
let copyState = null;
let index = 0;

const trainerReducer = (state = [], action) => {
    const{ type, payload } = action;

    switch(type)
    {
        case 'ADD_TRAINER':
            if(payload.name!="")
            return [...state, {id: uuid(), name: payload.name, pokemon: [], poke_No: [], selected: false }]
        case 'DELETE_TRAINER':
            copyState = [ ...state ];
            index = copyState.findIndex((x)=>(x.id === payload.id));
            console.log("Hi from delete trainer")
            copyState.splice(index, 1);
            return [...copyState]
        case 'SELECT_TRAINER':
            copyState = [ ...state ];
            index = copyState.findIndex((x)=>(x.id === payload.id));
            console.log(index)
            let alreadySelected=false
            for(let i of copyState)
            {
                console.log(i);
                if(i.selected==true)
                alreadySelected=true
            }
            if(alreadySelected===false)
            copyState[index].selected=true;
            return [...copyState]
        case 'UNSELECT_TRAINER':
            copyState = [ ...state ];
            index = copyState.findIndex((x)=>(x.id === payload.id));
            copyState[index].selected=false;
            return [...copyState];
        case 'ADD_POKEMON':
            copyState = [ ...state ];

            let index1 =""
            for(let i of copyState)
            {
                if(i.selected==true)
                index1= i.id;
            }
            let i = copyState.findIndex((x)=>(x.id === index1));
            console.log("cetch pokemon",i)
            copyState[i].pokemon.push(payload.name);
            copyState[i].poke_No.push(payload.no);
            return [...copyState] 
        case 'RELEASE_POKEMON':
            copyState = [ ...state ];

            console.log(copyState)

            let index2 =""
            for(let i0 of copyState)
            {

                if(i0.selected===true)
                index2= i0.id;
            }
            console.log("Relaese pokemon",index2)
            let i2 = copyState.findIndex((x)=>(x.id === index2));
            console.log("Relaese pokemon",i2)

            for( let i =0;i<copyState[i2].pokemon.length;i++)
            {
                if(copyState[i2].pokemon[i]===payload.name)
                {
                    console.log(payload.name)
                    copyState[i2].pokemon.splice(i,1);
                    copyState[i2].poke_No.splice(i,1)
                }
            }
            return [...copyState];
        default:
            return state;

    }
};

export default trainerReducer;