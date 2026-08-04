import Link from "next/link";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "../character-data";
import { assetPath } from "../../base-path";

export function generateStaticParams() {
  return characters.map(({ slug }) => ({ slug }));
}

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = getCharacter(slug);
  if (!character) notFound();

  return (
    <main className={`character-page ${character.tone}`}>
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <Link href="/" className="home-link" aria-label="메인으로 돌아가기"><span>會</span><small>INCHEON · 2026</small></Link>
        <nav aria-label="조직 페이지 이동">
          <Link href="/myeongwol" aria-current={character.tone === "moon" ? "page" : undefined}>명월파</Link>
          <Link href="/heukjo" aria-current={character.tone === "tide" ? "page" : undefined}>흑조파</Link>
        </nav>
      </header>

      <section className="character-hero">
        <span className="character-watermark" aria-hidden="true">{character.mark}</span>
        <div className="character-copy">
          <Link className="character-back" href={character.factionHref}>← {character.faction} 인물 목록</Link>
          <p className="section-kicker">CHARACTER DOSSIER · {character.roman}</p>
          <p className="character-role">{character.faction} · {character.role} · {character.birth ? `${character.birth} · ` : ""}{character.age}세</p>
          <h1>{character.name}</h1>
          <div className="character-alias"><span>ALIAS</span><strong>{character.alias}</strong>{character.aliasNote && <small>{character.aliasNote}</small>}</div>
          <p className="character-lead">{character.lead}</p>
        </div>
        <div className={`character-visual${character.image ? "" : " no-image"}`}>
          {character.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assetPath(character.image)} alt={`${character.name} 인물 이미지`} />
          ) : (
            <span aria-hidden="true">{character.mark}</span>
          )}
        </div>
      </section>

      <section className="character-story content-section">
        <div className="story-heading">
          <p className="section-kicker">HER STORY</p>
          <h2>{character.name}의 이야기</h2>
          <span aria-hidden="true">{character.mark}</span>
        </div>
        <div className="story-prose">
          {character.narrative.map((paragraph, index) => <p key={`${character.slug}-${index}`}>{paragraph}</p>)}
        </div>
      </section>

      <section className="character-relations content-section">
        <div className="section-title"><p className="section-kicker">RELATIONSHIPS</p><h2>관계의 방향</h2></div>
        <div>{character.relations.map((relation) => <article key={relation.name}><h3>{relation.name}</h3><p>{relation.text}</p></article>)}</div>
      </section>

      <footer className="character-footer">
        <Link href={character.factionHref}>← {character.faction}로 돌아가기</Link>
        <Link href="/">메인</Link>
      </footer>
    </main>
  );
}
