const plugin = require('../index');

const mdTestAST = {
    "type": "root",
    "children": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "image",
            "title": "test title",
            "url": "test.jpg?align=left&width=300&height=250",
            "alt": "alt test",
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 67,
                "offset": 66
              }
            }
          }
        ],
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 67,
            "offset": 66
          }
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 67,
        "offset": 66
      }
    }
}

const htmlTestAST = {
    "type": "root",
    "children": [
      {
        "type": "html",
        "value": "<img src=\"test.jpg\" alt=\"test alt\" title=\"test title\" align=\"left\" width=\"300\" height=\"250\" />",
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 95,
            "offset": 94
          }
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 95,
        "offset": 94
      }
    }
  }

  const htmlNotImgTestAst = {
    "type": "root",
    "children": [
      {
        "type": "html",
        "value": "<div src=\"test.jpg\" alt=\"test alt\" title=\"test title\" align=\"left\" width=\"300\" height=\"250\" />",
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 95,
            "offset": 94
          }
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 95,
        "offset": 94
      }
    }
  }

describe("AST Visit Tests", () => {

    it("should extract attributes from html image", () => {
        const pluginOptions = [];
        const ast = {markdownAST: htmlTestAST};
        const newAST = plugin(ast, pluginOptions);
        expect(newAST.children[0].align).toBe("left");
        expect(newAST.children[0].width).toBe("300");
        expect(newAST.children[0].height).toBe("250");
    })

    it("should return original AST if html is not an image", () => {
        const pluginOptions = [];
        const ast = {markdownAST: htmlNotImgTestAst};
        const newAST = plugin(ast, pluginOptions);
        expect(newAST).toEqual(htmlNotImgTestAst);
    })

    it("should extract attributes from md image", () => {
        const pluginOptions = [];
        const ast = {markdownAST: mdTestAST};
        const newAST = plugin(ast, pluginOptions);
        expect(newAST.children[0].children[0].align).toBe("left");
        expect(newAST.children[0].children[0].width).toBe("300");
        expect(newAST.children[0].children[0].height).toBe("250");
    })

})

