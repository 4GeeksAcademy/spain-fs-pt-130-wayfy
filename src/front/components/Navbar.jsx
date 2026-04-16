import { useState } from 'react';
import { Link } from 'react-router-dom';
import urlLogo from '../assets/img/logo.png';
import { Search } from './Search';
import { LoginDropdown } from './LoginDropdown';
import { ButtonMenu } from './ButtonMenu';

const elementosMenu = [
	{
		link: '/',
		label: 'Home',
		icon: 'fa-home',
		clase: 'btn-success rounded-pill',
	},
	{
		link: '/map',
		label: 'Mapa',
		icon: 'fa-location-dot',
		clase: 'btn-success rounded-pill',
	},
	{
		link: '/hotels',
		label: 'Hoteles',
		icon: 'fa-hotel',
		clase: 'btn-success rounded-pill',
	},
	{
		link: '/restaurants',
		label: 'Restaurantes',
		icon: 'fa-utensils',
		clase: 'btn-success rounded-pill',
	},
	{
		link: '/transports',
		label: 'Transportes',
		icon: 'fa-bus',
		clase: 'btn-success rounded-pill',
	},
	{
		link: '/entertainment',
		label: 'Entretenimiento',
		icon: 'fa-star',
		clase: 'btn-success rounded-pill',
	},
];

export const Navbar = () => {
	const [mostrarMenu, setMostrarMenu] = useState(false);

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
					<LoginDropdown />
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
					{/* <div className="flex-grow-1 mx-lg-5 my-lg-0">
						<Search />
					</div> */}

					<div className="navbar-nav d-flex flex-row flex-wrap justify-content-center flex-grow-1 gap-3 mt-2 mt-lg-0 me-lg-5">
						{elementosMenu.map((elemento, index) => (
							<ButtonMenu
								link={elemento.link}
								label={elemento.label}
								icon={elemento.icon}
								clase={elemento.clase}
								key={index}
							/>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
};
