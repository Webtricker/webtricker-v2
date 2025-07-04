
import React from 'react';
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';

interface HtmlContentParserProps {
  htmlContent: string;
}

const HtmlContentParser: React.FC<HtmlContentParserProps> = ({ htmlContent }) => {
  const options: HTMLReactParserOptions = {
    replace: (node: DOMNode) => {
      // Check if the node is an element and has a tag name
      if (node instanceof Element && node.attribs) {
        // --- Replace <img> with Next.js <Image> ---
        if (node.name === 'img') {
          const { src, alt, width, height, ...rest } = node.attribs;

          // For simplicity, let's try to parse width/height if available, otherwise use fill
          const imgWidth = width ? parseInt(width, 10) : undefined;
          const imgHeight = height ? parseInt(height, 10) : undefined;

          if (src) {
            return (
              <Image
                src={src}
                alt={alt || 'Image'} 
                width={imgWidth || 500} 
                height={imgHeight || 300}
                // className='w-auto h-auto'
                {...rest}
              />
            );
          }
        }

        // --- Replace <a> with Next.js <Link> ---
        if (node.name === 'a') {
          const { href, ...rest } = node.attribs;

          if (href) {
            // Check if it's an internal link (does not start with http/https)
            const isInternalLink = !href.startsWith('http://') && !href.startsWith('https://');

            if (isInternalLink) {
              return (
                <Link href={href} {...rest}>
                  {parse(node.children as any, options)} {/* Recursively parse children */}
                </Link>
              );
            } else {
              // For external links, keep a standard <a> tag
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                  {parse(node.children as any, options)}
                </a>
              );
            }
          }
        }
      }
      return node; // Return the node as is if no replacement is needed
    },
  };

  return <>{parse(htmlContent, options)}</>;
};

export default HtmlContentParser;