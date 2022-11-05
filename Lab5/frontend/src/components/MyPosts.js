import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import { useQuery, gql, useMutation} from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { AddToBin } from './Home'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';

function RemovePost({ image1, deleteCalled }) {

    const delete_image_query = gql`
        mutation deleteImage($id: ID!){
                    deleteImage(id: $id){
                        id
                    }
             }
    `;

    const [delete_image] = useMutation(delete_image_query);
    const run_query = () => {
        delete_image({ variables: { id: image1.id } })
        deleteCalled()

    }
    return (

        <div>
            <Button type="submit" color="secondary" onClick={run_query}>Remove Post</Button>
        </div>
    )
}


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
                                Cancel
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

function GetPostedImages(props) {
    const [deleteF, setDeleteF] = useState(false)

    const deleteCalled = () => {
        setDeleteF({ deleteF: !deleteF })
        console.log('deleteCalled')
    }

    useEffect(() => {

        refetch()

    }, [deleteF])

    const getImageQuery = gql`
    query{
       userPostedImages{
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }`;

    const { loading, error, data, refetch } = useQuery(getImageQuery);


    if (loading) {
        return (<p>Loading</p>)
    }
    else if (error) {
        <div>
            <p>
                System encountered an error
            </p>
        </div>
    }

    else if (data) {
        let imageData = data.userPostedImages
        console.log(data)
        return ( 
            <div>
                {imageData.map((i) => (
                    <div className="Item-holder">
                        <img src={i.url} />
                        <h3>{i.posterName}</h3>
                        <p>{i.description}</p>
                        <AddToBin image1={i}></AddToBin>
                        <RemovePost deleteCalled={deleteCalled} image1={i}></RemovePost>
                        <br/>
                        <br/>
                    </div>
                ))}
            </div>
        )}
    else {
        return null
    }
}

function MyPosts() {
    
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Container>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" href="/my-bin" color="black">My Bin </Link>

                        <Link color="inherit" href="/" color="black"> Images </Link>

                        <Typography color="primary" color="black">My Posts</Typography>

                        <Link color="inherit" href="/popularity" color="black">Popularity</Link>
                    </Breadcrumbs>
               </div>
                <Button onClick={handleClickOpen}>Add New Post</Button>
                <CreateNewPost open={open} handleClose={handleClose} ></CreateNewPost>
                <br/>
                <GetPostedImages></GetPostedImages>
            </Container>
        </div>
    )
}

//export {CreateNewPost}
export default MyPosts
