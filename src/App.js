import { useEffect } from "react";
import "./styles.css";
import axios from "axios";

export default function App() {
  var currencyDynamic = [];

  function getPrevDateCourses(prevdate, iteration, currency) {
    if (iteration == 10) {
      console.log(currencyDynamic);
      alert(currency + " " + currencyDynamic.join(" "));
      currencyDynamic = [];

      return 0;
    }
    iteration += 1;
    prevdate = new Date(prevdate);
    var options = { year: "numeric", month: "2-digit", day: "2-digit" };

    prevdate = prevdate
      .toLocaleDateString(options)
      .split(".")
      .reverse()
      .join("/");
    // console.log(prevdate);

    axios
      .get(`https://www.cbr-xml-daily.ru/archive/${prevdate}/daily_json.js`)
      .then((request) => {
        let data = request.data;
        // console.log(data.Valute[currency].Value);
        currencyDynamic.push(data.Valute[currency].Value);
        prevdate = request.data.PreviousDate;
        getPrevDateCourses(prevdate, iteration, currency);
      });
  }

  useEffect(() => {
    // getPrevDateCourses("2022/02/10", 1, "USD");

    let table = document.getElementById("currencies");

    axios.get("https://www.cbr-xml-daily.ru/daily_json.js").then((request) => {
      let data = request.data;

      let content = [];
      for (let [key, value] of Object.entries(data.Valute)) {
        content += `
          <tr id='${key}'>
            <td class="tooltip">
              ${key} 
              <span class="tooltiptext">${value.Name}
              </span>
            </td>
            <td> ${value.Value}</td>
            <td>${value.Previous}</td>
            <td>
              ${Math.round((value.Previous / value.Value) * 1000 - 1000) / 1000}
            </td>
          </tr>`;
      }
      table.innerHTML = content;

      let obj = null;
      for (let [key, value] of Object.entries(data.Valute)) {
        obj = document.getElementById(key);
        obj.addEventListener("click", () =>
          getPrevDateCourses("2022/02/10", 1, key)
        );
        //  console.log(obj)
      }
    });
  });
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <table>
        <tbody id="currencies" className="currencies"></tbody>{" "}
      </table>
      <table>
        <tbody></tbody>{" "}
      </table>
    </div>
  );
}
