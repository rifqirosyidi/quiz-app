import React, { useState } from 'react';
import { fetchQuizQuestion, Difficulty, QuestionState } from './utils/api'
import QuestionCard from './components/QuestionCard'
import { setEmitFlags } from 'typescript';
import './App.css'

type AnswerObj = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}
const TOTAL_QUESTION = 10

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswer, setUserAnswer] = useState<AnswerObj[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  console.log(questions)

  const startQuiz = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestion(TOTAL_QUESTION, Difficulty.EASY)
    setQuestions(newQuestions)

    setScore(0)
    setUserAnswer([])
    setNumber(0)
    setLoading(false)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer

      if (correct) {
        setScore(prev => prev + 1)
      }

      const answerObj = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }

      setUserAnswer(prev => [...prev, answerObj])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <div className="App">
      <h1>QUIZ APP</h1>
      <small>Build with React & Typescript</small> <br/>
      {gameOver || userAnswer.length === TOTAL_QUESTION ? (
        <button className="start" onClick={startQuiz}>Start</button>
      ): null}
      
      { !gameOver ? <p className="score">Score: {score}</p> : null }
      { loading ? <p>Loading Question...</p> : null }

      { !loading && !gameOver ? (
        <QuestionCard 
          questionNum={ number + 1 }
          totalQuestion={ TOTAL_QUESTION }
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswer ? userAnswer[number] : undefined}
          callback={checkAnswer}
        />
      ): null}
      
      { !gameOver && !loading && userAnswer.length === number + 1 && number !== TOTAL_QUESTION - 1 ? (
        <button className="next" onClick={nextQuestion}>Next</button>
      ): null}
    </div>
  );
}

export default App;
