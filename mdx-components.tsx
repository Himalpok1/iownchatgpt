import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2
        className="text-[clamp(1.6rem,3vw,2rem)] text-white mt-12 mb-4 leading-tight"
        style={{ fontWeight: "var(--font-weight-semibold)" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-[1.08rem] text-white mt-8 mb-3 leading-tight"
        style={{ fontWeight: "var(--font-weight-semibold)" }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[var(--color-gray-200)] text-[1rem] leading-8 mb-5">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-3 mb-6 text-[var(--color-gray-200)] text-[1rem]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-3 mb-6 text-[var(--color-gray-200)] text-[1rem]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-8 pl-1">{children}</li>,
    strong: ({ children }) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[var(--color-cyan)] hover:opacity-80 transition-opacity underline"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="border-[rgba(125,211,252,0.12)] my-8" />,
    ...components,
  };
}
