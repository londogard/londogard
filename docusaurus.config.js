// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Londogard Blog',
  tagline: 'Blogging about everything.',
  url: 'https://blog.londogard.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'londogard', // Usually your GitHub org/user name.
  projectName: 'londogard', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/londogard/londogard',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          remarkPlugins: [math],
          rehypePlugins: [katex],
          editUrl:
            'https://github.com/londogard/londogard',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Londogard Blog',
        logo: {
          alt: 'Londogard logo',
          src: 'img/favicon.ico',
        },
        items: [
          /**{
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },*/
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/blog/tags', label: 'Tags', position: 'left' },
          { to: '/blog/archive', label: 'Archive', position: 'left' },
          {
            href: 'https://londogard.com/projects',
            label: 'Londogard Projects',
            position: 'right',
          },
          {
            href: 'https://github.com/londogard',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Support Londogard',
            items: [
              {
                html: `<a href="https://www.buymeacoffee.com/hlondogard" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>`,
              },
              {
                html: `<div style="display: flex; align-items: center;"><iframe src="https://github.com/sponsors/Lundez/button" title="Sponsor Lundez" height="35" width="116" style="border: 0;"></iframe><div>&nbsp;on GitHub</div></div>`,
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/londogard',
              },
            ],
          },
          {
            title: 'Feeds',
            items: [
              {
                label: 'RSS',
                href: 'https://blog.londogard.com/blog/rss.xml',
              },
              {
                label: 'Atom',
                href: 'https://blog.johnnyreilly.com/blog/atom.xml',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Londogard. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['kotlin', 'java', 'scala', 'docker'],
      },
    }),
};

module.exports = config;
