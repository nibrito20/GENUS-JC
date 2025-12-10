import "../css/loading.css"

const Loading = () => {
    return (
      <div className="loading-style">
        <h1>Carregando</h1>
        <div className="loading-points-style">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export default Loading

const LoadingNews = () => {
    return (
      <div className="loading-style">
        <h1>Carregando notícias</h1>
        <div className="loading-points-style">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export { LoadingNews }

const LoadingInfo = () => {
    return (
      <div className="loading-style">
        <h1>Carregando informações</h1>
        <div className="loading-points-style">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export { LoadingInfo }

const LoadingGender = () => {
    return (
      <div className="loading-gender-style">
        <h1>Carregando generos</h1>
        <div className="loading-points-style-gender">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export { LoadingGender }