import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="text-[var(--font-size-2xl)] text-white mt-10 mb-4" style={{ fontWeight: "var(--font-weight-semibold)" }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[var(--font-size-xl)] text-white mt-6 mb-3" style={{ fontWeight: "var(--font-weight-semibold)" }}>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)] leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
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
