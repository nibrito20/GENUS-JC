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
        <h1>Carregando noticias</h1>
        <div className="loading-points-style">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
}

export { LoadingNews }