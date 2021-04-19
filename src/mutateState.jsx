/*
This function is an excellent example of how jank my code can get
basically, what it does is takes an array like this:
{test: {bruh: "hi", notouch: "please"}}

and a mutator array like this:
{test: {bruh: "bye", heck: "boink"}}

and when run, mutates the original and then sets the state:
{test: {bruh: "bye", notouch: "please", heck: "boink"}}

useful to properly update only part of state while still resetting it to avoid issues with react
*/

const mutateState = (thisRef, mutator) => {
	let toMutate = thisRef.state;
	var recurse = (object, path) => {
		if (typeof path == "undefined") path = [];

		for (var k in object) {
			if (typeof object[k] == "object" && object[k] != null) {
				path.push(k);
				recurse(object[k], path);
			} else {
				let objMod = toMutate;
				for (let j=0; j<path.length; j++) {
					objMod = objMod[path[j]];
				}
				objMod[k] = object[k];
			}
		}
	}
	recurse(mutator) //mutate toMutate by mutator
	thisRef.setState(toMutate)
}

export default mutateState;