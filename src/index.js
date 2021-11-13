const visit = require("unist-util-visit");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const PluginFunctions = require('./functions');
const pluginFunctions = require("./functions");

const gatsbyRemarkExtractImageAttributesPlugin = ({ markdownAST }, pluginOptions) => {

  PluginFunctions.setPluginOptions(pluginOptions);
  PluginFunctions.setProperties();

  // Check AST for images in HTML format
  // i.e. <img src="/path/to/image.jpg" alt="My Alt Text" title="My Title Text"/>
  visit(markdownAST, "html", node => {
    const imgHtml = node.value.toString();
    if(PluginFunctions.isImage(imgHtml)) {
      const dom = new JSDOM(imgHtml, { contentType: "text/xml" });
      const img = dom.window.document.querySelector("img");
      img && PluginFunctions.setHtmlImgProperties(node, img);
    }
  })

  // Check AST for images in markdown format
  // i.e. ![My Alt Text](/path/to/image.jpg "My Title Text")
  visit(markdownAST, "image", node => {
    const imgParams = PluginFunctions.getMarkdownImageParams(node);
    imgParams && PluginFunctions.setMarkdownImageAttributes(node, imgParams);
    PluginFunctions.pluginOptions.stripMdAttributes && PluginFunctions.stripParamsFromUrl(node);
  })

  return markdownAST;
}

module.exports = gatsbyRemarkExtractImageAttributesPlugin;