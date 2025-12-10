import "../css/topic.css";

import { useState } from "react";

import staredImg from "../assets/icons/stared.png"
import notStaredImg from "../assets/icons/not-stared.png"


type topicProps = {
  topicTitle: string;
  showStar?: boolean;
  isFavorito?: boolean;
  onStarClick?: (e: React.MouseEvent) => void;
};
  
const Topic = ({ topicTitle, showStar = false, isFavorito = false, onStarClick }: topicProps) => {
  return (
    <div className="topic-container responsible-margin-adjust">
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <h1>|</h1>
        <h1>{topicTitle}</h1>
      </div>
      {showStar && (
        <img
          src={isFavorito ? staredImg : notStaredImg}
          alt={isFavorito ? "Remover favorito" : "Adicionar favorito"}
          onClick={onStarClick}
          className="topic-star"
          style={{ cursor: "pointer", width: "16px", height: "16px", flexShrink: 0 }}
        />
      )}
    </div>
  );
};

export default Topic;

const SmallerTopic = ({ topicTitle }: topicProps) => {
  return (
    <div className="smaller-topic-container">
      <h1>|</h1>
      <h1>{topicTitle}</h1>
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

const DividerTopicGrey = ({topicTitle}: topicProps) => {
  return (
    <div className="diviver-topic-container-grey">
      <div></div>
      <h1>{topicTitle}</h1>
      <div></div>
    </div>
  )
}

export { DividerTopicGrey }

const UnderlinedTopic = ({topicTitle} : topicProps) => {
  return (
    <div className="underlined-topic">
      <h1>{topicTitle}</h1>
    </div>
  )
}

export { UnderlinedTopic }