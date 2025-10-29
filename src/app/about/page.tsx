import { Metadata } from "next";
import { ProjectCard } from "@/components/about/ProjectCard";

export const metadata: Metadata = {
  title: "소개",
  description: "KyoongDev에 대해 알아보세요.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            안녕하세요, Miles입니다 👋
          </h1>
        </div>

        <div className="space-y-12">
          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
                  Email
                </span>
                <a
                  href="mailto:9898junjun2@gmail.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  9898junjun2@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Educations */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Educations
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  건국대학교 산업공학과 2017.03 ~ 2025.08
                </p>
              </div>
            </div>
          </section>

          {/* About Me */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                기술은 '작동하는 도구'가 아닌 '문제를 해결하는 방법'이라고
                믿습니다. 단순히 기술을 사용하는 데 그치지 않고,{" "}
                <strong>동작 원리와 내부 구조에 대한 깊이 있는 탐구</strong>를
                바탕으로 문제의 본질을 꿰뚫는 개발자가 되고자 합니다. 코드의
                변화가 시스템에 미치는 영향을 면밀히 고려하여{" "}
                <strong>보다 견고하고 예측 가능한 설계</strong>를 추구합니다.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>
                  Java & Spring Boot, TypeScript & NestJS 기반의 백엔드 개발
                </strong>
                을 합니다. 실행 계획 분석을 통해 인덱스 설계, 정규화/비정규화
                구조 조정, JdbcTemplate 등의 전략을 활용하여{" "}
                <strong>API 응답 속도를 20초 이상에서 10초 이내로 단축</strong>
                하고, <strong>Batch 처리 시간을 70% 이상 단축</strong>한 경험이
                있습니다. 또한 AWS + Terraform 기반의 인프라 구성, Docker 멀티
                스테이지 빌드 및 캐시 최적화를 통해{" "}
                <strong>CI/CD 효율성과 배포 속도 모두를 개선</strong>하며{" "}
                <strong>확장 가능한 운영 환경을 설계</strong>한 경험이 있습니다.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                AI를 단순한 도구가 아닌 <strong>업무 파트너</strong>로 삼아,
                반복 작업 자동화는 물론{" "}
                <strong>
                  테스트 케이스 생성, 회의록 요약, 코드 리뷰, 설계 대안 탐색 등
                  다양한 개발 업무에 적극 활용
                </strong>
                하고 있습니다. 특히 AI에게 적절한 프롬프트를 설계하고 다양한
                시나리오를 실험하면서,{" "}
                <strong>더 빠르고 창의적인 문제 해결 방식</strong>을 찾아내고
                있습니다. 기술의 본질을 이해하려는 집요함과 변화에 열린 태도를
                기반으로,{" "}
                <strong>더 나은 시스템과 팀을 만들 수 있는 개발자</strong>로
                계속 성장하고 있습니다.
              </p>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Backend
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Java, NodeJS(Typescript)</li>
                  <li>
                    • Spring Boot, Spring Batch, Spring Data JPA/Redis, NestJS
                  </li>
                  <li>• JPA, Querydsl, Prisma</li>
                  <li>• JUnit 5, Jest, Supertest</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  DevOps
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• MySQL, PostgreSQL</li>
                  <li>
                    • AWS CodeDeploy, AWS CodeBuild, AWS CodePipeline, Github
                    Actions
                  </li>
                  <li>• AWS EC2, S3, RDS (Aurora), Cloud Watch</li>
                  <li>• Docker</li>
                  <li>• Grafana, Prometheus</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Frontend
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• React, NextJS</li>
                  <li>• TanStack Query</li>
                  <li>• Jotai</li>
                  <li>• SCSS, styled-components</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Tools
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• ChatGPT, Cursor, Augment, Claude</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Experiences */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Experiences
            </h2>
            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      (주)마인이스
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      2025.04 ~
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Operations Software 개발자
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-4 ml-4">
                  <li>• 입출고 프로세스 자동화 프로그램 개발</li>
                  <li>• WMS 프로그램 인프라 및 CI/CD 환경 구축</li>
                  <li>
                    • Grafana Cloud, Prometheus를 사용한 서버 로그 및 메트릭
                    정보 수집
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      퓨저블
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      2021.10 ~ 2022.10
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Co-Founder / Backend 개발자
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-4 ml-4">
                  <li>
                    • Express 라우터를 자동으로 등록하고 스웨거 문서를 자동
                    생성하는 사내 라이브러리 개발
                  </li>
                  <li>
                    • 각 외주 업무사의 상황에 따라 배포 상황을 공유할 수 있는
                    슬랙 알람 연동
                  </li>
                  <li>• 외주 프로젝트의 프런트엔드 및 백엔드 개발 담당</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      휴몬랩
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      2020.11 ~ 2021.03 (인턴)
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Backend 개발자
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-4 ml-4">
                  <li>
                    • 개발자 유형 찾기 웹 개발
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>
                        - 개발자의 유형을 찾을 수 있는 마케팅 서비스의 웹 및
                        서버 개발
                      </li>
                    </ul>
                  </li>
                  <li>
                    • 모각코 운영
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>- 코딩 교육에 필요한 자료 수집 및 매니지먼트</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Projects
            </h2>
            <div className="space-y-4">
              {/* 옥상 공간 대여 서비스 */}
              <ProjectCard
                title="팀 프로젝트"
                subtitle="옥상 공간 대여 서비스 서버 개발"
                period="2023.03 ~ 2023.12"
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  호스트가 옥상 공간을 직접 등록하고, 일반 사용자가 시간 단위로
                  예약·결제할 수 있는{" "}
                  <strong>옥상 공간 특화 공유 플랫폼</strong>의 백엔드 시스템을
                  구축했습니다. 사용자 경험 중심의 기능 설계부터, AWS 기반
                  인프라 구성, 성능 개선까지{" "}
                  <strong>엔드 투 엔드 서버 아키텍처 전반</strong>을
                  담당했습니다.
                </p>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    사용 기술 |
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    NestJS · @nestjs/bull · Redis · Prisma · Jest · MySQL
                    <br />
                    Docker · AWS EC2 · VPC · CodeBuild · CodeDeploy ·
                    CodePipeline
                    <br />
                    Aurora RDS · S3
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    역할 |
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm ml-4">
                    <li>
                      • <strong>예약·결제 기능 구현</strong>: 유저가 옥상 공간을
                      날짜/시간 단위로 예약하고 결제하는 API 설계 및 개발
                    </li>
                    <li>
                      • <strong>호스트 기능 개발</strong>: 공간 등록/수정/비공개
                      처리 등 호스트 관리 기능 제공
                    </li>
                    <li>
                      • <strong>인프라 설계 및 배포 자동화</strong>: AWS
                      기반으로 VPC와 RDS, EC2를 구성하고 CodePipeline을 통한
                      CI/CD 파이프라인 구축
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    기술 경험 및 성과 |
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm ml-4">
                    <li>
                      • Prisma에 존재하지 않는{" "}
                      <strong>Transaction 데코레이터를 직접 구현</strong>하여{" "}
                      <strong>선언적으로 Transaction을 관리</strong>하고 콜백
                      형식의 가독성이 떨어지는 기존 코드 작성 방식을 제거해{" "}
                      <strong>반복되는 코드를 30% 이상 제거</strong>하고
                      트랜잭션 관리 포인트를 한 곳으로 통일해 로그 일원화
                    </li>
                    <li>
                      • for 문을 사용해 동기적으로 작동하고 있는 코드를
                      Promise.allSettled를 사용한 비동기 작업으로 변경해 API
                      응답속도를 <strong>3초에서 1초로 단축</strong>
                    </li>
                    <li>
                      • ORM에서 지원하지 않는 SQL 문법을 지원하기 위해 상위 SQL
                      Interface를 제작하고 이를 구현한 Class를 제작해 복잡한
                      쿼리의 재사용성 향상 및 비즈니스 요구에 유연한 대응
                    </li>
                    <li>
                      • 실행 계획을 통한 SQL 인덱싱 및 쿼리 튜닝과 Database
                      테이블 역정규화를 통해 평균 실행 시간을{" "}
                      <strong>6초에서 1초로 단축</strong>
                    </li>
                    <li>
                      • Jest를 사용해 <strong>테스트 커버리지 80% 이상</strong>{" "}
                      달성
                    </li>
                  </ul>
                </div>
              </ProjectCard>

              {/* 아티스트 오픈 마켓 서비스 */}
              <ProjectCard
                title="팀 프로젝트"
                subtitle="아티스트 오픈 마켓 서비스 서버 개발"
                period="2024.01 ~ 2024.11"
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  작곡, 믹스·마스터링 등 음악 관련 상품과 인력을 거래할 수 있는{" "}
                  <strong>창작자 전용 오픈 마켓 플랫폼</strong>을 구축했습니다.
                  일반 사용자와 아티스트의 서비스 등록·구매·조회 기능을 포함해,
                  동시성 제어 및 권한 관리, 성능 최적화, 인프라 구축까지 백엔드
                  전반을 담당했습니다.
                </p>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    사용 기술 |
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Java · Spring Boot · Spring Security · JPA · QueryDSL ·
                    MySQL · Redis
                    <br />
                    Jenkins · AWS EC2 · AWS RDS
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    역할 |
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm ml-4">
                    <li>
                      • 아티스트 및 일반 사용자의{" "}
                      <strong>회원가입, 상품 등록, 조회, 구매 기능</strong> 전반
                      개발
                    </li>
                    <li>
                      • 상품 수량 차감 및 주문 처리의{" "}
                      <strong>동시성 문제 해결</strong>
                    </li>
                    <li>
                      • 서비스 전반에 <strong>권한 기반 접근 제어</strong> 및{" "}
                      <strong>공통 유틸 분리</strong>
                    </li>
                    <li>
                      • AWS 기반 인프라 및 Jenkins를 활용한 자동 배포 구축
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    기술 경험 및 성과 |
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm ml-4">
                    <li>
                      • 쿼리 최적화를 위해 Driving/Driven 테이블 순서를 조정해
                      데이터 조회 시간 <strong>1초에서 0.5초 내로 단축</strong>
                    </li>
                    <li>
                      • Fetch Join과 Paging 사용 시 default_batch_fetch_size
                      설정으로 N+1 문제 해결
                    </li>
                    <li>
                      • 다수 사진 업로드에 대해 ThreadPoolTaskExecutor를 도입해
                      이미지 저장 병렬 처리로 API 응답속도{" "}
                      <strong>최소 2배 개선</strong>
                    </li>
                    <li>
                      • AOP를 사용한 공통 관심사 분리를 위해 GetUser 어노테이션
                      제작으로 Request의 jwt에서 유저를 조회하는{" "}
                      <strong>코드 중복 API 당 10줄 제거</strong>
                    </li>
                    <li>
                      • 데이터 집계를 위해 JdbcTemplate을 사용한{" "}
                      <strong>Bulk Insert</strong>를 사용해 기존 jpa의 saveAll
                      사용 대비 <strong>3분 이상에서 3초대로 단축</strong>{" "}
                      (100만건 기준)
                    </li>
                  </ul>
                </div>
              </ProjectCard>
            </div>
          </section>

          {/* 자격증 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              자격증
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• SQLD</li>
                <li>• 영어 OPIC IH</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
