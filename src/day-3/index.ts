import {getAllLines} from "../utils";
import {Submarine} from "../core";

async function main() {
  const reportBits = (await getAllLines(__dirname, 'input.txt'));

  const awesomeSubmarine = new Submarine();
  awesomeSubmarine.loadDiagnosticReport(reportBits);

  console.log('Power consumption:', awesomeSubmarine.getPowerConsumptionLevel());
  console.log('Life support rating:', awesomeSubmarine.getLifeSupportRating());
}

main();
