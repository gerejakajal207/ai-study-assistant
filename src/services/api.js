const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const MOCK_MCQS = [
  {
    question: "What is photosynthesis?",
    options: {
      A: "Process of respiration",
      B: "Process of converting sunlight to food",
      C: "Process of cell division",
      D: "Process of digestion",
    },
    answer: "B",
    explanation:
      "Photosynthesis converts sunlight, water and CO2 into glucose and oxygen.",
  },
  {
    question: "Where does photosynthesis occur?",
    options: {
      A: "Mitochondria",
      B: "Nucleus",
      C: "Chloroplast",
      D: "Ribosome",
    },
    answer: "C",
    explanation:
      "Chloroplasts contain chlorophyll which absorbs sunlight for photosynthesis.",
  },
  {
    question: "What gas is released during photosynthesis?",
    options: { A: "Carbon Dioxide", B: "Nitrogen", C: "Hydrogen", D: "Oxygen" },
    answer: "D",
    explanation:
      "Oxygen is released as a byproduct when water molecules are split.",
  },
];

const MOCK_FLASHCARDS = [
  {
    front: "What is photosynthesis?",
    back: "The process by which plants convert sunlight, water, and CO2 into glucose and oxygen.",
  },
  {
    front: "Where does photosynthesis occur?",
    back: "In the chloroplasts, specifically using the pigment chlorophyll.",
  },
  {
    front: "What is the equation for photosynthesis?",
    back: "6CO2 + 6H2O + light → C6H12O6 + 6O2",
  },
];

export async function generateMCQs(topic) {
  // TODO: replace with real API call when backend is ready
  // const res = await fetch(`${BASE_URL}/topic/mcq`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ topic }),
  // });
  // if (!res.ok) throw new Error("Failed to generate MCQs");
  // return res.json();

  await new Promise((r) => setTimeout(r, 1500)); // simulate loading
  return MOCK_MCQS;
}

export async function generateFlashcards(topic) {
  // TODO: replace with real API call when backend is ready
  // const res = await fetch(`${BASE_URL}/topic/flashcards`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ topic }),
  // });
  // if (!res.ok) throw new Error("Failed to generate flashcards");
  // return res.json();

  await new Promise((r) => setTimeout(r, 1500)); // simulate loading
  return MOCK_FLASHCARDS;
}
export async function generateMCQsFromNotes(file) {
  await new Promise((r) => setTimeout(r, 2000));
  return MOCK_MCQS; // reuse the same mock data
}

export async function generateFlashcardsFromNotes(file) {
  await new Promise((r) => setTimeout(r, 2000));
  return MOCK_FLASHCARDS;
}
