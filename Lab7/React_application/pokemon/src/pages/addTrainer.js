import { useState } from 'react';
import { useDispatch } from 'react-redux';
//import {connect} from 'react-redux'
import actions from '../actions';

function AddTrainer() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: ''});

  //console.log(formData.name);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const addTrainer = () => {
    //console.log(formData.name)

    if(formData.name !=""){
      //console.log("for loop");
    dispatch(actions.addTrainer(formData.name));
    document.getElementById('name').value = '';}
  };
  console.log(formData);
  
  return (
    <div className="add">
      <div className="input-selection">
        <label>
          Trainer:
          <input
            onChange={(e) => handleChange(e)}
            id="name"
            name="name"
            placeholder="Trainer name..."
          />
        </label>
      </div>
      <button onClick={addTrainer}>Add Trainer</button>
    </div>
  );
}

export default AddTrainer;