import "../css/newscard.css";

import { SmallerTopic } from "./Topic";

type NewsCardProps = {
  newsTitle: string;
  newsImg: string;
  newsTopic: {
    topicTitle: string;
  };
};

const NewsCard = ({ newsTitle, newsImg, newsTopic }: NewsCardProps) => {
  return (
    <div className="news-card-container">
      <img src={newsImg} alt="Noticia" />
      <SmallerTopic topicTitle={newsTopic.topicTitle} />
      <p>{newsTitle}</p>
    </div>
  );
};

export default NewsCard;
