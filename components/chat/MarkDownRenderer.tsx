import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ text, role }: any) {
  return (
    <div
      className={`prose max-w-none text-sm leading-7 ${
        role === "user" ? "prose-invert" : "prose-zinc"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            return (
              <code
                className={`rounded-md px-1.5 py-1 text-[13px] ${
                  role === "user"
                    ? "bg-white/10 text-white"
                    : "bg-zinc-100 text-zinc-800"
                }`}
              >
                {props.children}
              </code>
            );
          },

          pre(props) {
            return (
              <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-zinc-100">
                {props.children}
              </pre>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
