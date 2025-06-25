import { useState, useEffect } from "react";

export default function SuiviSport() {
  const [exercices, setExercices] = useState(() => {
    if (typeof window !== 'undefined') {
      const sauvegarde = localStorage.getItem("exercices");
      return sauvegarde ? JSON.parse(sauvegarde) : [];
    }
    return [];
  });

  const [nouvelExercice, setNouvelExercice] = useState("");
  const [minuteur, setMinuteur] = useState(0);
  const [actif, setActif] = useState(false);

  useEffect(() => {
    localStorage.setItem("exercices", JSON.stringify(exercices));
  }, [exercices]);

  useEffect(() => {
    let interval = null;
    if (actif && minuteur > 0) {
      interval = setInterval(() => {
        setMinuteur((prev) => prev - 1);
      }, 1000);
    } else if (minuteur === 0) {
      clearInterval(interval);
      setActif(false);
    }
    return () => clearInterval(interval);
  }, [actif, minuteur]);

  const ajouterExercice = () => {
    if (nouvelExercice.trim() !== "") {
      setExercices([
        ...exercices,
        { nom: nouvelExercice, series: 0, repetitions: 0, poids: "", termine: false },
      ]);
      setNouvelExercice("");
    }
  };

  const changerValeur = (index, champ, valeur) => {
    const copie = [...exercices];
    copie[index][champ] = valeur;
    setExercices(copie);
  };

  const toggleTermine = (index) => {
    const copie = [...exercices];
    copie[index].termine = !copie[index].termine;
    setExercices(copie);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Suivi d'entraînement</h1>

      <div className="flex mb-4 gap-2">
        <input
          className="border p-2 flex-1 rounded"
          type="text"
          placeholder="Nom de l'exercice"
          value={nouvelExercice}
          onChange={(e) => setNouvelExercice(e.target.value)}
        />
        <button onClick={ajouterExercice} className="bg-blue-500 text-white px-4 py-2 rounded">
          +
        </button>
      </div>

      {exercices.map((ex, i) => (
        <div key={i} className="border rounded p-3 mb-3 shadow">
          <div className="flex justify-between items-center">
            <span className={ex.termine ? "line-through" : ""}>{ex.nom}</span>
            <input
              type="checkbox"
              checked={ex.termine}
              onChange={() => toggleTermine(i)}
              className="ml-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
            <input
              type="number"
              className="border p-1 rounded"
              placeholder="Séries"
              value={ex.series}
              onChange={(e) => changerValeur(i, "series", e.target.value)}
            />
            <input
              type="number"
              className="border p-1 rounded"
              placeholder="Répétitions"
              value={ex.repetitions}
              onChange={(e) => changerValeur(i, "repetitions", e.target.value)}
            />
            <input
              type="text"
              className="border p-1 rounded"
              placeholder="Poids"
              value={ex.poids}
              onChange={(e) => changerValeur(i, "poids", e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Minuteur de repos</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="border p-2 rounded w-20"
            placeholder="Secondes"
            value={minuteur}
            onChange={(e) => setMinuteur(Number(e.target.value))}
            disabled={actif}
          />
          <button
            onClick={() => setActif(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={actif || minuteur === 0}
          >
            Démarrer
          </button>
          {actif && <span className="text-lg font-mono">⏱️ {minuteur}s</span>}
        </div>
      </div>
    </div>
  );
}
