import "../css/comentarios.css"

const Comentarios = () => {
    return (
        <div className="comentarios-container">
            <h1>comentários</h1>
            <div className="enviar-comentario">
                <img src="" alt="" />
                <input type="text" />
                <img src="" alt="" />
            </div>
            <div className="comentario">
                <div>
                    <h2 className="user-comentario">nome do usuario</h2>
                <p className="conteudo-comentario">comentario do usuario</p>
                </div>
                <img src="" alt="" />
            </div>
            
        </div>
    )
}

export default Comentarios