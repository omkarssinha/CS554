import React, {useState, useEffect} from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import Error from '../components/Error'
import store from '../store';
import actions from '../actions';
import {useSelector, useDispatch} from 'react-redux';

const Page = (props) =>{
      const {
        history,
        match: { params },
        location: { state },
      } = props;

      //console.log("Hi");
      //console.log(params);

      const dispatch = useDispatch();
      const allTrainer = useSelector((state) => state.trainers);

      const getURL = (url)=>{
        let len = url.length
        console.log(len);
        let urlModified = (url).substring(0,len-1);
        console.log(urlModified)
        return urlModified.substring(urlModified.lastIndexOf('/')+1)
    }

      store.subscribe(()=>{
          //console.log(store.getState());
      })

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

        let url = "/pokemon/page/"+params.pagenum;
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
      },[history,params.pagenum,store]);

      console.log(payload);

      const handleClick = (i) => history.push(`/pokemon/${i}`, { params: i });
      const handleClickPage = (i) => history.push(`/pokemon/page/${i}`, { params: i});

      if(payload.response=="Invalid Page no")
      return (<Error />)
    
      else if(payload.response=="Pokemon not found")
      return (<div>404 Not Found</div>)

      else{
        return (
        <div>
            {payload.error ? 'Error' : null}
            {payload.loading
                ? <div>Loading...</div>
            : <div>
                <div>
                <Header text="Pokemon List" />
                {params.pagenum!="1" &&
                <Button
                    isHoverBorder={true}
                    text="Prev"
                    onClick={()=>handleClickPage((parseInt(params.pagenum)-1))}
                />
                }
                {params.pagenum<56 &&
                <Button
                    isHoverBorder={true}
                    text="Next"
                    onClick={()=>handleClickPage(parseInt(params.pagenum)+1)}
                />
                }
                </div>
              
                {(payload.response.data.results).map(i => 
                    <React.Fragment>
                    <Card
                      onClick={() => handleClick(getURL(i.url))}
                      title={i.name}
                      img= {getURL(i.url)}
                    />
                    <Button
                      isHoverBorder={true}
                      text={checkStore(i.name)}
                      onClick={()=>handleClickCatchBtn(i.name,getURL(i.url),checkStore(i.name))}
                    />
                </React.Fragment>
                )}
                 
                
              </div>
            }        
        </div>
      )
      }

    }

export default Page;