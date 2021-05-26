const querystring = require('querystring');
const { DEFAULT_OPTIONS } = require('./constants');

const pluginFunctions = {

  /**
   * Set pluginOptions object
   * @param {object} options 
   */
  setPluginOptions: function(options) {
    this.pluginOptions = options;
  },

  /**
   * set properties value
   */
  setProperties: function() {
    this.properties = [...DEFAULT_OPTIONS.properties, ...this.getPluginOptionsProperties(this.pluginOptions)]
  },

  /**
   * Check if pluginOptions contains "properties" and return array
   * @param {Object} pluginOptions 
   * @returns {array}
   */
  getPluginOptionsProperties: function(options) {
    if(!("properties" in options)) return [];
    return options.properties;
  },

  /**
   * Check if node value begins with <img
   * @param {string} value
   * @returns {Boolean}
   */
  isImage: function(value) {
    const reg = /^<img/gim;
    return reg.test(value);
  },

  /**
   * Set string-keyed property on current AST node
   * @param {Object} node
   * @param {Object} propertyValue
   * @param {string} propertyValue.property
   * @param {string} propertyValue.value
   */
  setImgProperty: function(node, { property, value }) {
    node[property] = value;
  },

  /**
   * Return attribute value by property name.
   * Checks dataset values first.
   * @param {Element} img
   * @param {string} property
   * @returns {*|string|null}
   */
  getHtmlImgAttributeByProperty: function(img, property) {
    return img.getAttribute(`data-${property}`) || img.getAttribute(property);
  },

  /**
   * Set node properties from html img attributes
   * @param {Object} node
   * @param {Element} img
   */
  setHtmlImgProperties: function(node, img) {
    this.properties.forEach(property => {
      this.setImgProperty(node, {property, value: this.getHtmlImgAttributeByProperty(img, property)});
    });
  },

  /**
   * Get query string params from node.url and return as object
   * @param node
   * @returns {Object}
   */
  getMarkdownImageParams: function(node) {
    const imgUrl = node.url.toString();
    const queryParams = imgUrl.split('?')[1];
    return querystring.parse(queryParams);
  },

  /**
   * Set node properties from markdown image attributes
   * @param {Object} node
   * @param {Object} params
   */
  setMarkdownImageAttributes: function(node, params) {
    this.properties.forEach(property => {
      this.setImgProperty(node, {property, value: params[property]});
    });
  },

}

module.exports = pluginFunctions;