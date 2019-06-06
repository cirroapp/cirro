const express = require('express');
const router = require('./router');

const { port, style } = require('./config');

const { json, urlencoded } = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const session = require('cookie-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `templates/${template}/views`);
app.set('port', port);
app.use(express.static(`templates/${template}/assets`));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cors());

router(app);

app.listen(port, console.log(`Started on port ${port}`));