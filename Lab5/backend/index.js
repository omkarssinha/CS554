const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios')
const { v4: uuidv4, stringify } = require('uuid');

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


client.on('connect', function () {
    console.log('connected');
});

const typeDefs = gql` 
  type Query {
    unSplashImages(pageNum: Int!): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
    getTopTenBinnedPosts: [ImagePost]
  }

  type Mutation{
    uploadImage(url: String!, description: String, posterName: String): ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean, numBinned: Int) : ImagePost
    deleteImage(id: ID!): ImagePost
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
}`;


async function removeImage(index, image) {
    let image_obj = await client.LREMAsync("Image_List", index, image)
    return image_obj
}

async function binnedImages() {
    let redis_len = await client.LLENAsync("Image_List")
    image_list = await client.LRANGEAsync("Image_List", 0, redis_len)
    let binned_images = []
    image_list.map(image_obj => {
        js_obj = JSON.parse(image_obj)
        if (js_obj.binned == true) {
            binned_images.push(js_obj)
        }
    })
    return binned_images
}





function uploadImageToCache(args) {
    var image = {
        "id": args.id,
        "url": args.url,
        "posterName": args.posterName,
        "description": args.description,
        "userPosted": args.userPosted,
        "binned": !args.binned,
        "numBinned": args.numBinned
    }
    client.rpush("Image_List", JSON.stringify(image))
    return image
}



const resolvers = {
    Query: {
        async unSplashImages(parent, args, context, info) {
            const { data } = await axios.get(`https://api.unsplash.com/photos/?page=${args.pageNum};client_id=lHfyk2JBw9w_9Nt-Msm6biu5JjR0R5geNZ7foxY_M_E`)

            const response = data
            return response.map(async image => {
                var image = {
                    "id": uuidv4(),
                    "url": image.urls.regular,
                    "posterName": image.user.name,
                    "description": image.description || image.alt_description,
                    "numBinned": image.likes,
                    "userPosted": false,
                    "binned": false
                }
                let binImageList = await binnedImages();
                for (const binImg of binImageList) {
                    if(binImg.posterName == image.posterName && binImg.description == image.description && binImg.url==image.url)
                        image.binned = true;
                }



                return image
            })
        },
        async binnedImages() {
            let binned_images = []
            let redis_len = await client.LLENAsync("Image_List")
            image_list = await client.LRANGEAsync("Image_List", 0, redis_len)
            image_list.map(image_obj => {
                js_obj = JSON.parse(image_obj)
                if (js_obj.binned == true) {
                    binned_images.push(js_obj)
                }
            })
            return binned_images
        },

        async userPostedImages() {

            let redis_len = await client.LLENAsync("Image_List")
            image_list = await client.LRANGEAsync("Image_List", 0, redis_len)
            let binned_images = []
            image_list.map(image_obj => {
                js_obj = JSON.parse(image_obj)
                if (js_obj.userPosted == true) {
                    binned_images.push(js_obj)
                }
            })
            return binned_images

        },
        async getTopTenBinnedPosts() {
            let binImageList = await binnedImages();

            for (const binImg of binImageList) {
                await client.zaddAsync("sortedImages", binImg.numBinned.toString(), JSON.stringify(binImg))
            }

            let sortedImages = await client.zrevrangeAsync("sortedImages", 0, -1);
            await client.DELAsync("sortedImages")
            let binned_images = []
            let counter =0;
            sortedImages.forEach(image_obj => {
                js_obj = JSON.parse(image_obj)
                if(counter<10)
                {
                    binned_images.push(js_obj);
                    counter=counter+1;
                }
            })
            return binned_images
        }
    },
    Mutation: {
        async uploadImage(parent, args, context, info) {

            uui = uuidv4()
            var image = {
                "id": uui,
                "url": args.url,
                "posterName": args.posterName,
                "description": args.description,
                "numBinned": 0,
                "userPosted": true,
                "binned": false
            }


            client.rpush("Image_List", JSON.stringify(image))


            return image
        },
         async deleteImage(parent, args, context, info) {
            let redis_len = await client.LLENAsync("Image_List")
            image_list = await client.LRANGEAsync("Image_List", 0, redis_len)
            let index = 0
            let current_img = null
            image_list.map(image => {
                image = JSON.parse(image)
                if (image.id == args.id) {

                    current_img = image

                }
                index++
            })
            if (current_img) {
                await removeImage(0, JSON.stringify(current_img))
                return current_img
            }

            return current_img
        },
    
    async updateImage(parent, args, context, info) {
        let redis_len = await client.LLENAsync("Image_List")
        image_list = await client.LRANGEAsync("Image_List", 0, redis_len)
        let current_img = undefined
        image_list.map(image => {
            image = JSON.parse(image)
            if (image.id == args.id) {

                current_img = image

            }

        })

        if (current_img === undefined) {
            let image = uploadImageToCache(args)
            return image
        }
        else {
            removeImage(0, JSON.stringify(current_img))
            let image = uploadImageToCache(args)
            return image

        }
    }
}
};


const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
