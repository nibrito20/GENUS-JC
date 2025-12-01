import "../css/morenewsbutton.css"
import { useNavigate } from "react-router-dom";

type moreNewsButtonProps = {
    buttonText : string
    buttonLink : string
}

const MoreNewsButton = ({buttonText, buttonLink} : moreNewsButtonProps) => {
    const navigate = useNavigate();

    return (
        <div className="centralizer-button">
            <button onClick={() => navigate(buttonLink)}>{buttonText}</button>
        </div>
    )
}

export default MoreNewsButton