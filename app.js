const courses = [
  {
    id: "MC101",
    name: "미디어커뮤니케이션입문",
    category: "전공필수",
    credits: 3,
    day: "월",
    start: 2,
    end: 4,
    difficulty: 3,
    team: 2,
    success: 4,
    requirement: 5,
  },
  {
    id: "MC102",
    name: "커뮤니케이션이론",
    category: "전공필수",
    credits: 3,
    day: "화",
    start: 6,
    end: 8,
    difficulty: 4,
    team: 2,
    success: 3,
    requirement: 5,
  },
  {
    id: "MC201",
    name: "디지털미디어론",
    category: "전공필수",
    credits: 3,
    day: "목",
    start: 3,
    end: 5,
    difficulty: 3,
    team: 1,
    success: 4,
    requirement: 5,
  },
  {
    id: "MC202",
    name: "미디어조사방법론",
    category: "전공필수",
    credits: 3,
    day: "수",
    start: 1,
    end: 3,
    difficulty: 5,
    team: 3,
    success: 2,
    requirement: 5,
  },
  {
    id: "MC211",
    name: "콘텐츠기획실습",
    category: "전공선택",
    credits: 3,
    day: "월",
    start: 6,
    end: 8,
    difficulty: 3,
    team: 3,
    success: 3,
    requirement: 3,
  },
  {
    id: "MC212",
    name: "영상편집과스토리텔링",
    category: "전공선택",
    credits: 3,
    day: "화",
    start: 3,
    end: 5,
    difficulty: 2,
    team: 2,
    success: 4,
    requirement: 3,
  },
  {
    id: "MC213",
    name: "광고와브랜드전략",
    category: "전공선택",
    credits: 3,
    day: "목",
    start: 6,
    end: 8,
    difficulty: 2,
    team: 3,
    success: 5,
    requirement: 3,
  },
  {
    id: "MC214",
    name: "AI와미디어산업",
    category: "전공선택",
    credits: 3,
    day: "금",
    start: 2,
    end: 4,
    difficulty: 3,
    team: 1,
    success: 2,
    requirement: 3,
  },
  {
    id: "MC215",
    name: "플랫폼비즈니스",
    category: "전공선택",
    credits: 3,
    day: "수",
    start: 5,
    end: 7,
    difficulty: 4,
    team: 2,
    success: 3,
    requirement: 3,
  },
  {
    id: "GE101",
    name: "글쓰기와토론",
    category: "교양필수",
    credits: 2,
    day: "수",
    start: 3,
    end: 4,
    difficulty: 2,
    team: 1,
    success: 4,
    requirement: 4,
  },
  {
    id: "GE102",
    name: "대학영어",
    category: "교양필수",
    credits: 2,
    day: "금",
    start: 5,
    end: 6,
    difficulty: 2,
    team: 1,
    success: 5,
    requirement: 4,
  },
  {
    id: "GE103",
    name: "컴퓨팅적사고",
    category: "교양필수",
    credits: 2,
    day: "화",
    start: 1,
    end: 2,
    difficulty: 3,
    team: 2,
    success: 3,
    requirement: 4,
  },
  {
    id: "GE211",
    name: "현대사회와윤리",
    category: "교양선택",
    credits: 3,
    day: "목",
    start: 1,
    end: 3,
    difficulty: 1,
    team: 1,
    success: 5,
    requirement: 2,
  },
  {
    id: "GE212",
    name: "창의적문제해결",
    category: "교양선택",
    credits: 3,
    day: "금",
    start: 7,
    end: 9,
    difficulty: 2,
    team: 3,
    success: 4,
    requirement: 2,
  },
  {
    id: "GE213",
    name: "문화예술의이해",
    category: "교양선택",
    credits: 3,
    day: "월",
    start: 9,
    end: 11,
    difficulty: 1,
    team: 1,
    success: 3,
    requirement: 2,
  },
  {
    id: "GE214",
    name: "데이터리터러시",
    category: "교양선택",
    credits: 3,
    day: "수",
    start: 8,
    end: 10,
    difficulty: 3,
    team: 1,
    success: 4,
    requirement: 2,
  },
];

const days = ["월", "화", "수", "목", "금"];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let generatedPlans = [];
let activeWeights = { grad: 0.4, life: 0.25, easy: 0.2, success: 0.15 };
let activePreferenceFlags = { avoidMorning: false, avoidTeam: false };
let preferredFreeDays = new Set();

const form = document.querySelector("#plannerForm");
const recognizedCourseList = document.querySelector("#recognizedCourseList");
const cards = document.querySelector("#scheduleCards");
const resultHint = document.querySelector("#resultHint");
const historyImage = document.querySelector("#historyImage");
const recognitionNote = document.querySelector("#recognitionNote");
const addRecognizedCourse = document.querySelector("#addRecognizedCourse");
const preferenceText = document.querySelector("#preferenceText");
const fillExample = document.querySelector("#fillExample");
const analyzePreference = document.querySelector("#analyzePreference");
const analysisList = document.querySelector("#analysisList");
const planSelect = document.querySelector("#planSelect");
const failedCourseSelect = document.querySelector("#failedCourseSelect");
const planBResults = document.querySelector("#planBResults");
const makePlanB = document.querySelector("#makePlanB");

const examplePreference =
  "저는 오전 수업은 최대한 피하고 싶고, 금요일 공강이면 좋겠어요. 팀플 많은 과목은 싫고, 이번 학기는 학점도 챙기고 싶어요. 그래도 전공필수는 밀리면 안 돼요.";

const recognizedPresets = {
  1: {
    label: "이미지 1",
    note: "이미지 1 인식 결과: 기본 이수 과목 5개를 찾았습니다.",
    ids: ["MC101", "GE101", "GE102", "GE103", "GE211"],
    text: ["미디어커뮤니케이션입문", "글쓰기와토론", "대학영어", "컴퓨팅적사고", "현대사회와윤리"],
  },
  2: {
    label: "이미지 2",
    note: "이미지 2 인식 결과: 전공필수와 교양필수 포함 6개 과목을 찾았습니다.",
    ids: ["MC101", "MC102", "GE101", "GE102", "GE103", "GE211"],
    text: ["미디어커뮤니케이션입문", "커뮤니케이션이론", "글쓰기와토론", "대학영어", "컴퓨팅적사고", "현대사회와윤리"],
  },
  3: {
    label: "이미지 3",
    note: "이미지 3 인식 결과: 전공선택까지 포함해 6개 과목을 찾았습니다.",
    ids: ["MC101", "MC102", "MC201", "GE101", "MC211", "MC212"],
    text: [
      "미디어커뮤니케이션입문",
      "커뮤니케이션이론",
      "디지털미디어론",
      "글쓰기와토론",
      "콘텐츠기획실습",
      "영상편집과스토리텔링",
    ],
  },
};

const preferenceRules = [
  {
    label: "전공필수 이수",
    bucket: "grad",
    terms: ["전공필수", "필수", "졸업", "밀리면 안", "밀리면 안 돼", "밀리면 안돼"],
    strongTerms: ["전공필수", "밀리면 안", "밀리면 안 돼", "밀리면 안돼"],
  },
  {
    label: "오전 수업 회피",
    bucket: "life",
    terms: [
      "오전",
      "아침",
      "1교시",
      "2교시",
      "일찍",
      "늦게 시작",
      "오후",
      "오후 수업",
      "오후 수업만",
      "오후에만",
      "오후만",
      "낮 수업",
    ],
    strongTerms: [
      "오전 수업",
      "오전은 싫",
      "아침 수업",
      "아침 일찍",
      "오후 수업만",
      "오후에만",
      "오후만",
      "늦게 시작",
    ],
    apply: () => {
      activePreferenceFlags.avoidMorning = true;
    },
  },
  {
    label: "공강 선호",
    bucket: "life",
    terms: [
      "공강",
      "월공강",
      "화공강",
      "수공강",
      "목공강",
      "금공강",
      "월 공강",
      "화 공강",
      "수 공강",
      "목 공강",
      "금 공강",
      "월요일 공강",
      "화요일 공강",
      "수요일 공강",
      "목요일 공강",
      "금요일 공강",
      "월요일 비워",
      "화요일 비워",
      "수요일 비워",
      "목요일 비워",
      "금요일 비워",
      "월요일 쉬",
      "화요일 쉬",
      "수요일 쉬",
      "목요일 쉬",
      "금요일 쉬",
    ],
    strongTerms: [
      "월공강",
      "화공강",
      "수공강",
      "목공강",
      "금공강",
      "월 공강",
      "화 공강",
      "수 공강",
      "목 공강",
      "금 공강",
      "월요일 공강",
      "화요일 공강",
      "수요일 공강",
      "목요일 공강",
      "금요일 공강",
    ],
  },
  {
    label: "팀플 적은 과목",
    bucket: "easy",
    terms: ["팀플", "조별", "조모임"],
    strongTerms: ["팀플"],
    apply: () => {
      activePreferenceFlags.avoidTeam = true;
    },
  },
  {
    label: "학점 방어",
    bucket: "easy",
    terms: ["학점", "성적", "난이도", "꿀강"],
    strongTerms: ["학점"],
  },
  {
    label: "수강신청 성공 가능성",
    bucket: "success",
    terms: ["성공", "경쟁률", "잔여석", "인원", "잡기 쉬운"],
    strongTerms: ["성공", "경쟁률"],
  },
];

function normalizeText(text) {
  return text.replace(/\s+/g, "").toLowerCase();
}

function extractPreferredFreeDays(text) {
  const compact = normalizeText(text);
  const dayMap = [
    ["월", ["월공강", "월요일공강", "월요일비워", "월요일쉬", "월요일빼", "월요일없"]],
    ["화", ["화공강", "화요일공강", "화요일비워", "화요일쉬", "화요일빼", "화요일없"]],
    ["수", ["수공강", "수요일공강", "수요일비워", "수요일쉬", "수요일빼", "수요일없"]],
    ["목", ["목공강", "목요일공강", "목요일비워", "목요일쉬", "목요일빼", "목요일없"]],
    ["금", ["금공강", "금요일공강", "금요일비워", "금요일쉬", "금요일빼", "금요일없"]],
  ];
  return new Set(
    dayMap
      .filter(([, terms]) => terms.some((term) => compact.includes(term)))
      .map(([day]) => day),
  );
}

function formatFreeDays(daySet) {
  return [...daySet].map((day) => `${day}요일`).join(", ");
}

function matchCourseByText(value) {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  return courses.find((course) => {
    const aliases = [course.name, course.id, course.name.replace(/과/g, ""), course.name.replace(/와/g, "")].map(normalizeText);
    return aliases.some((alias) => alias && (normalized.includes(alias) || alias.includes(normalized)));
  });
}

function createRecognizedRow(value = "") {
  const row = document.createElement("div");
  row.className = "recognized-row";
  row.innerHTML = `
    <div>
      <input type="text" value="${value}" aria-label="인식된 과목명" />
      <span class="recognized-meta"></span>
    </div>
    <button class="remove-course" type="button" aria-label="과목 삭제">×</button>
  `;
  const input = row.querySelector("input");
  const meta = row.querySelector(".recognized-meta");
  const remove = row.querySelector(".remove-course");

  function updateMeta() {
    const matched = matchCourseByText(input.value);
    meta.textContent = matched
      ? `매칭됨: ${matched.category} · ${matched.credits}학점`
      : "미매칭: 과목명을 수정하거나 추천 계산에서 제외됩니다";
    meta.style.color = matched ? "var(--green)" : "var(--amber)";
  }

  input.addEventListener("input", updateMeta);
  remove.addEventListener("click", () => row.remove());
  updateMeta();
  return row;
}

function renderRecognizedCourses(values) {
  recognizedCourseList.innerHTML = "";
  values.forEach((value) => {
    recognizedCourseList.appendChild(createRecognizedRow(value));
  });
}

function initRecognizedCourses() {
  renderRecognizedCourses([]);
  recognitionNote.textContent =
    "아직 인식된 과목이 없습니다. 이미지 1/2/3을 선택하거나 파일을 넣으면 결과가 표시돼요.";
}

function applyRecognizedPreset(presetKey) {
  const preset = recognizedPresets[presetKey] || recognizedPresets[1];
  renderRecognizedCourses(preset.text);
  recognitionNote.textContent = `${preset.note} 잘못 인식된 과목명은 직접 고치거나 삭제할 수 있어요.`;
}

function presetFromFileName(fileName) {
  const name = fileName.toLowerCase();
  if (name.includes("3") || name.includes("third")) return 3;
  if (name.includes("2") || name.includes("second")) return 2;
  return 1;
}

function getWeights() {
  return activeWeights;
}

function analyzePreferenceText() {
  const text = preferenceText.value.trim();
  activePreferenceFlags = { avoidMorning: false, avoidTeam: false };
  const extractedFreeDays = extractPreferredFreeDays(text);
  preferredFreeDays = extractedFreeDays;

  const results = preferenceRules
    .map((rule) => {
      let score = 0;
      rule.terms.forEach((term) => {
        if (text.includes(term)) score += 1;
      });
      rule.strongTerms.forEach((term) => {
        if (text.includes(term)) score += 2;
      });
      return { ...rule, score };
    })
    .filter((rule) => rule.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (!results.length) {
    analysisList.innerHTML = "<li>조건을 더 구체적으로 적어주세요.</li>";
    return;
  }

  const rankWeights = [35, 25, 20, 10, 10];
  const buckets = { grad: 0, life: 0, easy: 0, success: 0 };
  results.forEach((rule, index) => {
    buckets[rule.bucket] += rankWeights[index] || 0;
    if (rule.apply) rule.apply();
  });

  const total = Object.values(buckets).reduce((sum, value) => sum + value, 0) || 100;
  activeWeights = {
    grad: buckets.grad / total,
    life: buckets.life / total,
    easy: buckets.easy / total,
    success: buckets.success / total,
  };

  analysisList.innerHTML = results
    .map((rule, index) => {
      const label =
        rule.label === "공강 선호" && preferredFreeDays.size
          ? `${formatFreeDays(preferredFreeDays)} 공강 선호`
          : rule.label;
      return `<li>${index + 1}순위: ${label}</li>`;
    })
    .join("");
}

function getPreferences() {
  const freeDays = new Set(preferredFreeDays);

  return {
    avoidMorning: activePreferenceFlags.avoidMorning,
    preferredFreeDays: freeDays,
    avoidTeam: activePreferenceFlags.avoidTeam,
  };
}

function getCompletedIds() {
  const ids = [...recognizedCourseList.querySelectorAll("input")]
    .map((input) => matchCourseByText(input.value))
    .filter(Boolean)
    .map((course) => course.id);
  return new Set(ids);
}

function overlaps(a, b) {
  if (a.day !== b.day) return false;
  return a.start <= b.end && b.start <= a.end;
}

function hasConflict(combo) {
  for (let i = 0; i < combo.length; i += 1) {
    for (let j = i + 1; j < combo.length; j += 1) {
      if (overlaps(combo[i], combo[j])) return true;
    }
  }
  return false;
}

function getCredits(combo) {
  return combo.reduce((sum, course) => sum + course.credits, 0);
}

function dayFree(combo, day) {
  return combo.every((course) => course.day !== day);
}

function respectsPreferredFreeDays(combo, prefs) {
  return [...(prefs.preferredFreeDays || [])].every((day) => dayFree(combo, day));
}

function preferredFreeDayCourseCount(combo, prefs) {
  return combo.filter((course) => prefs.preferredFreeDays && prefs.preferredFreeDays.has(course.day)).length;
}

function morningCount(combo) {
  return combo.filter((course) => course.start <= 2).length;
}

function teamLoad(combo) {
  return combo.reduce((sum, course) => sum + course.team, 0);
}

function difficultyLoad(combo) {
  return combo.reduce((sum, course) => sum + course.difficulty, 0);
}

function requirementScore(course, completed) {
  if (completed.has(course.id)) return -100;
  const categoryBoost = {
    전공필수: 1.0,
    교양필수: 0.82,
    전공선택: 0.62,
    교양선택: 0.42,
  };
  return (categoryBoost[course.category] || 0.4) * course.requirement;
}

function scoreCombo(combo, completed, weights, prefs, mode) {
  const credits = getCredits(combo);
  if (combo.length < 5 || combo.length > 6) return -Infinity;
  if (credits < 13 || credits > 18) return -Infinity;
  if (hasConflict(combo)) return -Infinity;

  const modeBoost = {
    stable: { grad: 0.18, life: -0.04, easy: -0.02, success: 0 },
    balanced: { grad: -0.02, life: 0.16, easy: 0, success: 0 },
    easy: { grad: -0.04, life: 0, easy: 0.18, success: 0.02 },
  }[mode];

  const adjusted = {
    grad: Math.max(0, weights.grad + modeBoost.grad),
    life: Math.max(0, weights.life + modeBoost.life),
    easy: Math.max(0, weights.easy + modeBoost.easy),
    success: Math.max(0, weights.success + modeBoost.success),
  };
  const adjustedTotal = Object.values(adjusted).reduce((sum, value) => sum + value, 0) || 1;
  Object.keys(adjusted).forEach((key) => {
    adjusted[key] /= adjustedTotal;
  });

  const gradScore = combo.reduce((sum, course) => sum + requirementScore(course, completed), 0) * 10;
  let lifeScore = 50;
  if (prefs.preferredFreeDays && prefs.preferredFreeDays.size) {
    const freeDayConflictCount = preferredFreeDayCourseCount(combo, prefs);
    lifeScore += freeDayConflictCount === 0 ? 34 : freeDayConflictCount * -45;
  }
  if (prefs.avoidMorning) lifeScore -= morningCount(combo) * 10;
  const dayCount = new Set(combo.map((course) => course.day)).size;
  lifeScore += Math.max(0, 5 - dayCount) * 4;

  let easyScore = 100 - difficultyLoad(combo) * 5;
  if (prefs.avoidTeam) easyScore -= teamLoad(combo) * 4;

  const successScore = combo.reduce((sum, course) => sum + course.success, 0) * 7;
  const creditFitScore = 100 - Math.abs(15 - credits) * 8;

  return (
    gradScore * adjusted.grad +
    lifeScore * adjusted.life +
    easyScore * adjusted.easy +
    successScore * adjusted.success +
    creditFitScore * 0.08
  );
}

function combinations(items, size, start = 0, chosen = [], output = []) {
  if (chosen.length === size) {
    output.push([...chosen]);
    return output;
  }
  for (let i = start; i < items.length; i += 1) {
    chosen.push(items[i]);
    combinations(items, size, i + 1, chosen, output);
    chosen.pop();
  }
  return output;
}

function generatePlan(mode, completed, weights, prefs) {
  const available = courses.filter((course) => !completed.has(course.id));
  const allCombos = [
    ...combinations(available, 5),
    ...combinations(available, 6),
  ];

  const rankCombos = (combos) => combos
    .map((combo) => ({
      courses: combo,
      score: scoreCombo(combo, completed, weights, prefs, mode),
    }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  let ranked = [];
  if (prefs.preferredFreeDays && prefs.preferredFreeDays.size) {
    ranked = rankCombos(allCombos.filter((combo) => respectsPreferredFreeDays(combo, prefs)));
  }
  if (!ranked.length) ranked = rankCombos(allCombos);

  return ranked[0];
}

function makePlans() {
  const completed = getCompletedIds();
  const weights = getWeights();
  const prefs = getPreferences();
  const modes = [
    { key: "stable", title: "1안 졸업 안정형", desc: "전공필수와 졸업요건 충족을 가장 크게 반영" },
    { key: "balanced", title: "2안 생활 균형형", desc: "공강, 오전 회피, 하루 수업 부담을 크게 반영" },
    { key: "easy", title: "3안 학점 방어형", desc: "난이도와 팀플 부담을 낮추는 방향으로 반영" },
  ];

  return modes.map((mode) => {
    const plan = generatePlan(mode.key, completed, weights, prefs);
    return {
      ...mode,
      ...plan,
    };
  });
}

function getReasons(plan, prefs) {
  const reasons = [];
  const requiredCount = plan.courses.filter((course) => course.category.includes("필수")).length;
  reasons.push(`필수 과목 ${requiredCount}개 포함, 총 ${getCredits(plan.courses)}학점`);
  if (prefs.preferredFreeDays && prefs.preferredFreeDays.size) {
    [...prefs.preferredFreeDays].forEach((day) => {
      if (dayFree(plan.courses, day)) reasons.push(`${day}요일 수업 없음`);
    });
  }
  if (prefs.avoidMorning && morningCount(plan.courses) === 0) reasons.push("오전 수업 없음");
  const easyAvg = difficultyLoad(plan.courses) / plan.courses.length;
  reasons.push(`평균 난이도 ${easyAvg.toFixed(1)} / 5`);
  return reasons;
}

function renderMiniGrid(combo) {
  const cells = [];
  cells.push("<div></div>");
  days.forEach((day) => cells.push(`<div>${day}</div>`));

  for (let period = 1; period <= 10; period += 1) {
    cells.push(`<div>${period}</div>`);
    days.forEach((day) => {
      const course = combo.find((item) => item.day === day && item.start <= period && item.end >= period);
      cells.push(`<div class="${course ? "course-block" : ""}">${course ? course.name.slice(0, 4) : ""}</div>`);
    });
  }
  return `<div class="mini-grid">${cells.join("")}</div>`;
}

function renderPlans() {
  const prefs = getPreferences();
  cards.classList.remove("empty-state");
  cards.innerHTML = generatedPlans
    .map((plan, index) => {
      const reasons = getReasons(plan, prefs);
      const courseRows = plan.courses
        .map(
          (course) => `
          <div class="course-row">
            <div>
              <strong>${course.name}</strong>
              <span>${course.day} ${course.start}-${course.end}교시 · ${course.credits}학점</span>
            </div>
            <span class="tag">${course.category}</span>
          </div>
        `,
        )
        .join("");

      return `
        <article class="schedule-card">
          <div class="card-header">
            <div>
              <h3>${plan.title}</h3>
              <p>${plan.desc}</p>
            </div>
            <div class="score-badge">${Math.round(plan.score)}점</div>
          </div>
          <div class="card-body">
            <div class="course-list">${courseRows}</div>
            <ul class="reason-list">${reasons.map((reason) => `<li>${reason}</li>`).join("")}</ul>
            ${renderMiniGrid(plan.courses)}
          </div>
        </article>
      `;
    })
    .join("");

  resultHint.textContent = "샘플 데이터 기준 룰 기반 계산 결과입니다.";
  planSelect.innerHTML = generatedPlans
    .map((plan, index) => `<option value="${index}">${plan.title}</option>`)
    .join("");
  updateFailedCourseOptions();
}

function updateFailedCourseOptions() {
  const plan = generatedPlans[Number(planSelect.value)] || generatedPlans[0];
  if (!plan) {
    failedCourseSelect.innerHTML = "";
    return;
  }
  failedCourseSelect.innerHTML = plan.courses
    .map((course) => `<option value="${course.id}">${course.name}</option>`)
    .join("");
}

function findPlanB() {
  const plan = generatedPlans[Number(planSelect.value)];
  if (!plan) return;
  const failedId = failedCourseSelect.value;
  const failedCourse = courses.find((course) => course.id === failedId);
  const baseCourses = plan.courses.filter((course) => course.id !== failedId);
  const completed = getCompletedIds();
  const weights = getWeights();
  const prefs = getPreferences();

  const replacements = courses
    .filter((course) => !completed.has(course.id))
    .filter((course) => course.id !== failedId)
    .filter((course) => !baseCourses.some((base) => base.id === course.id))
    .filter((course) => course.category === failedCourse.category || course.category.includes("필수"))
    .map((course) => {
      const combo = [...baseCourses, course];
      return {
        course,
        combo,
        score: scoreCombo(combo, completed, weights, prefs, "stable"),
      };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!replacements.length) {
    planBResults.className = "planb-results empty-state";
    planBResults.innerHTML = "<p>조건을 만족하는 대체 과목이 없습니다.</p>";
    return;
  }

  planBResults.classList.remove("empty-state");
  planBResults.innerHTML = replacements
    .map((item, index) => {
      const course = item.course;
      const sameCategory = course.category === failedCourse.category;
      const notes = [
        sameCategory ? "동일 이수구분 대체 가능" : "필수 요건 보완 가능",
        hasConflict(item.combo) ? "시간 충돌 있음" : "시간 충돌 없음",
        `예상 점수 ${Math.round(item.score)}점`,
      ];
      return `
        <article class="replacement-card">
          <h3>${index + 1}순위 ${course.name}</h3>
          <p>${course.category} · ${course.day} ${course.start}-${course.end}교시 · ${course.credits}학점</p>
          <ul class="reason-list">${notes.map((note) => `<li>${note}</li>`).join("")}</ul>
        </article>
      `;
    })
    .join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (preferenceText.value.trim()) analyzePreferenceText();
  generatedPlans = makePlans();
  renderPlans();
  planBResults.className = "planb-results empty-state";
  planBResults.innerHTML = "<p>실패한 과목을 선택하고 대체 플랜을 찾아보세요.</p>";
});

planSelect.addEventListener("change", updateFailedCourseOptions);
makePlanB.addEventListener("click", findPlanB);
fillExample.addEventListener("click", () => {
  preferenceText.value = examplePreference;
  analyzePreferenceText();
});
analyzePreference.addEventListener("click", analyzePreferenceText);
historyImage.addEventListener("change", () => {
  const file = historyImage.files && historyImage.files[0];
  if (!file) return;
  const preset = presetFromFileName(file.name);
  applyRecognizedPreset(preset);
});
document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    applyRecognizedPreset(button.dataset.preset);
  });
});
addRecognizedCourse.addEventListener("click", () => {
  recognizedCourseList.appendChild(createRecognizedRow(""));
});

initRecognizedCourses();
