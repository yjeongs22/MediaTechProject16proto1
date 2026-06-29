export interface Course {
  id: string;
  name: string;
  type: string;
  day: string;
  start: string;
  end: string;
  credit: number;
  difficulty: string;
  team: string;
  courseCode: string;
  room: string;
  review: string;
  syllabus: string;
  color: string;
}

export const defaultCourses: Course[] = [
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
    color: "#2563eb",
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
    color: "#0891b2",
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
    color: "#059669",
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
    color: "#f97316",
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
    color: "#db2777",
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
    color: "#7c3aed",
  },
  {
    id: "ai-basic",
    name: "AI기초",
    type: "전공선택",
    day: "수",
    start: "13:00",
    end: "15:00",
    credit: 3,
    difficulty: "중간",
    team: "없음",
    courseCode: "CS250",
    room: "AI융합관 301호",
    review: "최근 관심도가 높은 과목이며, 수학 기초가 있으면 따라가기 쉽다는 평가가 있습니다.",
    syllabus: "인공지능 개념, 머신러닝 기초, 데이터 학습 과정, 간단한 모델 활용 사례를 다룹니다.",
    color: "#0f766e",
  },
];

export function getCourses(): Course[] {
  try {
    const stored = localStorage.getItem("planpickCourses");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return defaultCourses;
}

export function saveCourses(courses: Course[]) {
  localStorage.setItem("planpickCourses", JSON.stringify(courses));
}
