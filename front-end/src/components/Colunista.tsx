import "../css/colunista.css"

type colunistaProps = {
    colunistaImg : string
}

const Colunista = ({colunistaImg} : colunistaProps) => {
    return (
        <>
            <img src={colunistaImg} alt="Colunista" />
        </>
    )
}

export default Colunista