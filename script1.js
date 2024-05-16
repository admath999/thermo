document.getElementById("thermoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var initialPressure = parseFloat(document.getElementById("initialPressure").value);
    var finalPressure = parseFloat(document.getElementById("finalPressure").value);
    var initialVolume = parseFloat(document.getElementById("initialVolume").value);
    var finalVolume = parseFloat(document.getElementById("finalVolume").value);
    var initialTemperature = parseFloat(document.getElementById("initialTemperature").value);
    var finalTemperature = parseFloat(document.getElementById("finalTemperature").value);
    var moles = parseFloat(document.getElementById("moles").value);
    var Cp = parseFloat(document.getElementById("Cp").value);
    var Cv = parseFloat(document.getElementById("Cv").value);
    var process = document.getElementById("process").value;

    // Converting units if needed
    // Add conversion logic here if necessary
   
    function convertToSI(value, unit) {
    switch (unit) {
        case "atm":
            return value * 101325; // 1 atm = 101325 Pa
        case "mmHg":
            return value * 133.322; // 1 mmHg = 133.322 Pa
        case "psi":
            return value * 6894.76; // 1 psi = 6894.76 Pa
        case "liters":
            return value * 0.001; // 1 liter = 0.001 m^3
        case "milliliters":
            return value * 0.000001; // 1 milliliter = 0.000001 m^3
        case "cubic_meters":
            return value; // Already in m^3
        case "Celsius":
            return value + 273.15; // Celsius to Kelvin
        case "Fahrenheit":
            return (value - 32) * (5 / 9) + 273.15; // Fahrenheit to Kelvin
        case "Kelvin":
            return value; // Already in Kelvin
        default:
            return value;
    }
}

    // Calculate enthalpy change
    var enthalpyChange;
    switch (process) {
        case "isothermal":
            enthalpyChange = 0; // Isothermal process, so no change in enthalpy
            break;
        case "isobaric":
            enthalpyChange = Cp * 8.314 * (finalTemperature - initialTemperature); // ΔH = Cp * R * ΔT for constant pressure
            break;
        case "adiabatic":
            enthalpyChange = Cp * 8.314 * (finalTemperature - initialTemperature); // ΔH = Cp * R * ΔT for constant pressure
            break;
        case "isochoric":
            enthalpyChange = Cv * 8.314 * (finalTemperature - initialTemperature) + ( initialVolume * ( finalPressure - initialPressure)); // ΔH = ( Cv * R * ΔT ) + ( V ΔP ) 
            break;
        default:
            enthalpyChange = NaN; // Error handling for invalid process type
    }

    // Calculate internal energy change
    var internalEnergyChange;
    switch (process) {
        case "isothermal":
            internalEnergyChange = 0; // Isothermal process, so no change in internal energy
            break;
        case "isobaric":
            internalEnergyChange = Cv * 8.314 * (finalTemperature - initialTemperature); // ΔU = Cv * R * ΔT for constant volume
            break;
        case "adiabatic":
            internalEnergyChange = Cv * 8.314 * (finalTemperature - initialTemperature); // ΔU = Cv * R * ΔT for constant volume
            break;
        case "isochoric":
            internalEnergyChange = Cv * 8.314 * (finalTemperature - initialTemperature); // ΔU = Cv * R * ΔT for constant volume 
            break;
        default:
            internalEnergyChange = NaN; // Error handling for invalid process type
    }

    // Calculate heat and work
    var heat, work;
    switch (process) {
        case "isothermal":
            heat = 8.314 * initialTemperature * Math.log(finalVolume / initialVolume); // Q = R * T * ln(V2 / V1)
            work = -heat; // W = -Q for isothermal process
            break;
        case "isobaric":
            heat = Cp * 8.314 * (finalTemperature - initialTemperature); // Q = Cp * R * ΔT for constant pressure
            work = -initialPressure * (finalVolume - initialVolume) ; // W = -Q for constant pressure process (no change in volume)
            break;
        case "adiabatic":
            heat = 0; // Adiabatic process, so no heat exchange
            // Add appropriate calculation for work (in adiabatic process
            work = - (( 8.314 * initialTemperature) / (1.40 - 1 ))  * (1 - (finalPressure / initialPressure) ^ 0.28571428571)
            break;
        case "isochoric":
            heat = Cv * 8.314 * (finalTemperature - initialTemperature); // Q = Cv * R * ΔT for constant pressure
            work = 0; // No work done in constant volume process
            break;
        default:
            heat = NaN; // Error handling for invalid process type
            work = NaN; // Error handling for invalid process type
    }

    // Display results
    var result = document.getElementById("result");
    result.innerHTML = "Enthalpy Change (ΔH): " + enthalpyChange.toFixed(4) + " J<br>" +
                       "Internal Energy Change (ΔU): " + internalEnergyChange.toFixed(4) + " J<br>" +
                       "Heat (Q): " + heat.toFixed(4) + " J<br>" +
                       "Work (W): " + work.toFixed(4) + " J";
});

