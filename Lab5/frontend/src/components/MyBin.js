import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { AddToBin } from './Home';


function GetBinnedImages(props) {
    const [updated, setupdated] = useState(false)
    const updateCalled = () => {
        setupdated({ updated: !updated })
        console.log('updateCalled')
    }
    useEffect(() => {

        refetch()

    }, [updated])


    const getImageQuery = gql`
    query{
        binnedImages{
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
        let imageData = data.binnedImages
        console.log(data)
        return (
                <div>
                {imageData.map((i) => (
                    <div className="Item-holder">
                        <img src={i.url} />
                        <h3>{i.posterName}</h3>
                        <p>{i.description}</p>
                        <AddToBin image1={i}></AddToBin>
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

function MyBin() {

    return (
        <div>
            <Container>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="primary" color="black">My Bin</Typography>

                        <Link color="inherit" href="/" color="black">Images</Link>

                        <Link color="inherit" href="/my-posts" color="black"> My Posts </Link>

                        <Link color="inherit" href="/popularity" color="black">Popularity</Link>
                    </Breadcrumbs>
                </div>
                <br/>
                <GetBinnedImages></GetBinnedImages>
            </Container>
        </div>
    )
}

export default MyBin
