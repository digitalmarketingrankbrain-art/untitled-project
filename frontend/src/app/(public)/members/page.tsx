import Image from "next/image";
export const metadata = {title:"Members | UASL"};
export default function Page() { return <article className="reference-container reference-content"><h1>Members</h1><div className="reference-members">{[["pex","Process Excellence Network"],["isqem","ISQEM"],["iseis","ISEIS"],["iaab","International Association for Assessment Board"]].map(([key,name]) => <Image key={key} src={`/images/uasl/member-${key}.jpg`} alt={name ?? key ?? "Member"} width={180} height={180} />)}</div></article>; }
