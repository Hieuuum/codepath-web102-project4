import { useState } from "react";
import "./App.css";

function App() {
	const [curDog, setCurDog] = useState(null);
	const [banList, setBanList] = useState([]);
	let limit = 100;

	const discoverRandom = () => {
		callAPI().catch(console.error);
		// console.log(Math.floor(Math.random() * 5));
	};

	const callAPI = async () => {
		const response = await fetch(
			"https://api.thedogapi.com/v1/images/search?limit=100",
			{
				headers: {
					"x-api-key":
						"live_LnIInUH8Hs8pAzDJGEQ4HpypTxar8kROgPtZ9QSJOz3oI3JoGUnOHvoyGfge1Nti",
				},
			}
		);
		const json = await response.json();

		if (json.length === 0) {
			alert("Oops! Something went wrong with that query, let's try again!");
		} else {
			let imgIndex = Math.floor(Math.random() * limit);
			while (json[imgIndex].breeds.length == 0) {
				imgIndex = Math.floor(Math.random() * limit);
			}
			console.log(json[imgIndex]);
			setCurDog(json[imgIndex]);
		}
	};

	const addToBanList = (e) => {
		let content = e.target.innerHTML;
		console.log(content);
		if (!banList.includes(content)) {
			setBanList((prev) => [...prev, content]);
		}
		console.log(banList);
	};

	const removeFromBanList = (e) => {
		let content = e.target.innerHTML;
		console.log(content);
		setBanList((prev) => {
			return prev.filter((tag) => tag != content);
		});
		console.log(banList);
	};

	return (
		<>
			<h1>Look for Dogs</h1>
			<h2>Ban List:</h2>
			{banList &&
				banList.map((v) => {
					return (
						<p className="tag" onClick={removeFromBanList}>
							{v}
						</p>
					);
				})}
			{curDog && curDog.breeds[0] && (
				<div>
					<h2>{curDog.breeds[0].name}</h2>
					<div className="container">
						{Object.entries(curDog.breeds[0]).map(([key, value]) => {
							let displayVal;

							if (typeof value === "object" && value !== null && value.metric) {
								displayVal = value.metric;
								if (key === "height") {
									displayVal += " cm";
								} else if (key === "weight") {
									displayVal += " kg";
								}
							} else if (typeof value === "object" && value !== null) {
								displayVal = JSON.stringify(value);
							} else {
								displayVal = value;
							}

							if (
								key != "reference_image_id" &&
								key != "id" &&
								key != "name" &&
								key != "temperament"
							) {
								return (
									<p className="tag" key={key} onClick={addToBanList}>
										{displayVal}
									</p>
								);
							}
						})}
					</div>
					<img src={curDog.url} width={300} height={200} />
				</div>
			)}
			<button className="button" onClick={discoverRandom}>
				Discover
			</button>
		</>
	);
}

export default App;
