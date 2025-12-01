import type { ReactNode } from "react";
import "../css/container.css"

interface ContainerProps {
  children: ReactNode; // <- diz pro TS que pode receber JSX, texto, outros componentes
}

const Container = ({ children }: ContainerProps) => {
    return (
        <div className="container">
            {children}
        </div>
    )
}

export default Container

const Container2 = ({ children }: ContainerProps) => {
    return (
        <div className="container-2">
            {children}
        </div>
    )
}

export {Container2}