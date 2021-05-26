const pluginFunctions = require('../functions.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("Plugin Functions Tests", () => {
    beforeEach(() => {
        const options = { properties: ["test"] };
        pluginFunctions.setPluginOptions(options);
        pluginFunctions.setProperties();
    })

    it("should return an array if pluginOptions", () => {
        expect(pluginFunctions.getPluginOptionsProperties(pluginFunctions.pluginOptions)).toEqual(
            expect.arrayContaining(["test"])
        );
    })

    it("should return an empty array if !pluginOptions", () => {
        const options = {};
        pluginFunctions.setPluginOptions(options);
        expect(pluginFunctions.getPluginOptionsProperties(pluginFunctions.pluginOptions)).toEqual(
            expect.arrayContaining([])
        );
    })

    it("should return true if node value begins with <img", () => {
        const nodeValue = `<img src="test.jpg" title="test" alt="test"/>`;
        expect(pluginFunctions.isImage(nodeValue)).toBeTruthy();
    })

    it("should return false if node value does not begin with <img", () => {
        const nodeValue = `test`;
        expect(pluginFunctions.isImage(nodeValue)).toBeFalsy();
    })

    it("should set property value of node object", () => {
        const nodeObj = {};
        const propValue = {property: "test", value: "isGood"};
        pluginFunctions.setImgProperty(nodeObj, propValue);
        expect(nodeObj).toEqual(
            expect.objectContaining({test: "isGood"})
        )
    })

    it("should return HTML Img data-* attribute value by name", () => {
        const imgHtml = `<img src="/path/to/image.jpg" alt="My Alt Text" title="My Title Text" data-test="testAttribute"/>`;
        const dom = new JSDOM(imgHtml, { contentType: "text/xml" });
        const img = dom.window.document.querySelector("img");
        const attribute = pluginFunctions.getHtmlImgAttributeByProperty(img, "test");
        expect(attribute).not.toBe("scooby doo");
        expect(attribute).toBe("testAttribute");
    })

    it("should return default attribute if data-* attr not available", () => {
        const imgHtml = `<img src="/path/to/image.jpg" alt="My Alt Text" title="My Title Text" align="left"/>`;
        const dom = new JSDOM(imgHtml, { contentType: "text/xml" });
        const img = dom.window.document.querySelector("img");
        const defaultAttribute = pluginFunctions.getHtmlImgAttributeByProperty(img, "align");
        expect(defaultAttribute).toBe("left");
    })

    it("should set HTML Img properties from pluginOptions", () => {
        const nodeObj = {};
        const imgHtml = `<img src="/path/to/image.jpg" alt="My Alt Text" title="My Title Text" data-test="testAttribute"/>`;
        const dom = new JSDOM(imgHtml, { contentType: "text/xml" });
        const img = dom.window.document.querySelector("img");
        pluginFunctions.setHtmlImgProperties(nodeObj, img)
        expect(nodeObj).toEqual(
            expect.objectContaining(
                {
                    test: "testAttribute"
                }
            )
        );
    })

    it("should set default HTML Img properties", () => {
        const nodeObj = {};
        const imgHtml = `<img src="/path/to/image.jpg" alt="My Alt Text" title="My Title Text" data-align="left" width="300" height="250"/>`;
        const dom = new JSDOM(imgHtml, { contentType: "text/xml" });
        const img = dom.window.document.querySelector("img");
        pluginFunctions.setHtmlImgProperties(nodeObj, img)
        expect(nodeObj).toEqual(
            expect.objectContaining(
                {
                    align: "left",
                    width: "300",
                    height: "250"
                }
            )
        );
    })

    it("should return an obj with markdown image params", () => {
        const nodeObj = {url: "image.jpg?align=left&width=300&height=250"};
        const queryParams = pluginFunctions.getMarkdownImageParams(nodeObj);
        expect(queryParams).toEqual(
            expect.objectContaining(
                {
                    align: "left",
                    width: "300",
                    height: "250"
                }
            )
        )
    })

    it("should set markdown image attributes", () => {
        const nodeObj = {};
        const queryParams = {
            align: "left",
            width: "300",
            height: "250"
        };
        pluginFunctions.setMarkdownImageAttributes(nodeObj, queryParams);
        expect(nodeObj).toEqual(
            expect.objectContaining(
                {
                    align: "left",
                    width: "300",
                    height: "250"
                }
            )
        )
    })

    it("should call setHtmlImgProperties if HTML image exists in AST", () => {

    })

    it("should call setMarkdownImageAttributes if markdown image exists in AST", () => {

    })

})