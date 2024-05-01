import { useEffect, useReducer } from "react";

import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import StartScreen from "./StartScreens.js";
import Error from "./Error.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import Finish from "./Finish.js";
import Footer from "./Footer.js";
import Timer from "./Timer.js";
const SECS_REM_QUESTION = 30;
const initialState = {
  questions: [],
  status: "isLoading",
  index: 0,
  answer: null,

  points: 0,
  score: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: SECS_REM_QUESTION * state.questions.length,
      };

    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return { ...state, status: "finish" };

    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
      };
    case "thick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finish" : state.status,
      };

    default:
      throw new Error("unknown action");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, score, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numberOfQuestions = questions?.length;
  const highScore = score > points ? score : points;

  const totalPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  console.log(numberOfQuestions);
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />

      <Main>
        {status === "isLoading" && <Loader />}
        {status === "ready" && (
          <StartScreen questionLength={numberOfQuestions} dispatch={dispatch} />
        )}
        {status === "error" && <Error />}
        {status === "active" && (
          <>
            <Progress
              numberOfQuestions={numberOfQuestions}
              totalPoints={totalPoints}
              index={index}
              points={points}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numberOfQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finish" && (
          <Finish
            dispatch={dispatch}
            points={points}
            totalPoints={totalPoints}
            highScore={highScore}
          />
        )}
      </Main>
    </div>
  );
}
