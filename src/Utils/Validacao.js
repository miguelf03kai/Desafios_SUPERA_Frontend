class Validation{
    isValidDate(dateString){
        let result;
        if(dateString !== ""){
          const dateParts = dateString.split("/");
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const year = parseInt(dateParts[2]);
          const date = new Date(year, month, day);

          result = date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;

        }
          return result;
    }
}

const Validacao = new Validation();
export default Validacao;