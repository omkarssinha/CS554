import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../actions';
import AddTrainer from './addTrainer';
import Header from '../components/Header';
import Card from '../components/Card';
//import store from '../store';

function Trainer(props) {
        const {
          history,
          match: { params },
          location: { state },
        } = props;
    //const allTrainer = useSelector((state) => state.todos);
    //console.log('allToDos', allTodos);

    /*store.subscribe(()=>{
        console.log(store.getState());
    })*/
    const dispatch = useDispatch();
    const allTrainer = useSelector((state) => state.trainers);

    return (
        <div>
            <Header text="Welcome trainers" />
            <div>
                <AddTrainer/>
            </div>
            <br/>
            <div>
            <div>
                List of Trainers::
                <div>{(allTrainer).map(i =>(
                    <li>
                        {i.name}
                        <button onClick ={() => i.selected? dispatch(actions.unselectTrainer(i.id)) : dispatch(actions.selectTrainer(i.id))}>{i.selected? "Unselect": "Select"} </button>
                        <button onClick ={() => dispatch(actions.deleteTrainer(i.id))}>Delete </button>
                        <br/>
                        {((i.pokemon).map(function (x, j) { 
                            return [x, i.poke_No[j]] 
                          })).map((poke) =>(
                            <Card
                                onClick={() => history.push(`/pokemon/${poke[1]}`)}
                                title={poke[0]}
                            />                          
                            ) 
                        )
                        }
                    </li>
                     ))
                    }
                </div>
          </div>
            </div>

        </div>
    )
}

export default Trainer;
