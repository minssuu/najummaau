import Link from "next/link";
import { assetPath } from "./base-path";

export default function Home() {
  return (
    <main className="landing">
      <div className="noise" aria-hidden="true" />
      <div className="landing-moon" aria-hidden="true" />
      <div className="landing-tide" aria-hidden="true" />

      <section className="landing-content" aria-labelledby="story-title">
        <p className="landing-label">INCHEON · 2026</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="landing-logo"
          src={assetPath("/assets/title-logo.png")}
          alt="회는 산 채로 뜬다"
          id="story-title"
        />

        <div className="landing-copy">
          <p>15년 전, 두 개로 갈라진 조직</p>
          <p>그 사이 숨겨진 진실</p>
        </div>

        <nav className="faction-entry" aria-label="조직 정보 선택">
          <Link className="entry-card entry-moon" href="/myeongwol">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="entry-emblem" src={assetPath("/assets/myeongwol-logo.png")} alt="" aria-hidden="true" />
            <span className="entry-hanja" aria-hidden="true">明</span>
            <span className="entry-index">01 · THE PALE MOON</span>
            <strong>명월파</strong>
            <small>明月派</small>
            <i>조직 정보 보기</i>
          </Link>
          <Link className="entry-card entry-tide" href="/heukjo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="entry-emblem" src={assetPath("/assets/heukjo-logo.png")} alt="" aria-hidden="true" />
            <span className="entry-hanja" aria-hidden="true">潮</span>
            <span className="entry-index">02 · THE BLACK TIDE</span>
            <strong>흑조파</strong>
            <small>黑潮派</small>
            <i>조직 정보 보기</i>
          </Link>
        </nav>

        <p className="landing-foot">두 문은 같은 진실로 이어진다.</p>
      </section>
    </main>
  );
}
