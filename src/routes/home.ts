import { Request, Response } from 'express';

import path from 'path';
import renderer from '../renderer';

const get = async (req: Request, res: Response) => {
    const theme = await renderer(path.join((req as any).templateDir, 'layout', 'theme.liquid'), {
        canonical_url: '/',
        page_title: 'Homepage',

        content_for_layout: await renderer(path.join((req as any).templateDir, 'templates', 'index.liquid')),
        content_for_index: 'Hello World!' // TODO
    });
    res.status(200).send(theme);
};

export { get };
