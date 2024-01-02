import { useEffect, useState } from "react";
import Api from "../Utils/Api";

function Conta(props){

	const [options, setOptions] = useState([]);

	useEffect(() => {
		fetch(`${Api}/conta`)
		.then((response) => response.json())
		.then((data) => {
		setOptions([
			{ value: '', label: 'Sem seleção' },
			...data.map((option) => ({
			value: option.idConta,
			label: option.idConta
			}))
		  ]);
		});
	}, []);

	const handleChange = (event) => {
		props.onContaChange(event.target.value);
	};

	return (
			<div>
				<label>Número da Conta</label>
				<select className="form-control" id="conta" name="conta" onChange={handleChange}>
					{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
					))}
      			</select>
			</div>
	);

}

export default Conta;