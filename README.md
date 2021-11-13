# gatsby-remark-extract-image-attributes

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) ![Circle CI](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

Extract data attributes from the images in your Markdown (.md) files and add them to the remark AST for later processing.

### Align And Size Markdown Images
This plugin can be used by itself, or in conjunction with the [gatsby-remark-images-insert-wrapper-attributes](https://github.com/newsproutsmedia/gatsby-remark-images-insert-wrapper-attributes) plugin to extract image attributes and then apply them to the wrapper generated by [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images) after image processing.

Using the two plugins together makes it simple to align and size images in your Markdown files while still taking advantage of Gatsby's excellent image optimization plugin, [gatsby-remark-images](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images).

### Use With Gatsby Remark Copy Linked Files Plugin
The "stripMdAttributes" option can be used to remove url params prior to being processed by the [gatsby-remark-copy-linked-files](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-copy-linked-files) plugin. This setup can be very useful when using a git-backed CMS such as [Forestry.io](https://forestry.io/) or [NetlifyCMS](https://www.netlifycms.org/) where images must be stored in and referenced from the "static" directory.

To use this plugin with [gatsby-remark-copy-linked-files](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-copy-linked-files) (and Gatsby Remark Images), place it thusly in the gatsby-config.js plugins array:

``` 
{
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-extract-image-attributes`,
            options: {
              stripMdAttributes: true,
            }
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-images`,
        ]
      }
}
```
## Getting Started

### Compatibility
This plugin has been tested, and is compatible, with the following (related) dependencies: 

- gatsby: ^3.3.1
- gatsby-transformer-remark: ^3.0.0
- gatsby-transformer-sharp: ^3.0.0
- gatsby-remark-images: ^4.0.0

### Prerequisites
- [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)
- Node.js v10 or newer

### Installation
```
npm install gatsby-remark-extract-image-attributes
```

### Solo Usage

This plugin can be used by itself to extract image attributes. In your gatsby-config.js file, simply add it to the plugins array of the 'gatsby-transformer-remark' plugin.
```
// gatsby-config.js
plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-extract-image-attributes`,
        ]
      }
    }
]
```

### With gatsby-remark-images-insert-wrapper-attributes  
In this configuration, the gatsby-remark-images plugin should be sandwiched in the middle, like so: 
``` 
{
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-extract-image-attributes`,
          `gatsby-remark-images`,
          `gatsby-remark-images-insert-wrapper-attributes`
        ]
      }
}
```

## Options 

### `properties` 
By default, the plugin extracts the "align", "width", and "height" attributes. Any number of additional custom data attributes can be captured by specifying the attribute name(s) in the "properties" array:

```
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      {
        resolve: `gatsby-remark-extract-image-attributes`,
        options: {
          properties: ["caption", "filesize", "format"]
        }
      },
    ]
  }
}

```

### `stripMdAttributes` (boolean)
When using Markdown syntax, setting this value to "true" will remove url params from the image source. For example, ```image.jpg?align=left&width=300``` will become ```image.jpg```.

```
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      {
        resolve: `gatsby-remark-extract-image-attributes`,
        options: {
          stripMdAttributes: true,
        }
      },
    ]
  }
}

```

## Image Attribute Examples

The plugin accepts both Markdown and HTML syntax.

### Markdown 

Attributes using Markdown syntax are accomplished by appending the desired data to the image source as URL params. This example shows align, height, width, and caption params. Make sure to [URL-encode](https://www.w3schools.com/tags/ref_urlencode.ASP) any data parameters that include spaces or characters outside the ASCII set :

```
![Alt text here](my-image.jpg?align=left&height=300&width=250&caption=My%20awesome%20picture%20caption "Title text here")
```

### HTML

With HTML syntax, the plugin first looks for data-* attributes:

```
<img src="my-image.jpg" alt="Alt text here" title="Title text here" data-align="left" data-height="1280" data-width="720" data-caption="My awesome picture caption">
```

If no data-* attribute is found, it will look for the attribute name alone:

```
<img src="my-image.jpg" alt="Alt text here" title="Title text here" align="left" height="1280" width="720" data-caption="My awesome picture">
```

## Testing

To run Jest tests: 
```
npm test
```
