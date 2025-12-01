import "../css/newscard.css";

import { SmallerTopic } from "./Topic";
import { UnderlinedTopic } from "./Topic";

type newsCardProps = {
  newsTitle: string;
  newsImg: string;
  newsTopic: {
    topicTitle: string;
  };
};

const NewsCard = ({ newsTitle, newsImg, newsTopic }: newsCardProps) => {
  return (
    <div className="news-card-container">
      <img src={newsImg} alt="Noticia" />
      <SmallerTopic topicTitle={newsTopic.topicTitle} />
      <p>{newsTitle}</p>
    </div>
  );
};

export default NewsCard;

