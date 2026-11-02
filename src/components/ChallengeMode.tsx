import React, { useState, useMemo } from 'react';
import { Difficulty, ChallengeQuestion } from '../types/physics';
import { CHALLENGE_QUESTIONS } from '../data/challenges';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, Award, Zap, BookOpen, Compass } from 'lucide-react';

interface ChallengeModeProps {
  onReturnToLab: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onReturnToLab }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('facil');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Filter questions for active difficulty
  const questions = useMemo(() => {
    return CHALLENGE_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentQ: ChallengeQuestion | undefined = questions[currentQuestionIndex];

  // Dynamically shuffle options for the active question so positions vary on every attempt
  const shuffledOptions = useMemo(() => {
    if (!currentQ) return [];
    const arr = [...currentQ.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentQ?.id]);

  const handleSelectOption = (opt: number) => {
    if (isAnswered) return;
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || isAnswered || !currentQ) return;

    const diff = Math.abs(selectedAnswer - currentQ.correctAnswer);
    const correct = diff <= currentQ.tolerance;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      const points = selectedDifficulty === 'facil' ? 100 : selectedDifficulty === 'intermedio' ? 200 : 350;
      const streakBonus = streak * 25;
      setScore((prev) => prev + points + streakBonus);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > highestStreak) setHighestStreak(next);
        return next;
      });

      // Launch subtle celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sound.playIncorrect();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = (newDiff?: Difficulty) => {
    sound.playClick();
    if (newDiff) setSelectedDifficulty(newDiff);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header & Difficulty Selector */}
      <div className="bg-slate-900/90 rounded-2xl border border-sky-900/40 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">MODO DESAFÍO FÍSICO</h2>
            <p className="text-xs text-slate-400">Pon a prueba tus conocimientos en problemas reales de fricción</p>
          </div>
        </div>

        {/* Difficulty Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          {(['facil', 'intermedio', 'dificil'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => handleRestart(d)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                selectedDifficulty === d
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {d === 'facil' ? 'Fácil' : d === 'intermedio' ? 'Intermedio' : 'Difícil'}
            </button>
          ))}
        </div>
      </div>

      {/* Scoreboard bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Puntuación</span>
          <span className="text-xl font-bold font-mono text-cyan-300 tabular-nums">{score} pts</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Progreso</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums">
            {isFinished ? questions.length : currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Racha Actual</span>
          <span className="text-xl font-bold font-mono text-amber-300 tabular-nums flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            {streak}
          </span>
        </div>
      </div>

      {/* Main Question Card OR Results Screen */}
      {!isFinished && currentQ ? (
        <div className="bg-slate-900/90 rounded-2xl border border-sky-900/40 p-6 shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Situation Title & Scenario */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span>Pregunta #{currentQuestionIndex + 1}</span>
              <span>·</span>
              <span className="capitalize">{currentQ.difficulty}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {currentQ.title}
            </h3>
            <p className="text-sm text-slate-300 mt-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
              {currentQ.scenario}
            </p>
          </div>

          {/* Given parameters badge strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400">Datos dados:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">
              m = {currentQ.given.mass} kg
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">
              μs = {currentQ.given.muS}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">
              μk = {currentQ.given.muK}
            </span>
            {currentQ.given.appliedForce !== undefined && (
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-mono">
                F_app = {currentQ.given.appliedForce} N
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              g = 9.81 m/s²
            </span>
          </div>

          {/* The Prompt Question */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-slate-100 font-medium text-sm">
            {currentQ.question}
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shuffledOptions.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              let optionClass = 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700 text-slate-200';

              if (isAnswered) {
                if (Math.abs(opt - currentQ.correctAnswer) <= currentQ.tolerance) {
                  optionClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  optionClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  optionClass = 'opacity-40 border-slate-850 text-slate-500';
                }
              } else if (isSelected) {
                optionClass = 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => { sound.playClick(); handleSelectOption(opt); }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between font-mono text-sm ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-sans text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.toFixed(2)} {currentQ.unit}</span>
                  </div>

                  {isAnswered && Math.abs(opt - currentQ.correctAnswer) <= currentQ.tolerance && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {isAnswered && isSelected && Math.abs(opt - currentQ.correctAnswer) > currentQ.tolerance && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Explanation Box */}
          {isAnswered && (
            <div className={`p-4 rounded-xl border transition-all space-y-3 ${
              isCorrect ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-rose-950/30 border-rose-500/50'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-emerald-300 text-sm">
                      ¡Correcto! Respuesta calculada con éxito.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span className="font-bold text-rose-300 text-sm">
                      Incorrecto. La respuesta correcta es {currentQ.correctAnswer.toFixed(2)} {currentQ.unit}.
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p>{currentQ.explanation}</p>
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono space-y-1">
                  <span className="text-[10px] text-cyan-400 block font-sans font-bold">
                    PROCEDIMIENTO MATEMÁTICO:
                  </span>
                  {currentQ.solutionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="text-slate-300">
                      • {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Button: Check Answer or Next Question */}
          <div className="pt-2 flex items-center justify-end">
            {!isAnswered ? (
              <button
                disabled={selectedAnswer === null}
                onClick={handleCheckAnswer}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/35 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Comprobar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Final Victory / Score Screen */
        <div className="bg-slate-900/90 rounded-2xl border border-sky-900/40 p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-2xl font-bold font-display text-white">
              ¡Desafío Completado!
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Has respondido todas las preguntas de nivel {selectedDifficulty.toUpperCase()}
            </p>
          </div>

          <div className="max-w-md mx-auto grid grid-cols-2 gap-4 py-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Puntaje Total</span>
              <strong className="text-2xl font-bold font-mono text-cyan-300">{score}</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Mejor Racha</span>
              <strong className="text-2xl font-bold font-mono text-amber-300">{highestStreak} seguidas</strong>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            ¡Excelente desempeño aplicando la Segunda Ley de Newton, la Normal y los coeficientes de rozamiento!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleRestart()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar este nivel</span>
            </button>

            <button
              onClick={onReturnToLab}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Regresar al Laboratorio</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
