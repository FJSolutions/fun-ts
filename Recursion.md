# Recursion

I want to create a higher order function that replicates tail-recursion as a HOF.

It will be very similar to `reduce` but will be more general-purpose.

A recursive function processes a set of parameters until some condition is met.
The parameters are pushed into the function to get a result, that result is then sent to the condition
When the condition is met, the current value is returned.
	If the condition is not met, then the function is called again with the result of the last call
