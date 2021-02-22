import { Liquid } from 'liquidjs';
import fs from 'fs';
import path from 'path';

const renderer = async (src: string, data?: any) => {
    const engine = new Liquid({
        root: path.resolve(src, '../../', 'snippets'), // TODO
        extname: '.liquid'
    });

    engine.registerFilter('asset_url', (str: string) => `/assets/${str}`);
    engine.registerFilter('stylesheet_tag', (str: string) => `<link rel="stylesheet" href="${str}" />`);
    engine.registerFilter('font_face', (str: string) => ''); // TODO
    engine.registerFilter('default', (str: string) => str); // TODO

    engine.registerTag('section', {
        parse: function (tagToken: any, remainTokens: any) {
            this.str = tagToken.args; // name
        },
        render: async function (scope: any, hash: any) {
            var str = await this.liquid.evalValue(this.str, scope);
            return str.toUpperCase(); // TODO: import section
        }
    });

    const theme = fs
        .readFileSync(src, 'utf-8')
        .replaceAll('{{ base_family.family }}', 'open sans')
        .replaceAll('{{ base_family.fallback_families }}', 'sans-serif')
        .replaceAll('{{ base_family.weight }}', '600')
        .replaceAll('{{ base_family_bold.weight | default: 700 }}', '700')
        .replaceAll('{{ base_family.style }}', 'none')
        .replaceAll("{{ base_family_italic.style | default: 'italic' }}", 'italic')
        .replaceAll('{{ header_family.family }}', 'open sans')
        .replaceAll('{{ header_family.fallback_families }}', 'sans-serif')
        .replaceAll('{{ header_family.weight }}', '600')
        .replaceAll('{{ header_family_bold.weight | default: 700 }}', '700')
        .replaceAll('{{ header_family.style }}', 'none')
        .replaceAll('{{ accent_family.family }}', 'open sans')
        .replaceAll('{{ accent_family.fallback_families }}', 'sans-serif')
        .replaceAll('{{ accent_family.weight }}', '600')
        .replaceAll('{{ accent_family_bold.weight | default: 700 }}', '700')
        .replaceAll('{{ accent_family.style }}', 'none');
    return await engine.parseAndRender(theme, data);
};

export default renderer;
