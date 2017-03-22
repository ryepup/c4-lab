(def-system ("A") 
  (def-container ("a")
    (edge :to "B"))
  (def-container ("b")
    (edge :to "./a")))

(def-system ("B") 
  (def-container ("a")))
