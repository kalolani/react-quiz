function Finish({ dispatch, points, totalPoints, highScore }) {
  const percentage = (points / totalPoints) * 100;
  let imoji;
  if (percentage === 100) imoji = "🥇";
  if (percentage >= 80 && percentage < 100) imoji = "🎉";
  if (percentage >= 50 && percentage < 80) imoji = "☺";
  if (percentage >= 0 && percentage < 50) imoji = "😡";
  if (percentage === 0) imoji = "😭";

  return (
    <>
      <div className="result">
        <p>
          <span>{imoji}</span> you scored: {points} out of {totalPoints} that
          means ({Math.round(percentage)}%)
        </p>
      </div>

      <p className="highScore">(Hiscore:{highScore}) points</p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart
      </button>
    </>
  );
}

export default Finish;
