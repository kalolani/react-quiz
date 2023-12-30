function Progress({ totalPoints, numberOfQuestions, index, points, answer }) {
  return (
    <header className="progress">
      <progress
        max={numberOfQuestions}
        value={index + Number(answer !== null)}
      />
      <p>
        Question{" "}
        <strong>
          {index + 1}/{numberOfQuestions}
        </strong>
      </p>

      <p>
        <strong>
          {" "}
          {points}/{totalPoints}
        </strong>
      </p>
    </header>
  );
}

export default Progress;
