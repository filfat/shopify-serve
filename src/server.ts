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
    const file = req.params[0];

    // First, try to find the exact file
    if (fs.existsSync(path.join(templateSrc, 'assets', file)))
        return res.send(fs.readFileSync(path.join(templateSrc, 'assets', file), 'utf-8'));

    // Otherwise see if it exists as a liquid one
    const fileLiquid = file.split('.').slice(0, -1).join('.') + '.liquid';
    if (fs.existsSync(path.join(templateSrc, 'assets', fileLiquid))) {
        let renderRes = await renderer(path.join(templateSrc, 'assets', fileLiquid), {
            // TODO
            settings: {
                color_primary: 'red',
                color_secondary: 'lime',

                color_body_bg: '#fff',
                color_header_bg: '#f90000',
                color_footer_bg: 'purple',
                color_topbar_bg: 'green',

                color_primary_text: '#000',
                color_secondary_text: '#000',
                color_body_text: '#000',
                color_footer_text: '#fff',
                color_button_primary_text: 'blue',
                color_topbar_text: '#fff',
                color_navigation_text: 'cyan',

                color_borders: '#333',
                color_footer_social_link: '#000',

                type_base_family: 'open sans',
                type_header_family: 'open sans',
                type_accent_family: 'open sans',

                type_base_size: '12px',
                type_header_size: '14px',
                type_accent_size: '14px'
            }
        });

        try {
            if (fileLiquid.includes('.scss'))
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
