import React from "react";
import parse, {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import Image from "next/image";
import Link from "next/link";

interface HtmlContentParserProps {
  htmlContent: string;
}

const HtmlContentParser: React.FC<HtmlContentParserProps> = ({
  htmlContent,
}) => {
  const options: HTMLReactParserOptions = {
    replace: (node: DOMNode) => {
      if (node instanceof Element && node.attribs) {
        // Handle <img>
        if (node.name === "img") {
          const {
            src,
            alt,
            width,
            height,
            class: className,
            ...rest
          } = node.attribs;
          const imgWidth = width ? parseInt(width, 10) : 912;
          const imgHeight = height ? parseInt(height, 10) : 912;

          if (src) {
            return (
              <Image
                src={src}
                alt={alt || "Image"}
                width={imgWidth}
                height={imgHeight}
                className={className || "max-w-full h-auto"}
                {...rest}
              />
            );
          }
        }

        // Handle <a>
        if (node.name === "a") {
          const { href, ...rest } = node.attribs;

          if (href) {
            const { class: className, ...otherAttribs } = rest;
            const children = domToReact(node.children as DOMNode[], options);
            return (
              <Link href={href} className={className} {...otherAttribs}>
                {children}
              </Link>
            );
          }
        }
      }

      return undefined; // Fallback: let html-react-parser render as-is
    },
  };

  return <>{parse(htmlContent, options)}</>;
};

export default HtmlContentParser;
