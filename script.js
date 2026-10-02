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
