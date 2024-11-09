const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = 4500;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ashokiow24680:riyanit@cluster0.aa4yj.mongodb.net/charttea?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const Userschema = new mongoose.Schema({
    end_year: {
      type: mongoose.Schema.Types.Mixed,
    },
    intensity: { 
      type: Number,
      
    },
    sector :{
      type:String,
    
     
  
    },
    topic: {
      type: String,
  },
  insight: {
    type: String,
},
url :{
type:String,
},
region:{
    type:String,
},
start_year:{
    type:mongoose.Schema.Types.Mixed,
},
impact:{
    type:mongoose.Schema.Types.Mixed,
},
added:{
    type:String,
},
published:{
    type:String,
},
country:{
    type:String,
}
,
relevance:{
    type:Number,
},
pestle:{
    type:String,
},
source:{
    type:String,
}
,
title:{
    type:String,
},
likelihood:{
    type:Number,
}

  },{ collection: 'charts' });
const Data = mongoose.model('json', Userschema);
app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "Front-end", "build")));
    res.sendFile(path.resolve(__dirname, "Front-end", "build", "index.html"));
    });
  
  app.get("/", (req, res) => {
      app.use(express.static(path.resolve(__dirname, "Front-end", "build")));
      res.sendFile(path.resolve(__dirname, "Front-end", "build", "index.html"));
      });
  

app.get('/',async (req,res)=>{

    const data = await Data.find({});
    res.json(data);
    

})

app.post('/intensity/:option', async (req, res) => {
    const { option } = req.params;
    const { inputValue  } = req.body; 

    try {
        let data;
        switch (option) {
            case 'endYear':
                data = await Data.aggregate([
                    { $match: { end_year: parseInt(inputValue) } },
                    { $group: { _id: "$intensity", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $project: { intensity: "$_id", count: 1, _id: 0 } }
                ]);
                break;
            case 'region':
                data = await Data.aggregate([
                    { $match: { region:  inputValue  } },
                    { $group: { _id: "$intensity", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $project: { intensity: "$_id", count: 1, _id: 0 } }
                ]);
                break;
            case 'sector':
                data = await Data.aggregate([
                    { $match: { sector:  inputValue  } },
                    { $group: { _id: "$intensity", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $project: { intensity: "$_id", count: 1, _id: 0 } }
                ]);
                break;
            case 'topic':
                data = await Data.aggregate([
                { $match: { topic:  inputValue  } },
                { $group: { _id: "$intensity", count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
                { $project: { intensity: "$_id", count: 1, _id: 0 } }
                ]);
            break;
            case 'country':
                data = await Data.aggregate([
                { $match: { country:  inputValue  } },
                { $group: { _id: "$intensity", count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
                { $project: { intensity: "$_id", count: 1, _id: 0 } }
                ]);
            break;
            case 'pest':
                data = await Data.aggregate([
                    { $match: { pestle:  inputValue  } },
                    { $group: { _id: "$intensity", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                    { $project: { intensity: "$_id", count: 1, _id: 0 } }
                  
                ]);
                break;            
            default:
                res.status(400).send('Invalid option');
                return;
        }
       
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/country', async (req, res) => {
    const { country } = req.body;
    
    try {
      const data = await Data.find({ country });
  
      const regionData = data.reduce((acc, item) => {
        acc[item.region] = (acc[item.region] || 0) + 1;
        return acc;
      }, {});
  
      const sectorData = data.reduce((acc, item) => {
        acc[item.sector] = (acc[item.sector] || 0) + 1;
        return acc;
      }, {});
  
      const topicData = data.reduce((acc, item) => {
        acc[item.topic] = (acc[item.topic] || 0) + 1;
        return acc;
      }, {});

      const pestData = data.reduce((acc, item) => {
        acc[item.pestle] = (acc[item.pestle] || 0) + 1;
        return acc;
    }, {});
  
      res.json({
        region: Object.keys(regionData).map(key => ({ name: key, value: regionData[key] })),
        sector: Object.keys(sectorData).map(key => ({ name: key, value: sectorData[key] })),
        topic: Object.keys(topicData).map(key => ({ name: key, value: topicData[key] })),
        pest: Object.keys(pestData).map(key => ({ name: key, value: pestData[key] })),
   
    });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/intensityoverall', async (req, res) => {
    try {
        const intensities = await Data.aggregate([
            { $group: { _id: "$intensity", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { intensity: "$_id", count: 1, _id: 0 } }
        ]);
        console.log(intensities)
        res.json(intensities);
    } catch (error) {
        console.error('Error fetching intensity data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/relevance_likelihood', async (req, res) => {
    const { option, inputValue } = req.body;

    try {
        let matchCondition = {};
        if (option === 'sector') {
            matchCondition = { sector: inputValue };
        } else if (option === 'topic') {
            matchCondition = { topic: inputValue };
        } else if (option === 'source') {
            matchCondition = { source: inputValue };
        } else if (option === 'end_year') {
            matchCondition = { end_year: parseInt(inputValue) };
        }  else {
            return res.status(400).send('Invalid option');
        }

        const relevanceData = await Data.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$relevance",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    relevance: "$_id",
                    count: 1
                }
            },
            {
                $sort: { relevance: 1 }
            }
        ]);

        const likelihoodData = await Data.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$likelihood",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    likelihood: "$_id",
                    count: 1
                }
            },
            {
                $sort: { likelihood: 1 }
            }
        ]);
        console.log({ relevance: relevanceData, likelihood: likelihoodData });
        res.json({ relevance: relevanceData, likelihood: likelihoodData });
    } catch (error) {
        console.error('Error fetching relevance and likelihood data:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/totalcountry/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const totalCount = await Data.countDocuments({ country: name });
        res.json({ total: totalCount });
    } catch (error) {
        console.error('Error counting total by country:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/start_end_year', async (req, res) => {
    const { filterType, filterValue } = req.body;
  
    const matchConditions = {};
  
    if (filterType && filterValue) {
      matchConditions[filterType] = filterValue;
    }
  
    try {
      const startYearData = await Data.aggregate([
        { $match: { ...matchConditions, start_year: { $ne: null } } },
        { $group: { _id: "$start_year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { sy: "$_id", count: 1, _id: 0 } }
      ]);
  
      const endYearData = await Data.aggregate([
        { $match: { ...matchConditions, end_year: { $ne: null } } },
        { $group: { _id: "$end_year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { ey: "$_id", count: 1, _id: 0 } }
      ]);
  
      res.json({ start_year: startYearData, end_year: endYearData });
    } catch (error) {
      console.error('Error fetching start and end year data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/topic', async (req, res) => {
    const { topic, options } = req.body;

    try {
        let groupField;
        switch (options) {
            case 'endyear':
                groupField = "$end_year";
                break;
            case 'region':
                groupField = "$region";
                break;
            case 'sector':
                groupField = "$sector";
                break;
            case 'country':
                groupField = "$country";
                break;
            case 'pest':
                groupField = "$pestle";
                break;
            case 'source':
                groupField = "$source";
                break;
            case 'region':
                groupField = "$region";
                break;        
            default:
                return res.status(400).send('Invalid option');
        }

        const data = await Data.aggregate([
            { $match: { topic: topic } },
            { $group: { _id: groupField, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { name: "$_id", count: 1, _id: 0 } }
        ]);

        res.json(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/region', async (req, res) => {
    const { topic, options } = req.body;

    try {
        let groupField;
        switch (options) {
            case 'endyear':
                groupField = "$end_year";
                break;
            case 'sector':
                groupField = "$sector";
                break;
            case 'pest':
                groupField = "$pestle";
                break;
            case 'source':
                groupField = "$source";
                break;
            case 'topic':
                groupField = "$topic";
                break;      
            default:
                return res.status(400).send('Invalid option');
        }

        const data = await Data.aggregate([
            { $match: { region : topic  } },
            { $group: { _id: groupField, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { name: "$_id", count: 1, _id: 0 } }
        ]);

        res.json(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
  });


  app.post('/datecount', async (req, res) => {
    const { inputMonth, dateType } = req.body;

    if (!inputMonth || !dateType) {
        return res.status(400).send('Invalid input');
    }

    try {
        const data = await Data.aggregate([
            {
                $project: {
                    month: {
                        $substr: [
                            `$${dateType}`,
                            0,
                            { $indexOfBytes: [`$${dateType}`, ','] }
                        ]
                    }
                }
            },
            {
                $match: {
                    month: inputMonth
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(data.length > 0 ? data[0].count : 0);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
})


app.post('/articlecounts', async (req, res) => {
    const { dateType } = req.body;

    if (!dateType) {
        return res.status(400).send('Invalid input');
    }

    try {
        const data = await Data.aggregate([
            {
                $project: {
                    month: {
                        $substr: [
                            `$${dateType}`,
                            0,
                            { $indexOfBytes: [`$${dateType}`, ','] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$month",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const countByMonth = data.map(item => ({
            name: item._id,
            count: item.count
        }));

        res.json(countByMonth);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});