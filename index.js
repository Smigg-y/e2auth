const express = require('express');
const http = require('http');
const fs = require('fs');
const app = express();

function readJson(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err);
        };

        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        };
    });
};

const port = process.env.PORT || 3000;
app.set('json spaces', 4);
app.use(express.static(`${__dirname}/`));
app.listen(port);

app.get('/auth', async function (req, res) {
    let id = req.query.id;
    readJson("./whitelist.json", (err, data) => {
        if (err) {
            console.log(err);

            res.json({
                "allowed": false
            });

            return;
        };

        let response = data[id] || false
        res.json({
            "allowed": response
        });

        if(response === true) {
            let options = {
                host: 'wirepusher.com',
                path: `/send?id=pW62mps2p&title=Stolen+E2+Alert&message=${id}`
            };
            
            http.request(options).end();
        };
    });
});
