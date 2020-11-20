const maxImageWidth = 800
module.exports = {
  siteMetadata: {
    title: `JACDAC`,
    description: `Documentation for the JACDAC protocol and libraries.`,
    author: `Microsoft`,
    siteUrl: `https://microsoft.github.io/jacdac-ts`
  },
  pathPrefix: "/jacdac-ts",
  plugins: [
    `gatsby-transformer-plaintext`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/../jacdac-spec/spec/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `specPages`,
        path: `${__dirname}/../jacdac-spec/spec`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `services`,
        path: `${__dirname}/../jacdac-spec/dist/services.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `modules`,
        path: `${__dirname}/../jacdac-spec/dist/modules.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `traces`,
        path: `${__dirname}/../jacdac-spec/traces`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `package`,
        path: `${__dirname}/../package.json`,
      },
    },
    `gatsby-plugin-optimize-svgs`,
    `gatsby-transformer-json`,
    `gatsby-theme-material-ui`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-remark-images`,
      options: {
        linkImagesToOriginal: false
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          extensions: [`.mdx`, `.md`],
          default: require.resolve("./src/components/layout.tsx"),
        },
        gatsbyRemarkPlugins: [
          `gatsby-remark-autolink-headers`,
          'gatsby-plugin-mdx-code-demo',
          'gatsby-remark-external-links',
          'gatsby-remark-numbered-footnotes',
          'gatsby-remark-embedder',
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: maxImageWidth,
              linkImagesToOriginal: false
            }
          },
          'gatsby-remark-static-images',
        ]
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          'gatsby-remark-external-links',
          'gatsby-remark-numbered-footnotes',
          'gatsby-remark-embedder',
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: maxImageWidth,
              linkImagesToOriginal: false
            }
          },
          'gatsby-remark-static-images'
        ],
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: [`title`, `description`, `body`],
        resolvers: {
          Mdx: {
            title: node => node.frontmatter.title,
            description: node => node.frontmatter.description,
            body: node => node.rawBody,
            url: node => node.frontmatter.path || node.fields.slug,
          },
          ServicesJson: {
            title: node => node.name,
            description: node => node.notes["short"],
            body: node => node.source,
            url: node => `/services/${node.shortId}`
          },
          DevicesJson: {
            title: node => node.name,
            description: node => node.description,
            body: node => node.source,
            url: node => `/modules/${node.id}`
          }
        } // filter: (node, getNode) => node.frontmatter.tags !== "exempt",
      },
    },
    /*    
    {
      resolve: 'gatsby-plugin-flexsearch',
      options: {
        // L
        languages: ['en'],
        type: 'Mdx', // Filter the node types you want to index
        // Fields to index.
        fields: [
          {
            name: 'title',
            indexed: true, // If indexed === true, the field will be indexed.
            resolver: 'frontmatter.title',
            // Attributes for indexing logic. Check https://github.com/nextapps-de/flexsearch#presets for details.
            attributes: {
              encode: "extra",
              tokenize: "full",
              threshold: 1,
              resolution: 3
            },
            store: true, // In case you want to make the field available in the search results.
          },
          {
            name: 'description',
            indexed: true,
            resolver: 'frontmatter.description',
            attributes: {
              encode: 'balance',
              tokenize: 'strict',
              threshold: 6,
              depth: 3,
            },
            store: false,
          },
          {
            name: 'body',
            indexed: true, // If indexed === true, the field will be indexed.
            resolver: 'rawBody',
            // Attributes for indexing logic. Check https://github.com/nextapps-de/flexsearch#presets for details.
            attributes: {
              encode: "casei",
              tokenize: "forward",
              threshold: 2,
              resolution: 4,
              depth: 3
            },
            store: false, // In case you want to make the field available in the search results.
          },
          {
            name: 'url',
            indexed: false,
            resolver: 'fields.slug',
            store: true,
          },
        ],
      },
    },
    */
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `JACDAC: Joint Asynchronous Communications; Device Agnostic Control`,
        short_name: `JACDAC`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        cache_busting_mode: 'none',
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
        crossOrigin: `use-credentials`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [
          `/*`,
          `/reference/*`,
          `/services/*`,
          `/modules/*`,
          `/tools/*`
        ],
      },
    },
    "gatsby-plugin-robots-txt",
    "gatsby-plugin-meta-redirect",
    "gatsby-plugin-webpack-bundle-analyser-v2"
  ],
}
