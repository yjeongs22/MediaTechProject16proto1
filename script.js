const pages = ["homePage", "studentPage", "needsPage", "waitingPage", "resultPage", "adminPage", "adminDetailPage"].filter(id => document.getElementById(id));

const pageTitles = {
  homePage: "홈",
  studentPage: "기본 정보 입력",
  needsPage: "시간표 니즈 입력",
  waitingPage: "분석 대기",
  resultPage: "추천 결과",
  adminPage: "관리자 페이지",
  adminDetailPage: "요청 상세 / 시간표 생성"
};

const defaultCourses = [
  {
    id: "data-structure",
    name: "자료구조",
    type: "전공필수",
    day: "월",
    start: "10:00",
    end: "12:00",
    credit: 3,
    difficulty: "높음",
    team: "없음",
    courseCode: "CS201",
    room: "공학관 302호",
    review: "과제는 많지만 전공 기초를 잡기 좋다는 평가가 많습니다. 시험 난이도는 높은 편입니다.",
    syllabus: "스택, 큐, 리스트, 트리, 그래프 등 기본 자료구조와 알고리즘 기초를 학습합니다.",
    color: "#2563eb"
  },
  {
    id: "computer-arch",
    name: "컴퓨터구조",
    type: "전공필수",
    day: "금",
    start: "10:00",
    end: "12:00",
    credit: 3,
    difficulty: "높음",
    team: "없음",
    courseCode: "CS204",
    room: "공학관 405호",
    review: "개념 이해가 중요하며 시험 범위가 넓다는 평가가 있습니다. 팀플 부담은 적습니다.",
    syllabus: "CPU 구조, 명령어 집합, 메모리 계층, 파이프라이닝 등 컴퓨터 시스템 구조를 다룹니다.",
    color: "#0891b2"
  },
  {
    id: "web-programming",
    name: "웹프로그래밍",
    type: "전공선택",
    day: "화",
    start: "13:00",
    end: "15:00",
    credit: 3,
    difficulty: "중간",
    team: "있음",
    courseCode: "CS305",
    room: "새천년관 210호",
    review: "실습 중심이라 결과물이 남는다는 장점이 있습니다. 팀 프로젝트가 있어 일정 관리가 필요합니다.",
    syllabus: "HTML, CSS, JavaScript와 웹 서비스 구현 기초를 배우고 간단한 웹 프로젝트를 제작합니다.",
    color: "#059669"
  },
  {
    id: "database",
    name: "데이터베이스",
    type: "전공선택",
    day: "목",
    start: "13:00",
    end: "15:00",
    credit: 3,
    difficulty: "중간",
    team: "있음",
    courseCode: "CS303",
    room: "공학관 501호",
    review: "SQL 실습이 많고 프로젝트가 포함됩니다. 취업 준비에 도움이 된다는 평가가 있습니다.",
    syllabus: "관계형 데이터베이스, SQL, 정규화, 트랜잭션, 데이터 모델링을 학습합니다.",
    color: "#f97316"
  },
  {
    id: "english",
    name: "교양영어",
    type: "교양필수",
    day: "수",
    start: "09:00",
    end: "11:00",
    credit: 2,
    difficulty: "낮음",
    team: "없음",
    courseCode: "GE101",
    room: "교양관 103호",
    review: "난이도는 낮은 편이지만 오전 수업이라 생활 패턴에 따라 부담이 있을 수 있습니다.",
    syllabus: "기초 영어 읽기, 말하기, 발표를 중심으로 대학 교양 영어 역량을 기릅니다.",
    color: "#db2777"
  },
  {
    id: "creative",
    name: "창의적사고",
    type: "교양선택",
    day: "금",
    start: "14:00",
    end: "16:00",
    credit: 2,
    difficulty: "낮음",
    team: "있음",
    courseCode: "GE220",
    room: "교양관 205호",
    review: "학점 부담은 낮지만 조별 발표가 있어 팀플을 싫어하는 학생에게는 부담이 될 수 있습니다.",
    syllabus: "문제 해결, 아이디어 발상, 팀 기반 발표 활동을 통해 창의적 사고 과정을 익힙니다.",
    color: "#7c3aed"
  },
  {
    id: "ai-basic",
    name: "AI기초",
    type: "전공선택",
    day: "수",
    start: "13:00",
    end: "15:00",
    credit: 3,
    difficulty: "3.0",
    team: "없음",
    online: false,
    courseCode: "CS250",
    room: "AI융합관 301호",
    review: "최근 관심도가 높은 과목이며, 수학 기초가 있으면 따라가기 쉽다는 평가가 있습니다.",
    syllabus: "인공지능 개념, 머신러닝 기초, 데이터 학습 과정, 간단한 모델 활용 사례를 다룹니다.",
    color: "#0f766e"
  }
];

const days = ["월", "화", "수", "목", "금"];
const hours = [9,10,11,12,13,14,15,16,17,18];

let historyStack = ["homePage"];
let waitingPollTimer = null;
const appMode = document.body.dataset.app || "user";

function $(id) {
  return document.getElementById(id);
}

function getData(key) {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const firebaseDocByKey = {
  planpickStudent: "student",
  planpickRequest: "request",
  planpickRequests: "requests",
  planpickCourses: "courses"
};

let cloudDb = null;
let cloudReady = false;

function hasFirebaseConfig() {
  const config = window.PLANPICK_FIREBASE_CONFIG;
  return Boolean(
    config &&
    config.apiKey &&
    config.projectId &&
    !String(config.apiKey).includes("여기에")
  );
}

function waitWithTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(label + " timeout")), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function loadScriptOnce(src, globalCheck) {
  if (globalCheck()) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => reject(new Error(src + " load failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(src + " load failed"));
    document.head.appendChild(script);
  });
}

async function loadFirebaseSdk() {
  if (window.firebase?.firestore) return true;

  try {
    await waitWithTimeout(
      loadScriptOnce("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js", () => Boolean(window.firebase)),
      5000,
      "Firebase app SDK"
    );
    await waitWithTimeout(
      loadScriptOnce("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js", () => Boolean(window.firebase?.firestore)),
      5000,
      "Firebase Firestore SDK"
    );
    return Boolean(window.firebase?.firestore);
  } catch (error) {
    console.warn("Firebase SDK를 불러오지 못했습니다. 로컬 저장 방식으로 실행합니다.", error);
    return false;
  }
}

async function initCloudStorage() {
  if (!hasFirebaseConfig()) {
    return false;
  }

  const loaded = await loadFirebaseSdk();
  if (!loaded || !window.firebase) {
    cloudReady = false;
    return false;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.PLANPICK_FIREBASE_CONFIG);
    }
    cloudDb = firebase.firestore();
    cloudReady = true;
    return true;
  } catch (error) {
    console.warn("Firebase 연결을 초기화하지 못했습니다. 로컬 저장 방식으로 실행합니다.", error);
    cloudReady = false;
    return false;
  }
}

function cloudDocRef(key) {
  if (!cloudReady || !firebaseDocByKey[key]) return null;
  return cloudDb.collection("planpickMvp").doc(firebaseDocByKey[key]);
}

function packCloudValue(key, value) {
  if (key === "planpickCourses" || key === "planpickRequests") return { items: value || [] };
  return value || {};
}

function unpackCloudValue(key, value) {
  if (!value) return null;
  if (key === "planpickCourses" || key === "planpickRequests") return Array.isArray(value.items) ? value.items : null;
  return value;
}

async function getDataAsync(key) {
  const ref = cloudDocRef(key);
  if (!ref) return getData(key);

  try {
    const localValue = getData(key);
    const snapshot = await waitWithTimeout(ref.get(), 5000, `Firebase get ${key}`);
    if (!snapshot.exists) return getData(key);

    const value = unpackCloudValue(key, snapshot.data());
    if (key === "planpickRequests") {
      const merged = mergeRequestLists(
        Array.isArray(localValue) ? localValue : [],
        Array.isArray(value) ? value : []
      );
      setData(key, merged);
      return merged;
    }

    if (value) setData(key, value);
    return value;
  } catch (error) {
    console.warn("Firebase 데이터를 불러오지 못했습니다. 로컬 데이터를 사용합니다.", error);
    return getData(key);
  }
}

async function setDataAsync(key, value) {
  setData(key, value);

  if (!cloudReady) {
    await initCloudStorage();
  }

  const ref = cloudDocRef(key);
  if (!ref) return;

  try {
    await waitWithTimeout(ref.set(packCloudValue(key, value)), 5000, `Firebase set ${key}`);
  } catch (error) {
    console.warn("Firebase에 저장하지 못했습니다. 현재 브라우저에는 저장되었습니다.", error);
  }
}

async function removeDataAsync(key) {
  localStorage.removeItem(key);

  const ref = cloudDocRef(key);
  if (!ref) return;

  try {
    await waitWithTimeout(ref.delete(), 5000, `Firebase delete ${key}`);
  } catch (error) {
    console.warn("Firebase 데이터를 삭제하지 못했습니다.", error);
  }
}

async function hydrateCloudData() {
  if (!cloudReady) return;
  await Promise.all([
    getDataAsync("planpickStudent"),
    getDataAsync("planpickRequest"),
    getDataAsync("planpickRequests"),
    getDataAsync("planpickCourses")
  ]);
}

function getCourses() {
  const stored = getData("planpickCourses");
  if (stored && Array.isArray(stored)) return stored;
  setData("planpickCourses", defaultCourses);
  return defaultCourses;
}

function saveCourses(courses) {
  setData("planpickCourses", courses);
}

function createCourseDraft(index = 0) {
  return {
    id: `custom-${Date.now()}-${index}`,
    name: "새 강의",
    type: "전공선택",
    day: days[0],
    start: "09:00",
    end: "10:00",
    credit: 3,
    difficulty: "3.0",
    team: "없음",
    online: false,
    courseCode: "",
    room: "",
    review: "",
    syllabus: "",
    color: "#2563eb"
  };
}

function getRequestList() {
  const list = getData("planpickRequests");
  if (Array.isArray(list)) return list;

  const legacyRequest = getData("planpickRequest");
  return legacyRequest ? [legacyRequest] : [];
}

function chooseRequestVersion(current, next) {
  if (!current) return next;
  if (!next) return current;
  if (isRequestComplete(next) && !isRequestComplete(current)) return next;
  if (isRequestComplete(current) && !isRequestComplete(next)) return current;
  return next;
}

function upsertRequestInList(list, request) {
  const nextList = Array.isArray(list) ? [...list] : [];
  const requestId = String(request.id);
  const existingIndex = nextList.findIndex(item => String(item.id) === requestId);

  if (existingIndex >= 0) {
    nextList[existingIndex] = chooseRequestVersion(nextList[existingIndex], request);
  } else {
    nextList.push(request);
  }

  return nextList;
}

function mergeRequestLists(localList, cloudList) {
  return [...(localList || []), ...(cloudList || [])].reduce((merged, request) => {
    if (!request) return merged;
    return upsertRequestInList(merged, request);
  }, []);
}

async function getRequestListAsync() {
  const list = await getDataAsync("planpickRequests");
  if (Array.isArray(list)) return list;

  const legacyRequest = await getDataAsync("planpickRequest");
  return legacyRequest ? [legacyRequest] : [];
}

function getCurrentRequestId() {
  return localStorage.getItem("planpickCurrentRequestId");
}

function setCurrentRequestId(id) {
  localStorage.setItem("planpickCurrentRequestId", String(id));
}

function getAdminSelectedRequestId() {
  return localStorage.getItem("planpickAdminRequestId");
}

function setAdminSelectedRequestId(id) {
  localStorage.setItem("planpickAdminRequestId", String(id));
}

async function getRequestByIdAsync(id) {
  const list = await getRequestListAsync();
  return list.find(request => String(request.id) === String(id)) || null;
}

async function getCurrentRequestAsync() {
  const currentId = getCurrentRequestId();
  const localList = getRequestList();
  const localCurrent = currentId
    ? localList.find(request => String(request.id) === String(currentId))
    : null;

  if (localCurrent && !cloudReady) {
    return localCurrent;
  }

  const localLegacy = getData("planpickRequest");

  if (!cloudReady && localLegacy) return localLegacy;

  const cloudList = await getRequestListAsync();
  const cloudCurrent = currentId
    ? cloudList.find(request => String(request.id) === String(currentId))
    : null;

  return chooseRequestVersion(localCurrent, cloudCurrent) || localLegacy || cloudList[cloudList.length - 1] || null;
}

function getPendingRequests(requests) {
  return (requests || []).filter(request => !isRequestComplete(request));
}

async function upsertRequestAsync(request) {
  const localList = upsertRequestInList(getRequestList(), request);
  setData("planpickRequests", localList);
  setData("planpickRequest", request);

  const cloudList = await getRequestListAsync();
  const mergedList = upsertRequestInList(mergeRequestLists(localList, cloudList), request);
  await setDataAsync("planpickRequests", mergedList);
  await setDataAsync("planpickRequest", request);
  return request;
}

function stopWaitingPoll() {
  if (waitingPollTimer) {
    clearInterval(waitingPollTimer);
    waitingPollTimer = null;
  }
}

function startWaitingPoll() {
  stopWaitingPoll();
  waitingPollTimer = setInterval(async () => {
    const activePage = document.querySelector(".page.active")?.id;
    if (activePage !== "waitingPage") {
      stopWaitingPoll();
      return;
    }
    await renderWaiting();
  }, 3000);
}

async function showPage(pageId, pushHistory = true) {
  if (pageId !== "waitingPage") stopWaitingPoll();
  if (!pages.includes(pageId)) pageId = pages[0];
  pages.forEach((id) => $(id).classList.remove("active"));
  $(pageId).classList.add("active");
  $("pageTitle").textContent = pageTitles[pageId] || "플랜픽";

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.go === pageId);
  });

  $("backBtn").classList.toggle("hidden", pageId === "homePage");

  if (pushHistory && historyStack[historyStack.length - 1] !== pageId) {
    historyStack.push(pageId);
  }

  if (pageId === "waitingPage") await renderWaiting();
  if (pageId === "resultPage") await renderResult();
  if (pageId === "adminPage") {
    await renderAdminList();
    renderCourseManager();
  }
  if (pageId === "adminDetailPage") await renderAdminDetail();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

$("backBtn")?.addEventListener("click", () => {
  if (historyStack.length <= 1) {
    showPage(appMode === "admin" ? "adminPage" : "homePage", false);
    return;
  }
  historyStack.pop();
  const prev = historyStack[historyStack.length - 1] || "homePage";
  showPage(prev, false);
});

$("resetBtn")?.addEventListener("click", async () => {
  if (confirm("저장된 MVP 데이터를 모두 초기화할까요? 강의 데이터도 샘플로 복구됩니다.")) {
    await removeDataAsync("planpickStudent");
    await removeDataAsync("planpickRequest");
    await removeDataAsync("planpickRequests");
    localStorage.removeItem("planpickCurrentRequestId");
    localStorage.removeItem("planpickAdminRequestId");
    await setDataAsync("planpickCourses", defaultCourses);
    alert("초기화되었습니다.");
    showPage("homePage");
  }
});

function inferPriorities(text) {
  const source = String(text || "").trim();
  const normalized = source
    .toLowerCase()
    .replace(/[.,!?/\\|()[\]{}<>~^*_+=:;"']/g, " ")
    .replace(/\s+/g, " ");
  const compact = normalized.replace(/\s/g, "");

  const rules = [
    {
      label: "졸업요건",
      reason: "졸업, 필수 과목, 학점 충족과 관련된 표현이 감지됨",
      keywords: ["졸업", "졸업요건", "졸업 조건", "전공필수", "교양필수", "필수", "필수과목", "요건", "학점 채우", "학점채우", "밀리면", "미루면", "꼭 들어", "반드시"],
      patterns: [/졸업.*(밀|요건|조건|필수|학점)/, /(전공|교양).*필수/]
    },
    {
      label: "공강",
      reason: "공강, 쉬는 날, 특정 요일 비우기와 관련된 표현이 감지됨",
      keywords: ["공강", "금공강", "월공강", "화공강", "수공강", "목공강", "쉬는날", "쉬는 날", "하루 비", "비워", "비었", "수업 없는 날", "몰아듣"],
      patterns: [/(월|화|수|목|금).*공강/, /(하루|요일).*(비워|쉬)/]
    },
    {
      label: "오전 수업 회피",
      reason: "오전·아침 수업을 피하고 싶은 표현이 감지됨",
      keywords: ["오전", "아침", "9시", "1교시", "일찍", "늦잠", "오후", "오전피", "아침수업", "오전 수업"],
      patterns: [/(오전|아침|9시|1교시).*(싫|피|힘들|빼|없)/, /(늦게|오후).*(시작|수업)/]
    },
    {
      label: "학점 방어",
      reason: "성적, 난이도, 과제 부담과 관련된 표현이 감지됨",
      keywords: ["학점", "성적", "평점", "A+", "에이쁠", "꿀강", "쉬운", "쉽게", "널널", "난이도", "과제 적", "시험 쉬", "학점방어", "학점 방어"],
      patterns: [/(학점|성적|평점).*(잘|방어|챙|높)/, /(쉬운|널널|꿀).*(수업|강의|과목)/]
    },
    {
      label: "팀플 회피",
      reason: "팀플, 조별과제, 발표 부담을 피하고 싶은 표현이 감지됨",
      keywords: ["팀플", "팀 프로젝트", "팀프로젝트", "조별", "조별과제", "발표", "협업", "혼자", "개인과제"],
      patterns: [/(팀플|조별|발표).*(싫|피|없|적|힘들)/, /(개인|혼자).*(과제|수업)/]
    },
    {
      label: "전공 실력",
      reason: "전공 역량, 취업, 프로젝트와 관련된 표현이 감지됨",
      keywords: ["전공", "실력", "취업", "포트폴리오", "프로젝트", "개발", "코딩", "실무", "역량", "스펙", "깊게", "배우고"],
      patterns: [/(전공|개발|코딩|실무).*(실력|역량|늘|키우|배우)/, /(취업|포트폴리오|스펙).*(도움|필요|준비)/]
    }
  ];

  const scored = rules.map(rule => {
    let score = 0;
    rule.keywords.forEach(keyword => {
      if (compact.includes(keyword.replace(/\s/g, "").toLowerCase())) score += 2;
    });
    rule.patterns.forEach(pattern => {
      if (pattern.test(normalized)) score += 3;
    });
    return { label: rule.label, score, reason: rule.reason };
  });

  const sorted = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const unclearInput = compact.length < 8 || ["아무거나", "상관없", "모르겠", "추천해줘", "알아서", "무난"].some(keyword => compact.includes(keyword));

  if (sorted.length === 0 || unclearInput) {
    return [
      { label: "졸업요건", score: 1, reason: "조건이 모호해 기본적으로 졸업 안정성을 우선 적용" },
      { label: "공강", score: 1, reason: "일반적으로 체감 만족도가 높은 시간표 조건으로 보조 적용" },
      { label: "학점 방어", score: 1, reason: "난이도와 성적 부담을 낮추는 방향으로 보조 적용" }
    ];
  }

  const fallbackOrder = ["졸업요건", "공강", "학점 방어", "오전 수업 회피", "팀플 회피", "전공 실력"];
  while (sorted.length < 3) {
    const fallback = fallbackOrder.find(label => !sorted.some(item => item.label === label));
    const fallbackRule = rules.find(rule => rule.label === fallback);
    sorted.push({ label: fallback, score: 1, reason: fallbackRule?.reason || "부족한 우선순위를 기본 추천 기준으로 보완" });
  }

  return sorted;
}

function renderPriorityList(containerId, priorities) {
  const container = typeof containerId === "string" ? $(containerId) : containerId;
  if (!container) return;
  container.innerHTML = "";

  if (!priorities || priorities.length === 0) {
    container.textContent = "분석된 우선순위가 없습니다.";
    return;
  }

  priorities.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "priority-item";
    div.title = item.reason || "";
    div.innerHTML = `<span>${index + 1}</span>${item.label}`;
    container.appendChild(div);
  });
}

function normalizeKeywordText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function inferKeywords(text) {
  const compact = normalizeKeywordText(text);
  if (!compact) return [];

  const rules = [
    {
      label: "졸업요건",
      reason: "졸업, 필수 과목, 학점 충족과 관련된 표현",
      keywords: ["졸업", "졸업요건", "졸업조건", "전공필수", "교양필수", "필수과목", "필수", "요건", "학점채우", "학점충족", "밀리면", "반드시"]
    },
    {
      label: "공강",
      reason: "공강, 쉬는 날, 특정 요일을 비우고 싶은 표현",
      keywords: ["공강", "금공강", "월공강", "화공강", "수공강", "목공강", "쉬는날", "수업없는날", "하루비우", "비워", "비었", "몰아서"]
    },
    {
      label: "오전 수업 회피",
      reason: "오전, 아침, 1교시 수업 부담과 관련된 표현",
      keywords: ["오전", "오전수업", "아침", "아침수업", "9시", "1교시", "일찍", "늦잠", "오후시작", "늦게시작"]
    },
    {
      label: "학점 방어",
      reason: "성적, 평점, 난이도, 과제 부담과 관련된 표현",
      keywords: ["학점", "학점방어", "성적", "평점", "A+", "에이쁠", "꿀강", "쉬운", "쉽게", "널널", "난이도", "과제적", "시험적"]
    },
    {
      label: "팀플 회피",
      reason: "팀플, 조별과제, 발표 부담과 관련된 표현",
      keywords: ["팀플", "팀프로젝트", "조별", "조별과제", "발표", "협업", "혼자", "개인과제"]
    },
    {
      label: "전공 실력",
      reason: "전공 역량, 취업, 프로젝트와 관련된 표현",
      keywords: ["전공", "실력", "취업", "포트폴리오", "프로젝트", "개발", "코딩", "실무", "역량", "스펙", "깊게", "배우고"]
    },
    {
      label: "온라인 선호",
      reason: "온라인, 비대면, 녹화 강의와 관련된 표현",
      keywords: ["온라인", "비대면", "녹화", "원격", "인터넷강의", "인강"]
    }
  ];

  return rules
    .map(rule => {
      const matched = rule.keywords.filter(keyword => compact.includes(normalizeKeywordText(keyword)));
      return {
        label: rule.label,
        score: matched.length,
        matched: [...new Set(matched)],
        reason: rule.reason
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

function inferPriorities(text) {
  return inferKeywords(text);
}

function getRequestKeywords(request) {
  return request?.keywords || request?.detectedKeywords || request?.inferredPriorities || [];
}

function renderKeywordList(containerId, keywords) {
  const container = typeof containerId === "string" ? $(containerId) : containerId;
  if (!container) return;
  container.innerHTML = "";

  if (!keywords || keywords.length === 0) {
    container.textContent = "입력에서 인식된 키워드가 없습니다.";
    return;
  }

  keywords.forEach((item) => {
    const div = document.createElement("div");
    div.className = "priority-item keyword-item";
    div.title = item.reason || "";
    const matched = Array.isArray(item.matched) && item.matched.length
      ? `<em>${escapeHtml(item.matched.join(", "))}</em>`
      : "";
    div.innerHTML = `<span>#</span>${escapeHtml(item.label)}${matched}`;
    container.appendChild(div);
  });
}

function renderPriorityList(containerId, priorities) {
  renderKeywordList(containerId, priorities);
}

function setCreditGoal(value) {
  const input = $("creditInput");
  const valueText = $("creditValueText");
  if (!input) return;

  const nextValue = Math.max(1, Number(value || 18));
  input.value = `${nextValue}학점`;
  if (valueText) valueText.textContent = `${nextValue}학점`;
}

function setupCreditSelector() {
  const input = $("creditInput");
  const rangeInput = $("creditRangeInput");
  const overToggle = $("creditOverToggle");
  const overPanel = $("creditOverPanel");
  const overInput = $("creditOverInput");
  if (!input || !rangeInput) return;

  const sync = () => {
    const isOver = Boolean(overToggle?.checked);
    if (overPanel) overPanel.classList.toggle("hidden", !isOver);

    if (isOver) {
      const nextValue = Math.max(22, Number(overInput?.value || 22));
      if (overInput) overInput.value = String(nextValue);
      setCreditGoal(nextValue);
      return;
    }

    setCreditGoal(rangeInput.value);
  };

  rangeInput.addEventListener("input", sync);
  overToggle?.addEventListener("change", sync);
  overInput?.addEventListener("input", sync);
  sync();
}

$("saveStudentBtn")?.addEventListener("click", async () => {
  const student = {
    school: $("schoolInput").value.trim(),
    major: $("majorInput").value.trim(),
    studentNumber: $("studentNumberInput").value.trim(),
    grade: $("gradeInput").value,
    creditGoal: $("creditInput").value
  };

  if (!student.school || !student.major || !student.studentNumber || !student.grade) {
    alert("학교, 학과, 학번, 학년은 꼭 입력해주세요.");
    return;
  }

  setData("planpickStudent", student);
  setDataAsync("planpickStudent", student);
  showPage("needsPage");
});

$("submitRequestBtn")?.addEventListener("click", async () => {
  const student = getData("planpickStudent");
  if (!student) {
    alert("기본 정보를 먼저 입력해주세요.");
    showPage("studentPage");
    return;
  }

  const needText = $("needTextInput").value.trim();
  if (!needText) {
    alert("원하는 시간표 조건을 자유 입력에 적어주세요.");
    return;
  }

  const keywords = inferKeywords(needText);

  const request = {
    id: Date.now(),
    createdAt: new Date().toLocaleString("ko-KR"),
    status: "대기중",
    needText,
    keywords,
    detectedKeywords: keywords,
    inferredPriorities: keywords,
    result: null,
    student
  };

  upsertRequestAsync(request);
  setCurrentRequestId(request.id);
  showPage("waitingPage");
});

function isRequestComplete(request) {
  return Boolean(request && request.result && (request.status === "완료" || request.status === "?꾨즺"));
}

async function renderWaiting() {
  const request = await getCurrentRequestAsync();
  const isComplete = isRequestComplete(request);

  $("waitingCard").classList.toggle("complete", isComplete);
  $("waitingLoader").classList.toggle("hidden", isComplete);
  $("waitingCompleteIcon").classList.toggle("hidden", !isComplete);
  $("waitingStatusChip").textContent = isComplete ? "분석 완료" : "분석 대기중";
  $("waitingTitle").textContent = isComplete ? "분석이 완료되었습니다" : "요청이 접수되었습니다";
  $("waitingMessage").textContent = isComplete
    ? "추천 결과가 준비되었습니다. 결과 화면에서 시간표와 장단점을 확인하세요."
    : "요청을 확인하는 중입니다. 결과가 준비되면 이 화면이 자동으로 완료 상태로 바뀝니다.";
  $("waitingResultBtn").className = isComplete ? "primary-btn pulse-btn" : "secondary-btn hidden";
  $("waitingResultBtn").textContent = isComplete ? "완료된 결과 확인하기" : "결과 확인";

  if (request) {
    renderKeywordList("waitingPriorityBox", getRequestKeywords(request));
  }

  if (isComplete) {
    stopWaitingPoll();
  } else {
    startWaitingPoll();
  }
}

function getCourseById(id) {
  return getCourses().find(course => course.id === id);
}

function isOnlineCourse(course) {
  return course?.online === true || course?.online === "true";
}

function getCourseScheduleText(course) {
  return isOnlineCourse(course)
    ? "온라인 · 시간 지정 없음"
    : `${course.day || "요일 미입력"} ${course.start || ""}~${course.end || ""}`;
}

function normalizeDifficultyRating(value) {
  const text = String(value ?? "").trim();
  const mapped = {
    "높음": 4.5,
    "중간": 3.0,
    "낮음": 2.0
  };
  const numeric = mapped[text] ?? Number(text);
  if (!Number.isFinite(numeric)) return 3.0;
  return Math.min(5, Math.max(0, Math.round(numeric * 10) / 10));
}

function formatDifficultyRating(value) {
  return normalizeDifficultyRating(value).toFixed(1);
}

function timeToHour(time) {
  return Number(String(time).split(":")[0]);
}

function renderTimetable(containerId, courses) {
  const container = $(containerId);
  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "timetable-wrap";

  const onlineCourses = courses.filter(isOnlineCourse);
  if (onlineCourses.length) {
    const onlineBox = document.createElement("div");
    onlineBox.className = "online-course-list";
    onlineBox.innerHTML = `<strong>온라인 과목</strong><p>시간표 칸에는 넣지 않고 별도로 수강하면 되는 과목입니다.</p>`;
    onlineCourses.forEach(course => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "online-course-item";
      button.innerHTML = `<span>${escapeHtml(course.name)}</span><small>${Number(course.credit || 0)}학점 · ${escapeHtml(course.type || "구분 없음")}</small>`;
      button.addEventListener("click", () => openCourseModal(course));
      onlineBox.appendChild(button);
    });
    wrap.appendChild(onlineBox);
  }

  const grid = document.createElement("div");
  grid.className = "timetable-grid";

  const corner = document.createElement("div");
  corner.className = "grid-header";
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  corner.textContent = "";
  grid.appendChild(corner);

  days.forEach((day, index) => {
    const header = document.createElement("div");
    header.className = "grid-header";
    header.style.gridColumn = String(index + 2);
    header.style.gridRow = "1";
    header.textContent = day;
    grid.appendChild(header);
  });

  hours.forEach((hour, rowIndex) => {
    const timeCell = document.createElement("div");
    timeCell.className = "time-cell";
    timeCell.style.gridColumn = "1";
    timeCell.style.gridRow = String(rowIndex + 2);
    timeCell.textContent = `${String(hour).padStart(2, "0")}:00`;
    grid.appendChild(timeCell);

    days.forEach((day, dayIndex) => {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.gridColumn = String(dayIndex + 2);
      cell.style.gridRow = String(rowIndex + 2);
      grid.appendChild(cell);
    });
  });

  courses.filter(course => !isOnlineCourse(course)).forEach(course => {
    const dayIndex = days.indexOf(course.day);
    const startHour = timeToHour(course.start);
    const endHour = timeToHour(course.end);
    const startRow = hours.indexOf(startHour) + 2;
    const span = Math.max(endHour - startHour, 1);

    if (dayIndex === -1 || startRow < 2) return;

    const block = document.createElement("div");
    block.className = "course-block";
    block.style.gridColumn = String(dayIndex + 2);
    block.style.gridRow = `${startRow} / span ${span}`;
    block.style.background = course.color || "#2563eb";
    block.innerHTML = `
      ${course.name}
      <small>${course.start}~${course.end}</small>
      <small>${course.room || "강의실 미입력"}</small>
    `;
    block.addEventListener("click", () => openCourseModal(course));
    grid.appendChild(block);
  });

  wrap.appendChild(grid);
  container.appendChild(wrap);
}

function renderCourseSummary(containerId, courses) {
  const container = $(containerId);
  container.innerHTML = "";

  const totalCredit = courses.reduce((sum, course) => sum + Number(course.credit || 0), 0);
  const total = document.createElement("span");
  total.className = "course-pill";
  total.textContent = `총 ${totalCredit}학점`;
  container.appendChild(total);

  courses.forEach(course => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "course-pill course-pill-btn";
    pill.title = "눌러서 강의 정보를 확인";
    pill.textContent = `${course.name} (${getCourseScheduleText(course)})`;
    pill.addEventListener("click", () => openCourseModal(course));
    container.appendChild(pill);
  });
}

function getRecommendedCourses(request) {
  const plans = ["plan1", "plan2", "plan3"].map(key => request.result?.[key] || {});
  const uniqueIds = [...new Set(plans.flatMap(plan => plan.courseIds || []))];
  return uniqueIds.map(getCourseById).filter(Boolean);
}

function ensureCourseListModal() {
  let modal = $("courseListModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "courseListModal";
  modal.className = "modal hidden";
  modal.innerHTML = `
    <div class="modal-backdrop" data-close-course-list></div>
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <span class="tag">추천 과목</span>
          <h3>추천 과목 전체 보기</h3>
        </div>
        <button class="ghost-btn" type="button" data-close-course-list>×</button>
      </div>
      <div id="courseListModalContent"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelectorAll("[data-close-course-list]").forEach(button => {
    button.addEventListener("click", closeCourseListModal);
  });
  return modal;
}

function closeCourseListModal() {
  $("courseListModal")?.classList.add("hidden");
}

function openRecommendedCoursesModal(courses) {
  const modal = ensureCourseListModal();
  const content = $("courseListModalContent");
  const typeCounts = courses.reduce((map, course) => {
    const type = course.type || "구분 없음";
    map.set(type, (map.get(type) || 0) + 1);
    return map;
  }, new Map());

  content.innerHTML = `
    <div class="course-list-summary">
      <div><strong>${courses.length}</strong><span>추천 과목</span></div>
      <div><strong>${typeCounts.size}</strong><span>과목 종류</span></div>
    </div>
    <div class="type-count-list">
      ${[...typeCounts].map(([type, count]) => `<span>${escapeHtml(type)} ${count}개</span>`).join("")}
    </div>
    <div class="modal-course-list"></div>
  `;

  const list = content.querySelector(".modal-course-list");
  courses.forEach(course => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-course-item";
    button.innerHTML = `
      <strong>${escapeHtml(course.name)}</strong>
      <span>${escapeHtml(course.type || "구분 없음")} · ${escapeHtml(getCourseScheduleText(course))} · ${Number(course.credit || 0)}학점</span>
    `;
    button.addEventListener("click", () => {
      closeCourseListModal();
      openCourseModal(course);
    });
    list.appendChild(button);
  });

  modal.classList.remove("hidden");
}

function renderResultOverview(request) {
  const box = $("resultOverview");
  if (!box) return;
  const courses = getRecommendedCourses(request);
  const typeCount = new Set(courses.map(course => course.type || "구분 없음")).size;
  box.innerHTML = `
    <button class="overview-card overview-button" type="button" data-open-recommended-courses>
      <strong>${courses.length}</strong><span>추천 과목</span><small>눌러서 전체 보기</small>
    </button>
    <div class="overview-card"><strong>${typeCount}</strong><span>과목 종류</span></div>
    <div class="overview-card"><strong>Plan B</strong><span>대안 포함</span></div>
  `;
  box.querySelector("[data-open-recommended-courses]")?.addEventListener("click", () => {
    openRecommendedCoursesModal(courses);
  });
}

async function renderResult() {
  const request = await getCurrentRequestAsync();

  $("resultEmpty").classList.add("hidden");
  $("resultPending").classList.add("hidden");
  $("resultContent").classList.add("hidden");

  if (!request) {
    $("resultEmpty").classList.remove("hidden");
    return;
  }

  if (!isRequestComplete(request)) {
    $("resultPending").classList.remove("hidden");
    return;
  }

  renderKeywordList("resultPriorityList", getRequestKeywords(request));

  ["plan1", "plan2", "plan3"].forEach(planKey => {
    const plan = request.result[planKey] || {};
    const courses = (plan.courseIds || []).map(getCourseById).filter(Boolean);

    renderCourseSummary(`${planKey}CourseSummary`, courses);
    renderTimetable(`${planKey}Timetable`, courses);
    $(`${planKey}ProsText`).textContent = plan.pros || "입력된 장점 없음";
    $(`${planKey}ConsText`).textContent = plan.cons || "입력된 단점 없음";
  });

  $("planBText").textContent = request.result.planB || "입력된 Plan B가 없습니다.";
  $("resultContent").classList.remove("hidden");
  renderResultOverview(request);
}

document.querySelectorAll("[data-plan-tab]").forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.planTab;
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".plan-panel").forEach(panel => panel.classList.remove("active"));

    button.classList.add("active");
    $(`${target}Panel`).classList.add("active");
  });
});

async function renderAdminList() {
  const requests = await getRequestListAsync();
  const pendingRequests = getPendingRequests(requests)
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  const list = $("adminRequestList");

  $("adminEmpty").classList.toggle("hidden", pendingRequests.length > 0);
  if (!list) return;
  list.innerHTML = "";

  pendingRequests.forEach(request => {
    const student = request.student || {};
    const card = document.createElement("div");
    card.className = "admin-card request-card";
    card.innerHTML =
      '<div class="admin-row">' +
        '<span class="status-chip">' + escapeHtml(request.status || "대기중") + '</span>' +
        '<span class="muted">' + escapeHtml(request.createdAt || "") + '</span>' +
      '</div>' +
      '<h3>' + escapeHtml(student.school || "학교 미입력") + ' ' + escapeHtml(student.major || "학과 미입력") + ' / ' + escapeHtml(student.grade || "학년 미입력") + '</h3>' +
      '<p>' + escapeHtml(request.needText || "요청 내용 없음") + '</p>' +
      '<div class="priority-list"></div>' +
      '<button class="primary-btn width-fit" type="button" data-open-request="' + escapeAttr(request.id) + '">요청 상세 보기</button>';
    list.appendChild(card);
    renderKeywordList(card.querySelector(".priority-list"), getRequestKeywords(request));
  });

  list.querySelectorAll("[data-open-request]").forEach(button => {
    button.addEventListener("click", () => {
      setAdminSelectedRequestId(button.dataset.openRequest);
      showPage("adminDetailPage");
    });
  });
}

function makePrompt(student, request) {
  const courses = getCourses();
  const priorityText = getRequestKeywords(request)
    .map((item) => `- ${item.label}${item.matched?.length ? `: ${item.matched.join(", ")}` : ""} (${item.reason})`)
    .join("\n");

  return `너는 대학생 수강 전략을 추천하는 AI야.

아래 학생 정보와 사용자의 자유 입력, 그리고 앱이 감지한 키워드를 바탕으로 시간표 3안을 추천해줘.
중요: 아래 샘플 과목 데이터에 있는 과목명만 사용해줘.

학생 정보:
- 학교: ${student.school}
- 학과: ${student.major}
- 학번: ${student.studentNumber}
- 학년: ${student.grade}
- 목표 학점: ${student.creditGoal || "미입력"}

사용자 자유 입력:
${request.needText}

반영된 키워드:
${priorityText || "감지된 키워드 없음"}

샘플 과목 데이터:
${courses.map((course, index) => `${index + 1}. ${course.name} / ${course.type} / ${getCourseScheduleText(course)} / ${course.credit}학점 / 강의실 ${course.room || "미입력"} / 강의코드 ${course.courseCode || "미입력"} / 난이도 ${formatDifficultyRating(course.difficulty)}/5 / 온라인 ${isOnlineCourse(course) ? "예" : "아니오"} / 팀플 ${course.team}`).join("\n")}

결과 형식:
1안: 졸업 안정형
- 추천 과목:
- 장점:
- 단점:

2안: 생활 균형형
- 추천 과목:
- 장점:
- 단점:

3안: 학점 방어형
- 추천 과목:
- 장점:
- 단점:

Plan B:
- 실패 시 우선 잡아야 할 과목 TOP 3:
- 대체 과목:
- 졸업요건 영향:
- 다음 학기 부담 예측:`;
}

function renderCoursePickers() {
  const courses = getCourses();

  ["plan1", "plan2", "plan3"].forEach(planKey => {
    const picker = $(`${planKey}CoursePicker`);
    picker.innerHTML = "";

    courses.forEach(course => {
      const id = `${planKey}-${course.id}`;
      const label = document.createElement("label");
      label.className = "course-option";
      label.innerHTML = `
        <input type="checkbox" value="${course.id}" id="${id}" data-plan="${planKey}">
        <div>
          <strong>${course.name}</strong>
          <span>${course.type} · ${getCourseScheduleText(course)} · ${course.credit}학점 · 난이도 ${formatDifficultyRating(course.difficulty)}/5 · ${course.room || "강의실 미입력"}</span>
        </div>
      `;
      picker.appendChild(label);
    });
  });
}

function getSelectedCourseIds(planKey) {
  return Array.from(document.querySelectorAll(`input[data-plan="${planKey}"]:checked`))
    .map(input => input.value);
}

function setSelectedCourseIds(planKey, courseIds) {
  document.querySelectorAll(`input[data-plan="${planKey}"]`).forEach(input => {
    input.checked = courseIds.includes(input.value);
  });
}

async function renderAdminDetail() {
  const selectedId = getAdminSelectedRequestId();
  const pendingRequests = getPendingRequests(await getRequestListAsync());
  const request = selectedId ? await getRequestByIdAsync(selectedId) : pendingRequests[0];
  const student = request?.student || await getDataAsync("planpickStudent");

  if (!student || !request) {
    alert("처리할 요청이 없습니다.");
    showPage("adminPage");
    return;
  }

  $("detailStudentInfo").textContent =
    `${student.school} / ${student.major} / ${student.studentNumber}학번 / ${student.grade} / 목표 ${student.creditGoal || "미입력"}`;

  $("detailNeedText").textContent = request.needText;
  renderKeywordList("detailPriorityText", getRequestKeywords(request));

  $("promptText").textContent = makePrompt(student, request);

  renderCoursePickers();

  if (request.result) {
    ["plan1", "plan2", "plan3"].forEach(planKey => {
      const plan = request.result[planKey] || {};
      setSelectedCourseIds(planKey, plan.courseIds || []);
      $(`${planKey}ProsInput`).value = plan.pros || "";
      $(`${planKey}ConsInput`).value = plan.cons || "";
    });
    $("planBInput").value = request.result.planB || "";
  }
}

$("copyPromptBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("promptText").textContent);
    alert("프롬프트를 복사했습니다.");
  } catch {
    alert("복사에 실패했습니다. 직접 드래그해서 복사해주세요.");
  }
});

$("fillExampleBtn")?.addEventListener("click", () => {
  setSelectedCourseIds("plan1", ["data-structure", "computer-arch", "english", "ai-basic"]);
  $("plan1ProsInput").value = "전공필수 2개와 교양필수를 포함해 졸업요건 충족에 가장 안정적인 시간표입니다.";
  $("plan1ConsInput").value = "수요일 오전 수업과 금요일 수업이 있어 오전 회피와 금공강 선호는 일부 포기해야 합니다.";

  setSelectedCourseIds("plan2", ["web-programming", "database", "ai-basic", "creative"]);
  $("plan2ProsInput").value = "오후 수업 위주로 구성되어 오전 부담이 적고, 전공선택을 균형 있게 챙길 수 있습니다.";
  $("plan2ConsInput").value = "전공필수 과목이 부족해 다음 학기 졸업요건 부담이 커질 수 있습니다.";

  setSelectedCourseIds("plan3", ["english", "creative", "ai-basic", "web-programming"]);
  $("plan3ProsInput").value = "난이도가 낮거나 중간 수준인 과목 위주라 학점 방어에 유리합니다.";
  $("plan3ConsInput").value = "전공필수 충족률이 낮아 졸업 안정성은 1안보다 떨어집니다.";

  $("planBInput").value = "자료구조 수강신청 실패 시 컴퓨터구조를 우선 확보하고, 전공선택은 AI기초 또는 웹프로그래밍으로 대체하는 것이 좋습니다.";
});

$("saveResultBtn")?.addEventListener("click", async () => {
  const selectedId = getAdminSelectedRequestId();
  const request = selectedId ? await getRequestByIdAsync(selectedId) : null;

  if (!request) {
    alert("저장할 요청이 없습니다.");
    return;
  }

  const updated = {
    ...request,
    status: "완료",
    result: {
      plan1: {
        courseIds: getSelectedCourseIds("plan1"),
        pros: $("plan1ProsInput").value.trim(),
        cons: $("plan1ConsInput").value.trim()
      },
      plan2: {
        courseIds: getSelectedCourseIds("plan2"),
        pros: $("plan2ProsInput").value.trim(),
        cons: $("plan2ConsInput").value.trim()
      },
      plan3: {
        courseIds: getSelectedCourseIds("plan3"),
        pros: $("plan3ProsInput").value.trim(),
        cons: $("plan3ConsInput").value.trim()
      },
      planB: $("planBInput").value.trim()
    }
  };

  const anyCourseSelected =
    updated.result.plan1.courseIds.length ||
    updated.result.plan2.courseIds.length ||
    updated.result.plan3.courseIds.length;

  if (!anyCourseSelected) {
    alert("최소 한 개 이상의 과목을 선택해주세요.");
    return;
  }

  await upsertRequestAsync(updated);
  localStorage.removeItem("planpickAdminRequestId");
  alert("결과가 저장되었습니다. 관리자 목록에서는 처리된 요청이 사라집니다.");
  showPage("adminPage");
});

function renderCourseManager() {
  const courses = getCourses();
  const container = $("courseManager");
  if (!container) return;
  container.innerHTML = "";

  courses.forEach((course, index) => {
    const online = isOnlineCourse(course);
    const card = document.createElement("div");
    card.className = "course-edit-card";
    card.innerHTML = `
      <div class="course-edit-header">
        <h3>${index + 1}. ${escapeHtml(course.name || "새 강의")}</h3>
        <button class="tiny-btn danger-light-btn" type="button" data-delete-course="${index}">삭제</button>
      </div>
      <div class="course-edit-grid">
        <div>
          <label>과목명</label>
          <input data-course-field="name" data-course-index="${index}" value="${escapeAttr(course.name)}">
        </div>
        <div>
          <label>구분</label>
          <input data-course-field="type" data-course-index="${index}" value="${escapeAttr(course.type)}">
        </div>
        <div>
          <label>강의코드</label>
          <input data-course-field="courseCode" data-course-index="${index}" value="${escapeAttr(course.courseCode || "")}">
        </div>
        <div>
          <label>온라인 강의</label>
          <label class="inline-check">
            <input type="checkbox" data-course-field="online" data-course-index="${index}" ${online ? "checked" : ""}>
            <span>온라인 과목</span>
          </label>
        </div>
        <div>
          <label>요일</label>
          <select data-course-field="day" data-course-index="${index}" data-schedule-field="true" ${online ? "disabled" : ""}>
            ${days.map(day => `<option ${course.day === day ? "selected" : ""}>${day}</option>`).join("")}
          </select>
        </div>
        <div>
          <label>시작</label>
          <input data-course-field="start" data-course-index="${index}" data-schedule-field="true" value="${escapeAttr(course.start)}" ${online ? "disabled" : ""}>
        </div>
        <div>
          <label>종료</label>
          <input data-course-field="end" data-course-index="${index}" data-schedule-field="true" value="${escapeAttr(course.end)}" ${online ? "disabled" : ""}>
        </div>
        <div>
          <label>학점</label>
          <input data-course-field="credit" data-course-index="${index}" value="${escapeAttr(course.credit)}">
        </div>
        <div>
          <label>강의실</label>
          <input data-course-field="room" data-course-index="${index}" value="${escapeAttr(course.room || "")}">
        </div>
        <div>
          <label>색상</label>
          <input data-course-field="color" data-course-index="${index}" value="${escapeAttr(course.color || "#2563eb")}">
        </div>
        <div>
          <label>난이도 평점</label>
          <input type="number" min="0" max="5" step="0.1" data-course-field="difficulty" data-course-index="${index}" value="${escapeAttr(formatDifficultyRating(course.difficulty))}">
        </div>
        <div>
          <label>팀플</label>
          <input data-course-field="team" data-course-index="${index}" value="${escapeAttr(course.team || "")}">
        </div>
        <div class="wide">
          <label>강의평</label>
          <textarea data-course-field="review" data-course-index="${index}">${escapeHtml(course.review || "")}</textarea>
        </div>
        <div class="wide">
          <label>강의계획서</label>
          <textarea data-course-field="syllabus" data-course-index="${index}">${escapeHtml(course.syllabus || "")}</textarea>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function collectCoursesFromManager() {
  const courses = getCourses().map(course => ({ ...course }));

  document.querySelectorAll("[data-course-field]").forEach(input => {
    const index = Number(input.dataset.courseIndex);
    const field = input.dataset.courseField;
    if (!courses[index]) return;

    let value = input.type === "checkbox" ? input.checked : input.value;
    if (field === "credit") value = Number(value) || 0;
    if (field === "difficulty") value = formatDifficultyRating(value);
    courses[index][field] = value;
  });

  return courses;
}

$("addCourseBtn")?.addEventListener("click", () => {
  const courses = collectCoursesFromManager();
  courses.push(createCourseDraft(courses.length + 1));
  saveCourses(courses);
  renderCourseManager();
});

$("courseManager")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-course]");
  if (!button) return;

  const courses = collectCoursesFromManager();
  if (courses.length <= 1) {
    alert("강의는 최소 1개 이상 있어야 합니다.");
    return;
  }

  const index = Number(button.dataset.deleteCourse);
  const courseName = courses[index]?.name || "이 강의";
  if (!confirm(`${courseName}을(를) 삭제할까요?`)) return;

  courses.splice(index, 1);
  saveCourses(courses);
  renderCourseManager();
});

$("courseManager")?.addEventListener("change", (event) => {
  if (event.target?.dataset?.courseField !== "online") return;
  saveCourses(collectCoursesFromManager());
  renderCourseManager();
});

$("saveCoursesBtn")?.addEventListener("click", async () => {
  const courses = collectCoursesFromManager();

  await setDataAsync("planpickCourses", courses);
  alert("강의 정보가 저장되었습니다. 저장된 정보는 시간표와 강의 상세창에 반영됩니다.");
  renderCourseManager();
});

$("resetCoursesBtn")?.addEventListener("click", async () => {
  if (confirm("강의 데이터를 샘플 상태로 되돌릴까요?")) {
    await setDataAsync("planpickCourses", defaultCourses);
    renderCourseManager();
  }
});

function openCourseModal(course) {
  $("modalType").textContent = course.type || "구분 없음";
  $("modalTitle").textContent = course.name || "강의명 없음";
  $("modalCode").textContent = course.courseCode || "미입력";
  $("modalRoom").textContent = course.room || "미입력";
  $("modalTime").textContent = `${course.day || ""} ${course.start || ""}~${course.end || ""}`;
  $("modalCredit").textContent = `${course.credit || 0}학점`;
  $("modalReview").textContent = course.review || "등록된 강의평이 없습니다.";
  $("modalSyllabus").textContent = course.syllabus || "등록된 강의계획서가 없습니다.";
  $("courseModal").classList.remove("hidden");
}

function closeCourseModal() {
  $("courseModal").classList.add("hidden");
}

$("closeModalBtn")?.addEventListener("click", closeCourseModal);
$("modalBackdrop")?.addEventListener("click", closeCourseModal);

async function syncCloudDataAfterLoad() {
  try {
    const ready = await initCloudStorage();
    if (!ready) return;

    await hydrateCloudData();

    const activePage = document.querySelector(".page.active")?.id;
    if (activePage === "adminPage") await renderAdminList();
    if (activePage === "adminDetailPage") await renderAdminDetail();
    if (activePage === "waitingPage") await renderWaiting();
    if (activePage === "resultPage") await renderResult();
    if (appMode === "admin") renderCourseManager();
  } catch (error) {
    console.warn("Firebase background sync failed.", error);
  }
}

window.addEventListener("load", () => {
  setupCreditSelector();
  getCourses();
  showPage(appMode === "admin" ? "adminPage" : "homePage", false);
  syncCloudDataAfterLoad();
});
