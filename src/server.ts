import express from 'express';
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import renderer from './renderer';
import routes from './routes';
import sass from 'node-sass';
import templatePath from './middleware/path';
import yargs from 'yargs/yargs';

const argv = yargs(hideBin(process.argv)).argv;
const templateSrc: string = (argv as any)._[0] || '.';

const app = express();

// Path middleware
app.use(templatePath(templateSrc));
routes(app);

app.get('/assets/*', async (req, res) => {
    let file = req.params[0];

    // First, try to find the exact file
    if (fs.existsSync(path.join(templateSrc, 'assets', file)))
        return res.send(fs.readFileSync(path.join(templateSrc, 'assets', file), 'utf-8'));

    // Otherwise see if it exists as a liquid one
    if (fs.existsSync(path.join(templateSrc, 'assets', file.split('.').slice(0, -1).join('.') + '.liquid')))
        file = file.split('.').slice(0, -1).join('.') + '.liquid';
    else if (file + '.liquid') file = file + '.liquid';

    if (fs.existsSync(path.join(templateSrc, 'assets', file))) {
        let renderRes = await renderer(path.join(templateSrc, 'assets', file));

        try {
            if (file.includes('.scss'))
                renderRes = sass
                    .renderSync({
                        outputStyle: 'compressed',
                        data: renderRes
                    })
                    .css.toString();
        } catch (error) {
            console.error(error);
        }

        return res.send(renderRes);
    }

    // Throw
    res.status(404).end();
});

app.listen(3000);
export default app;
