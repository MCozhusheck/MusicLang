import React from 'react';
import './App.css';
import musicLang from './parser/musicLang'

var Tone = require('tone');
var ohm = require('ohm-js');


function App() {
  const synth = new Tone.MembraneSynth().toMaster();
  let gramma = ohm.grammar(musicLang);
  let input = `TriggerAttackRelease C4 0.5 1
               TriggerAttackRelease E4 0.5 2
               TriggerAttackRelease G4 0.5 3
               TriggerAttackRelease B4 0.5 4`;
  let semnantics = gramma.createSemantics().addOperation('eval', {
    triggerAttackRelease: function(_, ls, noteFreq, ms, tempoRelative, rs, timing) {
      console.log(timing.sourceString)
      return synth.triggerAttackRelease(noteFreq.eval(), tempoRelative.eval(), timing.sourceString)
    },
    noteFreq: function(e) {
      return e.eval()
    },
    pitchOctave: function(_) {
      return this.sourceString
    },
    tempoRelative: function(e) {
      return e.eval()
    },
    notation: function(number, part) {
      return this.sourceString
    },
    number: function(_) {
      return parseFloat(this.sourceString)
    },
    transportTime: function(_) {
      return this.sourceString
    },
    frequency: function(_) {
      return this.sourceString
    },
    tick: function(_) {
      return this.sourceString
    },
  })

  let m = gramma.match(input);
  if(m.succeeded()) {
    console.log('matched')
  } else {
    console.log('did not match')
  }


  function playMusic() {
    semnantics(m).eval()
  }
  
  return (
    <div className="App">
      <button onClick={playMusic}>
        play music
      </button>
    </div>
  );
}

export default App;