#!/usr/bin/env node
/**
 * Scoring regression tests for the ATS Resume Keyword & Score Checker.
 *
 * Runs with plain Node (no dependencies):  node tests/scoring.test.js
 *
 * It extracts the /* ==SCORING-CORE-START== *\/ ... /* ==SCORING-CORE-END== *\/
 * block from index.html and executes it, so the tests exercise the exact code
 * that ships. DOM code lives outside that block on purpose.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const start = "/* ==SCORING-CORE-START==";
const end = "/* ==SCORING-CORE-END== */";
const core = html.slice(html.indexOf(start), html.indexOf(end));
if (!core || html.indexOf(start) === -1 || html.indexOf(end) === -1) {
  console.error("Could not find the scoring core markers in index.html");
  process.exit(1);
}

const api = new Function(
  core + "\nreturn { extractKeywords, scoreKeywords, checkSections, auditFormatting, keyTokens, tokens, singular };"
)();

const overall = (resume, jd) => {
  const kw = api.scoreKeywords(api.extractKeywords(jd), resume);
  const fmt = api.auditFormatting(resume);
  const sec = api.checkSections(resume);
  const secPct = Math.round((sec.found.length / (sec.found.length + sec.missing.length)) * 100);
  return {
    overall: Math.round(kw.pct * 0.6 + fmt.pct * 0.25 + secPct * 0.15),
    kw: kw.pct,
    fmt: fmt.pct,
    sec: secPct,
    missing: kw.miss,
    hit: kw.hit,
  };
};

/* ------------------------------------------------------------------ */
/* 5 realistic pairs                                                   */
/* ------------------------------------------------------------------ */

const JD_EXEC = `Northwind Health is hiring a Vice President of Operations to lead our multi-site
clinical operations. You will own operational strategy, P&L performance, and cross-functional
execution across 14 clinics.

Responsibilities
- Develop and execute operational strategy across the region
- Drive margin improvement and cost control
- Lead a team of 6 regional directors
- Partner with finance on budgeting and forecasting
- Improve patient throughput and quality metrics
- Oversee vendor management and contract negotiation
- Ensure regulatory compliance and risk management

Requirements
- 10+ years in healthcare operations, 5+ years leading managers
- MBA preferred
- Demonstrated P&L ownership
- Experience with Lean or Six Sigma process improvement
- Strong executive communication and stakeholder management
- Proficiency with Tableau and Salesforce`;

const RESUME_EXEC = `Alexandra Morgan
alexandra.morgan@email.com | (415) 555-0142 | San Francisco, CA | linkedin.com/in/alexandramorgan

Professional Summary
Operations executive with 15 years in healthcare operations, including 7 years leading managers
across multi-site clinical networks. Owns P&L performance and operational strategy for $180M in
annual revenue.

Professional Experience
Vice President of Operations, Northwind Health — 2019 – Present
- Developed and executed operational strategy for 14 clinics and owned P&L performance.
- Drove margin improvement of 6 points through cost control and vendor management.
- Led a team of 6 regional directors and 400 staff; rebuilt budgeting and forecasting with finance.
- Improved patient throughput 22% and quality metrics 18% using Lean and Six Sigma process improvement.
- Oversaw contract negotiation with 40 vendors and standardized regulatory compliance and risk management.
- Presented cross-functional operating reviews to the board; recognized for executive communication and stakeholder management.

Director of Operations, Bayview Medical Group — 2014 – 2019
- Consolidated 8 clinics onto one scheduling platform, cutting patient wait times 30%.
- Built a Tableau dashboard for throughput and staffing that regional directors used weekly.
- Managed a $12M operating budget and reduced agency spend by $1.4M.

Education
MBA, Haas School of Business, University of California, Berkeley — 2013
B.S. Health Administration, San Jose State University — 2008

Skills
Operational strategy · P&L ownership · Lean · Six Sigma · Tableau · Salesforce · Budgeting ·
Forecasting · Vendor management · Contract negotiation · Regulatory compliance · Risk management`;

const JD_MANAGER = `Seeking an Operations Manager to run daily fulfillment operations for a 120-person warehouse.
Responsibilities: manage shift supervisors, track KPIs, improve pick and pack accuracy, reduce
overtime, own inventory accuracy, coordinate with carriers, maintain safety compliance, and lead
continuous improvement projects.
Requirements: 4+ years warehouse or fulfillment operations; experience with WMS systems; strong
Excel; Lean Six Sigma green belt; ability to coach and develop teams; comfortable with data analysis
and reporting.`;

const RESUME_MANAGER = `Jordan Reyes
jordan.reyes@email.com | (312) 555-0188 | Chicago, IL

Summary
Operations manager with 6 years in warehouse and fulfillment operations, focused on inventory
accuracy, pick and pack accuracy, and coaching front-line teams.

Experience
Operations Manager, Lakeshore Fulfillment — 2021 – Present
- Manage 4 shift supervisors and 90 associates across two shifts.
- Improved pick and pack accuracy from 98.1% to 99.6% in nine months.
- Own inventory accuracy cycle counts; reduced shrink by 14%.
- Track KPIs in Excel and a WMS dashboard; run weekly reporting for the site director.
- Coordinate with carriers on pickup schedules and maintain safety compliance.
- Coached 12 associates into team lead roles.

Warehouse Supervisor, Lakeshore Fulfillment — 2018 – 2021
- Led continuous improvement projects that cut overtime by 11%.
- Trained new hires on WMS systems and safety compliance.

Education
B.A. Business Administration, DePaul University — 2018

Skills
Warehouse operations · Fulfillment · WMS · Excel · Lean Six Sigma green belt · Inventory accuracy ·
Pick and pack · KPI reporting · Coaching`;

const JD_ENGINEER = `We are looking for a Senior Backend Engineer to design and scale our payments platform.
You will build distributed services in Python and Go, own service reliability, and mentor engineers.

Requirements
- 5+ years backend development
- Strong Python
- Experience with PostgreSQL, Redis, Kafka, Kubernetes, Docker, AWS
- REST and gRPC APIs
- CI/CD pipelines
- Observability with Prometheus and Grafana
- Terraform
- Strong testing discipline
- Experience with microservices and event-driven architecture

Nice to have: payments domain experience, Rust`;

const RESUME_ENGINEER = `Priya Nair
priya.nair@email.com | (206) 555-0164 | Seattle, WA | github.com/priyanair

Summary
Senior backend engineer with 8 years building distributed services and event-driven architecture
for payments platforms. Strong Python and Go, with a focus on service reliability.

Experience
Senior Backend Engineer, Meridian Payments — 2021 – Present
- Designed event-driven microservices in Python and Go processing 40M payments per month.
- Own service reliability for 12 services; raised uptime from 99.9% to 99.98%.
- Built REST and gRPC APIs consumed by 30 internal teams.
- Migrated 60 services to Kubernetes on AWS; cut deploy time 70% with CI/CD pipelines.
- Added observability with Prometheus and Grafana and wrote Terraform modules for new services.
- Mentored 5 engineers and led the testing discipline guild.

Backend Engineer, Cascade Software — 2017 – 2021
- Built Python services on PostgreSQL and Redis; introduced Kafka for order events.
- Containerized legacy apps with Docker and automated releases.

Education
B.S. Computer Science, University of Washington — 2017

Skills
Python · Go · PostgreSQL · Redis · Kafka · Kubernetes · Docker · AWS · REST · gRPC · CI/CD ·
Prometheus · Grafana · Terraform · Microservices · Event-driven architecture · Testing`;

const JD_COORDINATOR = `We are hiring a Project Coordinator to support our marketing team. You will schedule meetings,
maintain project trackers, coordinate deliverables across design and content, prepare status reports,
and keep stakeholders informed.

Requirements: 2+ years project coordination or administrative experience; proficiency with Asana or
Jira; strong Excel and Google Sheets; excellent written communication; ability to manage multiple
deadlines; familiarity with Agile workflows; Bachelor's degree required.`;

const RESUME_COORDINATOR = `Sam Okafor
sam.okafor@email.com | (512) 555-0199 | Austin, TX

Summary
High school English teacher moving into project coordination. Seven years of planning,
scheduling, and communicating with students, parents, and colleagues.

Experience
English Teacher, Austin Independent School District — 2017 – Present
- Planned and scheduled curriculum for 150 students across five sections each year.
- Coordinated the annual literary festival with 20 volunteers and a $4,000 budget.
- Wrote weekly parent updates and ran conferences; maintained a shared Excel gradebook.
- Served on the campus improvement committee and tracked action items to completion.
- Mentored two student teachers through their first year.

Education
B.A. English, University of Texas at Austin — 2016
M.Ed. Curriculum and Instruction, Texas State University — 2020

Skills
Lesson planning · Excel · Google Sheets · Written communication · Event planning · Scheduling`;

const JD_SUPPORT = `Customer Support Specialist — remote. Handle inbound tickets via Zendesk, troubleshoot billing
questions, document resolutions in Confluence, meet CSAT and first-response SLAs, escalate bugs to
engineering, and write help center articles.

Requirements: 2+ years customer support; Zendesk or Intercom; excellent written communication;
technical aptitude; Salesforce familiarity.`;

const RESUME_WEAK = `Michael Chen
michael.chen@email.com

Objective
Hardworking professional seeking new opportunities where I can grow.

Experience
Worked in various roles over the years helping customers and team members.
Responsible for daily tasks and reporting to management.
Good with people and computers.

Education
Some college coursework.

Skills
Microsoft Word, email, internet.`;

const PAIRS = [
  { name: "executive", resume: RESUME_EXEC, jd: JD_EXEC },
  { name: "manager", resume: RESUME_MANAGER, jd: JD_MANAGER },
  { name: "engineer", resume: RESUME_ENGINEER, jd: JD_ENGINEER },
  { name: "career-changer", resume: RESUME_COORDINATOR, jd: JD_COORDINATOR },
  { name: "weak", resume: RESUME_WEAK, jd: JD_SUPPORT },
];

const results = PAIRS.map((p) => ({ name: p.name, ...overall(p.resume, p.jd) }));

console.log("\n5 realistic resume/JD pairs — same weights the UI uses (60/25/15)\n");
console.log("pair            overall  keywords  format  sections");
console.log("---------------  -------  --------  ------  --------");
for (const r of results) {
  console.log(
    r.name.padEnd(15) +
      String(r.overall).padStart(7) +
      String(r.kw).padStart(10) +
      String(r.fmt).padStart(8) +
      String(r.sec).padStart(10)
  );
}
console.log("\nTop missing keywords per pair (first 8):");
for (const r of results) console.log("  " + r.name + ": " + (r.missing.slice(0, 8).join(", ") || "none"));

/* ------------------------------------------------------------------ */
/* Assertions                                                          */
/* ------------------------------------------------------------------ */

let failures = 0;
function check(label, condition, extra) {
  if (condition) {
    console.log("  ok   " + label);
  } else {
    failures++;
    console.log("  FAIL " + label + (extra ? "  → " + extra : ""));
  }
}

const by = Object.fromEntries(results.map((r) => [r.name, r.overall]));

console.log("\nDirection checks:");
check("engineer scores higher than manager", by.engineer > by.manager, by.engineer + " vs " + by.manager);
check("executive scores higher than manager", by.executive > by.manager, by.executive + " vs " + by.manager);
check("manager scores higher than career-changer", by.manager > by["career-changer"], by.manager + " vs " + by["career-changer"]);
check("career-changer scores higher than weak", by["career-changer"] > by.weak, by["career-changer"] + " vs " + by.weak);
check("strong pairs land at/above 70", by.executive >= 70 && by.engineer >= 70, by.executive + ", " + by.engineer);
check("weak pair lands at/below 40", by.weak <= 40, String(by.weak));

console.log("\nKeyword-matching regressions:");
const kwScore = (jd, resume) => api.scoreKeywords(api.extractKeywords(jd), resume);

let r = kwScore("We need someone to lead the team.", "She was a leader in her community.");
check("'lead' does not match 'leader'", r.hit.indexOf("lead") === -1, "hit: " + r.hit.join(","));

r = kwScore("Strong leadership required.", "She led the team.");
check("'leadership' does not match 'led'", r.hit.indexOf("leadership") === -1, "hit: " + r.hit.join(","));

r = kwScore("Manage stakeholders and stakeholder updates.", "Managed stakeholder expectations.");
check("plural tolerance: 'stakeholders' matches 'stakeholder'", r.hit.length === 1, "hit: " + r.hit.join(","));

r = kwScore("Manage the roadmap. Manage delivery. Manage risk.", "Managed the roadmap; improved delivery 20%.");
check("verb forms: 'manage' matches 'managed'", r.hit.indexOf("manage") !== -1, "hit: " + r.hit.join(","));
r = kwScore("Improve delivery speed and improve quality.", "Improved delivery 20% and quality scores.");
check("verb forms: 'improve' matches 'improved'", r.hit.indexOf("improve") !== -1, "hit: " + r.hit.join(","));

const stopJd = "You don't need to be perfect, but you'll own the roadmap. We're hiring now.";
const stopTerms = api.extractKeywords(stopJd).map((k) => k.term);
check("contraction residues are not keywords", !stopTerms.some((t) => ["don", "ll", "re", "ve", "dont", "youll"].includes(t)), stopTerms.join(","));

const numTerms = api.extractKeywords("Founded in 2024. 5+ years of experience. 10-15 reports.").map((k) => k.term);
check("years and numbers are not keywords", !numTerms.some((t) => /^\d/.test(t) || /^\d+[+.]?$/.test(t)), numTerms.join(","));

const glued = api.extractKeywords("5 years experience with kubernetes and terraform.").map((k) => k.term);
check("stopwords do not glue bigrams", glued.indexOf("experience kubernetes") === -1, glued.join(","));

console.log("\nSection + formatting regressions:");
let sec = api.checkSections("Managed jobs and systems programs for the company.");
check("'jobs' / 'systems' do not count as Education", sec.missing.some((m) => m.name === "Education"), sec.found.map((f) => f.name).join(","));

sec = api.checkSections("Education\nB.S. Computer Science\nSkills\nPython");
check("'B.S.' counts as Education", sec.found.some((f) => f.name === "Education"), sec.found.map((f) => f.name).join(","));

let fmt = api.auditFormatting("Jan 2019 - Dec 2022\nMar 2022 - Present\n- Did a thing\n- Did another thing\n- Did a third thing");
check("date ranges are not mistaken for a phone number", fmt.checks.some((c) => c.title === "Incomplete contact details" && /No phone/.test(c.detail)));

fmt = api.auditFormatting("jane@example.com | (415) 555-0142 | linkedin.com/in/jane\n- One\n- Two\n- Three");
check("a single pipe-separated contact line is not a table", fmt.checks.some((c) => c.title === "Single-column layout"));

console.log("\n" + (failures ? failures + " assertion(s) failed" : "All assertions passed") + "\n");
process.exit(failures ? 1 : 0);
