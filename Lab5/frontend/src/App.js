import React, { Component,useState } from 'react'
import './App.css';
import Home from './components/Home'
import MyPosts from './components/MyPosts'
import CreateNewPost from './components/CreateNewPost'
import MyBin from './components/MyBin'
import Popularity from './components/Populartiy';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import NavBar from './components/NavBar'
import Button from '@material-ui/core/Button';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Routes,
    Link
} from "react-router-dom";


const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
});

class App extends Component {

    constructor(props){
        super(props);
        this.state = {open: true};
        console.log(this.state.open)

        //this.handleClose = this.handleClose.bind(this)
        };
    
    render() {
        return (
            
            <Router>
                <ApolloProvider client={client}>
                    {<NavBar></NavBar>}
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/popularity">
                            <Popularity/>
                        </Route>
                        <Route path="/my-bin">
                            <MyBin/>
                        </Route>
                        <Route path="/my-posts">
                            <MyPosts/>
                        </Route>
                        <Route path="/new-post">
                            <Button onClick={true}>Add New Post</Button>
                            <CreateNewPost open={this.state.open} handleClose={true} ></CreateNewPost>
                        </Route>
                    </Switch>
                </ApolloProvider>
            </Router>
        )
    }
}

export default App;
