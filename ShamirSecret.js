// Function to parse big integers from strings in any base
function parseBigInt(str, base) {
    return BigInt(parseInt(str, base));
}

// Modular arithmetic functions for BigInt
function mod(a, b) {
    return ((a % b) + b) % b;
}

function modInverse(a, m) {
    let [g, x] = extendedEuclidean(BigInt(a), BigInt(m));
    if (g !== 1n) throw new Error('Modular inverse does not exist');
    return mod(x, m);
}

function extendedEuclidean(a, b) {
    if (b === 0n) return [a, 1n, 0n];
    let [g, x, y] = extendedEuclidean(b, a % b);
    return [g, y, x - (a / b) * y];
}

// Improved Lagrange interpolation
function lagrangeInterpolation(points, prime) {
    prime = BigInt(prime);
    return points.reduce((acc, [xi, yi], i) => {
        let numerator = BigInt(1);
        let denominator = BigInt(1);
        
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let [xj] = points[j];
                numerator = mod(numerator * mod(BigInt(0) - BigInt(xj), prime), prime);
                denominator = mod(denominator * mod(BigInt(xi) - BigInt(xj), prime), prime);
            }
        }
        
        let li = mod(numerator * modInverse(denominator, prime), prime);
        return mod(acc + mod(yi * li, prime), prime);
    }, BigInt(0));
}

// Main function to process input and calculate secret
function calculateSecret(input) {
    const { keys, ...points } = input;
    const k = keys.k;

    // Decode points
    const decodedPoints = Object.entries(points)
        .map(([x, { base, value }]) => [
            parseInt(x),
            parseBigInt(value, parseInt(base))
        ]);

    // Ensure we have at least k points
    if (decodedPoints.length < k) {
        console.error("Not enough points provided for interpolation.");
        return;
    }

    // Use only the first k points for interpolation
    const selectedPoints = decodedPoints.slice(0, k);

    // Choose a prime larger than any of the values
    const prime = BigInt(2n ** 256n - 351n * 2n ** 32n + 1n); // A 256-bit prime

    // Calculate secret
    const secret = lagrangeInterpolation(selectedPoints, prime);
    console.log("The secret (constant term) is:", secret.toString());
}

// Test cases
const testCase1 = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

const testCase2 = {
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }
};

console.log("Test Case 1:");
calculateSecret(testCase1);

console.log("\nTest Case 2:");
calculateSecret(testCase2);
