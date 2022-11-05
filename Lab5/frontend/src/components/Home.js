import React, { useState, useEffect} from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';


function AddToBin({ image1, updateCalled }) {

    const bin_it_query = gql`
        mutation updateImage($id: ID!
                $url: String
                $posterName: String
                $description: String
                $userPosted: Boolean
                $binned: Boolean
                $numBinned: Int){
                    updateImage( id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned, numBinned: $numBinned ){
                         
                        id
                        url
                        posterName
                        description
                        userPosted
                        binned
                        numBinned
                    }           
             }`;

    const [binIt] = useMutation(bin_it_query);

    const run_query = () => {
        binIt({ variables: { id: image1.id, url: image1.url, posterName: image1.posterName, description: image1.description, userPosted: image1.userPosted, binned: image1.binned, numBinned: image1.numBinned + 1} });
        if (updateCalled !== undefined) { updateCalled() }
    }

    if (image1.binned == false) {
        return (
            <div>
                <Button color="secondary" onClick={run_query}>Add to Bin</Button>
            </div>
        )
    }
    else {
        return (

            <div>
                <Button color="secondary" onClick={run_query}>Remove from Bin</Button>
            </div>
        )
    }
}

function ListImages(props) {
    const [pageNum, setPageNum] = useState(1)
    const getImageQuery = gql`
    query{
        unSplashImages(pageNum: ${pageNum}){
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;
    useEffect(() => { }, [pageNum])


    const { loading, error, data } = useQuery(getImageQuery);

    if (loading) {
        return (<p>Loading</p>)
    }
    else if (error) {
        <p> System encountered an error </p>
    }

    else if (data)
    {
        let imageData = data.unSplashImages
        return (
            <div>
                {imageData.map((i) => (
                    <div className="Item-holder">
                        <img src ={i.url} style={{width: 1000, height: 1000}} />
                        <h3>{i.posterName}</h3>
                        <p>{i.description}</p>
                        <AddToBin image1={i}></AddToBin>
                        <br/>
                        <br/>
                    </div>
                ))}
                <Button onClick={() => setPageNum(pageNum + 1)} >Load More</Button>   
            </div>
        )}
    else {
        return null
    }
}

function Home(props) {
    return (<div>
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/my-bin" color="black" > My Bin </Link>

                    <Typography color="primary" color="black">Images</Typography>

                    <Link color="inherit" href="/my-posts" color="black"> My Posts</Link>

                    <Link color="inherit" href="/popularity" color="black">Popularity</Link>
                </Breadcrumbs>
            </div>
            <br/>
            {ListImages()}
        </Container>
    </div>);
}

export {AddToBin}
export default Home;