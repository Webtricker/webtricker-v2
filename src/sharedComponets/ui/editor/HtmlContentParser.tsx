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

// Content comes from the CMS, but a compromised or careless editor account must
// not be able to ship script into a public page, so everything is filtered here.
const BLOCKED_TAGS = new Set([
  "script",
  "style",
  "object",
  "embed",
  "applet",
  "base",
  "meta",
  "link",
  "form",
  "noscript",
  "template",
]);
const URL_ATTRS = new Set(["href", "src", "action", "formaction", "xlink:href", "poster"]);
const IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.google.com",
]);

const isSafeUrl = (value: string, allowDataImage: boolean): boolean => {
  // browsers ignore whitespace/control characters inside the scheme
  const v = value.replace(/[\u0000- \u007F-\u009F]+/g, "").toLowerCase();
  if (v.startsWith("javascript:") || v.startsWith("vbscript:")) return false;
  if (v.startsWith("data:")) return allowDataImage && v.startsWith("data:image/") && !v.startsWith("data:image/svg");
  return true;
};

const sanitizeElement = (node: Element): boolean => {
  if (BLOCKED_TAGS.has(node.name)) return false;

  if (node.name === "iframe") {
    try {
      const url = new URL(node.attribs.src ?? "", "https://invalid.local");
      if (url.protocol !== "https:" || !IFRAME_HOSTS.has(url.host)) return false;
    } catch {
      return false;
    }
  }

  for (const attr of Object.keys(node.attribs)) {
    const lower = attr.toLowerCase();
    const value = node.attribs[attr] ?? "";
    if (lower.startsWith("on") || lower === "srcdoc") {
      delete node.attribs[attr];
    } else if (URL_ATTRS.has(lower) && !isSafeUrl(value, node.name === "img")) {
      delete node.attribs[attr];
    }
  }
  return true;
};

const HtmlContentParser: React.FC<HtmlContentParserProps> = ({
  htmlContent,
}) => {
  const options: HTMLReactParserOptions = {
    replace: (node: DOMNode) => {
      if (node instanceof Element && !sanitizeElement(node)) {
        return <></>;
      }

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
