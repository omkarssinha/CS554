import React, { useState,useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import { Badge, Typography } from '@material-ui/core'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { AddToBin } from './Home'
import { SubscriptionsOutlined } from '@material-ui/icons';


function GetPopularImages(props) {
    const [updateF, setUpdateF] = useState(false)
    const updateCalled = () => {
        setUpdateF({ updateF: !updateF })
        console.log('updateCalled')
    }
    useEffect(() => {

        refetch()

    }, [updateF])


    
    const getImageQuery = gql`
    query{
        getTopTenBinnedPosts{
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
        let imageData = data.getTopTenBinnedPosts
        let sum =0
        //console.log(typeof(sum))
        let mainstream=""
        let totalLikes = imageData.map((i) =>
        ( 
            console.log("i="+i.numBinned),
            sum = sum + parseInt(i.numBinned) , 
            console.log("sum="+sum)
        ));
        if(sum>200) 
            mainstream ="Mainstream";
        else 
            mainstream ="Not Mainstream"

        console.log(data)
        return (
                <div>
                    <p> Total Likes = {sum} hence {mainstream}</p>
                    {imageData.map((i) => (
                        <div className="Item-holder">
                            <img src={i.url} />
                            <h3>{i.posterName}</h3>
                            <p>{i.description}</p>
                            <Badge badgeContent={i.numBinned} color="primary">
                                <Typography variant="button">No of Likes</Typography>
                            </Badge>
                            <AddToBin updateCalled={updateCalled} image1={i}></AddToBin>
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
function Popularity() {

    return (
        <div>
            <Container>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>

                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" href="/my-bin" color="black" >My Bin</Link>

                        <Link color="inherit" href="/" color="black">Images</Link>

                        <Link color="inherit" href="/my-posts" color="black" > My Posts</Link>

                        <Typography color="primary" color="black">Popularity</Typography>
                    </Breadcrumbs>
                </div>
                <br/>
                <GetPopularImages></GetPopularImages>
            </Container>
        </div>
    )}

export default Popularity
