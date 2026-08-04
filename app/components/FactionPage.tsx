import Link from "next/link";
import { assetPath } from "../base-path";

export type Person = {
  name: string;
  age: string;
  birth?: string;
  role: string;
  alias: string;
  description: string;
  mark: string;
  href: string;
  image?: string;
};

export type Interest = {
  name: string;
  status: string;
  note: string;
};

export type FactionPageProps = {
  tone: "moon" | "tide";
  logo: string;
  index: string;
  name: string;
  hanja: string;
  english: string;
  front: string;
  symbol: string;
  method: string;
  territory: string;
  description: string;
  quote: string;
  powerLead: string;
  people: Person[];
  interests: Interest[];
  deal?: {
    kicker: string;
    title: string;
    quote: string;
    description: string;
    pieces: { name: string; has: string; lacks: string; logo?: string }[];
  };
  history: { year: string; title: string; text: string }[];
  rivalHref: string;
  rivalName: string;
};

export default function FactionPage(props: FactionPageProps) {
  return (
    <main className={`faction-page ${props.tone}`}>
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <Link href="/" className="home-link" aria-label="메인으로 돌아가기">
          <span>會</span><small>INCHEON · 2026</small>
        </Link>
        <nav aria-label="조직 페이지 이동">
          <Link href="/myeongwol" aria-current={props.tone === "moon" ? "page" : undefined}>명월파</Link>
          <Link href="/heukjo" aria-current={props.tone === "tide" ? "page" : undefined}>흑조파</Link>
        </nav>
      </header>

      <section className="faction-hero">
        <div className="faction-watermark" aria-hidden="true">{props.hanja[0]}</div>
        <div className="faction-hero-copy">
          <p className="section-kicker">{props.index} · {props.english}</p>
          <h1>{props.name}<small>{props.hanja}</small></h1>
          <blockquote>“{props.quote}”</blockquote>
          <p>{props.description}</p>
        </div>
        <div className="faction-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="faction-emblem" src={assetPath(props.logo)} alt={`${props.name} 조직 문장`} />
          <dl className="identity-grid">
            <div><dt>간판</dt><dd>{props.front}</dd></div>
            <div><dt>상징</dt><dd>{props.symbol}</dd></div>
            <div><dt>방식</dt><dd>{props.method}</dd></div>
            <div><dt>지배</dt><dd>{props.territory}</dd></div>
          </dl>
        </div>
      </section>

      <section className="content-section people-section" id="people">
        <div className="section-title">
          <p className="section-kicker">THE PEOPLE</p>
          <h2>조직원</h2>
        </div>
        <div className="people-grid">
          {props.people.map((person, index) => (
            <Link className={`person-card${person.image ? " has-portrait" : ""}`} href={person.href} key={person.name} aria-label={`${person.name} 이야기 보기`}>
              {person.image && (
                <span className="person-image-wrap" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetPath(person.image)} alt="" />
                </span>
              )}
              <span className="person-mark" aria-hidden="true">{person.mark}</span>
              <div className="person-no">0{index + 1}</div>
              <p className="person-role">{person.role} · {person.birth ? `${person.birth} · ` : ""}{person.age}세</p>
              <h3>{person.name}</h3>
              <p className="person-alias"><span>ALIAS</span>{person.alias}</p>
              <small>{person.description}</small>
              <i className="person-more">이야기 읽기 <b aria-hidden="true">→</b></i>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section power-section" id="power">
        <div className="section-title">
          <p className="section-kicker">POWER MAP</p>
          <h2>돈이 흐르는 곳</h2>
          <p>{props.powerLead}</p>
        </div>
        <div className="interest-list">
          {props.interests.map((interest, index) => (
            <article key={interest.name}>
              <span>0{index + 1}</span>
              <div><h3>{interest.name}</h3><p>{interest.note}</p></div>
              <strong>{interest.status}</strong>
            </article>
          ))}
        </div>

        {props.deal && (
          <aside className="deal-brief" aria-label={props.deal.title}>
            <div className="deal-heading">
              <p className="section-kicker">{props.deal.kicker}</p>
              <h3>{props.deal.title}</h3>
              <blockquote>“{props.deal.quote}”</blockquote>
              <p>{props.deal.description}</p>
            </div>
            <div className="deal-pieces">
              {props.deal.pieces.map((piece, index) => (
                <article key={piece.name}>
                  <span>0{index + 1}</span>
                  {piece.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="deal-emblem" src={assetPath(piece.logo)} alt="" aria-hidden="true" />
                  )}
                  <h4>{piece.name}</h4>
                  <dl>
                    <div><dt>가진 것</dt><dd>{piece.has}</dd></div>
                    <div><dt>없는 것</dt><dd>{piece.lacks}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </aside>
        )}
      </section>

      <section className="content-section history-section" id="history">
        <div className="section-title">
          <p className="section-kicker">FIFTEEN YEARS</p>
          <h2>갈라진 밤부터<br />D—90까지</h2>
        </div>
        <div className="history-list">
          {props.history.map((item) => (
            <article key={`${item.year}-${item.title}`}>
              <time>{item.year}</time>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="faction-footer">
        <p>다른 쪽의 진실도 확인하시겠습니까?</p>
        <Link href={props.rivalHref}>{props.rivalName} 정보 보기 <span>→</span></Link>
        <Link href="/" className="back-home">메인으로 돌아가기</Link>
      </footer>
    </main>
  );
}
