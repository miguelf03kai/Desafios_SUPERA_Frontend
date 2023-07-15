class Conversion{
    currencyFormat(num) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(num);
    } 

    convertToISODate(dateString) {
        let isoDate = "";
        
        if(dateString !== ""){
          const [day, month, year] = dateString.split("/");
          isoDate = `${year}-${month}-${day}`;
        }
        return isoDate;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      }
}

const Conversao = new Conversion();
export default Conversao;