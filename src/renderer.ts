import { Liquid } from 'liquidjs';
import fs from 'fs';
import path from 'path';

const renderer = async (src: string, data?: any) => {
    const engine = new Liquid({
        cache: false,
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
    return await engine.parseAndRender(theme, {
        ...data,
        shop: {
            name: 'Shopify Development Store'
        },

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
            type_accent_size: '14px',

            enable_wide_layout: true,
            enable_bold: false
        }
    });
};

export default renderer;
