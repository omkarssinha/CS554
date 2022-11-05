import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import { gql, useMutation } from '@apollo/client';
import Home from './Home'
import NavBar from './NavBar'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Routes,
    Link
} from "react-router-dom";

function CreateNewPost({ open, handleClose }) {

    const [urlData, setUrl] = useState('')
    const [nameData, setNameData] = useState('')
    const [description, setDescription] = useState('')

    const new_post_query = gql`
        mutation uploadImage(
                $url: String!
                $description: String
                $posterName: String)
                {
                    uploadImage( url: $url, posterName: $posterName, description: $description){
                    id
                 }
             }`;
             
    const [createPost] = useMutation(new_post_query);

    const handleDescription = input => e => {

        setDescription({ [input]: e.target.value })
    }
    const handleUrlChange = input => e => {

        setUrl({ [input]: e.target.value })

    }
    const handleNameChange = input => e => {

        setNameData({ [input]: e.target.value })
    }
    const handleSubmit = (event) => {
        console.log(urlData)
        console.log(nameData)
        console.log(description)
        createPost({ variables: { url: urlData.urlData, description: description.description, posterName: nameData.nameData } })
        handleClose()
        
        return(
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        )
    }


    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create New Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add an image to your bin using an image url, description and your name
                    </DialogContentText>
                    <form>
                        <FormControl>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="Description"
                                label="Image Description"
                                type="text"
                                onChange={handleDescription('description')}
                                fullWidth
                            />
                        </FormControl>
                        <FormControl required validate>
                            <TextField
                                margin="dense"
                                id="url"
                                label="Image url"
                                type="url"
                                onChange={handleUrlChange('urlData')}
                                fullWidth

                            />
                        </FormControl>
                        <FormControl required={true} >
                            <TextField
                                margin="dense"
                                id="name"
                                label="Author Name"
                                type="text"
                                onChange={handleNameChange('nameData')}
                                fullWidth
                            />
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                
                        </Button>
                            <Button type="submit" onClick={handleSubmit} color="primary">
                                Create
                        </Button>
                        </DialogActions>
                    </form>


                </DialogContent>


            </Dialog>

        </div>
    )


}
export default CreateNewPost;    
