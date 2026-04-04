import { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { getLocations } from '../services/mapbox.api'

export const Search = () => {
    const [buscar, setBuscar] = useState("")
    const { dispatch } = useGlobalReducer()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!buscar.trim()) return
        try {
            await getLocations(buscar, dispatch)

        } catch (error) {
            console.error("Error en la búsqueda:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='input-group border rounded-pill overflow-hidden bg-transparent shadow-none'>
                <span className="input-group-text bg-white border-0">
                    <i className="fa-solid fa-search text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control bg-transparent shadow-none border-0 ps-0"
                    placeholder='¿Dónde quieres viajar?'
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                />
            </div>
        </form>
    )
}
