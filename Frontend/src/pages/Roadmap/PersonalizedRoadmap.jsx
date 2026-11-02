import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart3, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronUp,
  Circle, Clock3, Code2, Database, ExternalLink, Goal, ListTree, LockKeyhole,
  Map, Play, Settings, Target, Zap, BookOpen, Sparkles,
} from "lucide-react";
import { FaPython } from "react-icons/fa";
import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";
import { generateLearningRoadmap } from "../../services/ai/roadmapGenerator";
import { saveRoadmap } from "../../services/roadmapService";
import { getInterviewDetail } from "../../services/interviewService";

const initialSections = [
  {
    id: 1, title: "Week 1 · Python Fundamentals",
    description: "Strengthen core Python concepts and problem-solving skills.",
    theme: "blue",
    topics: [
      { day: 1, title: "Python setup and syntax", description: "Review variables, data types, input and output.", status: "progress", icon: FaPython, iconClass: "bg-amber-50 text-amber-500", resource: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { day: 2, title: "Conditions and loops", description: "Practise if/else, for loops and while loops.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "Control Flow", url: "https://docs.python.org/3/tutorial/controlflow.html" },
      { day: 3, title: "Functions", description: "Write reusable functions with parameters and return values.", status: "not-started", icon: Code2, iconClass: "bg-sky-50 text-sky-600", resource: "Python Functions", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
      { day: 4, title: "Lists and tuples", description: "Practise indexing, slicing and common operations.", status: "not-started", icon: ListTree, iconClass: "bg-sky-50 text-sky-500", resource: "Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html" },
      { day: 5, title: "Dictionaries and sets", description: "Solve exercises using dictionaries and sets.", status: "not-started", icon: Database, iconClass: "bg-blue-50 text-blue-600", resource: "Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html" },
      { day: 6, title: "Exceptions and files", description: "Handle errors and read or write files safely.", status: "not-started", icon: Settings, iconClass: "bg-emerald-50 text-emerald-600", resource: "Errors and Exceptions", url: "https://docs.python.org/3/tutorial/errors.html" },
      { day: 7, title: "Weekly Python practice", description: "Solve five Python problems and review weak areas.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "HackerRank Python", url: "https://www.hackerrank.com/domains/python" },
    ],
  },
  {
    id: 2, title: "Week 2 · Django & REST APIs",
    description: "Build backend development skills with Django and DRF.", theme: "violet",
    topics: [
      { day: 8, title: "Django fundamentals", description: "Understand projects, apps, URLs, views and templates.", status: "not-started", icon: Settings, iconClass: "bg-emerald-50 text-emerald-600", resource: "Django Tutorial", url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/" },
      { day: 9, title: "Models and migrations", description: "Create models and apply database migrations.", status: "not-started", icon: Database, iconClass: "bg-blue-50 text-blue-600", resource: "Django Models", url: "https://docs.djangoproject.com/en/stable/topics/db/models/" },
      { day: 10, title: "Django ORM", description: "Practise filtering, creating, updating and deleting records.", status: "not-started", icon: Database, iconClass: "bg-blue-50 text-blue-600", resource: "Making Queries", url: "https://docs.djangoproject.com/en/stable/topics/db/queries/" },
      { day: 11, title: "DRF serializers", description: "Serialize model data and validate incoming requests.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "DRF Serializers", url: "https://www.django-rest-framework.org/api-guide/serializers/" },
      { day: 12, title: "API views and ViewSets", description: "Build list, create, retrieve, update and delete endpoints.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "DRF ViewSets", url: "https://www.django-rest-framework.org/api-guide/viewsets/" },
      { day: 13, title: "Filtering and pagination", description: "Add pagination and filtering to a list endpoint.", status: "not-started", icon: ListTree, iconClass: "bg-sky-50 text-sky-600", resource: "DRF Filtering", url: "https://www.django-rest-framework.org/api-guide/filtering/" },
      { day: 14, title: "Build a mini REST API", description: "Create a task API with CRUD operations.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "DRF Quickstart", url: "https://www.django-rest-framework.org/tutorial/quickstart/" },
    ],
  },
  {
    id: 3, title: "Week 3 · Database, Security & Testing",
    description: "Improve API reliability, database skills and security.", theme: "slate",
    topics: [
      { day: 15, title: "SQL fundamentals", description: "Practise SELECT, JOIN, GROUP BY and subqueries.", status: "not-started", icon: Database, iconClass: "bg-blue-50 text-blue-600", resource: "SQLBolt", url: "https://sqlbolt.com/" },
      { day: 16, title: "Relationships and constraints", description: "Understand foreign keys and Django model relationships.", status: "not-started", icon: Database, iconClass: "bg-blue-50 text-blue-600", resource: "Django Models", url: "https://docs.djangoproject.com/en/stable/topics/db/models/" },
      { day: 17, title: "Authentication", description: "Understand token and JWT authentication flows.", status: "not-started", icon: LockKeyhole, iconClass: "bg-slate-50 text-slate-500", resource: "Simple JWT", url: "https://django-rest-framework-simplejwt.readthedocs.io/" },
      { day: 18, title: "Permissions and validation", description: "Restrict API access and validate request data.", status: "not-started", icon: LockKeyhole, iconClass: "bg-slate-50 text-slate-500", resource: "DRF Permissions", url: "https://www.django-rest-framework.org/api-guide/permissions/" },
      { day: 19, title: "API testing", description: "Test successful requests and invalid input.", status: "not-started", icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600", resource: "DRF Testing", url: "https://www.django-rest-framework.org/api-guide/testing/" },
      { day: 20, title: "Database optimization", description: "Explore indexes and query optimization.", status: "not-started", icon: Database, iconClass: "bg-blue-50 text-blue-600", resource: "Django Optimization", url: "https://docs.djangoproject.com/en/stable/topics/db/optimization/" },
      { day: 21, title: "Debugging and error handling", description: "Handle failures and return useful API errors.", status: "not-started", icon: Settings, iconClass: "bg-amber-50 text-amber-600", resource: "Django Exceptions", url: "https://docs.djangoproject.com/en/stable/ref/exceptions/" },
    ],
  },
  {
    id: 4, title: "Week 4 · Project & Interview Preparation",
    description: "Apply your knowledge and practise explaining your work.", theme: "blue",
    topics: [
      { day: 22, title: "Plan a backend project", description: "Define models, endpoints, roles and validation rules.", status: "not-started", icon: Goal, iconClass: "bg-rose-50 text-rose-500", resource: "DRF Tutorial", url: "https://www.django-rest-framework.org/tutorial/1-serialization/" },
      { day: 23, title: "Implement CRUD APIs", description: "Build endpoints using serializers and database models.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "DRF Generic Views", url: "https://www.django-rest-framework.org/api-guide/generic-views/" },
      { day: 24, title: "Add authentication", description: "Protect endpoints and test user permissions.", status: "not-started", icon: LockKeyhole, iconClass: "bg-slate-50 text-slate-500", resource: "DRF Authentication", url: "https://www.django-rest-framework.org/api-guide/authentication/" },
      { day: 25, title: "Background tasks", description: "Understand queues, retries and idempotency.", status: "not-started", icon: Clock3, iconClass: "bg-amber-50 text-amber-600", resource: "Celery Documentation", url: "https://docs.celeryq.dev/en/stable/getting-started/introduction.html" },
      { day: 26, title: "Git and documentation", description: "Document setup steps and API usage.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "Git Documentation", url: "https://git-scm.com/doc" },
      { day: 27, title: "Coding interview practice", description: "Solve problems involving strings, lists and dictionaries.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "LeetCode", url: "https://leetcode.com/problemset/" },
      { day: 28, title: "Django interview questions", description: "Explain ORM, middleware, serializers and permissions.", status: "not-started", icon: BookOpen, iconClass: "bg-blue-50 text-blue-600", resource: "Django Documentation", url: "https://docs.djangoproject.com/en/stable/" },
      { day: 29, title: "Project walkthrough", description: "Explain your architecture and design decisions.", status: "not-started", icon: Code2, iconClass: "bg-violet-50 text-violet-600", resource: "DRF Documentation", url: "https://www.django-rest-framework.org/" },
      { day: 30, title: "Mock interview and review", description: "Complete a mock interview and list topics to revisit.", status: "not-started", icon: Target, iconClass: "bg-rose-50 text-rose-500", resource: "Interview Preparation Kit", url: "https://www.hackerrank.com/interview/interview-preparation-kit" },
    ],
  },
];

const PersonalizedRoadmap = () => {
  const location = useLocation();
  const interviewId = location.state?.interviewId;

  const [sections, setSections] = useState(() => {
    try {
      const saved = localStorage.getItem("interviewiq-roadmap-progress");
      return saved ? JSON.parse(saved) : initialSections;
    } catch {
      return initialSections;
    }
  });
  const [openSections, setOpenSections] = useState([1]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [focusAreas, setFocusAreas] = useState([
    "Django REST Framework",
    "Authentication & permissions",
    "Database optimization",
    "Real-world project practice",
  ]);

  useEffect(() => {
    try {
      localStorage.setItem("interviewiq-roadmap-progress", JSON.stringify(sections));
    } catch (error) {
      console.error("Unable to save roadmap progress:", error);
    }
  }, [sections]);

  const allTopics = useMemo(() => sections.flatMap((section) => section.topics), [sections]);
  const completedCount = allTopics.filter((topic) => topic.status === "completed").length;
  const progress = Math.round((completedCount / allTopics.length) * 100);
  const inProgressCount = allTopics.filter((topic) => topic.status === "progress").length;
  const upcomingCount = allTopics.length - completedCount - inProgressCount;
  const selectedTopic = allTopics.find((topic) => topic.day === selectedDay) || allTopics[0];
  const nextTopic = allTopics.find((topic) => topic.status !== "completed");

  const toggleSection = (id) => setOpenSections((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

  const updateTopicStatus = (day) => {
    setSections((prev) => prev.map((section) => ({
      ...section,
      topics: section.topics.map((topic) => topic.day === day
        ? { ...topic, status: topic.status === "completed" ? "not-started" : "completed" }
        : topic),
    })));
  };

  const selectTopic = (topic, sectionId) => {
    setSelectedDay(topic.day);
    setOpenSections((prev) => prev.includes(sectionId) ? prev : [...prev, sectionId]);
  };

  const continueNext = () => {
    if (!nextTopic) return;
    const section = sections.find((item) => item.topics.some((topic) => topic.day === nextTopic.day));
    selectTopic(nextTopic, section.id);
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const roadmap = await generateLearningRoadmap({
        targetRole: "Python Developer",
        resumeSkills: [],
        missingSkills: [],
        interviewFeedback: "",
      });

      const themes = [
        { theme: "blue", iconClass: "bg-blue-50 text-blue-600" },
        { theme: "violet", iconClass: "bg-violet-50 text-violet-600" },
        { theme: "slate", iconClass: "bg-slate-50 text-slate-600" },
        { theme: "blue", iconClass: "bg-emerald-50 text-emerald-600" },
      ];
      const icons = [FaPython, Code2, Database, BookOpen, Settings];

      const updatedSections = roadmap.weeks.map((week, index) => ({
        id: week.week ?? index + 1,
        title: week.title || `Week ${index + 1}`,
        description: week.description || "Work through this week's learning goals.",
        theme: themes[index % themes.length].theme,
        topics: (week.days || []).map((day, dayIndex) => ({
          day: day.day,
          title: day.title,
          description: day.description,
          status: "not-started",
          icon: icons[dayIndex % icons.length],
          iconClass: themes[index % themes.length].iconClass,
          resource: day.resource,
          url: day.url,
        })),
      }));

      if (!interviewId) {
        throw new Error(
          "Please select a completed interview before saving your roadmap."
        );
      }

      const savedRoadmap = await saveRoadmap({
        interview: interviewId,
        title: roadmap.targetRole
          ? `${roadmap.targetRole} Learning Roadmap`
          : "Personalized Learning Roadmap",
        description: roadmap.summary || "",
        estimated_duration: "30 days",
        target_role: roadmap.targetRole || "Python Developer",
        focus_areas: roadmap.focusAreas || [],
        tasks: roadmap.weeks.flatMap((week) =>
          week.days.map((day) => ({
            title: day.title,
            description: day.description,
            priority: "MEDIUM",
            estimated_hours: 1,
            week_number: week.week,
            day_number: day.day,
            resource_name: day.resource,
            resource_url: day.url,
          }))
        ),
      });

      setSections(
        updatedSections.map((section) => ({
          ...section,
          topics: section.topics.map((topic) => {
            const savedTask = savedRoadmap.tasks?.find(
              (task) => task.day_number === topic.day
            );

            return {
              ...topic,
              taskId: savedTask?.id,
            };
          }),
        }))
      );

      setOpenSections([1]);
      setSelectedDay(1);
    } catch (error) {
      setGenerationError(error?.message || "Unable to generate your roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#f8fbff]">
        <Container>
          <div className="pb-12 pt-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] bg-blue-50">
                  <Map size={34} strokeWidth={1.9} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[30px]">Your Personalized Learning Roadmap</h2>
                  <p className="mt-2 text-sm text-slate-500 sm:text-base">A 30-day plan to strengthen your skills and become interview ready.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-[280px] items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50"><Target size={23} className="text-rose-500" /></div>
                    <div><p className="text-xs font-medium text-slate-500">Target Role</p><p className="mt-1 text-sm font-bold text-slate-900">Python Developer</p></div>
                  </div>
                  <span className="rounded-lg border border-blue-500 px-3 py-2 text-xs font-semibold text-blue-600">30-day plan</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Sparkles size={16} />
                  {isGenerating ? "Generating Roadmap..." : "Generate AI Roadmap"}
                </button>
              </div>
            </div>

            {generationError && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                {generationError}
              </p>
            )}

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard icon={BarChart3} number={allTopics.length} title="Total Goals" description="Across 30 learning days" iconClass="bg-blue-50 text-blue-500" />
              <SummaryCard icon={CheckCircle2} number={completedCount} title="Completed" description="Goals finished" iconClass="bg-emerald-50 text-emerald-500" />
              <SummaryCard icon={Clock3} number={inProgressCount} title="In Progress" description="Currently working on" iconClass="bg-amber-50 text-amber-500" />
              <SummaryCard icon={CalendarDays} number={upcomingCount} title="Upcoming" description="Goals still to start" iconClass="bg-violet-50 text-violet-500" />
            </div>

            <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                {sections.map((section) => (
                  <RoadmapSection key={section.id} section={section} open={openSections.includes(section.id)} onToggle={() => toggleSection(section.id)} selectedDay={selectedDay} onSelectTopic={selectTopic} onToggleComplete={updateTopicStatus} />
                ))}
              </div>

              <div className="space-y-4 xl:sticky xl:top-5">
                <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-bold text-slate-900">Overall Progress</h2>
                  <div className="mt-5 flex items-center gap-5">
                    <ProgressCircle percentage={progress} />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{completedCount} of 30 days completed</p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{progress === 100 ? "Excellent work! You completed the roadmap." : "Keep learning and practising to improve your skills."}</p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[20px] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-violet-50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100"><CalendarDays size={21} className="text-rose-500" /></div>
                    <div><p className="text-xs font-semibold text-slate-600">Estimated Completion</p><p className="mt-1 text-xl font-bold text-slate-900">{30 - completedCount} learning days left</p><p className="mt-1 text-xs leading-5 text-slate-500">Plan for around 1 hour each day.</p></div>
                  </div>
                  <CalendarDays size={56} strokeWidth={1.5} className="absolute bottom-5 right-5 rotate-6 text-violet-300/70" />
                </div>

                <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50"><Goal size={19} className="text-rose-500" /></div>
                    <div><h2 className="text-sm font-bold text-slate-900">Focus Areas</h2><p className="mt-1 text-xs leading-5 text-slate-500">Key topics in this learning plan.</p></div>
                  </div>
                  <div className="mt-4 space-y-3">{focusAreas.map((item, index) => <div key={item} className="flex items-center gap-3"><span className={`flex h-5 min-w-9 items-center justify-center rounded-full px-2 text-[10px] font-bold ${["bg-rose-50 text-rose-500", "bg-blue-50 text-blue-500", "bg-emerald-50 text-emerald-500", "bg-violet-50 text-violet-500"][index]}`}>{index + 1}</span><p className="text-xs text-slate-600">{item}</p></div>)}</div>
                </div>

                <div className="rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-purple-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100"><Zap size={19} className="text-violet-600" /></div>
                    <div><h2 className="text-sm font-bold text-slate-900">Daily Goal</h2><p className="mt-1 text-xs text-slate-500">Spend at least 1 hour daily learning and practising.</p></div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-2 text-xs text-slate-500">{completedCount} of 30 daily goals completed</p>
                </div>

                <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Selected goal · Day {selectedTopic.day}</p>
                  <h2 className="mt-2 text-base font-bold text-slate-900">{selectedTopic.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{selectedTopic.description}</p>
                  <a href={selectedTopic.url} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"><span>{selectedTopic.resource}</span><ExternalLink size={16} /></a>
                  <button type="button" onClick={() => updateTopicStatus(selectedTopic.day)} className={`mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${selectedTopic.status === "completed" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}>{selectedTopic.status === "completed" ? "Mark as incomplete" : "Mark day as completed"}</button>
                  <button type="button" onClick={continueNext} disabled={!nextTopic} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"><Code2 size={16} /> Continue next goal</button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </UserLayout>
  );
};

const SummaryCard = ({ icon: Icon, number, title, description, iconClass }) => (
  <div className="flex min-h-[110px] items-center gap-5 rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}><Icon size={27} /></div>
    <div><p className="text-xl font-bold text-slate-950">{number}</p><p className="mt-0.5 text-sm font-medium text-slate-700">{title}</p><p className="mt-1 text-[11px] text-slate-400">{description}</p></div>
  </div>
);

const RoadmapSection = ({ section, open, onToggle, selectedDay, onSelectTopic, onToggleComplete }) => {
  const numberClasses = { blue: "bg-gradient-to-br from-blue-400 to-blue-600", violet: "bg-gradient-to-br from-violet-400 to-violet-600", slate: "bg-gradient-to-br from-slate-400 to-slate-600" };
  const completed = section.topics.filter((topic) => topic.status === "completed").length;

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${numberClasses[section.theme]}`}>{section.id}</div>
        <div className="min-w-0 flex-1"><h2 className="text-base font-bold text-slate-900">{section.title}</h2><p className="mt-1 text-xs text-slate-500">{section.description}</p></div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-600">{completed}/{section.topics.length} Completed</span>
        {open ? <ChevronUp size={17} className="text-slate-400" /> : <ChevronDown size={17} className="text-slate-400" />}
      </button>

      {open && <div className="relative px-4 pb-5 sm:px-5 sm:pl-[85px]">
        <div className="absolute bottom-9 left-[45px] top-0 hidden w-[2px] bg-gradient-to-b from-emerald-300 via-blue-400 to-slate-200 sm:block" />
        <div className="space-y-2">
          {section.topics.map((topic) => {
            const Icon = 
              topic.day === 1
              ? FaPython
              : topic.day % 3 === 0
                ? Database
                : Code2;
            const done = topic.status === "completed";
            const inProgress = topic.status === "progress";
            const selected = selectedDay === topic.day;
            return (
              <div key={topic.day} className={`relative rounded-xl border px-4 py-3 transition ${selected ? "border-blue-300 bg-blue-50/40" : "border-slate-200 bg-white hover:border-blue-200"}`}>
                <div className={`absolute -left-[52px] top-[22px] z-10 hidden h-7 w-7 items-center justify-center rounded-full border-2 sm:flex ${done ? "border-emerald-500 bg-emerald-500 text-white" : inProgress ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-300 bg-slate-100 text-slate-500"}`}>{done ? <Check size={14} strokeWidth={3} /> : inProgress ? <Clock3 size={13} /> : <Circle size={11} />}</div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button type="button" onClick={() => onSelectTopic(topic, section.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${topic.iconClass}`}><Icon size={20} /></div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Day {topic.day}</span><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${done ? "bg-emerald-50 text-emerald-600" : inProgress ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{done ? "Completed" : inProgress ? "In Progress" : "Not Started"}</span></div>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{topic.title}</p><p className="mt-1 text-xs text-slate-500">{topic.description}</p>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-2 sm:pl-2">
                    <a href={topic.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">Resource <ExternalLink size={12} /></a>
                    <button type="button" onClick={() => onToggleComplete(topic.day)} className={`inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${done ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}>{done ? <CheckCircle2 size={13} /> : <Play size={12} fill="currentColor" />}{done ? "Done" : "Complete"}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>}
    </div>
  );
};

const ProgressCircle = ({ percentage }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative h-[110px] w-[110px] shrink-0">
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#eaf1fb" strokeWidth="10" />
        <circle cx="55" cy="55" r={radius} fill="none" stroke="url(#roadmapProgress)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        <defs><linearGradient id="roadmapProgress" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold text-slate-900">{percentage}%</span></div>
    </div>
  );
};

export default PersonalizedRoadmap;
