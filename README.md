## Simple Python Program to Find the Sum of Natural Numbers

### Overview
This simple Python program calculates the sum of natural numbers up to a user-defined limit. The program takes an integer input from the user, representing the upper limit, and then uses a for loop to iterate through the natural numbers from 1 to the limit. The sum of these numbers is calculated and printed as the output.

### Usage
To use the program, simply run:

```
python sum_natural_numbers.py
```

You will be prompted to enter an integer value representing the upper limit. Enter the value and press Enter. The program will calculate and display the sum of natural numbers up to that limit.

### Code

```python
# Get the upper limit from the user
limit = int(input("Enter the upper limit: "))

# Initialize the sum to 0
sum = 0

# Iterate through the natural numbers from 1 to the limit
for i in range(1, limit + 1):
    # Add each number to the sum
    sum += i

# Print the sum
print("The sum of natural numbers up to", limit, "is:", sum)
```

### Example
If you run the program and enter the upper limit as 10, the output will be:

```
The sum of natural numbers up to 10 is: 55
```

### Explanation
The program initializes a variable `sum` to 0. Then, it uses a for loop to iterate through the natural numbers from 1 to the user-defined limit. In each iteration of the loop, the current number `i` is added to the `sum`. After the loop has completed, the program prints the calculated sum.