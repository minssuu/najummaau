import FactionPage from "../components/FactionPage";

export default function HeukjoPage() {
  return <FactionPage
    tone="tide"
    logo="/assets/heukjo-logo.png"
    index="02"
    name="흑조파"
    hanja="黑潮派"
    english="THE BLACK TIDE"
    front="흑조수산 · 동구 만석동"
    symbol="왼쪽 손목 안쪽의 검은 파도 문신"
    method="계약서를 쓰지 않는다"
    territory="만석동 · 중구 내항 · 연안부두"
    quote="약속을 어긴 사람이 사라진다."
    description="동구 만석동의 흑조수산을 본거지로, 중구 내항과 연안부두의 오래된 하역·창고·운송망을 지배해온 조직. 상인들은 두목을 ‘어머니’라 부르고, 악수할 때 드러나는 파도 문신으로 서로를 알아본다. 피와 약속으로 버티는 인천의 오래된 항만 왕국이다."
    powerLead="명월에는 팔 곳이 있고, 흑조에는 들여올 문이 있다. 이탈리아 본가가 90일 뒤 파트너를 고르기 전에 항만 왕국을 지켜야 한다."
    people={[
      { name: "서귀란", age: "56", role: "두목", mark: "潮", alias: "만석동의 어머니", href: "/characters/seo-gwiran", image: "/assets/seo-gwiran.png", description: "어부의 딸로 만석동과 내항을 40년 지켰다. 조직을 위해 친딸을 자기 손으로 죽였으며, 유림이 왜 칼을 들었는지는 아직 모른다." },
      { name: "문해강", age: "34", role: "행동대장", mark: "犬", alias: "흑조의 미친개", href: "/characters/moon-haegang", image: "/assets/moon-haegang.png", description: "2011년 유림의 두 번째 칼을 몸으로 막아 왼손 힘줄이 끊겼고, 그날 무엇을 지켰는지 모른 채 충성을 바친다." },
      { name: "김민지", age: "26", role: "자금관리 ‘장부’", mark: "帳", alias: "살아 있는 장부", href: "/characters/kim-minji", image: "/assets/kim-minji.png", description: "세무사 자격증을 따 조직의 돈줄을 쥐었다. 9년 동안 흑조 안에서 기다렸고, D—90 직전 장부 원본을 들고 명월로 향한다." },
      { name: "진나비", age: "22", role: "막내", mark: "蝶", alias: "검은 나비", href: "/characters/jin-nabi", image: "/assets/jin-nabi.png", description: "말단 출신. 야망이 사람 모양으로 걸어다닌다. D—22, 자기 몫을 위해 유저를 판다." },
    ]}
    interests={[
      { name: "동구 만석동 · 흑조수산", status: "본거지", note: "어시장 상인과 선원, 냉동창고 인력을 묶는 흑조의 심장" },
      { name: "중구 내항 · 연안부두", status: "장악", note: "하역·창고·운송 인력이 이어지는 밀수의 비공식 정문" },
      { name: "동인천 · 신포동 유흥업소", status: "6 / 17", note: "명월에 밀려났지만 클럽 ‘해구’와 사행성 게임장 라인을 유지한다" },
      { name: "어시장 · 항구 보호비", status: "잠식 중", note: "내항 재개발과 명월개발의 보상금 공세에 밀리고 있다" },
      { name: "마약 ‘소금’", status: "공급선 없음", note: "항구는 있지만 이탈리아 본가는 명월을 후보로 두고 거래를 보류한다" },
    ]}
    history={[
      { year: "—2011", title: "인천의 유일한 조직", text: "서귀란과 후계자 서주하, 오른팔 차유림이 만석동과 내항·연안부두를 함께 지배했다." },
      { year: "2011", title: "딸이 죽은 밤", text: "서주하가 조직의 금지된 라인을 끊으려 하자 귀란이 직접 딸을 죽였다. 유림의 쿠데타는 실패했다." },
      { year: "2014", title: "배신자의 귀환", text: "차유림이 명월파를 세워 돌아왔다. 흑조에게 명월은 두목을 죽이려 든 배신자 집단이다." },
      { year: "2014—26", title: "왕국의 침식", text: "동인천·신포동의 유흥과 사채, 시청 라인을 하나씩 빼앗겼다. 남은 핵심은 만석동과 내항·연안부두뿐이다." },
      { year: "D—90", title: "항구의 시한", text: "이탈리아 본가가 90일 뒤 한국 파트너를 확정한다. 명월은 계약을 따내기 위해 흑조를 없애고 항만망 전체를 노린다." },
    ]}
    rivalHref="/myeongwol"
    rivalName="명월파"
  />;
}
