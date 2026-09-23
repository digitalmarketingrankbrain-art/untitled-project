import Link from "next/link";
import content from "@/lib/uasl-reference-content.json";

export function ReferenceContentPage({ slug }: { slug: keyof typeof content }) {
  const page = content[slug];
  return <article className="reference-container reference-content">
    <h1>{page.title}</h1>
    {page.content.split(/\n\s*\n/).map((block, index) => {
      const lines = block.split("\n");
      if (slug === "management-system-certification" && lines.length === 2 && lines[1]?.includes("Aerospace,")) {
        return <div key={index}><p>{lines[0]}</p><ul>{lines[1].replace(/\.$/, "").split(", ").map(scheme => <li key={scheme}>{scheme}</li>)}</ul></div>;
      }
      const listStart = lines.findIndex(line => /^(?:\d+\. |[-*] )/.test(line));
      if (listStart >= 0) {
        const ordered = /^\d+\./.test(lines[listStart] ?? "");
        const List = ordered ? "ol" : "ul";
        return <div key={index}>{listStart > 0 && <p>{lines.slice(0, listStart).join(" ")}</p>}<List>{lines.slice(listStart).map((line, i) => <li key={i}>{line.replace(/^(?:\d+\. |[-*] )/, "")}</li>)}</List></div>;
      }
      if (block === "To apply accreditation - Contact us") return <p key={index}>To apply accreditation - <Link href="/get-in-touch">Contact us</Link></p>;
      if (lines.length > 1 && lines[0] && lines[0].length < 85) return <p key={index} className="whitespace-pre-line"><strong>{lines[0]}</strong>{"\n"}{lines.slice(1).join("\n")}</p>;
      return <p key={index} className="whitespace-pre-line">{block}</p>;
    })}
  </article>;
}
