import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Button from '../components/Button';
import Error from '../components/Error'
import actions from '../actions';
import store from '../store';
//import ApiCall from "../apiCall"

const PokemonDetails = (props) =>{
  const {
    history,
    match: { params },
    location: { state },
  } = props;

  console.log("Hi");
  console.log(params);
  const dispatch = useDispatch();
  const allTrainer = useSelector((state) => state.trainers);
  //let data = ApiCall(params.id)
  //console.log(data)
/*
  const [payload, setPayload] = useState(ApiCall(params.id));

  useEffect(()=> {
    setPayload(()=> ApiCall(params.id))
  },[])
  

  return (
    <div>
      <p> Hello!!!</p>
      <p> {payload.weight} </p>
    </div>
  )
*/
  const handleClickCatchBtn = (pokemon,no,text)=>{

    if(text==="Catch")
    {
        dispatch(actions.addPokemon(pokemon,no));
    }
    if(text==="Release")
    {
        dispatch(actions.releasePokemon(pokemon,no));
    }
  }

  const checkStore = (pokemon)=>{
        
    const state1 = store.getState();
    const state = [state1];
    //console.log(state)

    //console.log(allTrainer)
    let index = allTrainer.findIndex((x)=>(x.selected===true));
    //console.log(index)
    if(index === -1)
    return "No trainer selected";

    else{
    let noOfPokemon = allTrainer[index].pokemon.length;
    let isCaught=false;
    for(let i of allTrainer[index].pokemon )
    {
        if(pokemon === i)
        isCaught = true;
    }

    if(isCaught===true)
    return "Release";

    if(isCaught==false){
      if(noOfPokemon===6)
    return "Team full";
      else
    return "Catch";
    }
    } 
  }

  const [payload, setPayload] = useState({
    loading: true,
    response: null,
    error: null
  });

  useEffect(()=>{

    let url = "/pokemon/"+params.id;
    // make http request
    fetch(url)
    .then(res=>res.json())
    .then(response=>setPayload({
    loading: false,
    response,
    error:null
    }))
    .catch(error=>setPayload({
    loading: false,
    response: null,
    error
    }));
  },[]);

  console.log(payload.response)

  if(payload.response=="Invalid ID")
  return (<div>Invalid ID</div>)

  else if(payload.response=="Pokemon not found")
  return (<Error/>)

  else{
  return (<div>

    <Button isHoverBorder={true}
        text="Return"
        onClick={() => history.goBack()}
      />

  {payload.error ? 'Error' : null}
  {payload.loading
  ? <div>Loading...</div>
  : <div>The Pokemon is:
      <div>
        <p>  {payload.response.data.name} !!</p>
      </div>
      <div>
        <img src ={payload.response.data.sprites.other["official-artwork"].front_default} alt="No image is there" />
      </div>
      <div>
        Type(s):
        <div>{(payload.response.data.types).map(i =>(
        <li>
          {i.type.name}
        </li>
        ))
        }
        </div>
      </div>
      <div>
        <p> Weight: {payload.response.data.weight}</p>
      </div>
      <Button
        isHoverBorder={true}
        text={checkStore(payload.response.data.name)}
        onClick={()=>handleClickCatchBtn(payload.response.data.name,params.id,checkStore(payload.response.data.name))}
    />
    </div>
  }
  <p>button</p>
  </div>
)
}

}

export default PokemonDetails;

