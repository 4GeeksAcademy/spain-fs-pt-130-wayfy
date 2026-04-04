import { MapboxComponent } from "../components/MapboxComponent/MapboxComponent";



export const Home = () => {
	return (
		<div className="container-fluid p-0" style={{ height: "calc(100vh - 140px)" }}>
			<div className="row g-0 h-100">
				<div className="col-12 h-100">
					<MapboxComponent />
				</div>
			</div>
		</div>
	);
};