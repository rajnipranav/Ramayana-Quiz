import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Crown, 
  Coins, 
  RotateCcw, 
  Share2, 
  Sparkles,
  ChevronRight,
  Star,
  Trophy,
  Gem
} from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Quiz Data
interface Question {
  id: number;
  character: string;
  cardImage: string;
  backgroundImage: string;
  question: string;
  options: string[];
  correctAnswer: number;
  emoji: string;
}

const questions: Question[] = [
  {
    id: 1,
    character: 'Rama',
    cardImage: '/card_rama.jpg',
    backgroundImage: '/bg_q1.jpg',
    question: 'Who is the seventh avatar of Lord Vishnu?',
    options: ['Rama', 'Krishna', 'Vamana', 'Parashurama'],
    correctAnswer: 0,
    emoji: '👑'
  },
  {
    id: 2,
    character: 'Sita',
    cardImage: '/card_sita.jpg',
    backgroundImage: '/bg_q2.jpg',
    question: 'Who is the wife of Lord Rama and an avatar of Goddess Lakshmi?',
    options: ['Urmila', 'Sita', 'Mandodari', 'Tara'],
    correctAnswer: 1,
    emoji: '🌸'
  },
  {
    id: 3,
    character: 'Lakshmana',
    cardImage: '/card_lakshmana.jpg',
    backgroundImage: '/bg_q3.jpg',
    question: 'Who accompanied Rama into exile and is his devoted brother?',
    options: ['Bharata', 'Shatrughna', 'Lakshmana', 'Vibhishana'],
    correctAnswer: 2,
    emoji: '🏹'
  },
  {
    id: 4,
    character: 'Hanuman',
    cardImage: '/card_hanuman.jpg',
    backgroundImage: '/bg_q4.jpg',
    question: 'Which divine vanara is known for his unwavering devotion to Rama?',
    options: ['Sugriva', 'Angada', 'Jambavan', 'Hanuman'],
    correctAnswer: 3,
    emoji: '🐒'
  },
  {
    id: 5,
    character: 'Ravana',
    cardImage: '/card_ravana.jpg',
    backgroundImage: '/bg_q5.jpg',
    question: 'Who is the ten-headed king of Lanka and the story\'s main antagonist?',
    options: ['Kumbhakarna', 'Ravana', 'Indrajit', 'Akshayakumara'],
    correctAnswer: 1,
    emoji: '👹'
  },
  {
    id: 6,
    character: 'Bharata',
    cardImage: '/card_bharata.jpg',
    backgroundImage: '/bg_q6.jpg',
    question: 'Which brother ruled Ayodhya as a steward, refusing the throne for Rama\'s return?',
    options: ['Shatrughna', 'Bharata', 'Lakshmana', 'Vibhishana'],
    correctAnswer: 1,
    emoji: '🙏'
  },
  {
    id: 7,
    character: 'Kumbhakarna',
    cardImage: '/card_kumbhakarna.jpg',
    backgroundImage: '/bg_q7.jpg',
    question: 'Which giant warrior of Lanka is known for sleeping for months at a time?',
    options: ['Kumbhakarna', 'Vibhishana', 'Indrajit', 'Akshayakumara'],
    correctAnswer: 0,
    emoji: '😴'
  },
  {
    id: 8,
    character: 'Vibhishana',
    cardImage: '/card_vibhishana.jpg',
    backgroundImage: '/bg_q8.jpg',
    question: 'Which righteous brother of Ravana joined Rama\'s side?',
    options: ['Kumbhakarna', 'Indrajit', 'Vibhishana', 'Akshayakumara'],
    correctAnswer: 2,
    emoji: '⚖️'
  }
];

// SVG Components
const GemIcon = ({ filled }: { filled: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={filled ? 'gem-filled' : 'gem-empty'}>
    <path d="M12 2L2 9L12 22L22 9L12 2Z" />
  </svg>
);

const CoinIcon = () => (
  <div className="coin-ring w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
    <Coins className="w-5 h-5 text-purple-900" />
  </div>
);

// HUD Component
const HUD = ({ coins, currentQuestion }: { coins: number; currentQuestion: number }) => (
  <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
    {/* Coin Counter */}
    <div className="flex items-center gap-3 pointer-events-auto">
      <CoinIcon />
      <div className="flex flex-col">
        <span className="font-space text-xs uppercase tracking-widest text-ramayana-text-muted">Coins</span>
        <span className="font-cinzel text-xl font-bold text-ramayana-gold">{coins}</span>
      </div>
    </div>
    
    {/* Progress Gems */}
    <div className="flex items-center gap-2 pointer-events-auto">
      <span className="font-space text-xs uppercase tracking-widest text-ramayana-text-muted mr-2">Progress</span>
      <div className="flex gap-1">
        {questions.map((_, index) => (
          <GemIcon key={index} filled={index < currentQuestion} />
        ))}
      </div>
    </div>
  </div>
);

// Start Screen Component
const StartScreen = ({ onStart }: { onStart: () => void }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Auto-play entrance animation
      gsap.fromTo(titleRef.current, 
        { y: 24, opacity: 0, rotateX: 25 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: 'back.out(1.4)', delay: 0.3 }
      );
      
      gsap.fromTo(cardRef.current,
        { y: '18vh', scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)', delay: 0.5 }
      );
      
      gsap.fromTo(ctaRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.8 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="section-pinned flex flex-col items-center justify-center relative"
      style={{ background: 'var(--ramayana-purple)' }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg_hero.jpg)' }}
      />
      <div className="bg-overlay" />
      <div className="vignette" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-ramayana-gold" />
          <span className="font-space text-sm uppercase tracking-widest text-ramayana-gold">Epic Quiz Adventure</span>
          <Sparkles className="w-6 h-6 text-ramayana-gold" />
        </div>
        
        <h1 
          ref={titleRef}
          className="font-cinzel text-5xl md:text-7xl font-bold text-gradient-gold mb-4"
        >
          Ramayana Quest
        </h1>
        
        <p className="font-inter text-lg md:text-xl text-ramayana-text-muted mb-8 max-w-md">
          Eight questions. One ancient journey. How far will you go?
        </p>
        
        {/* Character Card */}
        <div 
          ref={cardRef}
          className="w-64 md:w-80 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-ramayana-gold/40 shadow-2xl mb-8 float-animation"
        >
          <img 
            src="/card_rama.jpg" 
            alt="Lord Rama" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* CTA Button */}
        <button
          ref={ctaRef}
          onClick={onStart}
          className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl font-cinzel font-bold text-lg text-purple-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <Crown className="w-6 h-6" />
          Start Quest
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Question Component
const QuestionScreen = ({ 
  question, 
  onAnswer, 
  answered,
  selectedOption 
}: { 
  question: Question; 
  onAnswer: (optionIndex: number) => void;
  answered: boolean;
  selectedOption: number | null;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(cardRef.current,
        { y: '100vh', scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      
      gsap.fromTo(questionRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
      
      gsap.fromTo(optionsRef.current?.children || [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.4, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [question.id]);

  return (
    <div 
      ref={sectionRef}
      className="section-pinned flex flex-col items-center justify-center relative"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${question.backgroundImage})` }}
      />
      <div className="bg-overlay" />
      <div className="vignette" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl">
        {/* Question */}
        <div ref={questionRef} className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl">{question.emoji}</span>
            <span className="font-space text-sm uppercase tracking-widest text-ramayana-gold">
              Question {question.id}
            </span>
            <span className="text-3xl">{question.emoji}</span>
          </div>
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white px-4">
            {question.question}
          </h2>
        </div>
        
        {/* Character Card */}
        <div 
          ref={cardRef}
          className="w-48 md:w-56 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-ramayana-gold/40 shadow-2xl mb-6 float-animation"
        >
          <img 
            src={question.cardImage} 
            alt={question.character} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Options */}
        <div ref={optionsRef} className="grid grid-cols-2 gap-3 w-full max-w-lg px-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !answered && onAnswer(index)}
              disabled={answered}
              className={`
                button-royal px-4 py-3 font-inter text-sm md:text-base text-white
                ${answered && index === question.correctAnswer ? 'button-correct' : ''}
                ${answered && selectedOption === index && index !== question.correctAnswer ? 'button-wrong' : ''}
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {answered && index === question.correctAnswer && <Star className="w-4 h-4 text-green-400" />}
                {answered && selectedOption === index && index !== question.correctAnswer && <span className="text-red-400">✗</span>}
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Results Screen Component
const ResultsScreen = ({ 
  score, 
  total, 
  onRestart, 
  onShare 
}: { 
  score: number; 
  total: number; 
  onRestart: () => void;
  onShare: () => void;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const getTitle = () => {
    if (score === total) return 'Golden Crown! 👑';
    if (score >= total * 0.75) return 'Noble Warrior! ⚔️';
    if (score >= total * 0.5) return 'Brave Seeker! 🏹';
    return 'Keep Learning! 📿';
  };

  const getMessage = () => {
    if (score === total) return 'Perfect! You are a true Ramayana scholar!';
    if (score >= total * 0.75) return 'Excellent! Your knowledge of the epic is remarkable!';
    if (score >= total * 0.5) return 'Good effort! Keep exploring the ancient wisdom!';
    return 'The journey continues! Read more about this great epic!';
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative py-20"
      style={{ background: 'var(--ramayana-maroon)' }}
    >
      {/* Mandala Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="mandala" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala)"/>
        </svg>
      </div>
      
      {/* Decorative Gems */}
      <div className="absolute top-20 left-10 opacity-30">
        <Gem className="w-8 h-8 text-ramayana-gold" />
      </div>
      <div className="absolute top-40 right-16 opacity-20">
        <Gem className="w-12 h-12 text-ramayana-gold" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-25">
        <Gem className="w-6 h-6 text-ramayana-gold" />
      </div>
      
      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl"
      >
        {/* Trophy */}
        <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-ramayana-gold/50">
          <Trophy className="w-16 h-16 text-ramayana-gold" />
        </div>
        
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
          Quest Complete!
        </h2>
        
        <p className="font-cinzel text-xl text-ramayana-gold mb-6">
          {getTitle()}
        </p>
        
        {/* Score Display */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl font-cinzel font-bold text-white">
            {score}
          </div>
          <div className="text-2xl text-ramayana-text-muted">/</div>
          <div className="text-4xl font-cinzel text-ramayana-text-muted">
            {total}
          </div>
        </div>
        
        <p className="font-inter text-lg text-ramayana-text-muted mb-8">
          {getMessage()}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestart}
            className="group px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl font-cinzel font-bold text-purple-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Play Again
          </button>
          
          <button
            onClick={onShare}
            className="group px-6 py-3 button-royal rounded-xl font-cinzel font-bold text-white hover:border-ramayana-gold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Result
          </button>
        </div>
        
        {/* Footer */}
        <p className="mt-12 font-inter text-sm text-ramayana-text-muted/60">
          Made with reverence for the epic 🙏
        </p>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'results'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const mainRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setCoins(0);
    setAnsweredQuestions(new Set());
    setSelectedOptions({});
  };

  const handleAnswer = useCallback((optionIndex: number) => {
    if (answeredQuestions.has(currentQuestion)) return;

    const question = questions[currentQuestion];
    const isCorrect = optionIndex === question.correctAnswer;

    setSelectedOptions(prev => ({ ...prev, [currentQuestion]: optionIndex }));
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion));

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 10);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameState('results');
      }
    }, 1500);
  }, [currentQuestion, answeredQuestions]);

  const handleRestart = () => {
    startGame();
  };

  const handleShare = () => {
    const text = `I scored ${score}/${questions.length} on Ramayana Quest! ${score === questions.length ? 'Perfect score! 👑' : ''} Test your knowledge of the epic!`;
    if (navigator.share) {
      navigator.share({
        title: 'Ramayana Quest',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('Result copied to clipboard!');
    }
  };

  // Render based on game state
  return (
    <div ref={mainRef} className="relative">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* HUD - only show during playing */}
      {gameState === 'playing' && (
        <HUD coins={coins} currentQuestion={currentQuestion} />
      )}
      
      {/* Game Content */}
      {gameState === 'start' && (
        <StartScreen onStart={startGame} />
      )}
      
      {gameState === 'playing' && (
        <QuestionScreen
          key={currentQuestion}
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
          answered={answeredQuestions.has(currentQuestion)}
          selectedOption={selectedOptions[currentQuestion] ?? null}
        />
      )}
      
      {gameState === 'results' && (
        <ResultsScreen
          score={score}
          total={questions.length}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default App;