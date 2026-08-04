import FactionPage from "../components/FactionPage";

export default function MyeongwolPage() {
  return <FactionPage
    tone="moon"
    logo="/assets/myeongwol-logo.png"
    index="01"
    name="명월파"
    hanja="明月派"
    english="THE PALE MOON"
    front="㈜명월개발 · 연수구 송도 39층"
    symbol="초승달과 체스말"
    method="일방적 구원이 아닌 선택을 주어 충성시킨다"
    territory="송도 · 동인천 · 신포동 · 서구 북항"
    quote="죽을 것인가, 힘과 권력을 얻을 것인가."
    description="연수구 송도 39층의 ㈜명월개발을 합법 간판으로 내건 여성 중심의 범죄조직. 차유림은 동인천과 신포동에서 빚에 끌려왔거나 갈 곳을 잃은 여자에게 가게와 장부, 부하와 결정권을 나눠준다. 연민이 아닌 권력의 배분으로 절대적인 충성을 설계했고, 목적을 위해서라면 납치와 폭력도 서슴지 않는다."
    powerLead="국내 판매망은 완성됐다. 이제 흑조가 쥔 인천항의 비공식 관문을 빼앗아야 이탈리아 본가의 첫 물량이 움직인다."
    people={[
      { name: "차유림", birth: "1980.08.21", age: "46", role: "회장", mark: "月", alias: "흑조의 패륜아", href: "/characters/cha-yurim", image: "/assets/cha-yurim.png", description: "갈 곳 없는 여자에게 빚을 지워주고 장부와 가게, 부하와 수익의 몫을 나눠줬다. 사람의 충성보다 자신이 얻은 권력을 지키려는 마음을 믿는다." },
      { name: "정윤아", birth: "1985.05.12", age: "41", role: "동인천·신포동 총괄", mark: "七", alias: "신포동의 붉은 칼", href: "/characters/jung-yuna", image: "/assets/jung-yuna.png", description: "동인천·신포동의 클럽·바·게임장과 주류 유통을 쥔다. 조직원을 외부에 팔지는 않지만 그들이 모은 정보와 약점을 조직의 힘으로 바꾼다." },
      { name: "오지안", birth: "1987.10.10", age: "39", role: "실행부장", mark: "刃", alias: "명월의 개새끼", href: "/characters/oh-jian", image: "/assets/oh-jian.png", description: "흑조 시절부터 유림을 따른 유일한 사람. 누가 피를 묻혀야 하는지 결정하고, 필요하다면 직접 칼을 든다." },
      { name: "리비아", birth: "1973.06.14", age: "53", role: "이탈리아 마피아 협상인", mark: "R", alias: "La Volpe Bianca", href: "/characters/livia", image: "/assets/livia.png", description: "한국 내 마약 ‘소금’의 새 유통 파트너를 심사하러 온 본가의 파견인. 항구를 차지한 자에게만 독점 계약을 내준다." },
    ]}
    interests={[
      { name: "사채 · 채권추심", status: "장악", note: "빚과 인감, 위임장으로 재산과 사람을 함께 묶는다" },
      { name: "동인천 · 신포동 유흥·사채", status: "장악", note: "낡은 클럽·바·게임장과 채권망이 ‘소금’의 국내 판매선이 된다" },
      { name: "약점 · 계약 · 도장", status: "장악", note: "시청·검찰·투자자의 비밀을 합법처럼 보이는 권리로 바꾼다" },
      { name: "송도 39층 · 도시개발", status: "본사", note: "㈜명월개발의 유리벽 안에서 합법 사업과 범죄 자금을 함께 움직인다" },
      { name: "서구 북항 · 폐기물", status: "장악", note: "산업폐기물 처리장을 후방 기지로 삼아 돈과 남은 흔적을 함께 지운다" },
      { name: "인천항 비공식 관문", status: "D—90 목표", note: "팔 곳은 있지만 들여올 문이 없다. 흑조의 항만망을 통째로 빼앗아야 한다" },
    ]}
    deal={{
      kicker: "THE PORT CONDITION",
      title: "항구를 가져오면 계약한다",
      quote: "90일 뒤, 본가는 동아시아 유통 파트너를 확정한다.",
      description: "차유림이 먼저 이탈리아 마피아에 접선을 요청했다. 그러나 흑조가 인천항의 하역업체·창고·운송 인력과 밀수 관문을 쥔 한 거래는 성립하지 않는다. 흑조를 없애고 그 자리를 명월이 먹는 순간, 리비아가 한국 독점 유통권에 서명한다.",
      pieces: [
        { name: "명월파", logo: "/assets/myeongwol-logo.png", has: "클럽·바·도박장·주류의 국내 판매망", lacks: "해외 물량이 들어올 항구" },
        { name: "흑조파", logo: "/assets/heukjo-logo.png", has: "인천항 하역·창고·운송의 비공식 관문", lacks: "안정적인 해외 공급자" },
        { name: "이탈리아 본가", logo: "/assets/italian-mafia-logo.png", has: "마약 ‘소금’과 국제 공급망", lacks: "한국을 장악할 현지 파트너" },
      ],
    }}
    history={[
      { year: "2011", title: "쿠데타 실패", text: "서주하가 죽은 밤, 차유림은 두목의 목을 노렸고 실패했다. 오지안과 함께 인천을 떠났다." },
      { year: "2011—14", title: "갈 곳 없는 여자들", text: "유림은 빚에 끌려온 여자와 범죄에 휘말린 여자들을 골라 거뒀다. 숨을 곳 대신 장부와 가게, 결정권을 나눠주며 자기 세력을 만들었다." },
      { year: "2014", title: "명월파 창단", text: "유림에게 처음으로 자기 몫의 권력을 받은 여자들이 하나의 조직으로 인천에 돌아왔다. 같은 해 정윤아가 동인천·신포동의 밤을 맡았다." },
      { year: "2014—26", title: "12년의 권력 배분", text: "사채와 도박, 약점과 도장으로 세력을 불렸다. 명월이 커질수록 조직의 여자들에게도 가게와 부하, 수익의 몫이 생겼다." },
      { year: "2026", title: "이탈리아와의 접선", text: "국내 판매망을 완성한 유림이 이탈리아 마피아에 먼저 거래를 제안한다. 리비아는 항구를 계약의 조건으로 내건다." },
      { year: "D—90", title: "인천항 전쟁", text: "본가의 파트너 확정까지 90일. 흑조를 없애고 항만망을 차지해야 명월은 국제 유통조직으로 올라선다." },
    ]}
    rivalHref="/heukjo"
    rivalName="흑조파"
  />;
}
