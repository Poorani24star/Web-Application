/*
FIT@HOME - Single-file React App (preview + editable)

How to use:
1. Create a Vite React project (recommended):
   npm create vite@latest fit-at-home -- --template react
   cd fit-at-home
   npm install
   npm install react-router-dom
   Install TailwindCSS following the official steps.

2. Replace src/App.jsx with this file's content (or paste into the canvas preview).
3. Create a .env (or .env.local) with:
   VITE_SPOONACULAR_API_KEY=your_spoonacular_key
   VITE_OPENAI_API_KEY=your_openai_key

4. Run: npm run dev

Notes:
- This is a single-file, editable preview for the frontend. For a real project, split components into separate files.
- Keep your API keys secret. For production, proxy OpenAI/Spoonacular through a backend to protect keys and implement rate-limits.
- This example uses the browser fetch to call the APIs; for OpenAI it calls chat completions endpoint.

*/

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

// ---------- Simple UI components (all in one file for canvas preview) ----------

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center py-5 px-2 text-gray-700">
              <span className="font-bold text-lg">FIT@HOME</span>
            </Link>
            <Link to="/recipe-ai" className="py-5 px-3 text-gray-600 hover:text-gray-900">AI Recipes</Link>
            <Link to="/fitness" className="py-5 px-3 text-gray-600 hover:text-gray-900">Fitness</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Container({ children }) {
  return <div className="p-6 max-w-4xl mx-auto">{children}</div>;
}

// ---------- API helpers (keep lightweight) ----------

async function spoonacularSearch(query) {
  const key = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!key) throw new Error("SPOONACULAR API KEY missing in VITE_SPOONACULAR_API_KEY");

  const q = encodeURIComponent(query || "healthy");
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${q}&number=6&addRecipeInformation=true&apiKey=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Spoonacular request failed");
  return res.json();
}

async function openaiGenerate(prompt) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI API KEY missing in VITE_OPENAI_API_KEY");

  // Example using Chat Completions endpoint
  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful diet and recipe assistant." },
      { role: "user", content: prompt }
    ],
    max_tokens: 600
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }

  return resp.json();
}

// ---------- Pages ----------

function Home() {
  const navigate = useNavigate();
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4">Welcome to FIT@HOME</h1>
      <p className="mb-4">Personalized fitness + AI-powered recipes — start by entering your profile.</p>

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/recipe-ai')}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Generate AI Recipe
          </button>
          <button
            onClick={() => navigate('/fitness')}
            className="px-4 py-2 rounded border"
          >
            Calculate Fitness Metrics
          </button>
        </div>
      </div>
    </Container>
  );
}

function FitnessCalc() {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('sedentary');
  const [result, setResult] = useState(null);

  function calc() {
    // Mifflin-St Jeor
    const s = gender === 'male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    const activityFactor = {
      sedentary: 1.2,
      lightly: 1.375,
      moderately: 1.55,
      very: 1.725,
    };
    const tdee = Math.round(bmr * (activityFactor[activity] || 1.2));
    setResult({ bmr: Math.round(bmr), tdee });
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Fitness Calculator</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="number" value={age} onChange={e => setAge(+e.target.value)} className="border p-2" placeholder="Age" />
        <input type="number" value={height} onChange={e => setHeight(+e.target.value)} className="border p-2" placeholder="Height (cm)" />
        <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} className="border p-2" placeholder="Weight (kg)" />
        <select value={gender} onChange={e => setGender(e.target.value)} className="border p-2">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="mt-3">
        <label className="block mb-1">Activity Level</label>
        <select value={activity} onChange={e => setActivity(e.target.value)} className="border p-2 w-full max-w-xs">
          <option value="sedentary">Sedentary</option>
          <option value="lightly">Lightly active</option>
          <option value="moderately">Moderately active</option>
          <option value="very">Very active</option>
        </select>
      </div>

      <div className="mt-4">
        <button onClick={calc} className="px-4 py-2 rounded bg-blue-600 text-white">Calculate</button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <p>BMR: <strong>{result.bmr} kcal/day</strong></p>
          <p>TDEE: <strong>{result.tdee} kcal/day</strong></p>
        </div>
      )}
    </Container>
  );
}

function RecipeCard({ recipe }) {
  return (
    <div className="border rounded overflow-hidden shadow-sm bg-white">
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-44 object-cover" />}
      <div className="p-3">
        <h3 className="font-semibold">{recipe.title}</h3>
        <p className="text-sm mt-2">Ready in {recipe.readyInMinutes} mins • Servings: {recipe.servings}</p>
        <a href={recipe.sourceUrl || recipe.spoonacularSourceUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-blue-600">View source</a>
      </div>
    </div>
  );
}

function RecipeAI() {
  const [user, setUser] = useState({ diet: '', goal: '', cuisine: '' });
  const [baseResults, setBaseResults] = useState([]);
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate() {
    setError(null);
    setAiText('');
    setBaseResults([]);
    setLoading(true);

    try {
      // 1) fetch a few base recipes from Spoonacular
      const base = await spoonacularSearch(user.cuisine || (user.diet || 'healthy'));
      const recipes = base.results || [];
      setBaseResults(recipes);

      // 2) create a prompt for OpenAI
      const prompt = `Create a personalized recipe and meal plan snippet (ingredients, steps and approximate nutrition) for a user with preferences: ${JSON.stringify(user)}. Base recipes: ${recipes.slice(0,3).map(r=>r.title).join(', ')}. Keep it concise and practical.`;

      const ai = await openaiGenerate(prompt);
      const content = ai.choices?.[0]?.message?.content || JSON.stringify(ai);
      setAiText(content);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">AI Recipe Generator</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <input placeholder="Diet (e.g. vegetarian)" className="border p-2" onChange={e=>setUser({...user, diet:e.target.value})} />
        <input placeholder="Goal (weight loss / muscle)" className="border p-2" onChange={e=>setUser({...user, goal:e.target.value})} />
        <input placeholder="Cuisine (Indian, Italian)" className="border p-2" onChange={e=>setUser({...user, cuisine:e.target.value})} />
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 rounded bg-blue-600 text-white">Generate</button>
        <button onClick={() => { setUser({diet:'',goal:'',cuisine:''}); setAiText(''); setBaseResults([]); }} className="px-4 py-2 rounded border">Reset</button>
      </div>

      {loading && <p className="mt-4">Generating... (this may take a few seconds)</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      {baseResults.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Base recipes from Spoonacular</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {baseResults.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </div>
      )}

      {aiText && (
        <div className="mt-6 p-4 bg-white rounded shadow whitespace-pre-line">
          <h2 className="font-semibold mb-2">AI Suggested Recipe & Plan</h2>
          <div>{aiText}</div>
        </div>
      )}
    </Container>
  );
}

// ---------- App ----------

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe-ai" element={<RecipeAI />} />
          <Route path="/fitness" element={<FitnessCalc />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
