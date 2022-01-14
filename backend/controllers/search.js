const algoliasearch = require('algoliasearch');
const algoliaClient = algoliasearch('latency', '249078a3d4337a8231f1665ec5a44966');



const search = async (req, res) => {
    try{
        const { requests } = req.body;
        console.log(requests);
        const results = await algoliaClient.search(requests);
        res.status(200).send(results);
    }
    catch(e){
        res.send({error: e.message})
    }

};


module.exports = {
    search
};