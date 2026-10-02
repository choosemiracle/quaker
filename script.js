const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-tabs]').forEach((tabs) => {
  const tabButtons = [...tabs.querySelectorAll('[role="tab"]')];
  const panels = [...tabs.querySelectorAll('[role="tabpanel"]')];

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((item) => item.setAttribute('aria-selected', 'false'));
      panels.forEach((panel) => panel.hidden = true);

      button.setAttribute('aria-selected', 'true');
      const panel = tabs.querySelector('#' + button.getAttribute('aria-controls'));
      if (panel) panel.hidden = false;
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.animate(
      [
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 580, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'both' }
    );
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08 });

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.path-card,.timeline-item,.concept-card,.person-card,.book,.branch-map article,.route-card,.term-grid article,.reading-path,.lineage-person,.research-timeline article,.river-grid article,.loop-grid article,.connection-grid a,.research-entry,.spiritual-practice-card,.thesis-triptych article,.axis-explanations article,.start-routes article,.generation-chain article').forEach((el) => observer.observe(el));
}

const glossaryInput = document.querySelector('[data-glossary-search]');
const glossary = document.querySelector('[data-glossary]');
const glossaryEmpty = document.querySelector('[data-glossary-empty]');

glossaryInput?.addEventListener('input', () => {
  const query = glossaryInput.value.trim().toLowerCase();
  let visible = 0;

  glossary?.querySelectorAll('article').forEach((card) => {
    const haystack = (card.dataset.term + ' ' + card.textContent).toLowerCase();
    const match = !query || haystack.includes(query);
    card.hidden = !match;
    if (match) visible += 1;
  });

  if (glossaryEmpty) glossaryEmpty.hidden = visible !== 0;
});

const timelineFilters = [...document.querySelectorAll('[data-timeline-filter]')];
const researchTimeline = document.querySelector('[data-research-timeline]');

timelineFilters.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    const filter = button.dataset.timelineFilter;
    timelineFilters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    researchTimeline?.querySelectorAll('article').forEach((item) => {
      const categories = (item.dataset.category || '').split(/\s+/);
      item.hidden = filter !== 'all' && !categories.includes(filter);
    });
  });
});

const conceptContent = {
  light: {
    kicker: 'CORE',
    title: '内在之光',
    body: '不是私人直觉的别名，而是指向一种在人里面工作、却不等同于自我的神圣引导。它会照见、纠正、召唤，并要求回应。',
    links: [
      ['它连接什么？', '启示、基督、圣经、敬拜与行动。'],
      ['最常见误读', '“我内心这样觉得，所以它就是真的。”'],
      ['如何被检验', '等待、圣经与传统、共同体、时间，以及行动结出的果子。']
    ]
  },
  revelation: {
    kicker: 'SOURCE',
    title: '即时启示',
    body: '贵格会坚持，产生圣经的同一圣灵并没有停止工作。启示因此不是只属于过去，但这也不意味着任何强烈感受都自动成为神圣启示。',
    links: [
      ['它保护什么？', '信仰的活性：真理必须在当下成为可经验的现实。'],
      ['它需要什么？', '辨识与检验，而不是“新奇”本身。'],
      ['失衡风险', '把个人冲动神圣化。']
    ]
  },
  christ: {
    kicker: 'CHRISTOLOGY',
    title: '基督',
    body: '早期 Friends 常把内在之光、基督之光与内在基督联系起来。19世纪分裂以后，“历史中的基督”与“内在基督”被不同分支赋予不同权重。',
    links: [
      ['早期结构', '历史中的基督与内在基督并非两个互不相关的对象。'],
      ['现代张力', '基督中心解释与更普遍主义的“光”语言并存。'],
      ['失衡风险', '只讲“内在”而抹去传统的基督教根系。']
    ]
  },
  scripture: {
    kicker: 'WITNESS',
    title: '圣经',
    body: '在 Brinton 对早期贵格立场的概括中，圣经不是被丢弃，而是作为同一圣灵工作的历史见证，去确认、澄清并检验当下领受。',
    links: [
      ['它不是', '被隔离成与活的圣灵无关的独立机制。'],
      ['它也不是', '可有可无的装饰性参考。'],
      ['核心关系', '当下引导与历史见证彼此校验。']
    ]
  },
  worship: {
    kicker: 'PRACTICE',
    title: '敬拜',
    body: '静默敬拜把神学变成身体与群体的实践：不预先制造内容，而是共同等待，辨认是否有话或行动被要求。',
    links: [
      ['静默的功能', '从自我生产答案转向接受与等待。'],
      ['口头服事', '任何人都可能说，但不是每个想法都该说。'],
      ['失衡风险', '把静默变成放松技术或个人冥想。']
    ]
  },
  discernment: {
    kicker: 'METHOD',
    title: '辨识',
    body: '因为人的内在并不只有一个声音，贵格会需要区分恐惧、欲望、自我意志、社会期待与更深的引导。辨识因此是“内在之光”不可缺少的另一半。',
    links: [
      ['个人层面', '等待、祈祷、时间与内在和平。'],
      ['群体层面', '开放问题、共同体回应与 unity。'],
      ['失衡风险', '把“真诚”误当作“正确”。']
    ]
  },
  community: {
    kicker: 'TESTING GROUND',
    title: '共同体',
    body: '贵格会的“内在”不是孤立个人主义。Meeting 让个人领受进入公共检验；unity 也不是要求所有人变得一样，而是寻找一个群体能够共同承担的方向。',
    links: [
      ['核心实践', '敬拜式事务聚会、澄心会、Queries。'],
      ['它限制谁？', '既限制个人任性，也限制职位垄断。'],
      ['失衡风险', '把共同体变成多数决或权威压制。']
    ]
  },
  testimony: {
    kicker: 'FRUIT',
    title: '见证',
    body: '和平、诚信、简朴、平等之所以重要，不是因为它们是一套品牌价值观，而是因为它们被理解为内在生命在公共世界中反复结出的果子。',
    links: [
      ['从哪里来？', '敬拜中形成的 concern 与对现实的敏感。'],
      ['如何验证？', '生活是否真的发生改变，行动是否能被共同体承担。'],
      ['失衡风险', '把社会行动与灵性根基完全分开。']
    ]
  }
};

const conceptMap = document.querySelector('[data-concept-map]');
const conceptDetail = document.querySelector('[data-concept-detail]');

conceptMap?.querySelectorAll('[data-concept]').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.concept;
    const data = conceptContent[key];
    if (!data || !conceptDetail) return;

    conceptMap.querySelectorAll('[data-concept]').forEach((item) => item.classList.toggle('active', item === button));
    conceptDetail.innerHTML = `
      <p class="kicker">${data.kicker}</p>
      <h2>${data.title}</h2>
      <p>${data.body}</p>
      <dl>${data.links.map(([term, definition]) => `<dt>${term}</dt><dd>${definition}</dd>`).join('')}</dl>
    `;
  });
});


const practiceLibrary = document.querySelector('[data-practice-library]');
const practiceFilterButtons = [...document.querySelectorAll('[data-practice-filter]')];
const practiceAxisButtons = [...document.querySelectorAll('[data-practice-axis]')];
const practiceJumpButtons = [...document.querySelectorAll('[data-jump-practice]')];

function setPracticeFilter(filter, scrollToLibrary = false) {
  const cards = [...(practiceLibrary?.querySelectorAll('[data-axis]') || [])];

  cards.forEach((card) => {
    const axes = (card.dataset.axis || '').split(/\s+/);
    card.hidden = filter !== 'all' && !axes.includes(filter);
  });

  practiceFilterButtons.forEach((button) => {
    const active = button.dataset.practiceFilter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  practiceAxisButtons.forEach((button) => {
    const active = button.dataset.practiceAxis === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (scrollToLibrary && practiceLibrary) {
    const filterBar = document.querySelector('.practice-filter-bar');
    (filterBar || practiceLibrary).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

practiceFilterButtons.forEach((button) => {
  button.addEventListener('click', () => setPracticeFilter(button.dataset.practiceFilter || 'all'));
});

practiceAxisButtons.forEach((button) => {
  button.addEventListener('click', () => setPracticeFilter(button.dataset.practiceAxis || 'all', true));
});

practiceJumpButtons.forEach((button) => {
  button.addEventListener('click', () => setPracticeFilter(button.dataset.jumpPractice || 'all', true));
});

practiceFilterButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
});
practiceAxisButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
});

// Two-system navigation: keep legacy pages reachable while promoting the two primary systems.
document.querySelectorAll('.site-nav').forEach((siteNav) => {
  const theologyLink = [...siteNav.querySelectorAll('a')].find((link) => link.textContent.trim() === '神学');
  const thoughtLink = [...siteNav.querySelectorAll('a')].find((link) => link.getAttribute('href') === 'thought-map.html');
  if (theologyLink && !thoughtLink) {
    const link = document.createElement('a');
    link.href = 'thought-map.html';
    link.textContent = '思想地图';
    theologyLink.insertAdjacentElement('afterend', link);
  }

  const practiceLink = [...siteNav.querySelectorAll('a')].find((link) => link.textContent.trim() === '灵修实践');
  if (practiceLink) {
    practiceLink.href = 'practice-manual.html';
    practiceLink.textContent = '实践手册';
  }
});

const thoughtPeople = {
  fox: {
    kicker: '1624–1691 · ORIGINATING EXPERIENCE',
    title: 'George Fox：把问题从“谁有宗教权威”推回“谁能直接教导人”',
    inherit: '宗教改革后的圣经传统、Seekers 的寻求，以及清教徒对真实敬虔的渴望。',
    shift: '强调基督与圣灵此刻仍能直接触及、纠正和引导人；静默成为等待，而不是空白。',
    today: '“内在”不等于私人的：个人领受要进入敬拜、共同体与生活后果的检验。',
    href: 'person-fox.html', link: '进入 George Fox 人物专题 →'
  },
  barclay: {
    kicker: '1648–1690 · SYSTEMATIC EXPRESSION',
    title: 'Robert Barclay：让“活的经验”接受一套可以公开辩论的神学语言',
    inherit: 'Fox 与早期 Friends 对即时启示、内在基督、等待式敬拜的经验。',
    shift: '把经验组织成关于启示、圣经、普遍救恩、称义、完全、服事与敬拜的十五命题。',
    today: '提醒现代读者：Quaker experience 不是“感觉主义”，它从一开始就有权威、检验与神学边界问题。',
    href: 'person-barclay.html', link: '进入 Robert Barclay 人物专题 →'
  },
  woolman: {
    kicker: '1720–1772 · CONSCIENCE BECOMES WITNESS',
    title: 'John Woolman：让内在不安一路追到金钱、消费、奴隶制与关系',
    inherit: '等待、顺服、良知与“内在之光会纠正人”的早期传统。',
    shift: '把忠实放到具体生活结构中检验：衣着、贸易、旅行方式、奴隶制与经济关系都进入属灵辨识。',
    today: 'Testimony 不是先有价值观清单，而是一个人在现实中被迫调整生活，群体随后逐渐形成共同见证。',
    href: 'person-woolman.html', link: '进入 John Woolman 人物专题 →'
  },
  jones: {
    kicker: '1863–1948 · MODERN REINTERPRETATION',
    title: 'Rufus Jones：把 Quaker inwardness 翻译给现代心理学与宗教经验世界',
    inherit: '内在之光、直接经验、共同体与非圣职中心的传统。',
    shift: '用 mysticism、inner life、religious experience 等现代语言重述 Quaker identity，也因此重新安排了历史重心。',
    today: '他的解释极具影响力，也需要与更早的基督中心语言对读，避免把一种现代解释倒推为全部早期传统。',
    href: 'person-rufus-jones.html', link: '进入 Rufus Jones 人物专题 →'
  },
  kelly: {
    kicker: '1893–1941 · THE INWARD CENTER',
    title: 'Thomas Kelly：把“内在中心”从聚会时刻带进普通工作日',
    inherit: 'Jones 的内在宗教关怀，以及 Friends 持续敬拜、等待与顺服的传统。',
    shift: '强调内在圣所、双层注意与持续祈祷：外层处理事务，深层仍保持敬拜与接受。',
    today: '灵修不必等待退修或特殊状态；成熟更像“忘记后越来越快地回来”，并由此产生更深的世界关切。',
    href: 'person-thomas-kelly.html', link: '进入 Thomas Kelly 人物专题 →'
  },
  palmer: {
    kicker: '1939– · COMMUNITY AS A CONTAINER',
    title: 'Parker Palmer：把“内在老师”放进一个不急着干预人的群体结构',
    inherit: 'Quaker meeting、静默、内在老师，以及 Kelly 所强调的更深中心。',
    shift: '发展第三物、信任圈、clearness practice 与 meeting for learning，把传统转译到教育和群体带领。',
    today: '群体的任务不是替人修理人生，而是设计条件，让一个人的内在声音有机会在关系与现实中变清楚。',
    href: 'person-parker-palmer.html', link: '进入 Parker Palmer 人物专题 →'
  }
};

const thoughtRiver = document.querySelector('[data-thought-river]');
const thoughtDetail = document.querySelector('[data-thought-detail]');
function renderThoughtPerson(key) {
  const data = thoughtPeople[key];
  if (!data || !thoughtRiver || !thoughtDetail) return;
  thoughtRiver.querySelectorAll('[data-thought-person]').forEach((card) => {
    const active = card.dataset.thoughtPerson === key;
    card.classList.toggle('is-active', active);
    card.querySelector('button')?.setAttribute('aria-pressed', String(active));
  });
  thoughtDetail.innerHTML = `
    <p class="kicker">${data.kicker}</p>
    <h3>${data.title}</h3>
    <div class="thought-detail-grid">
      <div><span>承接</span><p>${data.inherit}</p></div>
      <div><span>转向</span><p>${data.shift}</p></div>
      <div><span>今天留下</span><p>${data.today}</p></div>
    </div>
    <a class="text-link" href="${data.href}">${data.link}</a>`;
}
thoughtRiver?.querySelectorAll('[data-thought-person] button').forEach((button) => {
  button.addEventListener('click', () => renderThoughtPerson(button.closest('[data-thought-person]')?.dataset.thoughtPerson));
});

if (thoughtRiver && 'IntersectionObserver' in window) {
  const riverObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, { threshold: .18 });
  riverObserver.observe(thoughtRiver);
}

const lensData = {
  light: [
    ['Fox','基督之光','一种临到、照见并要求回应的真实经验。'],['Barclay','普遍救赎之光','所有人都领受一份可回应或抗拒的恩典。'],['Woolman','良知被照明','光不断触及生活中习以为常的不义。'],['Jones','内在宗教','强调神圣与人的直接关系及神秘经验。'],['Kelly','Divine Center','光成为可在日常深层持续归向的中心。'],['Palmer','Inner Teacher','群体不替人发光，而保护人聆听内在老师的条件。']
  ],
  christ: [
    ['Fox','活的基督','“直接被基督教导”是经验核心。'],['Barclay','历史与内在','历史中的基督与当下内在工作属于同一救恩。'],['Woolman','跟随的尺度','基督的谦卑与和平进入生活方式。'],['Jones','语言被拓宽','现代解释更常把基督放进神秘主义与普遍宗教经验。'],['Kelly','内在圣所','明确把深层中心写成神圣临在主动工作的地方。'],['Palmer','语言转译','在教育文本中更常使用 Inner Teacher / truth 等开放语言。']
  ],
  scripture: [
    ['Fox','被圣灵打开','圣经重要，但需要同一圣灵使文字成为活的。'],['Barclay','次级规则','圣经忠实见证泉源，却不等于泉源本身。'],['Woolman','文本与生活互照','经文与内在不安一起推动伦理检验。'],['Jones','现代批判后重读','让 Quakerism 与现代圣经研究和宗教学对话。'],['Kelly','不以系统释经为中心','更多从祈祷、经验与新约意象进入。'],['Palmer','第三物之一','文本是共同中心，不是压过经验的裁判。']
  ],
  community: [
    ['Fox','Gathered Meeting','静默不是多人各自冥想，而是被同一临在召聚。'],['Barclay','秩序与服事','自由敬拜仍需要共同体纪律。'],['Woolman','共同体见证','个人 concern 逐渐推动 Friends 改变集体实践。'],['Jones','群体神秘主义','强调直接经验，也把 Quaker meeting 视作传统承载体。'],['Kelly','fellowship','深层中心把人带向更真实的相连。'],['Palmer','Circle of Trust','结构的任务是保护灵魂，而不是操控成员。']
  ],
  world: [
    ['Fox','真理必须被活出','见证始于言行一致和拒绝宗教/社会虚饰。'],['Barclay','生活纪律','神学延伸到良心、政权、礼仪与行为。'],['Woolman','最彻底的伦理化','奴隶制、消费与经济关系成为属灵问题。'],['Jones','服务与和平','现代 Quaker identity 更明确进入社会服务与和平工作。'],['Kelly','世界重新进入心中','深层退回不是逃世，而产生更深关切。'],['Palmer','公共生活与教育','完整的人回到制度和共同体，改变参与方式。']
  ],
  practice: [
    ['Fox','等候与顺服','静默中等待，辨认是否被要求说或做。'],['Barclay','可检验的经验','让启示接受圣经、理性与共同体的检验。'],['Woolman','带着 concern 生活','不急着结论，而让不安改变具体选择。'],['Jones','内在阅读与祈祷','用现代语言重新进入传统的内在维度。'],['Kelly','双层注意','工作同时保持深层祈祷，忘记后再回来。'],['Palmer','第三物与开放问题','减少直接干预，让结构承托深听与辨识。']
  ]
};
const lensLab = document.querySelector('[data-lens-lab]');
const lensTrack = document.querySelector('[data-lens-track]');
function renderLens(key) {
  if (!lensTrack || !lensData[key]) return;
  lensTrack.innerHTML = lensData[key].map(([name,title,body]) => `<article class="lens-card"><span>${name}</span><h3>${title}</h3><p>${body}</p></article>`).join('');
  lensLab?.querySelectorAll('[data-lens]').forEach((button) => {
    const active = button.dataset.lens === key; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
}
lensLab?.querySelectorAll('[data-lens]').forEach((button) => button.addEventListener('click', () => renderLens(button.dataset.lens)));
if (lensTrack) renderLens('light');

const scenarioData = {
  solo: { kicker:'SOLO · 10–30 分钟即可开始', title:'一个人：先建立“反复回到中心”的能力', body:'个人实践的目标不是制造特殊体验，而是让注意力有一个稳定返回点。静默、Journal 与 Queries 都可以很轻量，却会为后面的共同辨识建立基础。', tools:[['practice-silent-worship.html','静默 / 等候','10–20 分钟'],['practice-queries.html','Queries','带着一个问题生活'],['practice-silent-worship.html#daily','Journal','记录“什么让我更有生命 / 更收缩”']], boundary:'个人内省不能自动证明一个 leading 是真的；事情越重大，越需要时间、现实事实和共同体检验。' },
  dyad: { kicker:'DYAD · 30–60 分钟', title:'两个人：把“被理解”变成“被真正聆听”', body:'灵性友谊不是互相指导。稳定关系让一个人的变化有见证者，也让承诺、困惑和反复出现的模式有机会被温柔地指出。', tools:[['practice-covenant.html','灵性友谊','长期、低结构'],['practice-worship-sharing.html','二人式敬拜分享','从静默说与听'],['practice-queries.html','开放问题','避免把建议塞进问题']], boundary:'若双方权力明显不对等，或涉及创伤、危机与专业领域，需要更清楚的边界；“深度”不能成为强迫暴露。' },
  group: { kicker:'SMALL GROUP · 60–120 分钟', title:'5–8 人小组：让结构比带领者更可靠', body:'小组最容易滑回聊天、讨论或一个人主导。敬拜式分享、盟约小组和共读通过稳定规则，把注意力重新放回经验、静默和第三物。', tools:[['practice-worship-sharing.html','敬拜式分享','一次 60 分钟'],['practice-covenant.html','盟约小组','数月承诺'],['practice-queries.html','共读 + Query','文本作为第三物']], boundary:'成员越熟，越需要边界；亲密不能取消保密、pass 的自由和“不替别人解释”的纪律。' },
  meeting: { kicker:'CORPORATE · 依据议题长度', title:'群体决策：不是把每个人意见相加，而是寻找共同可承担的方向', body:'敬拜式事务会议让事实、分歧、静默和 minute 处在同一辨识过程里。Clerk 不是主席式裁判，而是聚会感受的聆听者和结构守护者。', tools:[['practice-business-meeting.html','敬拜式事务会议','完整流程'],['practice-business-meeting.html','Unity','不是一致意见'],['practice-business-meeting.html','Sense of the Meeting','由 Clerk 尝试命名']], boundary:'信息不足、成员疲惫或权力压力过强时，“暂不决定”可能比勉强形成 unity 更忠实。' },
  calling: { kicker:'CALLING · 90 分钟到长期陪伴', title:'重大选择与召命：事情越重，支持结构越需要升级', body:'一次澄心会可以帮助清晰，却不能承担数年的服事。Quaker tradition 会根据事情重量，把澄心会、灵性友谊、盟约小组和支持委员会组合起来。', tools:[['practice-clearness.html','澄心会','围绕一个具体问题'],['practice-calling.html','召命辨识','leading / concern / calling'],['practice-faithfulness.html','支持忠实','长期陪伴与问责']], boundary:'医疗、法律、财务和严重心理危机需要专业判断；属灵辨识帮助澄清价值与忠实方向，但不能替代专业服务。' }
};
const scenarioPath = document.querySelector('[data-scenario-path]');
const scenarioDetail = document.querySelector('[data-scenario-detail]');
function renderScenario(key) {
  const data = scenarioData[key]; if (!data || !scenarioDetail) return;
  scenarioPath?.querySelectorAll('[data-scenario]').forEach((button) => { const active=button.dataset.scenario===key; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); });
  scenarioDetail.innerHTML = `<div><p class="kicker">${data.kicker}</p><h3>${data.title}</h3><p>${data.body}</p></div><div class="scenario-tools">${data.tools.map(([href,title,note])=>`<a href="${href}"><b>${title}</b><span>${note}</span></a>`).join('')}</div><p class="scenario-boundary"><strong>边界：</strong>${data.boundary}</p>`;
}
scenarioPath?.querySelectorAll('[data-scenario]').forEach((button) => button.addEventListener('click', () => renderScenario(button.dataset.scenario)));

const flowData = {
  sharing:{title:'敬拜式分享 · 60 分钟',intro:'从静默中说，向静默里听。每一步都在防止小组滑回普通讨论。',steps:[['0–8','进入静默','让身体和注意力降速'],['8–12','读出 Query','问题简单、开放、贴近经验'],['12–50','分享','一次一人，说完回到静默'],['50–58','共同沉淀','不总结内容，让经验继续工作'],['58–60','结束','感谢、提醒保密、回到日常']]},
  clearness:{title:'澄心会 · 90–150 分钟',intro:'群体不替焦点人物作决定，而是帮助他的 Inner Teacher 更容易被听见。',steps:[['准备','写清问题','必要背景而非整部人生史'],['进入','静默与规则','保密、可拒答、只问不建议'],['核心','开放问题','问题之间允许真正的空白'],['中段','检查方向','继续问、静默或换一种方式'],['结束','听见下一步','清晰也可能是“再等等”'],['之后','继续整合','洞见可能在几天后才浮现']]},
  business:{title:'敬拜式事务会议',intro:'共同决策不是投票，也不是温和版辩论，而是让事务进入敬拜。',steps:[['1','进入敬拜','从立场转向共同聆听'],['2','陈述议题','先澄清事实与真正问题'],['3','从静默发言','不回应上一位、不拉票'],['4','形成 minute','Clerk 命名出现的共同方向'],['5','检验 unity','确认、修正或承认尚无清晰']]},
  support:{title:'支持忠实 · 长期',intro:'清晰之后，真正困难的是在时间、关系和现实限制中继续回应。',steps:[['轻','灵性友谊','日常倾听与见证'],['中','盟约小组','规律相见与相互问责'],['集中','澄心会','围绕具体问题集中辨识'],['重','支持委员会','长期陪伴召命与服事']]}
};
const flowLab = document.querySelector('[data-flow-lab]');
const flowVisual = document.querySelector('[data-flow-visual]');
let flowTimers = [];
function renderFlow(key) {
  const data=flowData[key]; if(!data||!flowVisual)return;
  flowTimers.forEach(clearTimeout); flowTimers=[];
  flowLab?.querySelectorAll('[data-flow]').forEach((button)=>{const active=button.dataset.flow===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  flowVisual.innerHTML=`<h3 class="flow-title">${data.title}</h3><p class="flow-intro">${data.intro}</p><div class="animated-flow" style="--flow-count:${data.steps.length}">${data.steps.map(([n,t,p])=>`<article class="flow-step"><span>${n}</span><b>${t}</b><p>${p}</p></article>`).join('')}</div>`;
  const steps=[...flowVisual.querySelectorAll('.flow-step')];
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){steps.forEach(s=>s.classList.add('is-lit'));return;}
  steps.forEach((step,index)=>flowTimers.push(setTimeout(()=>step.classList.add('is-lit'),170*index+80)));
}
flowLab?.querySelectorAll('[data-flow]').forEach((button)=>button.addEventListener('click',()=>renderFlow(button.dataset.flow)));
if(flowVisual)renderFlow('sharing');

document.querySelector('[data-print-page]')?.addEventListener('click', () => window.print());

const personIndex = document.querySelector('.person-index');
if (personIndex && !personIndex.querySelector('a[href="thought-map.html"]')) {
  const mapLink = document.createElement('a');
  mapLink.href = 'thought-map.html';
  mapLink.textContent = '在思想演变地图中定位这个人物 →';
  personIndex.appendChild(mapLink);
}
