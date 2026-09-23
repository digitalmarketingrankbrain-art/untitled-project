import Image from "next/image";
export const metadata = { title: "Recognitions | UASL" };
export default function Page() {
  return <article className="reference-container reference-content"><h1>Recognitions</h1><div className="reference-certificates">{[2,1].map(page => <a key={page} href={`/images/uasl/recognition-${page}.jpg`} target="_blank" rel="noopener noreferrer"><Image src={`/images/uasl/recognition-${page}.jpg`} width={745} height={1030} alt={`UASL Global Level Recognition Arrangement certificate, page ${page}`} /></a>)}</div></article>;
}
