const path = require('path')

module.exports = {
  plugins: [
    {
      resolve: "smooth-doc",
      options: {
        name: "mcjava-wiki",
        description: "Comprehensive documentation for creating and editing Minecraft: Java Edition resource packs",
        siteUrl: "https://wiki.mcjava.dev",
        githubRepositoryURL: 'https://github.com/mcjava-wiki/mcjava-wiki',
        baseDirectory: path.resolve(__dirname, './'),
        author: 'Kas-tle',
        navItems: [{ title: 'Docs', url: '/docs/about/introduction/' }],
        sections: [
          'About', 
          'Basics', 
          'External Programs', 
          'Textures', 
          'Models', 
          'Predicates', 
          'Sounds', 
          'Languages', 
          'Block States',
          'Particles', 
          'Fonts', 
          'GUIs', 
          'Texts',
          'Shaders',
          'Techniques',
          'Troubleshooting'
        ],
      },
    },
  ],
};
