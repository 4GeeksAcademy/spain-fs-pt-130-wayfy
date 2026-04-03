export const Search = () => {
    return (
        <form>
            <div className='input-group  border rounded-pill overflow-hidden' style={{ borderColor: 'transparent', boxShadow: 'none' }}>
                <span className="input-group-text bg-white border-0">
                    <i className="fa-solid fa-search text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-0 ps-0"
                    style={{ borderColor: 'transparent', boxShadow: 'none' }}
                    placeholder='¿Dónde quieres viajar?'
                    aria-label='Buscar'
                />
            </div>
        </form>
    )
}
