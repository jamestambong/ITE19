const fs = require("fs"); // Import the 'fs' module for file operations

// Function to convert Roman numeral to decimal
function romanToDecimal(roman) {
    const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }; // Map Roman numerals to their decimal values
    let total = 0; // Initialize total to store the decimal value

    // Loop through each character in the Roman numeral string
    for (let i = 0; i < roman.length; i++) {
        // If the current numeral is smaller than the next, subtract it
        if (values[roman[i]] < values[roman[i + 1]]) {
            total -= values[roman[i]];
        } else {
            // Otherwise, add its value
            total += values[roman[i]];
        }
    }
    return total; // Return the decimal equivalent
}

// Function to convert decimal number to words
function decimalToWords(number) {
    // Arrays for number-to-word mapping
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
                   "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const hundreds = ["", "One Hundred", "Two Hundred", "Three Hundred", "Four Hundred", "Five Hundred",
                      "Six Hundred", "Seven Hundred", "Eight Hundred", "Nine Hundred"];
    const thousands = ["", "Thousand", "Million"]; // Labels for larger numbers

    if (number === 0) return "Zero"; // Return "Zero" if the number is 0

    let result = number < 0 ? "(Negative) " : ""; // Handle negative numbers by adding a prefix
    number = Math.abs(number); // Convert the number to positive for processing
    let position = 0; // Position for the thousands, millions, etc.

    // Process the number in chunks of three digits
    while (number > 0) {
        const part = number % 1000; // Get the last three digits
        number = Math.floor(number / 1000); // Remove the last three digits

        if (part > 0) {
            let chunk = ""; // Temporary string for the current chunk

            // Process the hundreds place
            if (Math.floor(part / 100) > 0) {
                chunk += hundreds[Math.floor(part / 100)] + " ";
            }

            const lastTwo = part % 100; // Get the last two digits
            if (lastTwo >= 11 && lastTwo <= 19) {
                // Handle teen numbers (11–19)
                chunk += teens[lastTwo % 10 - 1] + " ";
            } else {
                // Process the tens place
                if (Math.floor(lastTwo / 10) > 0) {
                    chunk += tens[Math.floor(lastTwo / 10)] + " ";
                }
                // Process the ones place
                if (lastTwo % 10 > 0) {
                    chunk += ones[lastTwo % 10] + " ";
                }
            }

            // Add the positional label (e.g., Thousand, Million) if applicable
            if (position > 0) {
                chunk += thousands[position] + " ";
            }

            result = chunk + result; // Combine the chunk with the result
        }
        position++; // Move to the next position (e.g., Thousand → Million)
    }
    return result.trim(); // Return the final result, trimming extra spaces
}

// Function to perform arithmetic operations
function performOperation(num1, num2, operator) {
    // Use a switch statement to handle different operations
    switch (operator) {
        case '+': return num1 + num2; // Addition
        case '-': return num1 - num2; // Subtraction
        case '*': return num1 * num2; // Multiplication
        case '/': return num2 !== 0 ? Math.floor(num1 / num2) : 0; // Division (check for zero)
        default: return null; // Return null for unsupported operations
    }
}

// Function to process a single line of input
function processLine(line) {
    const [roman1, operator, roman2] = line.split(" "); // Split the line into parts (Roman numeral, operator, Roman numeral)

    // Check if the line contains valid input
    if (!roman1 || !operator || !roman2) {
        return `${line} => Invalid Input`; // Return error message if input is invalid
    }

    const num1 = romanToDecimal(roman1); // Convert the first Roman numeral to decimal
    const num2 = romanToDecimal(roman2); // Convert the second Roman numeral to decimal
    const result = performOperation(num1, num2, operator); // Perform the operation

    // Check if the operation is unsupported
    if (result === null) {
        return `${line} => Unsupported Operation`;
    }

    return `${line} => ${decimalToWords(result)}`; // Return the processed result as a string
}

// Main function for file handling
function main() {
    const inputFilePath = "Input.txt"; // Path to the input file
    const outputFilePath = "Output.txt"; // Path to the output file

    // Clear the output file before writing new results
    fs.writeFileSync(outputFilePath, ""); // Write an empty string to clear the file

    const data = fs.readFileSync(inputFilePath, "utf8"); // Read the input file as a string
    const lines = data.trim().split("\n"); // Split the input into lines

    // Process each line from the input file
    lines.forEach(line => {
        const result = processLine(line.trim()); // Process the current line
        fs.appendFileSync(outputFilePath, result + "\n"); // Append the result to the output file
    });

    console.log("Processing complete. Check Output.txt for results."); // Log completion message
}

// Call the main function
main(); // Execute the main function