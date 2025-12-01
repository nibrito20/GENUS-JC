import "../css/topic.css";

import { useState } from "react";

import staredImg from "../assets/icons/stared.png"
import notStaredImg from "../assets/icons/notStared.png"


type topicProps = {
  topicTitle: string; };
  
const Topic = ({ topicTitle }: topicProps) => {
  return (
    <div className="topic-container">
      <h1>|</h1>
      <h1>{topicTitle}</h1>
    </div>
  );
};

export default Topic;

const SmallerTopic = ({ topicTitle }: topicProps) => {
  const [favorited, setFavorited] = useState(false);

  function favoritar() {
    setFavorited((prev) => !prev); // alterna entre true / false
  }

  return (
    <div className="smaller-topic-container-divider">
      <div className="smaller-topic-container">
        <h1>|</h1>
        <h1>{topicTitle}</h1>
      </div>

      <img
        src={favorited ? notStaredImg : staredImg}
        alt="Favoritar"
        onClick={favoritar}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export { SmallerTopic };

const DividerTopic = ({topicTitle}: topicProps) => {
  return (
    <div className="diviver-topic-container">
      <div></div>
      <h1>{topicTitle}</h1>
      <div></div>
    </div>
  )
}

export { DividerTopic }

