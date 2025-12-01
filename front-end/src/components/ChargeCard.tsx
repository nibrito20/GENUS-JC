import "../css/chargecard.css"

import { UnderlinedTopic } from "./Topic";

type newsCardProps = {
  newsImg: string;
  newsTopic: {
    topicTitle: string;
  };
};

const ChargeCard = ({newsImg, newsTopic} : newsCardProps) => {
  return (
    <div className="charge-card-container">
      <UnderlinedTopic topicTitle={newsTopic.topicTitle}/>
      <img src={newsImg} alt="Noticia" />
    </div>
  )
}

export default ChargeCard