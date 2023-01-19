const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(index.html);
})

app.post('/upload', (req, res) => {
    console.log('hi');
    res.send(error.html);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})