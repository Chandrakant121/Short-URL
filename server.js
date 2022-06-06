const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');


const app = express()
mongoose.connect('mongodb+srv://abc12:abc12@cluster0.bjtpv.mongodb.net/web15?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.listen(process.env.PORT || 5000);
app.listen(5200, async () => {
  try {
    await connect();
    console.log("listening on port 5200");
  }
  catch (err) {
    console.log("err in listening port 5200")
  }
});


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find()
  let ab = shortUrls.length;
  res.render('../views/index', { shortUrls: shortUrls[ab - 1] })
})

app.post('/shortUrls', async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrls = await shortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrls == null) return res.sendStatus(404)
  shortUrls.save()
  res.redirect(shortUrls.full)
})

