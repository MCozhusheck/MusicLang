import musicLang from './musicLang'
import Tone from 'tone';
import ohm  from 'ohm-js';
import { getInstrument } from './instruments'

let synth = null
let gramma = ohm.grammar(musicLang);
let onLoad = null;
let variables = new Map();
export let id
export let nodes
export let fft = new Tone.FFT(16);
export let waveform = new Tone.Waveform(16);

let semnantics = gramma.createSemantics().addOperation('eval', {
    Init: function(start) {
        nodes = Object.assign(start)
        id = []
        start.eval()
    },
    Start: function(_, toneType, bpm, statements) {
        toneType.eval()
        statements.eval()
    },
    Instrument(oscillator) {
        synth = getInstrument(oscillator.sourceString, onLoad).chain(waveform, fft, Tone.Master)
    },
    BPM: function(_, __, ___, bpm){
        Tone.Transport.bpm.value = bpm.eval()
    },
    Statement: function(e) {
        e.eval()
    },
    Event: function(event) {
        return event.eval()
    },
    Play: function(_, event, start) {
        let tmpId
        if(typeof event.eval() === 'function') {
            tmpId = Tone.Transport.schedule(event.eval(), start.eval())
            id.push(tmpId)
        } else {
            let events = variables.get(event.eval())
            console.log(events)
            if(typeof events === 'function') {
                tmpId = Tone.Transport.schedule(events, start.eval())
            } else {
                for (let i=0; i<events.length; i++) {
                    tmpId = Tone.Transport.schedule(events[i], start.eval())
                    id.push(tmpId)
                }
            }
        }
        return tmpId
    },
    SingleNote: function (_, noteFreq, duration, velocity) {
        const trigger = (time) => synth.triggerAttackRelease(noteFreq.eval(), duration.eval(), time, velocity.eval());
        return trigger
    },
    ManyNotes2: function (_,n1, n2, duration, velocity) {
        let noteArray = [n1.sourceString, n2.sourceString];
        const trigger = (time) => synth.triggerAttackRelease(noteArray, duration.eval(), time, velocity.eval())
        return trigger
    },
    ManyNotes3: function (_,n1, n2, n3, duration, velocity) {
        let noteArray = [n1.sourceString, n2.sourceString, n3.sourceString];
        const trigger = (time) => synth.triggerAttackRelease(noteArray, duration.eval(), time, velocity.eval())
        return trigger
    },
    ManyNotes4: function (_,n1, n2, n3, n4, duration, velocity) {
        let noteArray = [n1.sourceString, n2.sourceString, n3.sourceString, n4.sourceString];
        const trigger = (time) => synth.triggerAttackRelease(noteArray, duration.eval(), time, velocity.eval())
        return trigger
    },
    Assignment: function (_, ident, __, event) {
        let eve = event.eval()
        variables.set(ident.eval(), eve)
    },
    Body: function (_, events, __) {
        let bodyEvents = events.children
        let tmps = [];
        bodyEvents.forEach((element, index, array) => tmps.push(element.eval()))
        return tmps
    },
    Duration: function (_, dur) {
        return dur.eval()
    },
    Velocity: function(_, vel){
        return vel.sourceString
    },
    Timing: function (_, start) {
        return start.eval()
    },
    Interval: function(_, inter) {
        return inter.eval()
    },
    StartTime: function(_, start) {
        return start.eval()
    },
    noteFreq: function (e) {
        return e.eval()
    },
    pitchOctave: function (_) {
        return this.sourceString
    },
    tempoRelative: function (e) {
        return e.eval()
    },
    notation: function (number, part) {
        return this.sourceString
    },
    number: function (_) {
        return parseFloat(this.sourceString)
    },
    transportTime: function (_) {
        return this.sourceString
    },
    frequency: function (_) {
        return this.sourceString
    },
    tick: function (_) {
        return this.sourceString
    },
    nowRelative: function(plus, tempoRel) {
        return plus.sourceString + tempoRel.eval()
    },
    ident: function(i) {
        return i.sourceString
    },
    Repeat: function(_, event, interval, start, duration) {
        let tmpId
        if(typeof event === 'function') {
            tmpId = Tone.Transport.scheduleRepeat(event.eval(), interval.eval(), start.eval(), duration.eval())
        } else{
            tmpId = Tone.Transport.scheduleRepeat(variables.get(event.eval()), interval.eval(), start.eval(), duration.eval())
        }
        id.push(tmpId)
        return tmpId
    }
})

export let parse = function parse(input, assetsLoaded) {
    let result = match(input)
    onLoad = assetsLoaded
    return semnantics(result).eval()
}

export let match = function(input){
    return gramma.match(input)
}

export default { parse, match, nodes, id, fft, waveform }