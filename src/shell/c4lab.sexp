(title "c4-lab")
;; add an actor to represent humans that use your system
(define-actor ("Devs")
       ;; add edges to say what part of your system the actor uses
       (edge
        ;; specify where the other end of this edge is using something like a path
        ;; "C4 Lab/UI" points at the "C4 Lab" system, the the "UI" container inside
        :to "C4 Lab/UI"
        :description "Create/read/update designs")
       )
;; add your system
(define-system ("C4 Lab"
         :description "Web-based rapid prototyping of C4 diagrams to augment whiteboards")
        ;; add the containers inside your system
        (def-container ("UI" :tech "html5, angularjs"
                         :description "prototype, import, export C4 diagrams" ))
        )
(define-system ("Github" :description "Free git and web hosting")
        ;; add edges between any actor, system, or container
        (edge :description "hosts" :to "C4 Lab/UI")
        (edge :to "Travis-ci" :description "triggers build")
        )
(define-system ("Travis-ci" :description "Open source CI")
        (edge :to "Github" :description "publishes"))
;; any line that starts with ";;" is a comment