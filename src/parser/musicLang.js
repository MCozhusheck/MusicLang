export let musicLang = `musicLang {
  
  Init
    = Start

  Start
    = "use" Instrument BPM? Statement*

  Instrument
    = "bass-electric"
    | "bassoon"
    | "cello"
    | "clarinet"
    | "contrabass"
    | "flute"
    | "french-horn"
    | "guitar-acoustic"
    | "guitar-electric"
    | "guitar-nylon"
    | "harmonium"
    | "harp"
    | "organ"
    | "piano"
    | "saxophone"
    | "trombone"
    | "trumpet"
    | "tuba"
    | "violin"
    | "xylophone"

  BPM
    = "set" "bpm" "to" number
  
  Statement
    = Play
    | Repeat
    | Assignment

  Event 
    = SingleNote
    | ManyNotes2
    | ManyNotes3
    | ManyNotes4

  Play
    = "Play" Event Timing
    | "Play" ident Timing

  SingleNote
    = "SingleNote" noteFreq Duration Velocity

  Repeat
    = "Repeat" Event Interval StartTime Duration
    | "Repeat" ident Interval StartTime Duration

  ManyNotes2
    = "ManyNotes" noteFreq noteFreq Duration Velocity

  ManyNotes3
    = "ManyNotes" noteFreq noteFreq noteFreq Duration Velocity

  ManyNotes4
    = "ManyNotes" noteFreq noteFreq noteFreq noteFreq Duration Velocity

  Assignment
    = "let" ident "as" Event
    | "let" ident "as" Body

  Body
    = "begin" Event+ "end"

  noteFreq
    = pitchOctave
    | number

  Duration
    = "for" tempoRelative

  Velocity
    = "velocity" number

  Timing
    = "at" tempoRelative

  Interval
    = "every" tempoRelative

  StartTime
    = "since" tempoRelative

  pitchOctave
    = "A".."G" digit     -- octave
    | "A".."G" "#" digit -- sharpOctave
    | "A".."G" "b" digit -- flatOctave

  tempoRelative
    = notation
    | frequency
    | tick
    | transportTime
    | nowRelative
    | number

  notation
    = digit+ "n"
    | digit+ "t" 
    | digit+ "m" 

  number
    = digit* "." digit+  -- fract
    | digit+             -- whole

  transportTime
    = digit+ ":" digit+ ":" digit+ -- trans

  frequency
    = digit* "hz" -- freq

  tick
    = digit* "i"  -- tick

  nowRelative
    = "+" tempoRelative
    
  ident
    = alnum+
}`

export { musicLang as default}