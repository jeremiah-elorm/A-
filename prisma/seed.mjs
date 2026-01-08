import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    id: "bece-math-2021-01",
    exam: "BECE",
    subject: "Mathematics",
    topic: "Fractions",
    year: 2021,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "Simplify: 3/4 + 1/8",
    options: ["1", "7/8", "1/2", "5/8"],
    correctIndex: 1,
    explanation: "3/4 = 6/8. 6/8 + 1/8 = 7/8.",
  },
  {
    id: "bece-math-2021-02",
    exam: "BECE",
    subject: "Mathematics",
    topic: "Geometry",
    year: 2021,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "The sum of angles in a triangle is:",
    options: ["90°", "120°", "180°", "360°"],
    correctIndex: 2,
    explanation: "Interior angles of any triangle add up to 180°.",
  },
  {
    id: "bece-eng-2020-01",
    exam: "BECE",
    subject: "English",
    topic: "Grammar",
    year: 2020,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "Choose the correct sentence:",
    options: [
      "She don't like mangoes.",
      "She doesn't likes mangoes.",
      "She doesn't like mangoes.",
      "She don't likes mangoes.",
    ],
    correctIndex: 2,
    explanation: "Third-person singular uses 'doesn't' + base verb.",
  },
  {
    id: "bece-sci-2019-01",
    exam: "BECE",
    subject: "Science",
    topic: "Energy",
    year: 2019,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "Which is a renewable source of energy?",
    options: ["Coal", "Solar", "Diesel", "Gas"],
    correctIndex: 1,
    explanation: "Solar energy is renewable.",
  },
  {
    id: "bece-sci-2021-02",
    exam: "BECE",
    subject: "Science",
    topic: "Human Body",
    year: 2021,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt:
      "In the heart diagram, which labeled part carries oxygenated blood from the heart to the body?",
    options: ["Aorta", "Vena cava", "Pulmonary artery", "Right atrium"],
    correctIndex: 0,
    explanation: "The aorta carries oxygenated blood to the body.",
    imageUrl: "/questions/diagrams/heart.svg",
    imageAlt: "Simple heart diagram with labeled vessels",
    imageCaption: "Figure 1: Human heart (simplified)",
  },
  {
    id: "bece-social-2021-01",
    exam: "BECE",
    subject: "Social Studies",
    topic: "Governance",
    year: 2021,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "A key function of the legislature is to:",
    options: [
      "Interpret laws",
      "Make laws",
      "Enforce laws",
      "Collect taxes",
    ],
    correctIndex: 1,
    explanation: "The legislature is responsible for making laws.",
  },
  {
    id: "bece-ict-2020-01",
    exam: "BECE",
    subject: "ICT",
    topic: "Hardware",
    year: 2020,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "Which device is used to input text into a computer?",
    options: ["Monitor", "Keyboard", "Speaker", "Printer"],
    correctIndex: 1,
    explanation: "A keyboard is used to input text.",
  },
  {
    id: "bece-rme-2019-01",
    exam: "BECE",
    subject: "Religious and Moral Education",
    topic: "Values",
    year: 2019,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "Honesty is best described as:",
    options: [
      "Doing what pleases others",
      "Telling the truth and being trustworthy",
      "Being strict",
      "Keeping quiet always",
    ],
    correctIndex: 1,
    explanation: "Honesty involves truthfulness and trustworthiness.",
  },
  {
    id: "bece-french-2021-01",
    exam: "BECE",
    subject: "French",
    topic: "Greetings",
    year: 2021,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "How do you say 'Good morning' in French?",
    options: ["Bonsoir", "Bonjour", "Bonne nuit", "Merci"],
    correctIndex: 1,
    explanation: "'Bonjour' means Good morning.",
  },
  {
    id: "bece-gal-2020-01",
    exam: "BECE",
    subject: "Ghanaian Language",
    topic: "Proverbs",
    year: 2020,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "Proverbs are mainly used to:",
    options: [
      "Entertain only",
      "Decorate speech and teach wisdom",
      "Confuse listeners",
      "Replace grammar rules",
    ],
    correctIndex: 1,
    explanation: "Proverbs convey wisdom and enrich speech.",
  },
  {
    id: "bece-creative-2021-01",
    exam: "BECE",
    subject: "Creative Arts",
    topic: "Design",
    year: 2021,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "A repeated pattern in art is called:",
    options: ["Texture", "Rhythm", "Perspective", "Balance"],
    correctIndex: 1,
    explanation: "Repetition creates rhythm in art.",
  },
  {
    id: "bece-essay-social-2021-01",
    exam: "BECE",
    subject: "Social Studies",
    topic: "Citizenship",
    year: 2021,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Explain two responsibilities of a good citizen in Ghana.",
    options: [],
    markingGuide:
      "Mention duties such as obeying laws, paying taxes, voting, protecting public property.",
    sampleAnswer:
      "A good citizen obeys the laws and respects authority. Citizens also pay taxes and participate in elections to choose leaders.",
  },
  {
    id: "bece-essay-ict-2020-01",
    exam: "BECE",
    subject: "ICT",
    topic: "Internet Safety",
    year: 2020,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Describe three safe practices when using the internet.",
    options: [],
    markingGuide:
      "Examples: use strong passwords, avoid sharing personal info, verify sources, avoid suspicious links.",
    sampleAnswer:
      "Use strong passwords, avoid sharing personal details, and verify websites before clicking links or downloads.",
  },
  {
    id: "wassce-math-2022-01",
    exam: "WASSCE",
    subject: "Mathematics",
    topic: "Algebra",
    year: 2022,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "Solve for x: 2x + 5 = 17",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    explanation: "2x = 12, so x = 6.",
  },
  {
    id: "wassce-math-2021-02",
    exam: "WASSCE",
    subject: "Mathematics",
    topic: "Probability",
    year: 2021,
    difficulty: "HARD",
    type: "MCQ",
    prompt: "A fair die is rolled once. What is the probability of getting a multiple of 3?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctIndex: 1,
    explanation: "Multiples of 3 are 3 and 6: 2 outcomes out of 6 => 1/3.",
  },
  {
    id: "wassce-eng-2020-01",
    exam: "WASSCE",
    subject: "English",
    topic: "Comprehension",
    year: 2020,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "The main idea of a passage is the:",
    options: [
      "First sentence",
      "Central message",
      "Longest paragraph",
      "Title only",
    ],
    correctIndex: 1,
    explanation: "The main idea captures the central message of the passage.",
  },
  {
    id: "wassce-bio-2019-01",
    exam: "WASSCE",
    subject: "Biology",
    topic: "Cell",
    year: 2019,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "The basic unit of life is the:",
    options: ["Tissue", "Organ", "Cell", "System"],
    correctIndex: 2,
    explanation: "Cells are the basic unit of life.",
  },
  {
    id: "wassce-eco-2022-01",
    exam: "WASSCE",
    subject: "Economics",
    topic: "Demand",
    year: 2022,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "A decrease in price, ceteris paribus, causes:",
    options: [
      "A decrease in quantity demanded",
      "An increase in quantity demanded",
      "A decrease in demand",
      "No change",
    ],
    correctIndex: 1,
    explanation: "Lower price increases quantity demanded along the demand curve.",
  },
  {
    id: "wassce-eco-2021-02",
    exam: "WASSCE",
    subject: "Economics",
    topic: "Inflation",
    year: 2021,
    difficulty: "HARD",
    type: "MCQ",
    prompt: "Inflation is best described as:",
    options: [
      "A general rise in price levels",
      "A fall in GDP",
      "A reduction in unemployment",
      "An increase in exports",
    ],
    correctIndex: 0,
    explanation: "Inflation is a sustained rise in general price levels.",
  },
  {
    id: "wassce-phy-2022-01",
    exam: "WASSCE",
    subject: "Physics",
    topic: "Motion",
    year: 2022,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "The unit of acceleration is:",
    options: ["m/s", "m/s^2", "m^2/s", "s/m"],
    correctIndex: 1,
    explanation: "Acceleration is measured in meters per second squared.",
  },
  {
    id: "wassce-phy-2021-02",
    exam: "WASSCE",
    subject: "Physics",
    topic: "Oscillations",
    year: 2021,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt:
      "The diagram shows a simple pendulum. Which point represents the mean position?",
    options: ["A", "B", "C", "D"],
    correctIndex: 1,
    explanation: "The mean position is the central equilibrium point.",
    imageUrl: "/questions/diagrams/pendulum.svg",
    imageAlt: "Pendulum diagram with positions labeled A, B, C, D",
    imageCaption: "Figure 2: Simple pendulum positions",
  },
  {
    id: "wassce-chem-2021-01",
    exam: "WASSCE",
    subject: "Chemistry",
    topic: "Atomic Structure",
    year: 2021,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "The number of protons in an atom is called the:",
    options: ["Mass number", "Atomic number", "Isotope number", "Valency"],
    correctIndex: 1,
    explanation: "Atomic number equals the number of protons.",
  },
  {
    id: "wassce-chem-2020-02",
    exam: "WASSCE",
    subject: "Chemistry",
    topic: "Titration",
    year: 2020,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt:
      "In the titration setup, the solution in the burette is called the:",
    options: ["Analyte", "Titrant", "Solvent", "Indicator"],
    correctIndex: 1,
    explanation: "The burette contains the titrant.",
    imageUrl: "/questions/diagrams/titration.svg",
    imageAlt: "Titration apparatus with burette and flask labeled",
    imageCaption: "Figure 3: Titration setup",
  },
  {
    id: "wassce-gov-2020-01",
    exam: "WASSCE",
    subject: "Government",
    topic: "Constitution",
    year: 2020,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "A constitution is best defined as:",
    options: [
      "A list of rulers",
      "The supreme law of a country",
      "A political manifesto",
      "A court judgment",
    ],
    correctIndex: 1,
    explanation: "The constitution is the supreme law.",
  },
  {
    id: "wassce-geo-2019-01",
    exam: "WASSCE",
    subject: "Geography",
    topic: "Climate",
    year: 2019,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "The primary cause of seasons is:",
    options: [
      "Earth's distance from the sun",
      "Earth's tilt on its axis",
      "The moon's phases",
      "Ocean currents",
    ],
    correctIndex: 1,
    explanation: "The tilt of Earth's axis causes seasons.",
  },
  {
    id: "wassce-acc-2022-01",
    exam: "WASSCE",
    subject: "Accounting",
    topic: "Ledger",
    year: 2022,
    difficulty: "MEDIUM",
    type: "MCQ",
    prompt: "The double-entry principle requires:",
    options: [
      "Two accountants",
      "Each transaction affects at least two accounts",
      "Only cash transactions",
      "Weekly reporting",
    ],
    correctIndex: 1,
    explanation: "Each transaction affects at least two accounts.",
  },
  {
    id: "wassce-bm-2021-01",
    exam: "WASSCE",
    subject: "Business Management",
    topic: "Planning",
    year: 2021,
    difficulty: "EASY",
    type: "MCQ",
    prompt: "Planning in business involves:",
    options: [
      "Setting goals and deciding how to achieve them",
      "Only advertising",
      "Paying salaries",
      "Hiring workers only",
    ],
    correctIndex: 0,
    explanation: "Planning sets goals and the steps to achieve them.",
  },
  {
    id: "wassce-essay-eco-2021-01",
    exam: "WASSCE",
    subject: "Economics",
    topic: "Public Finance",
    year: 2021,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Explain two ways governments raise revenue and their importance.",
    options: [],
    markingGuide:
      "Mention taxes, levies, loans, grants; link to public services and development.",
    sampleAnswer:
      "Governments raise revenue through taxes and levies to fund public services. They also borrow or receive grants to finance development projects.",
  },
  {
    id: "wassce-essay-lit-2020-01",
    exam: "WASSCE",
    subject: "Literature",
    topic: "Drama",
    year: 2020,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Describe the role of conflict in drama and give an example.",
    options: [],
    markingGuide:
      "Define conflict, explain how it drives plot and character; provide an example.",
    sampleAnswer:
      "Conflict creates tension and drives the plot forward. For example, a character's struggle between duty and desire can shape the story.",
  },
  {
    id: "bece-eng-essay-2021-01",
    exam: "BECE",
    subject: "English",
    topic: "Essay Writing",
    year: 2021,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Write a short essay on the importance of reading habits among students.",
    options: [],
    markingGuide:
      "Clarity of ideas, organization (intro/body/conclusion), grammar, and relevant examples.",
    sampleAnswer:
      "Reading builds vocabulary, strengthens comprehension, and helps students learn new ideas. A strong reading habit improves performance across subjects and encourages curiosity.",
  },
  {
    id: "wassce-bio-essay-2020-01",
    exam: "WASSCE",
    subject: "Biology",
    topic: "Human Biology",
    year: 2020,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Describe the structure of the human heart and explain how it supports circulation.",
    options: [],
    markingGuide:
      "Mention chambers, valves, blood flow path, and the role of oxygenated vs deoxygenated blood.",
    sampleAnswer:
      "The heart has four chambers with valves that direct blood flow. Deoxygenated blood enters the right side, goes to the lungs, returns oxygenated to the left side, and is pumped to the body.",
  },
  {
    id: "wassce-eco-essay-2019-01",
    exam: "WASSCE",
    subject: "Economics",
    topic: "Development",
    year: 2019,
    difficulty: "MEDIUM",
    type: "ESSAY",
    prompt:
      "Explain two benefits and two challenges of industrialization in developing countries.",
    options: [],
    markingGuide:
      "Benefits: jobs, productivity, exports. Challenges: inequality, environmental impact, urban congestion.",
    sampleAnswer:
      "Industrialization creates jobs and boosts production, but it can widen inequality and strain cities. Environmental pollution and rapid urban growth are common challenges.",
  },
];

const SUBJECT_TOPICS = {
  BECE: {
    Mathematics: [
      "Fractions",
      "Algebra",
      "Geometry",
      "Mensuration",
      "Statistics",
      "Number Bases",
      "Ratio",
      "Percentages",
    ],
    English: [
      "Grammar",
      "Comprehension",
      "Vocabulary",
      "Essay Writing",
      "Letter Writing",
      "Summary",
      "Literature-in-English",
    ],
    Science: [
      "Energy",
      "Matter",
      "Living Things",
      "Electricity",
      "Ecosystems",
      "Human Body",
    ],
    "Social Studies": [
      "Governance",
      "Citizenship",
      "Culture",
      "Environment",
      "Development",
    ],
    ICT: [
      "Hardware",
      "Software",
      "Internet",
      "Data",
      "Digital Safety",
    ],
    French: [
      "Greetings",
      "Family",
      "School",
      "Numbers",
      "Food",
    ],
    "Religious and Moral Education": [
      "Values",
      "Leadership",
      "Community",
      "Respect",
      "Honesty",
    ],
    "Ghanaian Language": [
      "Proverbs",
      "Folklore",
      "Grammar",
      "Comprehension",
      "Oral Tradition",
    ],
    "Creative Arts": [
      "Design",
      "Color",
      "Pattern",
      "Texture",
      "Craft",
    ],
  },
  WASSCE: {
    Mathematics: [
      "Algebra",
      "Trigonometry",
      "Statistics",
      "Calculus",
      "Geometry",
      "Probability",
    ],
    English: [
      "Comprehension",
      "Summary",
      "Grammar",
      "Essay Writing",
      "Vocabulary",
    ],
    "Integrated Science": [
      "Energy",
      "Matter",
      "Living Systems",
      "Ecology",
      "Electricity",
      "Forces",
    ],
    "Social Studies": [
      "Governance",
      "Development",
      "Environment",
      "Identity",
      "Economy",
    ],
    Biology: [
      "Cell",
      "Genetics",
      "Ecology",
      "Human Biology",
      "Plant Biology",
    ],
    Economics: [
      "Demand",
      "Supply",
      "Inflation",
      "National Income",
      "Public Finance",
    ],
    Physics: [
      "Motion",
      "Energy",
      "Electricity",
      "Waves",
      "Measurements",
    ],
    Chemistry: [
      "Atomic Structure",
      "Chemical Bonding",
      "Acids and Bases",
      "Stoichiometry",
      "Organic Chemistry",
    ],
    Literature: [
      "Drama",
      "Poetry",
      "Prose",
      "Themes",
      "Characters",
    ],
    Government: [
      "Constitution",
      "Legislature",
      "Elections",
      "Public Policy",
      "Rights",
    ],
    Geography: [
      "Climate",
      "Relief",
      "Population",
      "Economic Geography",
      "Map Reading",
    ],
    History: [
      "Independence",
      "Colonialism",
      "Nationalism",
      "Traditional States",
      "Post-colonial Africa",
    ],
    Accounting: [
      "Ledger",
      "Trial Balance",
      "Final Accounts",
      "Cash Book",
      "Depreciation",
    ],
    "Business Management": [
      "Planning",
      "Leadership",
      "Marketing",
      "Operations",
      "Human Resources",
    ],
    ICT: [
      "Networks",
      "Databases",
      "Programming",
      "Cybersecurity",
      "Web",
    ],
  },
};

const DEFAULT_DISTRACTORS = [
  "An unrelated option from a different topic.",
  "A statement that sounds right but is inaccurate.",
  "A partial answer missing a key point.",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pickFrom(list, index) {
  return list[index % list.length];
}

function rotateOptions(options, index) {
  const correctIndex = index % options.length;
  if (correctIndex !== 0) {
    const swap = options[correctIndex];
    options[correctIndex] = options[0];
    options[0] = swap;
  }
  return correctIndex;
}

function buildMcq({ prompt, correct, distractors, explanation }, index) {
  const options = [correct, ...(distractors ?? [])];
  while (options.length < 4) {
    options.push(
      DEFAULT_DISTRACTORS[
        (options.length - 1) % DEFAULT_DISTRACTORS.length
      ]
    );
  }
  const correctIndex = rotateOptions(options, index);
  return { prompt, options, correctIndex, explanation };
}

function buildEssay({ prompt, markingGuide, sampleAnswer }) {
  return {
    prompt,
    markingGuide,
    sampleAnswer,
  };
}

function makeMathMcq(topic, index) {
  if (topic === "Fractions") {
    const denom = 4 + (index % 5);
    const a = 1 + (index % 3);
    const b = 1 + ((index + 1) % 3);
    const prompt = `Simplify: ${a}/${denom} + ${b}/${denom}`;
    const correct = `${a + b}/${denom}`;
    const distractors = [
      `${a + b}/${denom + 1}`,
      `${a + b - 1}/${denom}`,
      `${a + b}/${denom - 1}`,
    ];
    return buildMcq(
      {
        prompt,
        correct,
        distractors,
        explanation:
          "With a common denominator, add the numerators and keep the denominator.",
      },
      index
    );
  }
  if (topic === "Algebra") {
    const x = 3 + (index % 7);
    const b = 4 + (index % 5);
    const c = 2 * x + b;
    const prompt = `Solve for x: 2x + ${b} = ${c}`;
    return buildMcq(
      {
        prompt,
        correct: `${x}`,
        distractors: [`${x + 1}`, `${x - 1}`, `${x + 2}`],
        explanation: "Rearrange to 2x = c - b, then divide by 2.",
      },
      index
    );
  }
  if (topic === "Geometry") {
    const prompt = "The sum of interior angles in a triangle is:";
    return buildMcq(
      {
        prompt,
        correct: "180 degrees",
        distractors: ["90 degrees", "360 degrees", "120 degrees"],
        explanation: "Triangle angles always add up to 180 degrees.",
      },
      index
    );
  }
  if (topic === "Mensuration") {
    const length = 6 + (index % 5);
    const width = 3 + (index % 4);
    const prompt = `Find the area of a rectangle with length ${length} cm and width ${width} cm.`;
    return buildMcq(
      {
        prompt,
        correct: `${length * width} cm^2`,
        distractors: [
          `${length + width} cm^2`,
          `${length * 2 + width * 2} cm^2`,
          `${length * width * 2} cm^2`,
        ],
        explanation: "Area of a rectangle is length x width.",
      },
      index
    );
  }
  if (topic === "Statistics") {
    const values = [
      2 + (index % 3),
      4 + (index % 4),
      6 + (index % 5),
      8 + (index % 2),
    ];
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const prompt = `Find the mean of: ${values.join(", ")}.`;
    return buildMcq(
      {
        prompt,
        correct: `${mean}`,
        distractors: [`${mean + 1}`, `${mean - 1}`, `${mean + 2}`],
        explanation:
          "Mean is the total divided by the number of values.",
      },
      index
    );
  }
  if (topic === "Number Bases") {
    const prompt = "Convert 1011₂ to base 10.";
    return buildMcq(
      {
        prompt,
        correct: "11",
        distractors: ["9", "13", "10"],
        explanation: "1011₂ = 8 + 2 + 1 = 11.",
      },
      index
    );
  }
  if (topic === "Ratio") {
    const a = 2 + (index % 3);
    const b = 3 + (index % 4);
    const total = (a + b) * 5;
    const prompt = `Divide ${total} in the ratio ${a}:${b}. What is the first part?`;
    return buildMcq(
      {
        prompt,
        correct: `${(total * a) / (a + b)}`,
        distractors: [
          `${(total * b) / (a + b)}`,
          `${total / 2}`,
          `${a + b}`,
        ],
        explanation:
          "Multiply the total by the ratio part over the sum of parts.",
      },
      index
    );
  }
  if (topic === "Percentages") {
    const base = 100 + (index % 5) * 20;
    const percent = 10 + (index % 4) * 5;
    const prompt = `Find ${percent}% of ${base}.`;
    return buildMcq(
      {
        prompt,
        correct: `${(base * percent) / 100}`,
        distractors: [
          `${base + percent}`,
          `${base - percent}`,
          `${(base * (percent + 5)) / 100}`,
        ],
        explanation: "Convert percent to a fraction and multiply by the base.",
      },
      index
    );
  }
  if (topic === "Probability") {
    const red = 3 + (index % 3);
    const blue = 2 + (index % 2);
    const total = red + blue;
    const prompt = `A box has ${red} red and ${blue} blue balls. What is P(red)?`;
    return buildMcq(
      {
        prompt,
        correct: `${red}/${total}`,
        distractors: [
          `${blue}/${total}`,
          `${red}/${total + 1}`,
          `${total}/${red}`,
        ],
        explanation:
          "Probability is favorable outcomes over total outcomes.",
      },
      index
    );
  }
  if (topic === "Trigonometry") {
    const prompt = "What is sin 30 degrees?";
    return buildMcq(
      {
        prompt,
        correct: "1/2",
        distractors: ["sqrt(3)/2", "1", "0"],
        explanation: "sin 30 degrees equals 1/2.",
      },
      index
    );
  }
  if (topic === "Calculus") {
    const prompt = "Differentiate y = x^2 with respect to x.";
    return buildMcq(
      {
        prompt,
        correct: "2x",
        distractors: ["x", "x^2", "2"],
        explanation: "d/dx of x^2 is 2x.",
      },
      index
    );
  }
  return buildMcq(
    {
      prompt: `Which statement best describes ${topic} in Mathematics?`,
      correct: `${topic} involves applying mathematical rules to solve problems.`,
      distractors: [
        "It is unrelated to mathematical reasoning.",
        "It focuses only on memorizing facts.",
        "It excludes calculations entirely.",
      ],
      explanation:
        "Mathematics topics involve applying rules and methods to solve problems.",
    },
    index
  );
}

function makeEnglishMcq(topic, index) {
  if (topic === "Grammar") {
    return buildMcq(
      {
        prompt: "Choose the correct sentence.",
        correct: "She doesn't like mangoes.",
        distractors: [
          "She don't like mangoes.",
          "She doesn't likes mangoes.",
          "She don't likes mangoes.",
        ],
        explanation:
          "Use 'doesn't' + base verb for third-person singular.",
      },
      index
    );
  }
  if (topic === "Vocabulary") {
    return buildMcq(
      {
        prompt: "Choose the closest synonym of 'rapid'.",
        correct: "fast",
        distractors: ["slow", "late", "heavy"],
        explanation: "'Rapid' means fast.",
      },
      index
    );
  }
  if (topic === "Comprehension") {
    return buildMcq(
      {
        prompt: "The main idea of a passage is the:",
        correct: "central message",
        distractors: ["first sentence", "last sentence", "title only"],
        explanation: "Main idea is the central message.",
      },
      index
    );
  }
  if (topic === "Essay Writing") {
    return buildMcq(
      {
        prompt: "A good essay introduction should:",
        correct: "introduce the topic and thesis clearly",
        distractors: [
          "repeat the conclusion",
          "list all examples only",
          "avoid stating the topic",
        ],
        explanation: "Introductions present the topic and thesis.",
      },
      index
    );
  }
  if (topic === "Letter Writing") {
    return buildMcq(
      {
        prompt: "In a formal letter, the sender's address is placed:",
        correct: "at the top right",
        distractors: [
          "at the bottom",
          "after the signature",
          "in the subject line",
        ],
        explanation: "Formal letters place the sender's address at the top right.",
      },
      index
    );
  }
  if (topic === "Summary") {
    return buildMcq(
      {
        prompt: "A good summary should:",
        correct: "contain the key points in fewer words",
        distractors: [
          "add new ideas",
          "copy every sentence",
          "include opinions only",
        ],
        explanation: "Summaries highlight key points briefly.",
      },
      index
    );
  }
  return buildMcq(
    {
      prompt: `Which option best fits English topic: ${topic}?`,
      correct: `A correct usage or interpretation related to ${topic}.`,
      distractors: [
        "A grammatically incorrect option.",
        "An unrelated statement.",
        "A misleading definition.",
      ],
      explanation: "English questions test correct usage and meaning.",
    },
    index
  );
}

function makeScienceMcq(topic, index) {
  const bank = {
    Energy: {
      prompt: "Which is a renewable source of energy?",
      correct: "solar",
      distractors: ["coal", "diesel", "gas"],
      explanation: "Solar is renewable; fossil fuels are not.",
    },
    Matter: {
      prompt: "Which state of matter has a fixed shape?",
      correct: "solid",
      distractors: ["liquid", "gas", "plasma"],
      explanation: "Solids keep their shape.",
    },
    "Living Things": {
      prompt: "Which is a characteristic of living things?",
      correct: "they grow and reproduce",
      distractors: [
        "they never change",
        "they do not need energy",
        "they are all the same size",
      ],
      explanation:
        "Growth and reproduction are key characteristics of living things.",
    },
    Electricity: {
      prompt: "Which device protects a circuit from excessive current?",
      correct: "fuse",
      distractors: ["bulb", "switch", "wire"],
      explanation: "A fuse breaks the circuit when current is too high.",
    },
    Ecosystems: {
      prompt: "In a food chain, plants are:",
      correct: "producers",
      distractors: ["consumers", "decomposers", "predators"],
      explanation: "Plants make their own food, so they are producers.",
    },
    "Human Body": {
      prompt: "Which organ pumps blood around the body?",
      correct: "heart",
      distractors: ["lungs", "kidneys", "liver"],
      explanation: "The heart pumps blood.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which statement is true about ${topic} in Science?`,
      correct: `It explains how ${topic.toLowerCase()} works in the natural world.`,
      distractors: [
        "It is unrelated to scientific study.",
        "It only applies to art subjects.",
        "It is a personal opinion.",
      ],
      explanation: "Science topics explain natural phenomena.",
    },
    index
  );
}

function makeSocialStudiesMcq(topic, index) {
  const bank = {
    Governance: {
      prompt: "A key function of the legislature is to:",
      correct: "make laws",
      distractors: ["interpret laws", "enforce laws", "collect taxes"],
      explanation: "The legislature makes laws.",
    },
    Citizenship: {
      prompt: "A responsibility of a good citizen is to:",
      correct: "obey the laws",
      distractors: ["ignore rules", "avoid voting", "destroy public property"],
      explanation: "Citizens should obey the laws.",
    },
    Culture: {
      prompt: "Culture includes a society's:",
      correct: "beliefs, customs, and traditions",
      distractors: ["only food", "only clothing", "only language"],
      explanation: "Culture covers beliefs, customs, and traditions.",
    },
    Environment: {
      prompt: "Deforestation mainly leads to:",
      correct: "loss of biodiversity",
      distractors: ["more rainfall", "cleaner air", "stable soil only"],
      explanation: "Deforestation reduces biodiversity and damages habitats.",
    },
    Development: {
      prompt: "Which is a sign of national development?",
      correct: "improved infrastructure",
      distractors: ["higher illiteracy", "more unemployment", "worse health care"],
      explanation: "Development includes better infrastructure and services.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Social Studies, ${topic} is best described as:`,
      correct: "a key concept that shapes society and civic life",
      distractors: [
        "a personal hobby only",
        "a topic outside social studies",
        "an irrelevant detail",
      ],
      explanation: "Social Studies covers civic and societal concepts.",
    },
    index
  );
}

function makeIctMcq(topic, index) {
  const bank = {
    Hardware: {
      prompt: "Which device is used to input text into a computer?",
      correct: "keyboard",
      distractors: ["monitor", "speaker", "printer"],
      explanation: "A keyboard is used for text input.",
    },
    Software: {
      prompt: "Which is an example of application software?",
      correct: "word processor",
      distractors: ["keyboard", "router", "power supply"],
      explanation: "Word processors are application software.",
    },
    Internet: {
      prompt: "HTTP is mainly used for:",
      correct: "accessing web pages",
      distractors: ["printing documents", "powering devices", "editing images"],
      explanation: "HTTP is the protocol for web pages.",
    },
    Data: {
      prompt: "In computing, data means:",
      correct: "raw facts and figures",
      distractors: ["final decisions", "opinions only", "random guesses"],
      explanation: "Data are raw facts used to generate information.",
    },
    "Digital Safety": {
      prompt: "A strong password should include:",
      correct: "letters, numbers, and symbols",
      distractors: ["only letters", "only numbers", "your first name"],
      explanation: "Strong passwords mix multiple character types.",
    },
    Networks: {
      prompt: "A device that connects computers within a network is a:",
      correct: "switch",
      distractors: ["scanner", "projector", "speaker"],
      explanation: "Switches connect devices in a network.",
    },
    Databases: {
      prompt: "The primary key in a database is used to:",
      correct: "uniquely identify records",
      distractors: ["store images", "format text", "connect to Wi-Fi"],
      explanation: "Primary keys uniquely identify each record.",
    },
    Programming: {
      prompt: "Which is a programming construct used for repetition?",
      correct: "loop",
      distractors: ["browser", "monitor", "folder"],
      explanation: "Loops repeat a set of instructions.",
    },
    Cybersecurity: {
      prompt: "Phishing is best described as:",
      correct: "tricking users into revealing sensitive information",
      distractors: ["creating backups", "installing updates", "writing code"],
      explanation: "Phishing attempts to steal sensitive information.",
    },
    Web: {
      prompt: "HTML is used to:",
      correct: "structure web pages",
      distractors: ["send emails", "play music", "store files only"],
      explanation: "HTML structures web content.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which statement best fits ${topic} in ICT?`,
      correct: "It is a core idea in information and communication technology.",
      distractors: [
        "It has nothing to do with technology.",
        "It is a purely artistic skill.",
        "It is a medical concept.",
      ],
      explanation: "ICT topics relate to computing and digital systems.",
    },
    index
  );
}

function makeFrenchMcq(topic, index) {
  const bank = {
    Greetings: {
      prompt: "How do you say 'Good morning' in French?",
      correct: "Bonjour",
      distractors: ["Bonsoir", "Bonne nuit", "Merci"],
      explanation: "'Bonjour' means Good morning.",
    },
    Family: {
      prompt: "The French word for 'mother' is:",
      correct: "mere",
      distractors: ["pere", "frere", "soeur"],
      explanation: "'mere' means mother.",
    },
    School: {
      prompt: "Which word means 'teacher' in French?",
      correct: "professeur",
      distractors: ["eleve", "ecole", "livre"],
      explanation: "'Professeur' means teacher.",
    },
    Numbers: {
      prompt: "What is 'twenty' in French?",
      correct: "vingt",
      distractors: ["douze", "dix", "trente"],
      explanation: "'Vingt' is twenty.",
    },
    Food: {
      prompt: "Which word means 'bread' in French?",
      correct: "pain",
      distractors: ["lait", "riz", "viande"],
      explanation: "'Pain' means bread.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Choose the correct French term related to ${topic}.`,
      correct: `A correct French word or phrase for ${topic}.`,
      distractors: [
        "An English word.",
        "A misspelled French word.",
        "An unrelated term.",
      ],
      explanation: "French questions test vocabulary and translation.",
    },
    index
  );
}

function makeRmeMcq(topic, index) {
  const bank = {
    Values: {
      prompt: "Honesty is best described as:",
      correct: "telling the truth and being trustworthy",
      distractors: [
        "doing what pleases others",
        "being strict",
        "keeping quiet always",
      ],
      explanation: "Honesty means truthfulness and trustworthiness.",
    },
    Leadership: {
      prompt: "A good leader should:",
      correct: "be fair and responsible",
      distractors: ["be selfish", "avoid listening", "ignore the community"],
      explanation: "Leaders should be fair and responsible.",
    },
    Community: {
      prompt: "Showing concern for others in the community is called:",
      correct: "compassion",
      distractors: ["selfishness", "jealousy", "laziness"],
      explanation: "Compassion is concern for others.",
    },
    Respect: {
      prompt: "Respect for elders means:",
      correct: "listening and being polite",
      distractors: ["arguing always", "ignoring advice", "refusing help"],
      explanation: "Respect includes polite behavior and listening.",
    },
    Honesty: {
      prompt: "A student finds a wallet at school. The honest action is to:",
      correct: "return it to the owner or school authorities",
      distractors: ["keep it", "hide it", "throw it away"],
      explanation: "Honesty means returning lost items.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which statement reflects ${topic} in RME?`,
      correct: "It promotes good moral behavior and right actions.",
      distractors: [
        "It encourages harmful actions.",
        "It ignores moral choices.",
        "It is unrelated to values.",
      ],
      explanation: "RME focuses on moral values and behavior.",
    },
    index
  );
}

function makeGhanaianLanguageMcq(topic, index) {
  const bank = {
    Proverbs: {
      prompt: "Proverbs are mainly used to:",
      correct: "teach wisdom and guide behavior",
      distractors: [
        "confuse listeners",
        "replace grammar rules",
        "avoid meaning",
      ],
      explanation: "Proverbs convey wisdom and guidance.",
    },
    Folklore: {
      prompt: "Folklore stories are important because they:",
      correct: "preserve culture and history",
      distractors: [
        "are always fictional only",
        "have no moral lessons",
        "avoid cultural values",
      ],
      explanation: "Folklore preserves culture and history.",
    },
    Grammar: {
      prompt: "Grammar helps us to:",
      correct: "use language correctly",
      distractors: ["avoid speaking", "ignore meaning", "replace vocabulary"],
      explanation: "Grammar guides correct usage.",
    },
    Comprehension: {
      prompt: "Comprehension questions test:",
      correct: "understanding of a passage",
      distractors: [
        "handwriting only",
        "spelling of random words",
        "memorizing without meaning",
      ],
      explanation: "Comprehension is about understanding.",
    },
    "Oral Tradition": {
      prompt: "Oral tradition is passed down through:",
      correct: "storytelling and spoken word",
      distractors: ["only textbooks", "computer programs", "formal letters"],
      explanation: "Oral tradition is shared by word of mouth.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which option best relates to ${topic} in Ghanaian Language?`,
      correct: "It reflects language use and cultural communication.",
      distractors: [
        "It is unrelated to language or culture.",
        "It is a science-only concept.",
        "It avoids meaning in speech.",
      ],
      explanation: "Ghanaian Language topics focus on language and culture.",
    },
    index
  );
}

function makeCreativeArtsMcq(topic, index) {
  const bank = {
    Design: {
      prompt: "A repeated pattern in art is called:",
      correct: "rhythm",
      distractors: ["texture", "perspective", "balance"],
      explanation: "Repetition creates rhythm in art.",
    },
    Color: {
      prompt: "Blue, red, and yellow are:",
      correct: "primary colors",
      distractors: ["secondary colors", "neutral colors", "warm colors only"],
      explanation: "Primary colors are red, blue, and yellow.",
    },
    Pattern: {
      prompt: "A pattern is created by:",
      correct: "repeating elements in a design",
      distractors: [
        "removing all shapes",
        "using one color only",
        "avoiding repetition",
      ],
      explanation: "Patterns repeat elements.",
    },
    Texture: {
      prompt: "Texture in art refers to:",
      correct: "how a surface feels or looks like it feels",
      distractors: [
        "the size of a shape",
        "the price of materials",
        "the color of paint only",
      ],
      explanation: "Texture describes surface feel or appearance.",
    },
    Craft: {
      prompt: "A craft product is typically:",
      correct: "made by hand using tools or materials",
      distractors: [
        "mass-produced only",
        "purely digital only",
        "only drawn on paper",
      ],
      explanation: "Crafts are usually handmade.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Creative Arts, ${topic} focuses on:`,
      correct: "skills and concepts used to create visual works",
      distractors: [
        "memorizing unrelated facts",
        "ignoring design principles",
        "avoiding creativity",
      ],
      explanation: "Creative Arts emphasizes design and creativity.",
    },
    index
  );
}

function makeBiologyMcq(topic, index) {
  const bank = {
    Cell: {
      prompt: "Which organelle is the powerhouse of the cell?",
      correct: "mitochondrion",
      distractors: ["nucleus", "ribosome", "cell wall"],
      explanation: "Mitochondria produce energy.",
    },
    Genetics: {
      prompt: "The molecule that carries genetic information is:",
      correct: "DNA",
      distractors: ["RNA", "protein", "lipid"],
      explanation: "DNA carries genetic information.",
    },
    Ecology: {
      prompt: "A population is:",
      correct: "members of the same species in an area",
      distractors: [
        "different species in an area",
        "only producers",
        "only consumers",
      ],
      explanation: "Population refers to one species in a given area.",
    },
    "Human Biology": {
      prompt: "Which organ is responsible for pumping blood?",
      correct: "heart",
      distractors: ["lungs", "liver", "kidney"],
      explanation: "The heart pumps blood.",
    },
    "Plant Biology": {
      prompt: "Photosynthesis mainly occurs in the:",
      correct: "leaf",
      distractors: ["root", "stem", "flower"],
      explanation: "Leaves contain chlorophyll for photosynthesis.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which statement is true about ${topic} in Biology?`,
      correct: "It is a key concept studied in living organisms.",
      distractors: [
        "It is unrelated to living systems.",
        "It belongs to physics only.",
        "It is purely a mathematical topic.",
      ],
      explanation: "Biology covers living systems and life processes.",
    },
    index
  );
}

function makeEconomicsMcq(topic, index) {
  const bank = {
    Demand: {
      prompt: "Demand refers to:",
      correct: "quantity consumers are willing and able to buy",
      distractors: [
        "quantity producers want to sell",
        "government taxes only",
        "all goods produced",
      ],
      explanation:
        "Demand is about consumer willingness and ability to buy.",
    },
    Supply: {
      prompt: "Supply refers to:",
      correct: "quantity producers are willing and able to sell",
      distractors: [
        "quantity consumers want to buy",
        "imports only",
        "tax revenue",
      ],
      explanation:
        "Supply is about producer willingness and ability to sell.",
    },
    Inflation: {
      prompt: "Inflation means:",
      correct: "a general rise in prices over time",
      distractors: ["a fall in all prices", "a rise in wages only", "constant prices forever"],
      explanation: "Inflation is a general increase in price level.",
    },
    "National Income": {
      prompt: "GDP measures:",
      correct: "the value of goods and services produced in a country",
      distractors: ["only imports", "only taxes", "only savings"],
      explanation: "GDP measures total production value.",
    },
    "Public Finance": {
      prompt: "Public finance concerns:",
      correct: "government revenue and expenditure",
      distractors: ["private savings only", "household budgets only", "foreign trade only"],
      explanation: "Public finance is about government budgets.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Economics, ${topic} refers to:`,
      correct: "a core economic concept",
      distractors: ["a literary theme", "a chemical process", "a medical procedure"],
      explanation: "Economics studies production, consumption, and markets.",
    },
    index
  );
}

function makePhysicsMcq(topic, index) {
  const bank = {
    Motion: {
      prompt: "Speed is calculated as:",
      correct: "distance divided by time",
      distractors: [
        "time divided by distance",
        "distance plus time",
        "mass times acceleration",
      ],
      explanation: "Speed = distance / time.",
    },
    Energy: {
      prompt: "The unit of energy is:",
      correct: "joule",
      distractors: ["watt", "newton", "meter"],
      explanation: "Energy is measured in joules.",
    },
    Electricity: {
      prompt: "Ohm's law is:",
      correct: "V = IR",
      distractors: ["P = IV", "F = ma", "E = mc^2"],
      explanation: "Ohm's law relates voltage, current, and resistance.",
    },
    Waves: {
      prompt: "Frequency is measured in:",
      correct: "hertz",
      distractors: ["newton", "joule", "meter"],
      explanation: "Frequency is measured in hertz.",
    },
    Measurements: {
      prompt: "The SI unit for length is:",
      correct: "meter",
      distractors: ["kilogram", "second", "ampere"],
      explanation: "Length is measured in meters in SI.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which statement best describes ${topic} in Physics?`,
      correct: "It is a measurable physical concept.",
      distractors: [
        "It is unrelated to physics.",
        "It only applies to literature.",
        "It is purely subjective.",
      ],
      explanation: "Physics deals with measurable physical concepts.",
    },
    index
  );
}

function makeChemistryMcq(topic, index) {
  const bank = {
    "Atomic Structure": {
      prompt: "The particle with a positive charge is the:",
      correct: "proton",
      distractors: ["neutron", "electron", "atom"],
      explanation: "Protons are positively charged.",
    },
    "Chemical Bonding": {
      prompt: "An ionic bond is formed by:",
      correct: "transfer of electrons",
      distractors: ["sharing of electrons", "sharing of protons", "mixing solutions"],
      explanation: "Ionic bonding involves electron transfer.",
    },
    "Acids and Bases": {
      prompt: "A base turns red litmus paper:",
      correct: "blue",
      distractors: ["red", "yellow", "black"],
      explanation: "Bases turn red litmus blue.",
    },
    Stoichiometry: {
      prompt: "A mole contains:",
      correct: "6.02 x 10^23 particles",
      distractors: ["10^6 particles", "100 particles", "6 particles"],
      explanation: "Avogadro's number is 6.02 x 10^23.",
    },
    "Organic Chemistry": {
      prompt: "Methane is a:",
      correct: "hydrocarbon",
      distractors: ["salt", "metal", "acid"],
      explanation: "Methane is a hydrocarbon.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `Which statement is true about ${topic} in Chemistry?`,
      correct: "It describes chemical properties or reactions.",
      distractors: [
        "It is unrelated to chemistry.",
        "It is a historical event.",
        "It is a literary technique.",
      ],
      explanation: "Chemistry covers substances and reactions.",
    },
    index
  );
}

function makeLiteratureMcq(topic, index) {
  const bank = {
    Drama: {
      prompt: "A drama is primarily written to be:",
      correct: "performed on stage",
      distractors: ["read as a newspaper", "solved like a puzzle", "used as a timetable"],
      explanation: "Drama is written for performance.",
    },
    Poetry: {
      prompt: "A poem often uses:",
      correct: "imagery and rhythm",
      distractors: ["tables and charts", "only factual statements", "computer code"],
      explanation: "Poetry uses imagery and rhythm.",
    },
    Prose: {
      prompt: "Prose is written in:",
      correct: "ordinary sentences and paragraphs",
      distractors: ["lines with strict rhyme", "musical notes", "only bullet points"],
      explanation: "Prose uses normal sentences and paragraphs.",
    },
    Themes: {
      prompt: "A theme in literature is:",
      correct: "the central idea of a text",
      distractors: ["the title only", "the number of pages", "the author's name"],
      explanation: "Themes are central ideas.",
    },
    Characters: {
      prompt: "A character is:",
      correct: "a person or figure in a story",
      distractors: ["a chapter title", "a writing tool", "a topic sentence"],
      explanation: "Characters are people or figures in a story.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Literature, ${topic} refers to:`,
      correct: "a key element of literary study",
      distractors: ["a chemical process", "a physics formula", "a database term"],
      explanation: "Literature studies texts and their elements.",
    },
    index
  );
}

function makeGovernmentMcq(topic, index) {
  const bank = {
    Constitution: {
      prompt: "A constitution is:",
      correct: "the supreme law of a country",
      distractors: ["a school rule", "a private contract", "a newspaper"],
      explanation: "The constitution is the supreme law.",
    },
    Legislature: {
      prompt: "The main role of the legislature is to:",
      correct: "make laws",
      distractors: ["enforce laws", "interpret laws", "judge criminals"],
      explanation: "Legislatures make laws.",
    },
    Elections: {
      prompt: "Elections are conducted to:",
      correct: "choose leaders",
      distractors: ["avoid representation", "end voting rights", "replace courts"],
      explanation: "Elections choose leaders.",
    },
    "Public Policy": {
      prompt: "Public policy refers to:",
      correct: "decisions and actions taken by government",
      distractors: ["private opinions", "personal hobbies", "religious rituals only"],
      explanation: "Public policy is government action.",
    },
    Rights: {
      prompt: "A fundamental human right is the right to:",
      correct: "freedom of speech",
      distractors: ["steal property", "ignore laws", "harm others"],
      explanation: "Freedom of speech is a basic right.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Government, ${topic} refers to:`,
      correct: "a core concept of governance",
      distractors: ["a chemistry term", "a math formula", "a language rule"],
      explanation: "Government studies governance and institutions.",
    },
    index
  );
}

function makeGeographyMcq(topic, index) {
  const bank = {
    Climate: {
      prompt: "Climate describes:",
      correct: "long-term weather patterns",
      distractors: ["daily weather only", "soil types only", "river names only"],
      explanation: "Climate is long-term weather patterns.",
    },
    Relief: {
      prompt: "Relief refers to:",
      correct: "variation in land height",
      distractors: ["ocean currents only", "temperature only", "population only"],
      explanation: "Relief is variation in land elevation.",
    },
    Population: {
      prompt: "Population density is:",
      correct: "people per unit area",
      distractors: ["land per person", "total rainfall", "total GDP"],
      explanation: "Population density is people per unit area.",
    },
    "Economic Geography": {
      prompt: "Economic geography studies:",
      correct: "how economic activities are located and organized",
      distractors: ["only language use", "only weather", "only history"],
      explanation: "It focuses on location of economic activities.",
    },
    "Map Reading": {
      prompt: "A map scale is used to:",
      correct: "show the relationship between map distance and real distance",
      distractors: ["show population only", "show climate only", "show time zones only"],
      explanation: "Scale links map distances to real distances.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Geography, ${topic} focuses on:`,
      correct: "people, places, and environments",
      distractors: ["only math formulas", "only literature", "only chemistry"],
      explanation: "Geography studies places and environments.",
    },
    index
  );
}

function makeHistoryMcq(topic, index) {
  const bank = {
    Independence: {
      prompt: "Independence refers to:",
      correct: "self-rule by a country",
      distractors: ["foreign control", "private trade only", "a weather event"],
      explanation: "Independence is self-rule.",
    },
    Colonialism: {
      prompt: "Colonialism is:",
      correct: "control of one country by another",
      distractors: ["local rule only", "equal partnership always", "a trade agreement only"],
      explanation: "Colonialism involves external control.",
    },
    Nationalism: {
      prompt: "Nationalism promotes:",
      correct: "strong national identity and unity",
      distractors: ["division", "loss of identity", "foreign dominance"],
      explanation: "Nationalism promotes unity and identity.",
    },
    "Traditional States": {
      prompt: "Traditional states were governed by:",
      correct: "chiefs or kings",
      distractors: ["foreign corporations", "random citizens only", "military officers only"],
      explanation: "Traditional states had chiefs or kings.",
    },
    "Post-colonial Africa": {
      prompt: "Post-colonial Africa refers to:",
      correct: "the period after independence",
      distractors: ["before colonization", "during colonization only", "medieval Europe"],
      explanation: "Post-colonial is after independence.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In History, ${topic} is best described as:`,
      correct: "a significant historical concept or period",
      distractors: ["a math topic", "a scientific law", "a grammar rule"],
      explanation: "History covers significant events and periods.",
    },
    index
  );
}

function makeAccountingMcq(topic, index) {
  const bank = {
    Ledger: {
      prompt: "A ledger is used to:",
      correct: "record and classify financial transactions",
      distractors: ["cook meals", "write novels", "design logos"],
      explanation: "Ledgers record and classify transactions.",
    },
    "Trial Balance": {
      prompt: "A trial balance is prepared to:",
      correct: "check the accuracy of ledger balances",
      distractors: ["calculate profit only", "pay taxes", "issue shares"],
      explanation: "Trial balance checks ledger accuracy.",
    },
    "Final Accounts": {
      prompt: "Final accounts show:",
      correct: "profit or loss and financial position",
      distractors: ["weather patterns", "student grades", "sports scores"],
      explanation: "Final accounts show profit/loss and financial position.",
    },
    "Cash Book": {
      prompt: "The cash book records:",
      correct: "cash and bank transactions",
      distractors: ["inventory only", "only debts", "only assets"],
      explanation: "Cash book records cash and bank transactions.",
    },
    Depreciation: {
      prompt: "Depreciation refers to:",
      correct: "the reduction in value of an asset over time",
      distractors: ["increase in value", "tax paid on sales", "profit earned"],
      explanation: "Depreciation is loss in asset value.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Accounting, ${topic} is related to:`,
      correct: "recording and reporting financial information",
      distractors: ["literary analysis", "chemical reactions", "geographic maps"],
      explanation: "Accounting deals with financial records.",
    },
    index
  );
}

function makeBusinessManagementMcq(topic, index) {
  const bank = {
    Planning: {
      prompt: "Planning involves:",
      correct: "setting goals and deciding how to achieve them",
      distractors: ["avoiding decisions", "random actions", "only hiring staff"],
      explanation: "Planning sets goals and steps to achieve them.",
    },
    Leadership: {
      prompt: "Effective leadership includes:",
      correct: "motivating and guiding others",
      distractors: ["ignoring feedback", "avoiding responsibility", "working alone only"],
      explanation: "Leaders motivate and guide others.",
    },
    Marketing: {
      prompt: "Marketing is about:",
      correct: "promoting and selling products or services",
      distractors: ["only accounting", "only production", "only HR"],
      explanation: "Marketing promotes and sells products/services.",
    },
    Operations: {
      prompt: "Operations focuses on:",
      correct: "producing goods or delivering services efficiently",
      distractors: ["writing novels", "playing sports", "teaching art only"],
      explanation: "Operations manages production and delivery.",
    },
    "Human Resources": {
      prompt: "Human resources deals with:",
      correct: "recruiting, training, and managing employees",
      distractors: ["only buying equipment", "only marketing", "only sales"],
      explanation: "HR manages employees.",
    },
  };
  const item = bank[topic];
  if (item) {
    return buildMcq(item, index);
  }
  return buildMcq(
    {
      prompt: `In Business Management, ${topic} refers to:`,
      correct: "a key management activity",
      distractors: ["a chemical term", "a geometry topic", "a language rule"],
      explanation: "Business Management covers organizational activities.",
    },
    index
  );
}

function getSubjectMcq(subject, topic, index) {
  if (subject === "Mathematics") {
    return makeMathMcq(topic, index);
  }
  if (subject === "English") {
    return makeEnglishMcq(topic, index);
  }
  if (subject === "Science") {
    return makeScienceMcq(topic, index);
  }
  if (subject === "Social Studies") {
    return makeSocialStudiesMcq(topic, index);
  }
  if (subject === "ICT") {
    return makeIctMcq(topic, index);
  }
  if (subject === "French") {
    return makeFrenchMcq(topic, index);
  }
  if (subject === "Religious and Moral Education") {
    return makeRmeMcq(topic, index);
  }
  if (subject === "Ghanaian Language") {
    return makeGhanaianLanguageMcq(topic, index);
  }
  if (subject === "Creative Arts") {
    return makeCreativeArtsMcq(topic, index);
  }
  if (subject === "Biology") {
    return makeBiologyMcq(topic, index);
  }
  if (subject === "Economics") {
    return makeEconomicsMcq(topic, index);
  }
  if (subject === "Physics") {
    return makePhysicsMcq(topic, index);
  }
  if (subject === "Chemistry") {
    return makeChemistryMcq(topic, index);
  }
  if (subject === "Literature") {
    return makeLiteratureMcq(topic, index);
  }
  if (subject === "Government") {
    return makeGovernmentMcq(topic, index);
  }
  if (subject === "Geography") {
    return makeGeographyMcq(topic, index);
  }
  if (subject === "History") {
    return makeHistoryMcq(topic, index);
  }
  if (subject === "Accounting") {
    return makeAccountingMcq(topic, index);
  }
  if (subject === "Business Management") {
    return makeBusinessManagementMcq(topic, index);
  }
  return buildMcq(
    {
      prompt: `Which statement best describes ${topic} in ${subject}?`,
      correct: `${topic} is a key concept in ${subject}.`,
      distractors: DEFAULT_DISTRACTORS,
      explanation: `${topic} is covered under ${subject}.`,
    },
    index
  );
}

function getBeceMathEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}):\n` +
      "(a) A trader sold 3.5 kg of rice at GHS 12.50 per kg and used GHS 20.00 to buy change. " +
      "Calculate the total amount received.\n" +
      `(b) Using ${topic}, solve the problem carefully and show all working.\n` +
      "(c) Give your final answer with the correct unit or statement.",
    markingGuide:
      "Award marks for correct method, clear steps, and accurate final answers for each part.",
    sampleAnswer:
      "Show full working for each part, apply the correct formula or method, and state the final answer clearly.",
  });
}

function getBeceScienceEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}):\n` +
      `A student sets up a simple experiment to investigate ${topic}.\n` +
      "(a) State the aim of the experiment.\n" +
      "(b) List the materials needed and describe the procedure.\n" +
      "(c) State two observations you would expect.\n" +
      "(d) Explain the results in your own words.",
    markingGuide:
      "Look for a clear aim, logical procedure, realistic observations, and correct scientific explanation.",
    sampleAnswer:
      "State the aim, outline a safe procedure, note expected observations, and explain the science behind them.",
  });
}

function getBeceEnglishEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}): Write an essay of about 200-250 words on the topic below.\n` +
      `Topic: ${topic}.\n` +
      "Your essay should have an introduction, body, and conclusion.",
    markingGuide:
      "Assess organization, grammar, vocabulary, relevance, and coherence of ideas.",
    sampleAnswer:
      "Plan the essay, write clear paragraphs, and conclude with a summary of your main points.",
  });
}

function getBeceSocialEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}):\n` +
      `(a) Explain ${topic} in Ghana.\n` +
      "(b) State two effects of this issue on the community.\n" +
      "(c) Suggest two solutions or actions that can help.",
    markingGuide:
      "Look for clear explanations, Ghana-specific examples, and practical solutions.",
    sampleAnswer:
      "Define the issue, give local examples, describe effects, and propose realistic solutions.",
  });
}

function getBeceEnglishSectionAOptions() {
  return [
    "Write a narrative story about a time you helped someone in your community.",
    "Write a formal letter to your headteacher about a problem in your school.",
    "Write a speech to encourage your classmates to read more books.",
  ];
}

function getWassceEnglishSectionAOptions() {
  return [
    "Write an argumentative essay on the impact of social media on students.",
    "Write a formal letter to the Municipal Director of Education about improving school facilities.",
    "Write a speech to be delivered on Independence Day about national unity.",
    "Write a descriptive essay about a memorable cultural festival.",
    "Write an article for a school magazine on time management for final-year students.",
  ];
}

function getWassceEnglishComprehension() {
  const passage =
    "Ghanaian youth are increasingly using technology for learning and entrepreneurship. " +
    "With access to smartphones and community learning centers, many students now study online, " +
    "collaborate with peers, and develop business ideas. " +
    "However, challenges such as unreliable internet access and limited mentorship persist.";
  const questions = [
    "State two ways the youth use technology for learning.",
    "What opportunities does technology create for students?",
    "Mention one challenge that limits the use of technology.",
    "Why are community learning centers important?",
    "What does the passage suggest about mentorship?",
    "Explain the main idea of the passage.",
    "Give a suitable title for the passage.",
    "Identify one benefit of collaboration mentioned or implied.",
    "How can unreliable internet affect students?",
    "Suggest one solution to the challenges stated.",
  ];
  return { passage, questions };
}

function getWassceEnglishSummary() {
  const passage =
    "Effective revision requires planning, active recall, and regular practice with past questions. " +
    "Students who evaluate their weaknesses and correct mistakes improve steadily. " +
    "Consistent study habits and rest also support strong performance.";
  return {
    passage,
    points: [
      "Plan your revision.",
      "Use active recall.",
      "Practice with past questions.",
      "Identify weaknesses and correct mistakes.",
      "Maintain consistent study habits and rest.",
    ],
  };
}

function getWassceEnglishOral() {
  return [
    "Identify the stressed syllable in a given word and use it in a sentence.",
    "State the correct intonation for a question and read it aloud.",
    "Choose the word with a different vowel sound and explain why.",
    "Provide the correct pronunciation for a list of words.",
    "Differentiate between two minimal pairs in pronunciation.",
  ];
}

function buildWassceEnglishEssayQuestions({ exam, subject }) {
  const essayOptions = getWassceEnglishSectionAOptions();
  const comprehension = getWassceEnglishComprehension();
  const summary = getWassceEnglishSummary();
  const oral = getWassceEnglishOral();
  const questions = [];

  essayOptions.forEach((option, index) => {
    const essay = buildEssay({
      prompt:
        `Section A - Essay (Option ${String.fromCharCode(65 + index)}):\n` +
        "Answer ONE of the five options.\n" +
        "Write an essay of about 300-450 words.\n" +
        option,
      markingGuide:
        "Check organization, coherence, grammar, vocabulary, and relevance.",
      sampleAnswer:
        "Plan your essay, develop points with examples, and conclude clearly.",
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Essay Writing",
        index,
        ...essay,
      })
    );
  });

  comprehension.questions.forEach((question, index) => {
    const essay = buildEssay({
      prompt:
        "Section B - Comprehension:\n" +
        `Passage: ${comprehension.passage}\n` +
        `Question ${index + 1}: ${question}`,
      markingGuide:
        "Look for accurate interpretation and clear answers in complete sentences.",
      sampleAnswer:
        "Answer directly using your own words where possible.",
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Comprehension",
        index: essayOptions.length + index,
        ...essay,
      })
    );
  });

  summary.points.forEach((point, index) => {
    const essay = buildEssay({
      prompt:
        "Section C - Summary:\n" +
        `Passage: ${summary.passage}\n` +
        `Write summary point ${index + 1}.`,
      markingGuide:
        "Look for concise points written as simple sentences without examples.",
      sampleAnswer: point,
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Summary",
        index: essayOptions.length + comprehension.questions.length + index,
        ...essay,
      })
    );
  });

  oral.forEach((promptText, index) => {
    const essay = buildEssay({
      prompt: `Paper 3 - Oral:\n${promptText}`,
      markingGuide: "Assess pronunciation, stress, and clarity.",
      sampleAnswer: "Model pronunciation or response as required.",
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Oral",
        index:
          essayOptions.length +
          comprehension.questions.length +
          summary.points.length +
          index,
        ...essay,
      })
    );
  });

  return questions;
}

function getBeceEnglishComprehension() {
  const passage =
    "Many communities in Ghana are organizing clean-up exercises to keep their surroundings healthy. " +
    "Students and parents sweep compounds, clear gutters, and plant trees. " +
    "These activities reduce the spread of diseases and make the environment attractive. " +
    "Leaders also educate residents on proper waste disposal.";
  const questions = [
    "State two activities the community members do during clean-up exercises.",
    "Why are the clean-up exercises important?",
    "What benefit does planting trees bring to the community?",
    "Who takes part in the clean-up exercises?",
    "Mention one way leaders support the clean-up exercises.",
    "What does the passage say about disease prevention?",
    "Explain what makes the environment attractive, according to the passage.",
    "Give one example of proper waste disposal mentioned or implied.",
    "What is the main idea of the passage?",
    "Suggest one additional benefit of community clean-up exercises.",
  ];
  return { passage, questions };
}

function getBeceEnglishSummary() {
  const passage =
    "Healthy study habits include planning your time, revising regularly, and taking short breaks. " +
    "Students who set goals and review their work improve their performance. " +
    "Rest and sleep are also important for memory and concentration.";
  return {
    passage,
    points: [
      "Plan your time for study.",
      "Revise regularly.",
      "Take short breaks while studying.",
      "Set goals and review your work.",
      "Rest and sleep to aid memory and concentration.",
    ],
  };
}

function buildBeceEnglishEssayQuestions({ exam, subject }) {
  const essayOptions = getBeceEnglishSectionAOptions();
  const comprehension = getBeceEnglishComprehension();
  const summary = getBeceEnglishSummary();
  const questions = [];

  essayOptions.forEach((option, index) => {
    const essay = buildEssay({
      prompt:
        `Section A - Essay (Option ${String.fromCharCode(65 + index)}):\n` +
        "Answer ONE of the five options.\n" +
        "Write an essay of about 200-300 words.\n" +
        option,
      markingGuide:
        "Check format, organization, grammar, paragraphing, and relevance to the topic.",
      sampleAnswer:
        "Plan an introduction, develop clear points with examples, and conclude well.",
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Essay Writing",
        index,
        ...essay,
      })
    );
  });

  comprehension.questions.forEach((question, index) => {
    const essay = buildEssay({
      prompt:
        "Section B - Comprehension:\n" +
        `Passage: ${comprehension.passage}\n` +
        `Question ${index + 1}: ${question}`,
      markingGuide:
        "Look for accurate interpretation and clear answers in complete sentences.",
      sampleAnswer:
        "Answer directly using your own words where possible.",
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Comprehension",
        index: essayOptions.length + index,
        ...essay,
      })
    );
  });

  summary.points.forEach((point, index) => {
    const essay = buildEssay({
      prompt:
        "Section C - Summary:\n" +
        `Passage: ${summary.passage}\n` +
        `Write summary point ${index + 1}.`,
      markingGuide:
        "Look for concise points written as simple sentences without examples.",
      sampleAnswer: point,
    });
    questions.push(
      makeEssayWithPrompt({
        exam,
        subject,
        topic: "Summary",
        index: essayOptions.length + comprehension.questions.length + index,
        ...essay,
      })
    );
  });

  return questions;
}

function getWassceMathEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}):\n` +
      "(a) Solve the equation and show all working.\n" +
      `(b) Apply ${topic} to a real-life word problem and show your steps.\n` +
      "(c) State your final answer clearly.",
    markingGuide:
      "Award marks for correct method, clear working, and accurate final answers.",
    sampleAnswer:
      "Show the steps, apply the correct formula, and state the final answer clearly.",
  });
}

function getWassceEnglishEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}): Write an essay of about 300-450 words.\n` +
      `Topic: ${topic}.\n` +
      "Plan your work and write in clear paragraphs.",
    markingGuide:
      "Assess organization, coherence, grammar, vocabulary, and relevance.",
    sampleAnswer:
      "Write a clear introduction, develop points with examples, and conclude strongly.",
  });
}

function getWassceScienceEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}):\n` +
      `An experiment is set up to investigate ${topic}.\n` +
      "(a) State the aim and hypothesis.\n" +
      "(b) Describe the apparatus and procedure.\n" +
      "(c) Record expected observations or results.\n" +
      "(d) Explain the results using scientific principles.",
    markingGuide:
      "Look for a clear aim, logical procedure, realistic observations, and correct explanation.",
    sampleAnswer:
      "State the aim and hypothesis, outline a method, note observations, and explain the results.",
  });
}

function getWassceSocialEssay(topic, index) {
  const label = index === 0 ? "Compulsory" : "Optional";
  return buildEssay({
    prompt:
      `Question ${index + 1} (${label}):\n` +
      `(a) Explain ${topic} using Ghana or West African examples.\n` +
      "(b) State two causes or contributing factors.\n" +
      "(c) Discuss two effects and propose solutions.",
    markingGuide:
      "Look for clear explanations, relevant examples, and practical solutions.",
    sampleAnswer:
      "Define the issue, give examples, describe causes and effects, and propose solutions.",
  });
}

function getWassceEssay(subject, topic, index) {
  if (subject === "Mathematics") {
    return getWassceMathEssay(topic, index);
  }
  if (subject === "English") {
    return getWassceEnglishEssay(topic, index);
  }
  if (
    subject === "Integrated Science" ||
    subject === "Biology" ||
    subject === "Physics" ||
    subject === "Chemistry"
  ) {
    return getWassceScienceEssay(topic, index);
  }
  if (subject === "Social Studies" || subject === "Economics" || subject === "Government") {
    return getWassceSocialEssay(topic, index);
  }
  if (subject === "Geography" || subject === "History") {
    return buildEssay({
      prompt:
        `Question ${index + 1} (${index === 0 ? "Compulsory" : "Optional"}):\n` +
        `Discuss ${topic} with examples from Ghana or West Africa.\n` +
        "Support your answer with clear points.",
      markingGuide:
        "Assess historical or geographic accuracy, organization, and use of examples.",
      sampleAnswer:
        "Provide context, explain key points, and use relevant examples.",
    });
  }
  if (subject === "Accounting" || subject === "Business Management") {
    return buildEssay({
      prompt:
        `Question ${index + 1} (${index === 0 ? "Compulsory" : "Optional"}):\n` +
        `Answer the following on ${topic}.\n` +
        "(a) Define the concept.\n" +
        "(b) Explain two applications in business.\n" +
        "(c) Provide a short Ghanaian example.",
      markingGuide:
        "Look for accurate definitions, clear applications, and relevant examples.",
      sampleAnswer:
        "Define the term, explain uses, and provide a practical example.",
    });
  }
  if (subject === "Literature") {
    return buildEssay({
      prompt:
        `Question ${index + 1} (${index === 0 ? "Compulsory" : "Optional"}):\n` +
        `Write a critical response on ${topic} from a prescribed text.\n` +
        "Use quotations or references to support your points.",
      markingGuide:
        "Assess interpretation, textual evidence, and clarity of argument.",
      sampleAnswer:
        "Introduce the theme, analyze key moments, and conclude with a clear position.",
    });
  }
  if (subject === "ICT") {
    return buildEssay({
      prompt:
        `Question ${index + 1} (${index === 0 ? "Compulsory" : "Optional"}):\n` +
        `Describe a practical ICT solution for ${topic} and outline steps to implement it.`,
      markingGuide:
        "Look for practical steps, accurate ICT concepts, and clear explanation.",
      sampleAnswer:
        "Describe the solution, list steps, and explain how it solves the problem.",
    });
  }
  if (subject === "French") {
    return buildEssay({
      prompt:
        `Question ${index + 1} (${index === 0 ? "Compulsory" : "Optional"}):\n` +
        `Write a short essay in French about ${topic}. Use correct grammar.`,
      markingGuide:
        "Check vocabulary, grammar accuracy, and correct meaning.",
      sampleAnswer:
        "Use clear sentences and correct French vocabulary related to the topic.",
    });
  }
  return buildEssay({
    prompt:
      `Question ${index + 1} (${index === 0 ? "Compulsory" : "Optional"}):\n` +
      `Explain ${topic} in the context of ${subject} and give a Ghanaian example.`,
    markingGuide:
      "Look for clear points, relevant examples, and structured responses.",
    sampleAnswer:
      "Define the topic, explain key ideas, and include a local example.",
  });
}

function getSubjectEssay(exam, subject, topic, index) {
  if (exam === "BECE") {
    if (subject === "Mathematics") {
      return getBeceMathEssay(topic, index);
    }
    if (subject === "Science") {
      return getBeceScienceEssay(topic, index);
    }
    if (subject === "English") {
      return getBeceEnglishEssay(topic, index);
    }
    if (subject === "Social Studies") {
      return getBeceSocialEssay(topic, index);
    }
  }
  if (exam === "WASSCE") {
    return getWassceEssay(subject, topic, index);
  }
  if (subject === "Mathematics") {
    return buildEssay({
      prompt: `Solve and explain a typical ${topic} problem step by step.`,
      markingGuide:
        "Look for correct method, clear working, and a valid final answer.",
      sampleAnswer:
        `State the formula for ${topic}, show working, and present the final result clearly.`,
    });
  }
  if (subject === "French") {
    return buildEssay({
      prompt: `Write a short paragraph in French about ${topic}.`,
      markingGuide:
        "Check vocabulary, grammar accuracy, and correct meaning.",
      sampleAnswer:
        `Use simple sentences and correct French vocabulary related to ${topic}.`,
    });
  }
  if (subject === "English") {
    return buildEssay({
      prompt: `Write a short essay on ${topic} with a clear introduction and conclusion.`,
      markingGuide: "Assess organization, grammar, and relevance to the topic.",
      sampleAnswer:
        `Introduce ${topic}, develop two points with examples, and conclude clearly.`,
    });
  }
  if (subject === "ICT") {
    return buildEssay({
      prompt: `Describe two practical uses of ${topic} in ICT.`,
      markingGuide: "Look for accurate explanations and relevant examples.",
      sampleAnswer:
        `Explain how ${topic} is applied in real ICT tasks and give examples.`,
    });
  }
  if (
    subject === "Science" ||
    subject === "Biology" ||
    subject === "Physics" ||
    subject === "Chemistry"
  ) {
    return buildEssay({
      prompt: `Explain ${topic} and describe its importance in ${subject}.`,
      markingGuide: "Look for scientific accuracy and clear explanations.",
      sampleAnswer:
        `Define ${topic}, give an example, and explain its relevance to ${subject}.`,
    });
  }
  return buildEssay({
    prompt: `Explain ${topic} in the context of ${subject} and give a Ghanaian example.`,
    markingGuide:
      "Look for clear points, relevant examples, and structured responses.",
    sampleAnswer:
      `Define ${topic}, explain key ideas, and include a local example.`,
  });
}

function makeMcq({ exam, subject, topic, index }) {
  const question = getSubjectMcq(subject, topic, index);
  const year = 2018 + (index % 7);
  const difficulty = ["EASY", "MEDIUM", "HARD"][index % 3];
  return {
    id: `${slugify(exam)}-${slugify(subject)}-mcq-${String(index + 1).padStart(3, "0")}`,
    exam,
    subject,
    topic,
    year,
    difficulty,
    type: "MCQ",
    prompt: question.prompt,
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
}

function makeEssay({ exam, subject, topic, index }) {
  const essay = getSubjectEssay(exam, subject, topic, index);
  const year = 2018 + (index % 7);
  const difficulty = ["EASY", "MEDIUM", "HARD"][index % 3];
  return {
    id: `${slugify(exam)}-${slugify(subject)}-essay-${String(index + 1).padStart(3, "0")}`,
    exam,
    subject,
    topic,
    year,
    difficulty,
    type: "ESSAY",
    prompt: essay.prompt,
    options: [],
    markingGuide: essay.markingGuide,
    sampleAnswer: essay.sampleAnswer,
  };
}

function makeEssayWithPrompt({
  exam,
  subject,
  topic,
  index,
  prompt,
  markingGuide,
  sampleAnswer,
}) {
  const year = 2018 + (index % 7);
  const difficulty = ["EASY", "MEDIUM", "HARD"][index % 3];
  return {
    id: `${slugify(exam)}-${slugify(subject)}-essay-${String(index + 1).padStart(3, "0")}`,
    exam,
    subject,
    topic,
    year,
    difficulty,
    type: "ESSAY",
    prompt,
    options: [],
    markingGuide,
    sampleAnswer,
  };
}

function generateQuestions() {
  const generated = [];
  for (const exam of Object.keys(SUBJECT_TOPICS)) {
    const subjects = SUBJECT_TOPICS[exam];
    for (const subject of Object.keys(subjects)) {
      const topics = subjects[subject];
      const mcqCount =
        exam === "WASSCE"
          ? 50
          : exam === "BECE" && subject === "English"
          ? 54
          : 40;
      for (let i = 0; i < mcqCount; i += 1) {
        const topic = pickFrom(topics, i);
        generated.push(makeMcq({ exam, subject, topic, index: i }));
      }
      if (exam === "BECE" && subject === "English") {
        generated.push(
          ...buildBeceEnglishEssayQuestions({ exam, subject })
        );
        continue;
      }
      if (exam === "WASSCE" && subject === "English") {
        generated.push(
          ...buildWassceEnglishEssayQuestions({ exam, subject })
        );
        continue;
      }
      const hasPractical =
        exam === "WASSCE" &&
        ["Integrated Science", "Biology", "Chemistry", "Physics"].includes(
          subject
        );
      const essayCount = 10;
      for (let i = 0; i < essayCount; i += 1) {
        const topic = pickFrom(topics, i);
        generated.push(makeEssay({ exam, subject, topic, index: i }));
      }
      if (hasPractical) {
        for (let i = 0; i < 5; i += 1) {
          const practical = buildEssay({
            prompt:
              `Paper 3 - Practical:\n` +
              `Describe a practical investigation related to ${pickFrom(
                topics,
                i
              )} and explain your observations.`,
            markingGuide:
              "Look for clear procedure, observations, and correct explanation.",
            sampleAnswer:
              "Outline a procedure, state expected observations, and explain the results.",
          });
          generated.push(
            makeEssayWithPrompt({
              exam,
              subject,
              topic: "Practical",
              index: essayCount + i,
              ...practical,
            })
          );
        }
      }
    }
  }
  return generated;
}

questions.push(...generateQuestions());

async function main() {
  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: question.id },
      update: question,
      create: question,
    });
  }

  const beceSimulationConfigs = [
    {
      exam: "BECE",
      subject: "English",
      label: "BECE English Language",
      sections: [
        {
          id: "bece-english-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 50,
          questionCount: 54,
        },
        {
          id: "bece-english-paper-2",
          label: "Paper 2 (Written)",
          type: "essay",
          durationMinutes: 70,
          questionCount: 18,
        },
      ],
    },
    {
      exam: "BECE",
      subject: "Mathematics",
      label: "BECE Mathematics",
      sections: [
        {
          id: "bece-math-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 40,
        },
        {
          id: "bece-math-paper-2",
          label: "Paper 2 (Structured)",
          type: "essay",
          durationMinutes: 60,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "BECE",
      subject: "Science",
      label: "BECE Integrated Science",
      sections: [
        {
          id: "bece-science-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 45,
          questionCount: 40,
        },
        {
          id: "bece-science-paper-2",
          label: "Paper 2 (Theory)",
          type: "essay",
          durationMinutes: 60,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "BECE",
      subject: "Social Studies",
      label: "BECE Social Studies",
      sections: [
        {
          id: "bece-social-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 45,
          questionCount: 40,
        },
        {
          id: "bece-social-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 60,
          questionCount: 10,
        },
      ],
    },
  ];

  const wassceSimulationConfigs = [
    {
      exam: "WASSCE",
      subject: "English",
      label: "WASSCE English Language",
      sections: [
        {
          id: "wassce-english-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-english-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 20,
          topics: ["Essay Writing", "Comprehension", "Summary"],
        },
        {
          id: "wassce-english-paper-3",
          label: "Paper 3 (Oral)",
          type: "essay",
          durationMinutes: 60,
          questionCount: 5,
          topics: ["Oral"],
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Mathematics",
      label: "WASSCE Core Mathematics",
      sections: [
        {
          id: "wassce-math-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 75,
          questionCount: 50,
        },
        {
          id: "wassce-math-paper-2",
          label: "Paper 2 (Theory)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Integrated Science",
      label: "WASSCE Integrated Science",
      sections: [
        {
          id: "wassce-science-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-science-paper-2",
          label: "Paper 2 (Theory)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
        {
          id: "wassce-science-paper-3",
          label: "Paper 3 (Practical)",
          type: "essay",
          durationMinutes: 120,
          questionCount: 5,
          topics: ["Practical"],
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Social Studies",
      label: "WASSCE Social Studies",
      sections: [
        {
          id: "wassce-social-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-social-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 120,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Biology",
      label: "WASSCE Biology",
      sections: [
        {
          id: "wassce-bio-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-bio-paper-2",
          label: "Paper 2 (Theory)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
        {
          id: "wassce-bio-paper-3",
          label: "Paper 3 (Practical)",
          type: "essay",
          durationMinutes: 120,
          questionCount: 5,
          topics: ["Practical"],
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Chemistry",
      label: "WASSCE Chemistry",
      sections: [
        {
          id: "wassce-chem-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-chem-paper-2",
          label: "Paper 2 (Theory)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
        {
          id: "wassce-chem-paper-3",
          label: "Paper 3 (Practical)",
          type: "essay",
          durationMinutes: 120,
          questionCount: 5,
          topics: ["Practical"],
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Physics",
      label: "WASSCE Physics",
      sections: [
        {
          id: "wassce-phy-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-phy-paper-2",
          label: "Paper 2 (Theory)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
        {
          id: "wassce-phy-paper-3",
          label: "Paper 3 (Practical)",
          type: "essay",
          durationMinutes: 120,
          questionCount: 5,
          topics: ["Practical"],
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Economics",
      label: "WASSCE Economics",
      sections: [
        {
          id: "wassce-eco-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-eco-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Government",
      label: "WASSCE Government",
      sections: [
        {
          id: "wassce-gov-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-gov-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Geography",
      label: "WASSCE Geography",
      sections: [
        {
          id: "wassce-geo-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-geo-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "History",
      label: "WASSCE History",
      sections: [
        {
          id: "wassce-history-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-history-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Literature",
      label: "WASSCE Literature",
      sections: [
        {
          id: "wassce-lit-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-lit-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Accounting",
      label: "WASSCE Accounting",
      sections: [
        {
          id: "wassce-acc-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-acc-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "Business Management",
      label: "WASSCE Business Management",
      sections: [
        {
          id: "wassce-bm-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-bm-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "ICT",
      label: "WASSCE ICT",
      sections: [
        {
          id: "wassce-ict-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-ict-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
    {
      exam: "WASSCE",
      subject: "French",
      label: "WASSCE French",
      sections: [
        {
          id: "wassce-french-paper-1",
          label: "Paper 1 (Objective)",
          type: "mcq",
          durationMinutes: 60,
          questionCount: 50,
        },
        {
          id: "wassce-french-paper-2",
          label: "Paper 2 (Essay)",
          type: "essay",
          durationMinutes: 150,
          questionCount: 10,
        },
      ],
    },
  ];

  for (const config of beceSimulationConfigs) {
    await prisma.simulationConfig.upsert({
      where: { exam_subject: { exam: config.exam, subject: config.subject } },
      update: {
        label: config.label,
        sections: config.sections,
        published: true,
      },
      create: {
        ...config,
        published: true,
      },
    });
  }

  for (const config of wassceSimulationConfigs) {
    await prisma.simulationConfig.upsert({
      where: { exam_subject: { exam: config.exam, subject: config.subject } },
      update: {
        label: config.label,
        sections: config.sections,
        published: true,
      },
      create: {
        ...config,
        published: true,
      },
    });
  }
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
