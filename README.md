# mcjava-wiki

This is a technical wiki for Minecraft: Java Edition, primarily focused on resource-related tutorials. The ultimate goal is to be a reliable source of information for all things Java Edition resource pack related. It is accessible at https://wiki.mcjava.dev/docs.

## Why?

Though the Minecraft Wiki currently maintains a tutorial with regards to creating a resource pack, the page is largely disorganized and leaves much to be desired. In general, the wiki markdown format is also limiting, as it does not allow for niceties that developing ones own site affords.

Furthermore, the success of the [Bedrock Wiki](https://wiki.bedrock.dev/) in this format is also a source of motivation, which is an excellent resource for technical information related to Bedrock Edition resource packs and behavior packs.

## Technical Information

- Written primarily in Markdown / [MDX](https://github.com/mdx-js/mdx)
- Built with [Gatsby](https://www.gatsbyjs.com/)
- Deployed via [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- Uses the [Smooth Doc](https://github.com/gregberge/smooth-doc) theme

## Running Locally

```bash
git clone https://github.com/mcjava-wiki/mcjava-wiki
cd mcjava-wiki
yarn # if using npm you night need --legacy-peer-deps
yarn run develop
```

Visit `http://localhost:8000/` to view local changes.

## Contributing

Contributions are also welcome. Please create a pull request. For detailed instructions, refer to our [Contributing Page](https://wiki.mcjava.dev/docs/about/contributing).

Final test.
