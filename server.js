const express = require('express');

const { port, template, provider, database } = require('./config');

const router = require('./router');
const Database = require(`./src/providers/${provider}`);

const { json, urlencoded } = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const session = require('cookie-session');
const randomstring = require('randomstring');

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
app.use(session({
    secret: randomstring.generate()
}));

global.db = new Database(database);
global.startDate = Date.now();

router(app);

app.listen(port, console.log(`Started on port ${port}`));