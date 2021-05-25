const visit = require("unist-util-visit");
const querystring = require('querystring');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { DEFAULT_OPTIONS } = require('./constants');

module.exports = ({ markdownAST }, pluginOptions) => {

  /**
   * Check if pluginOptions contains "properties" and return array
   * @param {Object} pluginOptions 
   * @returns {array}
   */
  const getPluginOptionsProperties = (pluginOptions) => {
      if(!("properties" in pluginOptions)) return [];
      return pluginOptions.properties;
  }

  /**
   * Check if node value begins with <img
   * @param {string} value
   * @returns {Boolean}
   */
  const isImage = value => {
    const reg = /^<img/gim;
    return reg.test(value);
  }

  /**
   * Set string-keyed property on current AST node
   * @param {Object} node
   * @param {Object} propertyValue
   * @param {string} propertyValue.property
   * @param {string} propertyValue.value
   */
  const setImgProperty = (node, { property, value }) => {
    node[property] = value;
  }

  /**
   * Return attribute value by property name.
   * Checks dataset values first.
   * @param {Element} img
   * @param {string} property
   * @returns {*|string|null}
   */
  const getHtmlImgAttributeByProperty = (img, property) => {
    return img.getAttribute(`data-${property}`) || img.getAttribute(property);
  }

  // Set properties to be extracted
  const properties = [...DEFAULT_OPTIONS.properties, ...getPluginOptionsProperties(pluginOptions)];

  /**
   * Set node properties from html img attributes
   * @param {Object} node
   * @param {Element} img
   */
  const setHtmlImgProperties = (node, img) => {
    properties.forEach(property => {
      setImgProperty(node, {property, value: getHtmlImgAttributeByProperty(img, property)});
    });
  }

  /**
   * Get query string params from node.url and return as object
   * @param node
   * @returns {Object}
   */
  const getMarkdownImageParams = (node) => {
    const imgUrl = node.url.toString();
    const queryParams = imgUrl.split('?')[1];
    return querystring.parse(queryParams);
  }

  /**
   * Set node properties from markdown image attributes
   * @param {Object} node
   * @param {Object} params
   */
  const setMarkdownImageAttributes = (node, params) => {
    properties.forEach(property => {
      setImgProperty(node, {property, value: params[property]});
    });
  }

  // Check AST for images in HTML format
  // i.e. <img src="/path/to/image.jpg" alt="My Alt Text" title="My Title Text"/>
  visit(markdownAST, "html", node => {
    const imgHtml = node.value.toString();
    if(isImage(imgHtml)) {
      const dom = new JSDOM(imgHtml, { contentType: "text/xml" });
      const img = dom.window.document.querySelector("img");
      img && setHtmlImgProperties(node, img);
    }
  })

  // Check AST for images in markdown format
  // i.e. ![My Alt Text](/path/to/image.jpg "My Title Text")
  visit(markdownAST, ["image"], node => {
    const imgParams = getMarkdownImageParams(node);
    imgParams && setMarkdownImageAttributes(node, imgParams);
  })

  return markdownAST;
}