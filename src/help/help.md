# C4-Lab Help

C4-Lab defines a domain specific language (DSL) for creating software
architectures, modeled heavily after [Simon Brown][SB]'s [C4][] approach
(Context, Containers, Components, and Classes). See [Visualising Software
Architecture][] for more information.

[SB]: http://www.simonbrown.je/
[C4]: http://www.codingthearchitecture.com/2014/08/24/c4_model_poster.html
[Visualising Software Architecture]: https://leanpub.com/visualising-software-architecture

## Features

C4-Lab has import, export, and "share" features accessible in the top
navigation, and saves work-in-progress in your browser.  If you want to save a
graph for later editing, export the `sexp` format, or save the "share" link.
Other exports do not allow resuming editing.

## Syntax

The DSL uses [s-expression][]s to represent the hierarchy and connections
between actors, systems, containers, and components. If you squint your eyes, it
looks like common lisp or scheme macros.

We use the excellent [CodeMirror][] in-browser editor to add syntax highlighting
and some help with managing the parentheses.

[CodeMirror]: https://codemirror.net/
[s-expression]: https://en.wikipedia.org/wiki/S-expression

### Full example

Here's a small bit of software archicture for a web application, demonstrating
some of the syntax.

    (define-actor ("customer")
      (edge :to "dog rater" :description "views/votes/uploads dog pictures"))

    (define-system ("dog rater" :desc "fun clickbait website")

      (def-container ("frontend" :tech "typescript, reactjs")
        (edge :to "./database" :desc "display sweet dog pictures" 
              :direction "both")
        )

      (def-container ("backend" :tech "golang")
        (def-component ("ad provider")
          (edge :to "third party ad network" :desc "fetch user-specific ads")
          )
        )

      (def-container ("database" :tech "amazon S3"))
    )

    (def-system ("third party ad network" :desc "advert network"))

### Actors

Top level element, represents a human using the software.

Examples:

    (define-actor ("customer")
      ;; optional edges to other parts of the architecture
      )

If this were a real lisp macro, it's definition would look like:

    (defmacro define-actor ((name) &body children))

### Systems

Top level element, represents a logical software system.

Examples:

    (define-system ("name of the system" :description "optional description" 
                                         :tech "optional technology")
      ;; optional children of this system; edges or containers
      )
    (def-system ("name of the system" :desc "can abbreviate a little; :desc vs :description, def-system vs define-system"))

If this were a real lisp macro, it's definition would look like:

    (defmacro define-system ((name) &key description tech &body children))

### Containers

Containers are independently deployable pieces of a system. They should be used as children of a `def-system`

Examples:

    (def-system ("dog ratr")
      (def-container ("frontend" :tech "..." :desc "...")
        ;; optional children of this system; edges or components
      )
    )

If this were a real lisp macro, it's definition would look like:

    (defmacro define-container ((name) &key description tech &body children))

### Components

Components are pieces of one deployable part of a system. These could be things
like java packages, C# assemblies, ES6 modules, etc. They should be used as
children of a `def-container`

Examples:

    (def-system ("dog ratr")
      (def-container ("frontend")
        (def-component ("upload page" :tech "..." :desc "..."))
        (def-component ("dog browser")
          ;; optional children, edges
        )
      )
    )

If this were a real lisp macro, it's definition would look like:

    (defmacro define-component ((name) &key description tech &body children))

### Edges

Edges represent connections between the different elements in a software
architecture. These have a few different options for how to connect things.
Connections are specified using something like a file path to unambiguously
identify the destination of an edge.

They can be used as children of `def-actor`, `def-system`, `def-container`, and
`def-component`.

You can customize the direction of the edge using the `:direction` (`:dir` for
short) option. The valid options are:

* `push` - (default), indicates this node is reaching out to the target. Draws
  an arrow from the current node to the target.
* `pull` - indicates this node is pulling from the target, e.g. as a subscriber.
  Draws an arrow from the target to the current node.
* `both` - indicates bidrectional flow of actions/information. Draws an arrow to
  and from the target to the current node.

Examples:

    (def-actor ("customer")
      ;; connect this actor to the dog ratr system, and describe
      ;; how the actor uses the system
      (edge :to "dog ratr" :desc "clicks a lot of links and ads"))

    (def-system ("dog ratr")
      (def-container ("frontend")
        ;; connect the frontend to the backend, with a relative path
        (edge :to "./backend" :desc "fetch list of dogs" :dir "both")
        ;; can specify a "full" path to connect with nodes that aren't
        ;; on the top level
        (edge :to "ad server/click tracker" :desc "records a click via HTTP")
      )
      (def-container ("backend"))
    )

    (def-system ("ad server")
      (def-container ("click tracker")))

If this were a real lisp function, it's definition would look like:

    (defun edge (&key to description (direction "both")))

### Comments

Comments are of questionable use since they don't show up in the diagrams at
all, but they are useful for commenting out code while you're still hasing out
the architecture.

Any content after two colons is ignored as a comment.

Examples:

    ;; this whole line is a comment
    (def-system ("dog ratr")) ;; this bit is ignored, too
