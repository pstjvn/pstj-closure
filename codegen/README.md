## Code generation

This section of the library deals with generating code based on heuristics.

The pramary goal being to shorten development time. we strive to provide means
to generate code for several different pruposes utilizing generalized strategy
to help us achieve versatile tools that can be reused.

### Parsing

The initial solution relies on parsing source files and extracting information
from them in a structured way as to facilitate the further processing and
analysis.

Prime example of this is the ability to parse JSON formatted information
describing remote APIs like Discovery document v1.0 and Swagger v2.0 as well
as custom format using in internal development and generate unified
representation for the data structures the remote party utilizes.

In addition to that we can also store information like endpoints where to
find the data or store the data in the corresponding format.

### Data representation

Next step is to traverse the parsed data and construct a cohesive document
descriving a `whole world` view of the data collections an API can provide or
in the case of JSONTypes the data the app intends to generate and consume
internally and externally. The document must always look and be the same,
differing only by the parser used to generate it. This means we use the one
and same abstract structure to store information about an API and its data in
all supported format.

### Traversal and emitters

Once we have the data represenation ready we can do several interesting things
with it: traverse and alter it as well as emit code based on it.

As an example of a very simple emitter we can simply log out the data types in
an indented tree like view. A more complex emitter can create code that is
based on Data Tranfer Objects and be used in real code and compiled with the
GCC. We already have a POC of this with the deiscovery document as well as with
the JSONTypes used in many internal projects.

### Further work

Advanced work should be investigated to parse HTML (requires a different parser)
that can take into account data bindings and compare them to the data
representation extracted from this toolset. This can be used to generate code
that automatically updates binding on data change (in combination with the DTO
emitter), similar to how angular 2+ work. A set of rules should be devised to
figure out how a component class connects to data class and soy based view.


## Code style

The code is intended to be able to run in both client and server environment.
Still, because it is possible to compile to es3 for the client, the code is
expected to be written in es6 style as recent versions of NodeJS support it.