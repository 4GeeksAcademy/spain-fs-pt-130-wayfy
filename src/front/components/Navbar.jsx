import urlLogoLight from '../assets/img/logo.png';
import urlLogoAC from '../assets/img/logo-ac.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from './Search';
import { LoginDropdown } from './LoginDropdown';
import { ButtonMenu } from './ButtonMenu';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';
import { HOTKEYS } from '../hotkeys/config'
import { ShortcutToggle } from './ShortcutsShow/ShortcutToggle';
import useGlobalReducer from '../hooks/useGlobalReducer';

const { GO_HOME, GO_MAP, GO_HOTELS, GO_RESTAURANTS, GO_TRANSPORTS, GO_ENTERTAINMENT, GO_LOGIN, GO_REGISTER } = HOTKEYS

const menuElements = [
	{
		link: '/',
		label: 'Home',
		icon: 'fa-home',
		shortCut: GO_HOME.combo
	},
	{
		link: '/map',
		label: 'Mapa',
		icon: 'fa-location-dot',
		shortCut: GO_MAP.combo
	},
	{
		link: '/hotels',
		label: 'Hoteles',
		icon: 'fa-hotel',
		shortCut: GO_HOTELS.combo
	},
	{
		link: '/restaurants',
		label: 'Restaurantes',
		icon: 'fa-utensils',
		shortCut: GO_RESTAURANTS.combo
	},
	{
		link: '/transports',
		label: 'Transportes',
		icon: 'fa-bus',
		shortCut: GO_TRANSPORTS.combo
	},
	{
		link: '/entertainment',
		label: 'Entretenimiento',
		icon: 'fa-star',
		shortCut: GO_ENTERTAINMENT.combo
	},
];

export const Navbar = () => {
	const [mostrarMenu, setMostrarMenu] = useState(false);
	const { store } = useGlobalReducer()
	const { showShortcut } = store
	const { theme } = useTheme()

	const urlLogo = theme === 'light' ? urlLogoLight : urlLogoAC

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
			<div className="container">
				<Link to={'/'} className="navbar-brand m-0">
					<img
						src={urlLogo}
						alt="logo"
						width={90}
						className="img-fluid"
					/>
				</Link>

				<div className="d-flex align-items center border-0 ms-auto order-lg-last gap-2">
					<div className="position-relative">
						<Link to='/login' className="btn btn-outline-primary">
							Iniciar sesión
						</Link>

						{showShortcut && (
							<span className="badge badge-shortcut bg-dark">
								{GO_LOGIN.combo}
							</span>
						)}
					</div>
					<div className="position-relative">
						<Link to='/register' className="btn btn-success">
							Regístrate
						</Link>

						{showShortcut && (
							<span className="badge badge-shortcut bg-dark">
								{GO_REGISTER.combo}
							</span>
						)}
					</div>
					{/* <LoginDropdown /> */}
					{/* <div className="d-flex flex-column"> */}
					<ThemeSelector />
					<ShortcutToggle />
					{/* </div> */}
					<button
						type="button"
						className="navbar-toggler border-0 order-lg-last ms-2"
						onClick={() => setMostrarMenu(!mostrarMenu)}
					>
						<span className="navbar-toggler-icon"></span>
					</button>
				</div>

				<div
					className={`collapse navbar-collapse ${mostrarMenu ? 'show' : ''}`}
					id="navbarContent"
				>
					<div className="navbar-nav d-flex flex-row flex-wrap justify-content-center flex-grow-1 gap-3 mt-2 mt-lg-0 me-lg-5">
						{menuElements.map((element, index) => (
							<ButtonMenu
								link={element.link}
								label={element.label}
								icon={element.icon}
								shortCut={element.shortCut}
								key={index}
							/>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
};
