import Image from "next/image";

const Comment = (params) => {
  const ejParams = {
    score: 0,
    user: Pepito,
    text: qwiuheianbsdkajlbdflabfiubdflksbdfhj,
    time: "10:08",
  };

  function incScore() {
    ejParams.score + 1;
  }

  return (
    <div>
      <div>
        <button onClick={incScore}>+</button>
        <span>{ejParams.score}</span>
        <button>-</button>
      </div>
    </div>
  );
};

export default Comment;
