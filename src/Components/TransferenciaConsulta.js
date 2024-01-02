import Api from "../Utils/Api";
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Conversao from "../Utils/Conversao";
import Validacao from "../Utils/Validacao";
import Conta from "./Conta";

const TransferenciaConsulta = () => {

    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState({
                                    startDate: "",
                                    endDate: "",
                                    operador: "",
                                    conta: ""
                                    })
    const [startDateError, setStartDateError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);
    const [items, setItems] = useState([]);
    const limit = 4;

    

    const fetchData = async (page, startDate, endDate, operador, conta) => {
        const response = await fetch(
            `${Api}/transferencia/periodo?dataInicio=${Conversao.convertToISODate(startDate)
                                           }&dataFim=${Conversao.convertToISODate(endDate)
                                           }&operador=${operador
                                           }&page=${page
                                           }&size=${limit}&contaId=${conta}`);
        const dataJson = await response.json();
        const totalCount = parseInt(response.headers.get("X-Total-Count"));
        setTotalCount(totalCount);
        setItems(dataJson);
    };
  
    useEffect(() => {
        fetchData(page, data.startDate, data.endDate, data.operador, data.conta);
    }, [page]);
  
    const handlePageChange = (event, value) => {
      setPage(value - 1);
    };
  
    const handleChange = (e) => {
      let {name, value} = e.target;
  
      // remove qualquer espaço sem digito
      const cleanedValue = value.replace(/\D/g, "");
  
      // aplica a mascara (dd/mm/yyyy)
      let formattedValue = "";
      if (cleanedValue.length > 0) {
        if (cleanedValue.length <= 2) {
          formattedValue = cleanedValue;
        } else if (cleanedValue.length <= 4) {
          formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`;
        } else {
          formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}/${cleanedValue.slice(4, 8)}`;
        }
      }
  
      if (name === "startDate") {
        value = formattedValue;
        setStartDateError(!Validacao.isValidDate(value));
        if (value === "") {
          setStartDateError(false);
        }
      } else if (name === "endDate") {
        value = formattedValue;
        setEndDateError(!Validacao.isValidDate(value));
        if (value === "") {
          setEndDateError(false);
        }
      }
  
      setData({
        ...data,
        [e.target.name]: value
      })
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setPage(0);
      fetchData(page, data.startDate, data.endDate, data.operador, data.conta);
    }

    // retorna nome dos tipos de movimentações
    const renderSwitch = (param, value) => {
        switch(param) {
          case 'DEPOSITO':
              return 'Depósito';
          case 'SAQUE':
              return 'Saque';
          case 'TRANSFERENCIA':
              return (value < 0 ) ? "Transferência Saída" : "Transferência Entrada";
          default:
              return '';
        }
    }

    const handleContaChange = (value) => {
      setData({ ...data, conta: value });
    };
  
    return (
        <div className="container" style={{marginTop: "2%"}}>
          <div className="justify-content-center">
            <div>
              <form onSubmit={handleSubmit}>
                  <div className="form-row align-items-center d-flex justify-content-between">
                        <div className="form-group col-2">
                          <Conta onContaChange={handleContaChange} />
                        </div>
                        <div className="form-group col-2">
                          <label>Data Inicio</label>
                          <input className={`form-control ${startDateError ? "is-invalid" : ""}`} 
                                  name="startDate" 
                                  value={data.startDate} 
                                  onChange={handleChange} 
                                  placeholder="dd/mm/yyyy" 
                                  maxLength={10}/>
                        </div>
                        <div className="form-group col-2">
                          <label>Data Fim</label>
                          <input className={`form-control ${endDateError ? "is-invalid" : ""}`} 
                                  name="endDate" 
                                  value={data.endDate} 
                                  onChange={handleChange} 
                                  placeholder="dd/mm/yyyy" 
                                  maxLength={10}/>
                        </div>
                        <div className="form-group col-4">
                          <label>Nome do operador transacionado</label>
                          <input className="form-control" name="operador" value={data.operador} onChange={handleChange}/>
                        </div>
                        <div className="btn-group" role="group" style={{margin: "15px 0px 0px 0px"}}>
                          <button className="btn btn-secondary" disabled={startDateError || endDateError}>Pesquisar</button>
                        </div>
                  </div>
              </form>
              <div style={{border: "1px solid #d4d4d4", marginTop: "50px"}}>
                <div className="row" style={{padding: "15px"}}>
                    <div className="col">
                      <label>Saldo Total: {Conversao.currencyFormat(items?.saldoTotal)}</label>
                    </div>
                    <div className="col">
                      <label>Saldo do Periodo: {Conversao.currencyFormat(items?.saldoPeriodo)}</label>
                    </div>
                </div>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Dados</th>
                        <th>Valentia</th>
                        <th>Tipo</th>
                        <th>Nome Operador Transacionado</th>
                        <th>N° Conta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items?.transferencias?.map((item) => (
                          <tr key={item.id}>
                              <td>{Conversao.formatDate(item.dataTransferencia)}</td>
                              <td>{Conversao.currencyFormat(item.valor)}</td>
                              <td>{renderSwitch(item.tipo,item.valor)}</td>
                              <td>{item.nomeOperadorTransacao}</td>
                              <td>{item.conta.idConta}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-center" style={{padding: "10px"}}>
                      <Stack spacing={2}>
                        <Pagination count={Math.ceil(totalCount / limit)} 
                                    page={page + 1} 
                                    onChange={handlePageChange} 
                                    showFirstButton 
                                    showLastButton 
                                    size="large"
                                    shape="rounded" />
                      </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

export default TransferenciaConsulta;